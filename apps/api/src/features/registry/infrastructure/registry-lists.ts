import type { Prisma } from "../../../generated/prisma/client.js";
import type { RegistryCommand } from "../domain/registry.repository.js";

/**
 * Liste uniquement les groupes ou invitations du demandeur authentifié.
 * @param tx Transaction PostgreSQL.
 * @param command Identité et collection demandée.
 * @returns Au plus cent éléments de la collection privée.
 */
export function registryLists(tx: Prisma.TransactionClient, command: RegistryCommand) {
  if (command.operation === "LIST") return groups(tx, command.actorId);
  return tx.tontineInvitation.findMany({
    where: { recipientId: command.actorId },
    take: 100,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: {
      id: true,
      groupId: true,
      state: true,
      createdAt: true,
      expiresAt: true,
      group: { select: { name: true } },
    },
  });
}

function groups(tx: Prisma.TransactionClient, actorId: string) {
  return tx.tontineGroup.findMany({
    where: { members: { some: { userId: actorId } } },
    take: 100,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: { id: true, name: true, state: true, mode: true },
  });
}
