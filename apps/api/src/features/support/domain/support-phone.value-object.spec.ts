import { describe, expect, it } from "vitest";

import { InvalidSupportPhoneError } from "./invalid-support-phone.error.js";
import { SupportPhone } from "./support-phone.value-object.js";

describe("SupportPhone", () => {
  it("normalise un numéro congolais au format E.164", () => {
    expect(SupportPhone.parse("+242 06 570 6622").e164).toBe("+242065706622");
  });

  it("rattache un numéro national au Congo", () => {
    expect(SupportPhone.parse("06 570 6622").e164).toBe("+242065706622");
  });

  it("refuse un numéro illisible ou incomplet", () => {
    expect(() => SupportPhone.parse("appelez-nous")).toThrow(InvalidSupportPhoneError);
    expect(() => SupportPhone.parse("+242 12")).toThrow(InvalidSupportPhoneError);
  });
});
