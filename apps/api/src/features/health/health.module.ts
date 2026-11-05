import { Module } from "@nestjs/common";

import { HealthController } from "./presentation/health.controller.js";

/** Feature « santé » : sonde de vie de l'API. */
@Module({
  controllers: [HealthController],
})
export class HealthModule {}
