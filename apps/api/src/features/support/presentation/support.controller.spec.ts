import { NotFoundException } from "@nestjs/common";
import { describe, expect, it } from "vitest";

import { GetSupportContactUseCase } from "../application/get-support-contact.use-case.js";
import { SupportPhone } from "../domain/support-phone.value-object.js";
import { SupportController } from "./support.controller.js";

describe("SupportController", () => {
  it("rend le contrat du service client", () => {
    const controller = new SupportController(
      new GetSupportContactUseCase({
        phone: SupportPhone.parse("+242065706622"),
        maxAgeSeconds: 86_400,
      }),
    );

    expect(controller.contact()).toEqual({ phoneNumber: "+242065706622", maxAgeSeconds: 86_400 });
  });

  it("répond 404 tant qu'aucun numéro n'est configuré", () => {
    const controller = new SupportController(
      new GetSupportContactUseCase({ phone: null, maxAgeSeconds: 86_400 }),
    );

    expect(() => controller.contact()).toThrow(NotFoundException);
  });
});
