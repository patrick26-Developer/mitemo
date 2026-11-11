import { Module } from "@nestjs/common";
import { SandboxCallbackController } from "./presentation/sandbox-callback.controller.js";

/** Registers the Sandbox callback receiver. */
@Module({ controllers: [SandboxCallbackController] })
export class PawaPayModule {}
