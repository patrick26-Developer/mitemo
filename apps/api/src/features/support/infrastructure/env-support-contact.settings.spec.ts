import { describe, expect, it } from "vitest";

import { InvalidSupportPhoneError } from "../domain/invalid-support-phone.error.js";
import {
  readSupportContactSettings,
  SUPPORT_CONTACT_MAX_AGE_SECONDS,
} from "./env-support-contact.settings.js";

describe("readSupportContactSettings", () => {
  it("lit le numéro du service client dans SUPPORT_PHONE", () => {
    const settings = readSupportContactSettings({ SUPPORT_PHONE: "+242065706622" });

    expect(settings.phone?.e164).toBe("+242065706622");
    expect(settings.maxAgeSeconds).toBe(SUPPORT_CONTACT_MAX_AGE_SECONDS);
  });

  it("laisse le numéro vide quand la variable manque", () => {
    expect(readSupportContactSettings({}).phone).toBeNull();
    expect(readSupportContactSettings({ SUPPORT_PHONE: "  " }).phone).toBeNull();
  });

  it("refuse de démarrer avec un numéro invalide", () => {
    expect(() => readSupportContactSettings({ SUPPORT_PHONE: "123" })).toThrow(
      InvalidSupportPhoneError,
    );
  });

  it("garde le numéro une journée en cache", () => {
    expect(SUPPORT_CONTACT_MAX_AGE_SECONDS).toBe(86_400);
  });
});
