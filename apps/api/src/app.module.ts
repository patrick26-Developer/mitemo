import { Module } from "@nestjs/common";
import { HealthModule } from "./features/health/health.module.js";
import { IdentityModule } from "./features/identity/identity.module.js";
import { PawaPayModule } from "./features/pawapay/pawapay.module.js";
import { PrismaModule } from "./shared/database/prisma.module.js";

/** Assembles the API features. */
@Module({ imports: [PrismaModule, HealthModule, IdentityModule, PawaPayModule] })
export class AppModule {}
