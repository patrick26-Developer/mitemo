import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../../generated/prisma/client.js";
import { readDatabaseUrl } from "./database-url.js";

/**
 * Connexion applicative à PostgreSQL via le driver adapter Prisma 7.
 *
 * Utilise DATABASE_URL (connexion directe, non poolée) : requis pour les futures
 * écritures du grand livre en isolation SERIALIZABLE et pour les verrous explicites.
 * Le pooler Neon (mode transaction) casse ces garanties - voir AGENTS.md, section 1.1.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const connectionString = readDatabaseUrl(process.env["DATABASE_URL"]);
    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }

  /** Établit la connexion au démarrage du module Nest. */
  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log("Connexion à PostgreSQL établie.");
  }

  /** Ferme la connexion à l'arrêt du processus. */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
