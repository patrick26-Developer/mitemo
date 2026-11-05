import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { serializeAmount, toAmountMinor } from "./money.ts";
import { TONTINE_STATES } from "./tontine.ts";
import type { CreateTontineRequest, CycleFrequency, TontineState } from "./tontine.ts";

describe("TontineState", () => {
  it("contient les neuf états de l'automate (docs/audit/03-architecture-technique.md, §2)", () => {
    assert.deepEqual(TONTINE_STATES, [
      "BROUILLON",
      "RECRUTEMENT",
      "COLLECTE_GARANTIES",
      "TIRAGE_ORDRE",
      "ACTIVE",
      "SUSPENDUE",
      "CLOTUREE_NORMALE",
      "CLOTUREE_ANTICIPEE",
      "ANNULEE",
    ]);
  });

  it("refuse un état inconnu", () => {
    // @ts-expect-error "EN_PAUSE" n'est pas un état de l'automate tontine
    const state: TontineState = "EN_PAUSE";

    assert.equal(typeof state, "string");
  });
});

describe("CycleFrequency", () => {
  it("accepte une fréquence journalière, hebdomadaire ou mensuelle avec un intervalle entier", () => {
    const frequencies: readonly CycleFrequency[] = [
      { unit: "jour", interval: 1 },
      { unit: "jour", interval: 2 },
      { unit: "semaine", interval: 1 },
      { unit: "mois", interval: 1 },
    ];

    assert.equal(frequencies.length, 4);
  });

  it("refuse une unité hors jour/semaine/mois", () => {
    // @ts-expect-error "annee" n'est pas une unité de cycle valide
    const frequency: CycleFrequency = { unit: "annee", interval: 1 };

    assert.equal(typeof frequency, "object");
  });
});

describe("CreateTontineRequest", () => {
  it("décrit les paramètres de création (cahier des charges, §1.1)", () => {
    const request: CreateTontineRequest = {
      contributionAmount: { amount: serializeAmount(toAmountMinor(5000n)), currency: "XAF" },
      participantCount: 10,
      frequency: { unit: "jour", interval: 1 },
    };

    assert.equal(request.participantCount, 10);
  });
});
