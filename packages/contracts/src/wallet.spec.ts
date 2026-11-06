import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { toIsoDateTime } from "./datetime.ts";
import type { MovementId, SavingsCardId, TransactionId } from "./identifiers.ts";
import { serializeAmount, toAmountMinor } from "./money.ts";
import type { MoneyDto } from "./money.ts";
import { IDEMPOTENCY_KEY_HEADER, MOVEMENT_KINDS, PROGRAM_KINDS } from "./wallet.ts";
import type {
  MovementKind,
  SimulateFundingRequest,
  SimulateFundingResponse,
  WalletMovement,
  WalletMovementsResponse,
  WalletSummaryResponse,
} from "./wallet.ts";

function xaf(amount: bigint): MoneyDto {
  return { amount: serializeAmount(toAmountMinor(amount)), currency: "XAF" };
}

describe("WalletSummaryResponse", () => {
  it("expose les quatre soldes distincts du portefeuille", () => {
    const summary: WalletSummaryResponse = {
      available: xaf(12_500n),
      committed: xaf(2_500n),
      pending: xaf(5_000n),
      blocked: xaf(0n),
      simulated: true,
    };

    assert.deepEqual(Object.keys(summary).sort(), [
      "available",
      "blocked",
      "committed",
      "pending",
      "simulated",
    ]);
  });

  it("signale toujours que les fonds sont simulés pendant la démonstration", () => {
    const summary: WalletSummaryResponse = {
      available: xaf(0n),
      committed: xaf(0n),
      pending: xaf(0n),
      blocked: xaf(0n),
      // @ts-expect-error aucun fonds réel sans validation juridique (ADR 0005)
      simulated: false,
    };

    assert.equal(typeof summary.simulated, "boolean");
  });
});

describe("WalletMovement", () => {
  it("connaît les natures de mouvement du sprint", () => {
    assert.deepEqual(MOVEMENT_KINDS, [
      "FUNDING",
      "SAVINGS_INSTALLMENT",
      "SAVINGS_PAYOUT",
      "RISTOURNE_CONTRIBUTION",
      "RISTOURNE_PAYOUT",
      "FEE",
      "REVERSAL",
    ]);
    assert.deepEqual(PROGRAM_KINDS, ["SAVINGS_CARD", "RISTOURNE"]);
  });

  it("refuse une nature inconnue", () => {
    // @ts-expect-error "WITHDRAWAL" est hors périmètre de la démonstration
    const kind: MovementKind = "WITHDRAWAL";

    assert.equal(typeof kind, "string");
  });

  it("rattache un versement à son programme, montant signé négatif en sortie", () => {
    const movement: WalletMovement = {
      movementId: "m1" as MovementId,
      occurredAt: toIsoDateTime("2026-11-08T09:00:00.000Z"),
      kind: "SAVINGS_INSTALLMENT",
      amount: xaf(-500n),
      description: "Versement de la carte « Rentrée scolaire »",
      simulated: true,
      program: { kind: "SAVINGS_CARD", id: "card-1" as SavingsCardId },
    };
    const page: WalletMovementsResponse = { items: [movement] };

    assert.equal(page.items[0]?.amount.amount, "-500");
    assert.equal(page.nextCursor, undefined);
  });
});

describe("approvisionnement simulé", () => {
  it("exige une clé d'idempotence transmise par en-tête", () => {
    assert.equal(IDEMPOTENCY_KEY_HEADER, "Idempotency-Key");
  });

  it("renvoie une transaction en attente, jamais créditée d'emblée", () => {
    const request: SimulateFundingRequest = { amount: xaf(5_000n) };
    const response: SimulateFundingResponse = {
      transactionId: "t1" as TransactionId,
      state: "PENDING",
      amount: request.amount,
      simulated: true,
      createdAt: toIsoDateTime("2026-11-08T09:00:00.000Z"),
    };

    assert.equal(response.state, "PENDING");
  });
});
