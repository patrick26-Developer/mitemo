import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { toIsoDateTime } from "./datetime.ts";
import type { SavingsCardId } from "./identifiers.ts";
import { serializeAmount, toAmountMinor } from "./money.ts";
import type { MoneyDto } from "./money.ts";
import { INSTALLMENT_STATES, SAVINGS_CARD_STATES, SCHEDULE_FREQUENCIES } from "./savings-card.ts";
import type {
  CreateSavingsCardRequest,
  InstallmentState,
  PayInstallmentRequest,
  SavingsCardQuoteResponse,
  SavingsCardResponse,
  SavingsCardTerms,
  ScheduleFrequency,
} from "./savings-card.ts";

function xaf(amount: bigint): MoneyDto {
  return { amount: serializeAmount(toAmountMinor(amount)), currency: "XAF" };
}

const TERMS: SavingsCardTerms = {
  installmentAmount: xaf(500n),
  frequency: "DAILY",
  installmentsPerCycle: 30,
  cycleCount: 1,
  startsAt: toIsoDateTime("2026-11-08T00:00:00.000Z"),
};

describe("valeurs techniques de la carte de pointage", () => {
  it("connaît les périodicités, les états de carte et les états d'échéance", () => {
    assert.deepEqual(SCHEDULE_FREQUENCIES, ["DAILY", "WEEKLY", "MONTHLY"]);
    assert.deepEqual(SAVINGS_CARD_STATES, ["ACTIVE", "COMPLETED", "CANCELLED"]);
    assert.deepEqual(INSTALLMENT_STATES, ["UPCOMING", "DUE", "LATE", "PAID"]);
  });

  it("refuse une périodicité ou un état inconnus", () => {
    // @ts-expect-error la périodicité technique est en anglais ("DAILY"), pas "jour"
    const frequency: ScheduleFrequency = "jour";
    // @ts-expect-error "MISSED" n'est pas un état d'échéance
    const state: InstallmentState = "MISSED";

    assert.equal(typeof frequency, typeof state);
  });
});

describe("devis avant engagement", () => {
  it("montre les frais et le net avant toute création de carte", () => {
    const quote: SavingsCardQuoteResponse = {
      terms: TERMS,
      totalToSave: xaf(15_000n),
      totalFees: xaf(500n),
      netPayout: xaf(14_500n),
      fee: {
        policyVersion: "savings-card-fee/v1",
        feePerCycle: xaf(500n),
        illustrative: true,
      },
    };

    assert.equal(quote.fee.illustrative, true);
  });

  it("exige que la création cite la version de frais acceptée", () => {
    const request: CreateSavingsCardRequest = {
      name: "Rentrée scolaire",
      terms: TERMS,
      acceptedFeePolicyVersion: "savings-card-fee/v1",
    };

    assert.equal(request.acceptedFeePolicyVersion, "savings-card-fee/v1");
  });
});

describe("SavingsCardResponse", () => {
  it("donne le calendrier, le solde de sa caisse et les frais figés", () => {
    const card: SavingsCardResponse = {
      savingsCardId: "card-1" as SavingsCardId,
      name: "Rentrée scolaire",
      state: "ACTIVE",
      terms: TERMS,
      fee: { policyVersion: "savings-card-fee/v1", feePerCycle: xaf(500n), illustrative: true },
      caisseBalance: xaf(1_000n),
      installments: [
        {
          index: 1,
          dueAt: toIsoDateTime("2026-11-08T00:00:00.000Z"),
          amount: xaf(500n),
          state: "PAID",
          paidAt: toIsoDateTime("2026-11-08T09:00:00.000Z"),
        },
        {
          index: 2,
          dueAt: toIsoDateTime("2026-11-09T00:00:00.000Z"),
          amount: xaf(500n),
          state: "DUE",
        },
      ],
      createdAt: toIsoDateTime("2026-11-08T08:00:00.000Z"),
    };
    const pay: PayInstallmentRequest = { installmentIndex: 2 };

    assert.equal(card.installments[1]?.paidAt, undefined);
    assert.equal(pay.installmentIndex, 2);
  });
});
