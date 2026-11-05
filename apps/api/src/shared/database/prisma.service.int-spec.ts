import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { PrismaService } from "./prisma.service.js";

/**
 * Test d'intégration : exige une vraie base PostgreSQL atteignable via DATABASE_URL
 * (service PostgreSQL en CI, branche Neon personnelle en local). Aucun mock.
 */
describe("PrismaService (intégration)", () => {
  let service: PrismaService;

  beforeAll(async () => {
    service = new PrismaService();
    await service.$connect();
  });

  afterAll(async () => {
    await service.$disconnect();
  });

  it("exécute une requête réelle contre PostgreSQL", async () => {
    const rows = await service.$queryRaw<{ ok: number }[]>`SELECT 1 as ok`;
    expect(rows).toEqual([{ ok: 1 }]);
  });
});
