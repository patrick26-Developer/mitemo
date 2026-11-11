import { SessionService } from "./infrastructure/session.service.js";
import { Module } from "@nestjs/common";
import { IdentityService } from "./infrastructure/identity.service.js";
import { IdentityController } from "./presentation/identity.controller.js";

/** Registers the development identity flow. */
@Module({
  controllers: [IdentityController],
  providers: [IdentityService, SessionService],
  exports: [SessionService],
})
export class IdentityModule {}
