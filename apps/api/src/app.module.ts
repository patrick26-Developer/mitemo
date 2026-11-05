import { Module } from "@nestjs/common";

import { HealthModule } from "./features/health/health.module.js";

/** Module racine : assemble les features, sans logique propre. */
@Module({
  imports: [HealthModule],
})
export class AppModule {}
