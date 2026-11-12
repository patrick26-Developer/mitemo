import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  HttpCode,
  Inject,
  NotFoundException,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { DemoAccessGuard, previewEnabled, SessionService } from "../../identity/index.js";
import { WalletService } from "../infrastructure/wallet.service.js";

/** Exposes the authenticated demonstration wallet. */
@Controller("wallet")
@UseGuards(DemoAccessGuard)
export class WalletController {
  /**
   * Creates the wallet controller.
   * @param sessions Authentication service.
   * @param wallet Wallet operations.
   */
  constructor(
    @Inject(SessionService) private readonly sessions: SessionService,
    @Inject(WalletService) private readonly wallet: WalletService,
  ) {}

  /**
   * Reads the balance of the account owned by the caller.
   * @param auth Bearer header.
   * @returns Wallet balances.
   */
  @Get()
  @Header("Cache-Control", "no-store")
  async summary(@Headers("authorization") auth: string | undefined) {
    return this.wallet.summary(await this.sessions.walletOwner(auth));
  }

  /**
   * Lists the caller's ledger movements.
   * @param auth Bearer header.
   * @param query Page parameters.
   * @returns A page of ledger movements.
   */
  @Get("movements")
  @Header("Cache-Control", "no-store")
  async movements(
    @Headers("authorization") auth: string | undefined,
    @Query() query: Record<string, unknown>,
  ) {
    return this.wallet.movements(await this.sessions.walletOwner(auth), query);
  }

  /**
   * Records a confirmed simulated deposit.
   * @param auth Bearer header.
   * @param key Caller idempotency key.
   * @param body Deposit request.
   * @returns The confirmed entry.
   */
  @Post("demo-funding")
  @HttpCode(200)
  @Header("Cache-Control", "no-store")
  async fund(
    @Headers("authorization") auth: string | undefined,
    @Headers("idempotency-key") key: string | undefined,
    @Body() body: unknown,
  ) {
    if (!previewEnabled()) throw new NotFoundException();
    return this.wallet.fund(await this.sessions.walletOwner(auth), key, body);
  }
}
