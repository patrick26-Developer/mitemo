import { Module } from "@nestjs/common";
import { HealthModule } from "./features/health/health.module.js";
import { IdentityModule } from "./features/identity/index.js";
import { NotificationsModule } from "./features/notifications/notifications.module.js";
import { PawaPayModule } from "./features/pawapay/pawapay.module.js";
import { SavingsModule } from "./features/savings/savings.module.js";
import { SupportModule } from "./features/support/support.module.js";
import { WalletModule } from "./features/wallet/wallet.module.js";
import { PrismaModule } from "./shared/database/prisma.module.js";

/** Assembles the API features. */
@Module({
  imports: [
    PrismaModule,
    HealthModule,
    IdentityModule,
    WalletModule,
    PawaPayModule,
    SavingsModule,
    NotificationsModule,
    SupportModule,
  ],
})
export class AppModule {}
