import { Controller, Get } from "@nestjs/common";
import type { HealthResponse } from "@mitemo/contracts";

/** Expose l'état de vie de l'API pour l'hébergeur et la supervision. */
@Controller("health")
export class HealthController {
  /**
   * Indique que le processus répond. Ne touche pas la base : c'est une sonde de vie,
   * pas une sonde de disponibilité.
   * @returns Un statut constant tant que l'API tourne.
   */
  @Get()
  check(): HealthResponse {
    return { status: "ok" };
  }
}
