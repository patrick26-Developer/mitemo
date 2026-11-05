import { Module } from "@nestjs/common";

import { HealthModule } from "./features/health/health.module.js";
import { PrismaModule } from "./shared/database/prisma.module.js";

/** Module racine : assemble les features, sans logique propre. */
@Module({
  imports: [PrismaModule, HealthModule],
})
export class AppModule {}
