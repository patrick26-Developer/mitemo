import { Module } from "@nestjs/common";

import { GetSupportContactUseCase } from "./application/get-support-contact.use-case.js";
import { SupportContactSettings } from "./domain/support-contact.settings.js";
import { readSupportContactSettings } from "./infrastructure/env-support-contact.settings.js";
import { SupportController } from "./presentation/support.controller.js";

/** Feature « service client » : le numéro joint par WhatsApp ou par appel. */
@Module({
  controllers: [SupportController],
  providers: [
    { provide: SupportContactSettings, useFactory: () => readSupportContactSettings(process.env) },
    {
      provide: GetSupportContactUseCase,
      inject: [SupportContactSettings],
      useFactory: (settings: SupportContactSettings) => new GetSupportContactUseCase(settings),
    },
  ],
})
export class SupportModule {}
