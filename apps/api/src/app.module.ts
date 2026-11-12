import { Module } from "@nestjs/common";
import { HealthModule } from "./features/health/health.module.js";
import { IdentityModule } from "./features/identity/index.js";
import { PawaPayModule } from "./features/pawapay/pawapay.module.js";
import { SavingsModule } from "./features/savings/savings.module.js";
import { WalletModule } from "./features/wallet/wallet.module.js";
import { PrismaModule } from "./shared/database/prisma.module.js";

/** Assembles the API features. */
@Module({
  imports: [PrismaModule, HealthModule, IdentityModule, WalletModule, PawaPayModule, SavingsModule],
})
export class AppModule {}
