import { Module } from "@nestjs/common";
import { HealthModule } from "./features/health/health.module.js";
import { IdentityModule } from "./features/identity/index.js";
import { WalletModule } from "./features/wallet/wallet.module.js";
import { PrismaModule } from "./shared/database/prisma.module.js";

/** Assembles the API features. */
@Module({ imports: [PrismaModule, HealthModule, IdentityModule, WalletModule] })
export class AppModule {}
