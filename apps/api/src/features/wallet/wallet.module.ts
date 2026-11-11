import { Module } from "@nestjs/common";
import { IdentityModule } from "../identity/index.js";
import { WalletService } from "./infrastructure/wallet.service.js";
import { WalletController } from "./presentation/wallet.controller.js";

/** Registers the wallet backed by the existing ledger. */
@Module({ imports: [IdentityModule], controllers: [WalletController], providers: [WalletService] })
export class WalletModule {}
