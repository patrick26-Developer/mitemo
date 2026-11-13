import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { SupportContactResponse } from "./support.ts";

describe("SupportContactResponse", () => {
  it("donne le numéro du service client et sa durée de vie en cache", () => {
    const response: SupportContactResponse = {
      phoneNumber: "+242065706622",
      maxAgeSeconds: 86_400,
    };

    assert.equal(response.phoneNumber, "+242065706622");
  });

  it("exige une durée de vie", () => {
    // @ts-expect-error le client doit savoir combien de temps garder le numéro
    const response: SupportContactResponse = { phoneNumber: "+242065706622" };

    assert.equal(typeof response, "object");
  });
});
