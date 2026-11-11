import { describe, expect, it } from "vitest";
import { sandboxReceipt } from "./sandbox-receipt.js";

const id = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const mtn = { type: "MMO", accountDetails: { provider: "MTN_MOMO_COG" } };
const fixture = {
  payer: mtn,
  recipient: mtn,
  status: "COMPLETED",
  amount: "500",
  currency: "XAF",
  country: "COG",
};

describe("PawaPay Sandbox observation", () => {
  it("distinguishes the three v2 transaction identifiers", () => {
    expect(sandboxReceipt({ ...fixture, depositId: id })).toEqual({
      kind: "deposit",
      id,
      status: "COMPLETED",
      amount: 500n,
    });
    expect(sandboxReceipt({ ...fixture, payoutId: id })?.kind).toBe("payout");
    expect(sandboxReceipt({ ...fixture, refundId: id })?.kind).toBe("refund");
  });

  it("rejects ambiguous references and statuses from initiation", () => {
    for (const input of [
      { ...fixture, depositId: id, payoutId: id },
      { ...fixture, depositId: id, status: "ACCEPTED" },
      { ...fixture, depositId: id, status: "ENQUEUED" },
      { ...fixture, depositId: id, amount: "500.01" },
      { ...fixture, depositId: id, currency: "XOF" },
      {
        ...fixture,
        depositId: id,
        payer: { type: "MMO", accountDetails: { provider: "AIRTEL_COG" } },
      },
    ])
      expect(sandboxReceipt(input)).toBeUndefined();
  });
});
