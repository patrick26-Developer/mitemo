import { SessionService } from "./infrastructure/session.service.js";
import { Module } from "@nestjs/common";
import { IdentityService } from "./infrastructure/identity.service.js";
import { IdentityController } from "./presentation/identity.controller.js";
import { SESSION_AUTHENTICATOR } from "./domain/session-authenticator.js";

/** Registers the development identity flow. */
@Module({
  controllers: [IdentityController],
  providers: [
    IdentityService,
    SessionService,
    { provide: SESSION_AUTHENTICATOR, useExisting: SessionService },
  ],
  exports: [SessionService, SESSION_AUTHENTICATOR],
})
export class IdentityModule {}
