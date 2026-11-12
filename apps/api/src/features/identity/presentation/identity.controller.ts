import { SessionService } from "../infrastructure/session.service.js";
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Headers,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiTags, ApiResponse } from "@nestjs/swagger";
import { IdentityService } from "../infrastructure/identity.service.js";

import { DemoAccessGuard } from "./demo-access.guard.js";
import { DemoRateLimitGuard } from "./demo-rate-limit.guard.js";

/** HTTP entry points for the demonstration identity flow. */
@ApiTags("Identité")
@Controller()
@UseGuards(DemoAccessGuard)
export class IdentityController {
  /**
   * Creates the HTTP identity dependency.
   * @param identity Identity operations.
   * @param session Service for authenticated sessions.
   */
  constructor(
    @Inject(IdentityService) private readonly identity: IdentityService,
    @Inject(SessionService) private readonly session: SessionService,
  ) {}

  /**
   * Creates a demonstration account.
   * @param body Untrusted JSON body.
   * @returns The created profile.
   */
  @Post("auth/register")
  @Header("Cache-Control", "no-store")
  @ApiBody({
    schema: {
      required: ["phoneNumber", "pin", "displayName"],
      properties: {
        phoneNumber: { type: "string" },
        pin: { type: "string", pattern: "^[0-9]{4}$" },
        displayName: { type: "string" },
      },
    },
  })
  @UseGuards(DemoRateLimitGuard)
  @ApiResponse({ status: 429, description: "Trop de tentatives" })
  register(@Body() body: unknown) {
    return this.identity.register(body);
  }

  /**
   * Opens a simulated phone challenge after verifying the PIN.
   * @param body Untrusted JSON body.
   * @returns The temporary simulated challenge.
   */
  @Post("auth/login")
  @Header("Cache-Control", "no-store")
  @ApiBody({
    schema: {
      required: ["phoneNumber", "pin"],
      properties: {
        phoneNumber: { type: "string" },
        pin: { type: "string", pattern: "^(?:[0-9]{4}|[0-9]{6})$" },
      },
    },
  })
  @UseGuards(DemoRateLimitGuard)
  @ApiResponse({ status: 429, description: "Trop de tentatives" })
  @HttpCode(200)
  login(@Body() body: unknown) {
    return this.identity.login(body);
  }

  /**
   * Exchanges a valid challenge for a server session.
   * @param body Untrusted JSON body.
   * @returns The newly created server session.
   */
  @Post("auth/verify")
  @Header("Cache-Control", "no-store")
  @ApiBody({
    schema: {
      required: ["challengeId", "otp"],
      properties: {
        challengeId: { type: "string", format: "uuid" },
        otp: { type: "string", pattern: "^[0-9]{6}$" },
      },
    },
  })
  @UseGuards(DemoRateLimitGuard)
  @ApiResponse({ status: 429, description: "Trop de tentatives" })
  @HttpCode(200)
  verify(@Body() body: unknown) {
    return this.identity.verify(body);
  }

  /**
   * Returns the current user.
   * @param authorization Bearer header from the current request.
   * @returns The authenticated profile.
   */
  @Get("me")
  @Header("Cache-Control", "no-store")
  @ApiBearerAuth()
  profile(@Headers("authorization") authorization: string | undefined) {
    return this.session.profile(authorization);
  }

  /**
   * Changes the current user's display name.
   * @param authorization Bearer header from the current request.
   * @param body Untrusted JSON body.
   * @returns The updated profile.
   */
  @Patch("me")
  @Header("Cache-Control", "no-store")
  @ApiBody({
    schema: { required: ["displayName"], properties: { displayName: { type: "string" } } },
  })
  @ApiBearerAuth()
  update(@Headers("authorization") authorization: string | undefined, @Body() body: unknown) {
    return this.session.update(authorization, body);
  }

  /**
   * Rotates the current bearer token.
   * @param authorization Bearer header from the current request.
   * @returns The session with its rotated token.
   */
  @Post("auth/refresh")
  @Header("Cache-Control", "no-store")
  @ApiBearerAuth()
  @HttpCode(200)
  refresh(@Headers("authorization") authorization: string | undefined) {
    return this.session.refresh(authorization);
  }

  /**
   * Lists the caller’s active sessions.
   * @param authorization Bearer header from the current request.
   * @returns The active sessions owned by the caller.
   */
  @Get("auth/sessions")
  @Header("Cache-Control", "no-store")
  @ApiBearerAuth()
  sessions(@Headers("authorization") authorization: string | undefined) {
    return this.session.sessions(authorization);
  }

  /**
   * Revokes a session owned by the caller.
   * @param authorization Bearer header from the current request.
   * @param id UUID of the session to revoke.
   */
  @Delete("auth/sessions/:id")
  @Header("Cache-Control", "no-store")
  @ApiBearerAuth()
  @HttpCode(204)
  async revoke(
    @Headers("authorization") authorization: string | undefined,
    @Param("id") id: string,
  ) {
    await this.session.revoke(authorization, id);
  }

  /**
   * Revokes the current session.
   * @param authorization Bearer header from the current request.
   */
  @Delete("auth/session")
  @Header("Cache-Control", "no-store")
  @ApiBearerAuth()
  @HttpCode(204)
  async logout(@Headers("authorization") authorization: string | undefined) {
    await this.session.logout(authorization);
  }
}
