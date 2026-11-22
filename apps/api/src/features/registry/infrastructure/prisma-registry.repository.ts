import { registryLists } from "./registry-lists.js";
import { registryId } from "../domain/registry-id.js";
import { registryGroupResponse } from "./registry-group-response.js";
import { readRegistryName, readRegistryTerms } from "../domain/registry-terms.js";
import { randomUUID } from "node:crypto";
import type { Prisma, PrismaClient } from "../../../generated/prisma/client.js";
import {
  RegistryError,
  RegistryRepository,
  type RegistryCommand,
} from "../domain/registry.repository.js";
import {
  TransactionRaceError,
  withTransactionRetry,
} from "../../../shared/database/transaction-retry.js";

type Tx = Prisma.TransactionClient;
interface Execution extends RegistryCommand {
  readonly now: Date;
}
const FREE = "registry-free-v1";

function object(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new RegistryError("Corps invalide");
  return input as Record<string, unknown>;
}

function audit(
  tx: Tx,
  data: { groupId: string; actorId: string; action: string; subjectId: string },
) {
  return tx.auditEvent.create({ data: { id: randomUUID(), ...data } });
}

async function member(tx: Tx, groupId: string, actorId: string) {
  const result = await tx.tontineMember.findUnique({
    where: { groupId_userId: { groupId, userId: actorId } },
  });
  if (!result) throw new RegistryError("Ressource inaccessible", true);
  return result;
}

async function create(tx: Tx, cmd: Execution) {
  const data = readRegistryTerms(cmd.body),
    id = registryId(cmd.idempotencyKey);
  if (await creationReplay(tx, id, { data, actorId: cmd.actorId }))
    return read(tx, id, cmd.actorId);
  await tx.tontineGroup.create({
    data: { ...data, creationName: data.name, id, ownerId: cmd.actorId },
  });
  await tx.groupFeePolicy.create({ data: { groupId: id, version: FREE } });
  await tx.tontineMember.create({
    data: { groupId: id, userId: cmd.actorId, role: "ADMIN", policyVersion: FREE },
  });
  await audit(tx, { groupId: id, actorId: cmd.actorId, action: "GROUP_CREATED", subjectId: id });
  return read(tx, id, cmd.actorId);
}

async function read(tx: Tx, groupId: string, actorId: string) {
  await member(tx, groupId, actorId);
  const group = await tx.tontineGroup.findUniqueOrThrow({ where: { id: groupId } });
  return registryGroupResponse(group);
}

async function invite(tx: Tx, cmd: Execution) {
  const groupId = registryId(cmd.resourceId),
    recipientId = registryId(object(cmd.body)["userId"]);
  if ((await member(tx, groupId, cmd.actorId)).role !== "ADMIN")
    throw new RegistryError("Ressource inaccessible", true);
  if (recipientId === cmd.actorId) throw new RegistryError("Invitation invalide");
  if (!(await tx.appUser.findUnique({ where: { id: recipientId } })))
    throw new RegistryError("Destinataire indisponible");
  const existing = await tx.tontineInvitation.findUnique({
    where: { groupId_recipientId: { groupId, recipientId } },
  });
  if (existing) return existing;
  return createInvitation(tx, { groupId, recipientId, actorId: cmd.actorId, now: cmd.now });
}

async function createInvitation(
  tx: Tx,
  context: { groupId: string; recipientId: string; actorId: string; now: Date },
) {
  const { groupId, recipientId, actorId, now } = context;
  const invitation = await tx.tontineInvitation.create({
    data: {
      id: randomUUID(),
      groupId,
      recipientId,
      issuedBy: actorId,
      expiresAt: new Date(now.getTime() + 7 * 86400000),
    },
  });
  await audit(tx, { groupId, actorId, action: "INVITATION_CREATED", subjectId: invitation.id });
  return invitation;
}

async function respond(tx: Tx, cmd: Execution) {
  const invitation = await tx.tontineInvitation.findUnique({
    where: { id: registryId(cmd.resourceId) },
  });
  if (!invitation || invitation.recipientId !== cmd.actorId)
    throw new RegistryError("Ressource inaccessible", true);
  const next = cmd.operation === "ACCEPT" ? "ACCEPTED" : "DECLINED";
  if (invitation.state === next) return invitation;
  if (invitation.state !== "PENDING" || invitation.expiresAt.getTime() <= cmd.now.getTime())
    throw new RegistryError("Invitation indisponible");
  if (next === "ACCEPTED") await join(tx, invitation, cmd);
  return saveResponse(tx, {
    invitationId: invitation.id,
    groupId: invitation.groupId,
    actorId: cmd.actorId,
    next,
  });
}

async function saveResponse(
  tx: Tx,
  context: { invitationId: string; groupId: string; actorId: string; next: string },
) {
  const { invitationId, groupId, actorId, next } = context;
  const result = await tx.tontineInvitation.update({
    where: { id: invitationId },
    data: { state: next },
  });
  await audit(tx, {
    groupId: groupId,
    actorId: actorId,
    action: "INVITATION_" + next,
    subjectId: invitationId,
  });
  return result;
}

async function join(tx: Tx, invitation: { groupId: string }, cmd: Execution) {
  if (object(cmd.body)["acceptedPolicyVersion"] !== FREE)
    throw new RegistryError("Acceptation des règles requise");
  const group = await tx.tontineGroup.findUniqueOrThrow({ where: { id: invitation.groupId } });
  const members = await tx.tontineMember.count({ where: { groupId: group.id } });
  if (members >= group.participantCount) throw new RegistryError("Groupe complet");
  await tx.tontineMember.create({
    data: { groupId: group.id, userId: cmd.actorId, role: "MEMBRE", policyVersion: FREE },
  });
}

async function rename(tx: Tx, cmd: Execution) {
  const groupId = registryId(cmd.resourceId);
  if ((await member(tx, groupId, cmd.actorId)).role !== "ADMIN")
    throw new RegistryError("Ressource inaccessible", true);
  const name = readRegistryName(object(cmd.body)["name"]);
  await tx.tontineGroup.update({ where: { id: groupId }, data: { name } });
  await audit(tx, { groupId, actorId: cmd.actorId, action: "GROUP_RENAMED", subjectId: groupId });
  return read(tx, groupId, cmd.actorId);
}
async function execute(tx: Tx, cmd: Execution): Promise<unknown> {
  if (cmd.operation === "RENAME") return rename(tx, cmd);
  if (cmd.operation === "CREATE") return create(tx, cmd);
  if (["LIST", "INVITATIONS"].includes(cmd.operation)) return registryLists(tx, cmd);
  if (cmd.operation === "INVITE") return invite(tx, cmd);
  if (cmd.operation === "ACCEPT" || cmd.operation === "DECLINE") return respond(tx, cmd);
  const groupId = registryId(cmd.resourceId);
  await member(tx, groupId, cmd.actorId);
  if (cmd.operation === "MEMBERS")
    return tx.tontineMember.findMany({
      where: { groupId },
      select: { userId: true, role: true, state: true, joinedAt: true, policyVersion: true },
    });
  return read(tx, groupId, cmd.actorId);
}

async function creationReplay(
  tx: Tx,
  id: string,
  context: { data: ReturnType<typeof readRegistryTerms>; actorId: string },
) {
  const existing = await tx.tontineGroup.findUnique({ where: { id } });
  if (!existing) return false;
  if (existing.ownerId !== context.actorId) throw new RegistryError("Ressource inaccessible", true);
  const mismatch = Object.entries(context.data).some(
    ([key, value]) => Reflect.get(existing, key === "name" ? "creationName" : key) !== value,
  );
  if (mismatch) throw new RegistryError("Clé réutilisée avec des règles différentes");
  return true;
}

async function transact(prisma: PrismaClient, command: Execution): Promise<unknown> {
  try {
    return await prisma.$transaction((tx) => execute(tx, command), {
      isolationLevel: "Serializable",
    });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2002")
      throw new TransactionRaceError("Rejeu concurrent du registre");
    throw error;
  }
}
/** Adaptateur PostgreSQL du registre gratuit, sans accès au grand livre. */
export class PrismaRegistryRepository extends RegistryRepository {
  /**
   * Initialise le client Prisma.
   * @param prisma Connexion PostgreSQL.
   * @param now Horloge injectée pour les invitations.
   */
  constructor(
    private readonly prisma: PrismaClient,
    private readonly now: () => Date = () => new Date(),
  ) {
    super();
  }

  /**
   * Exécute et rejoue entièrement une transaction déclarative en conflit.
   * @param command Action authentifiée.
   * @returns Le résultat après validation de la transaction.
   */
  execute(command: RegistryCommand): Promise<unknown> {
    return withTransactionRetry(() => transact(this.prisma, { ...command, now: this.now() }), {
      maxAttempts: 5,
      baseDelayMs: 5,
    });
  }
}
