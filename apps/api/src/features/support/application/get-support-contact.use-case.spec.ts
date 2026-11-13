import { describe, expect, it } from "vitest";

import { SupportContactUnavailableError } from "../domain/support-contact-unavailable.error.js";
import { SupportPhone } from "../domain/support-phone.value-object.js";
import { GetSupportContactUseCase } from "./get-support-contact.use-case.js";

describe("GetSupportContactUseCase", () => {
  it("rend le numéro configuré et sa durée de vie en cache", () => {
    const useCase = new GetSupportContactUseCase({
      phone: SupportPhone.parse("+242065706622"),
      maxAgeSeconds: 86_400,
    });

    expect(useCase.execute()).toEqual({
      phone: SupportPhone.parse("+242065706622"),
      maxAgeSeconds: 86_400,
    });
  });

  it("signale l'absence de numéro configuré", () => {
    const useCase = new GetSupportContactUseCase({ phone: null, maxAgeSeconds: 86_400 });

    expect(() => useCase.execute()).toThrow(SupportContactUnavailableError);
  });
});
