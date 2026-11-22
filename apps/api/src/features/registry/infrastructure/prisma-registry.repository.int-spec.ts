import { randomUUID } from "node:crypto";
import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client.js";
import { PrismaRegistryRepository } from "./prisma-registry.repository.js";

const ids = { a: randomUUID(), b: randomUUID(), c: randomUUID() };
let prisma: PrismaClient;
let repository: PrismaRegistryRepository;

describe("registre PostgreSQL", () => {
  beforeAll(async () => {
    prisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString: process.env["DATABASE_URL"] }),
    });
    repository = new PrismaRegistryRepository(prisma);
    for (const id of Object.values(ids)) {
      await prisma.ledgerAccount.create({
        data: { id: "registry-test:" + id, kind: "WALLET_USER" },
      });
      await prisma.appUser.create({
        data: {
          id,
          phoneNumber: "+24206" + String(8100000 + Number.parseInt(id.slice(0, 5), 16)),
          displayName: "Test registre",
          pinHash: "integration-only",
          walletAccountId: "registry-test:" + id,
          isDemo: true,
        },
      });
    }
  });
  afterAll(async () => {
    await prisma?.$disconnect();
  });

  it("persiste un groupe gratuit, accepte une invitation une seule fois et isole les droits", async () => {
    const group = (await repository.execute({
      operation: "CREATE",
      idempotencyKey: randomUUID(),
      actorId: ids.a,
      body: {
        name: "Registre marché",
        contributionAmount: { amount: "2000", currency: "XAF" },
        participantCount: 2,
        frequency: { unit: "semaine", interval: 1 },
      },
    })) as { id: string };
    await expect(
      repository.execute({ operation: "READ", actorId: ids.c, resourceId: group.id }),
    ).rejects.toThrow("inaccessible");
    await expect(
      repository.execute({
        operation: "INVITE",
        actorId: ids.c,
        resourceId: group.id,
        body: { userId: ids.b },
      }),
    ).rejects.toThrow();
    const invite = (await repository.execute({
      operation: "INVITE",
      actorId: ids.a,
      resourceId: group.id,
      body: { userId: ids.b },
    })) as { id: string };
    await expect(
      repository.execute({
        operation: "ACCEPT",
        actorId: ids.c,
        resourceId: invite.id,
        body: { acceptedPolicyVersion: "registry-free-v1" },
      }),
    ).rejects.toThrow();
    await expect(
      repository.execute({
        operation: "ACCEPT",
        actorId: ids.b,
        resourceId: invite.id,
        body: { acceptedPolicyVersion: "other" },
      }),
    ).rejects.toThrow();
    const command = {
      operation: "ACCEPT",
      actorId: ids.b,
      resourceId: invite.id,
      body: { acceptedPolicyVersion: "registry-free-v1" },
    } as const;
    await repository.execute(command);
    await repository.execute(command);
    expect(await prisma.tontineMember.count({ where: { groupId: group.id } })).toBe(2);
    await prisma.$disconnect();
    await prisma.$connect();
    const persisted = (await repository.execute({
      operation: "READ",
      actorId: ids.b,
      resourceId: group.id,
    })) as { feePolicy: { mitemoFee: string } };
    expect(persisted.feePolicy.mitemoFee).toBe("0");
    expect(
      await prisma.ledgerEntry.count({ where: { recordedBy: { in: Object.values(ids) } } }),
    ).toBe(0);
    expect(await prisma.auditEvent.count({ where: { groupId: group.id } })).toBe(3);
    await expect(
      prisma.groupFeePolicy.update({
        where: { groupId_version: { groupId: group.id, version: "registry-free-v1" } },
        data: { mode: "FREE" },
      }),
    ).rejects.toThrow();
    await expect(prisma.auditEvent.deleteMany({ where: { groupId: group.id } })).rejects.toThrow();
  });
});
