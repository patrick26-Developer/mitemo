import { describe, expect, it } from "vitest";
import { readSavingsPlan, savingsCalendar } from "./savings-plan.js";

const input = {
  name: "Fournitures",
  terms: {
    installmentAmount: { amount: "500", currency: "XAF" },
    installmentsPerCycle: 3,
    cycleCount: 1,
    frequency: "DAILY",
    startsAt: "2026-11-10T00:00:00.000Z",
  },
};

describe("individual savings plan", () => {
  it("classifies UTC calendar dates without marking a payment", () => {
    const calendar = savingsCalendar(readSavingsPlan(input), new Date("2026-11-11T17:00:00Z"));
    expect(calendar.map(({ state }) => state)).toEqual(["LATE", "DUE", "UPCOMING"]);
  });

  it("rejects impossible dates and excessively large schedules", () => {
    expect(() =>
      readSavingsPlan({ ...input, terms: { ...input.terms, startsAt: "2026-02-30T00:00:00Z" } }),
    ).toThrow();
    expect(() =>
      readSavingsPlan({ ...input, terms: { ...input.terms, cycleCount: 366 } }),
    ).toThrow();
  });
});
