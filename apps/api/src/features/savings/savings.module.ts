import { Module } from "@nestjs/common";
import { IdentityModule } from "../identity/index.js";
import { SavingsController } from "./savings.controller.js";
import { SavingsService } from "./savings.service.js";

/** Registers the individual savings planning API. */
@Module({
  imports: [IdentityModule],
  controllers: [SavingsController],
  providers: [SavingsService],
})
export class SavingsModule {}
