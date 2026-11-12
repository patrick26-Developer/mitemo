import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  Inject,
  Module,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { toIsoDateTime, type RegisterPushTokenRequest } from "@mitemo/contracts";
import { PrismaService } from "../../shared/database/prisma.service.js";
import { DemoAccessGuard, IdentityModule, SessionService } from "../identity/index.js";

function readRegistration(input: unknown): RegisterPushTokenRequest {
  const { token, platform, appVersion } = (input ?? {}) as Record<string, unknown>;
  if (
    typeof token !== "string" ||
    !/^(?:ExponentPushToken|ExpoPushToken)\[[A-Za-z0-9_-]{1,200}\]$/.test(token) ||
    (platform !== "IOS" && platform !== "ANDROID") ||
    typeof appVersion !== "string" ||
    !/^[A-Za-z0-9][A-Za-z0-9.+-]{0,63}$/.test(appVersion)
  )
    throw new BadRequestException("Enregistrement de notification invalide");
  return { token, platform, appVersion };
}

/** Registers push tokens under the authenticated user. */
@Controller("notifications")
@ApiTags("Notifications")
@ApiBearerAuth()
@UseGuards(DemoAccessGuard)
export class NotificationsController {
  /**
   * Injects authentication and persistence.
   * @param sessions Bearer authentication.
   * @param prisma PostgreSQL persistence.
   */
  constructor(
    @Inject(SessionService) private readonly sessions: SessionService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  /**
   * Records consent to receive notifications on this device.
   * @param authorization Current session.
   * @param input Registration payload.
   * @returns Registration timestamp.
   */
  @Post("push-tokens")
  @HttpCode(200)
  @ApiResponse({ status: 200, description: "Jeton enregistré" })
  async register(
    @Headers("authorization") authorization: string | undefined,
    @Body() input: unknown,
  ) {
    const { userId } = await this.sessions.profile(authorization);
    const registration = readRegistration(input);
    const row = await this.prisma.notificationPushToken.upsert({
      where: { userId_token: { userId, token: registration.token } },
      create: { userId, ...registration },
      update: {},
    });
    return { registeredAt: toIsoDateTime(row.registeredAt.toISOString()) };
  }
}

/** Wires the authenticated push registration endpoint. */
@Module({ imports: [IdentityModule], controllers: [NotificationsController] })
export class NotificationsModule {}
