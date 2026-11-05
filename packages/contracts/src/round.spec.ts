import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { toIsoDateTime } from "./datetime.ts";
import type { MemberId, RoundId, TontineId } from "./identifiers.ts";
import { serializeAmount, toAmountMinor } from "./money.ts";
import { ARBITRATION_DECISIONS, ROUND_STATES } from "./round.ts";
import type { ArbitrateRequest, DistributeRoundResponse, RoundState } from "./round.ts";

describe("RoundState", () => {
  it("contient les huit états de l'automate (docs/audit/03-architecture-technique.md, §2)", () => {
    assert.deepEqual(ROUND_STATES, [
      "PLANIFIE",
      "OUVERT",
      "COLLECTE_EN_COURS",
      "COMPLET",
      "DISTRIBUE",
      "SOLDE",
      "COUVERT_PAR_RESERVE",
      "ECHEC_DISTRIBUTION",
    ]);
  });

  it("refuse un état inconnu", () => {
    // @ts-expect-error "EN_PAUSE" n'est pas un état de l'automate tour
    const state: RoundState = "EN_PAUSE";

    assert.equal(typeof state, "string");
  });
});

describe("ArbitrationDecision", () => {
  it("n'autorise que les deux décisions du cahier des charges, §2.2", () => {
    assert.deepEqual(ARBITRATION_DECISIONS, ["ACCEPTER", "ANNULER"]);
  });
});

describe("ArbitrateRequest", () => {
  it("décrit le choix du membre à l'échéance du tour", () => {
    const request: ArbitrateRequest = {
      memberId: "0" as MemberId,
      roundId: "0" as RoundId,
      decision: "ACCEPTER",
    };

    assert.equal(request.decision, "ACCEPTER");
  });

  it("refuse une décision hors ACCEPTER/ANNULER", () => {
    const request: ArbitrateRequest = {
      memberId: "0" as MemberId,
      roundId: "0" as RoundId,
      // @ts-expect-error "REPORTER" n'est pas une décision d'arbitrage valide
      decision: "REPORTER",
    };

    assert.equal(typeof request, "object");
  });
});

describe("DistributeRoundResponse", () => {
  it("distingue toujours le montant brut, la commission et le montant net", () => {
    const response: DistributeRoundResponse = {
      roundId: "0" as RoundId,
      tontineId: "0" as TontineId,
      beneficiaryId: "0" as MemberId,
      grossAmount: { amount: serializeAmount(toAmountMinor(45_000n)), currency: "XAF" },
      commission: { amount: serializeAmount(toAmountMinor(675n)), currency: "XAF" },
      netAmount: { amount: serializeAmount(toAmountMinor(44_325n)), currency: "XAF" },
      state: "DISTRIBUE",
      distributedAt: toIsoDateTime("2026-11-06T12:00:00.000Z"),
    };

    assert.equal(response.state, "DISTRIBUE");
  });
});
