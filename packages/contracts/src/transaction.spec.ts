import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { toIsoDateTime } from "./datetime.ts";
import type { MemberId, TransactionId } from "./identifiers.ts";
import { serializeAmount, toAmountMinor } from "./money.ts";
import { TRANSACTION_STATES } from "./transaction.ts";
import type { FundWalletRequest, FundWalletResponse, TransactionState } from "./transaction.ts";

describe("TransactionState", () => {
  it("contient les six états de l'automate (docs/audit/03-architecture-technique.md, §2)", () => {
    assert.deepEqual(TRANSACTION_STATES, [
      "INITIATED",
      "PENDING",
      "CONFIRMED",
      "FAILED",
      "EXPIRED",
      "REVERSED",
    ]);
  });

  it("refuse un état inconnu", () => {
    // @ts-expect-error "CANCELLED" n'est pas un état de l'automate transaction
    const state: TransactionState = "CANCELLED";

    assert.equal(typeof state, "string");
  });
});

describe("FundWalletRequest", () => {
  it("décrit l'approvisionnement demandé par le membre", () => {
    const request: FundWalletRequest = {
      memberId: "0" as MemberId,
      amount: { amount: serializeAmount(toAmountMinor(500n)), currency: "XAF" },
    };

    assert.equal(typeof request.memberId, "string");
  });
});

describe("FundWalletResponse", () => {
  it("renvoie INITIATED : jamais crédité sur un simple code 200 (docs/audit/03, §1.4)", () => {
    const response: FundWalletResponse = {
      transactionId: "0" as TransactionId,
      state: "INITIATED",
      amount: { amount: serializeAmount(toAmountMinor(500n)), currency: "XAF" },
      createdAt: toIsoDateTime("2026-11-06T12:00:00.000Z"),
    };

    assert.equal(response.state, "INITIATED");
  });
});
