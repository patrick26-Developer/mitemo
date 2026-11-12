import { BadRequestException } from "@nestjs/common";
import { SCHEDULE_FREQUENCIES, toIsoDateTime } from "@mitemo/contracts";
import type { Installment, ScheduleFrequency } from "@mitemo/contracts";

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw invalid();
  return value as Record<string, unknown>;
}

function invalid(): BadRequestException {
  return new BadRequestException("Conditions d’épargne invalides");
}

function positiveCount(value: unknown): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > 366)
    throw invalid();
  return value;
}

/**
 * Validates a plan without accepting a payment state.
 * @param body Untrusted JSON.
 * @returns Validated terms.
 */
export function readSavingsPlan(body: unknown) {
  const input = record(body);
  const terms = record(input["terms"]);
  const name = typeof input["name"] === "string" ? input["name"].trim() : "";
  const installmentsPerCycle = positiveCount(terms["installmentsPerCycle"]);
  const cycleCount = positiveCount(terms["cycleCount"]);
  if (!name || name.length > 80 || installmentsPerCycle * cycleCount > 366) throw invalid();
  return { name, installmentsPerCycle, cycleCount, ...readSchedule(terms) };
}

function readSchedule(terms: Record<string, unknown>) {
  const money = record(terms["installmentAmount"]);
  const amount = money["amount"];
  const frequency = terms["frequency"] as ScheduleFrequency;

  if (money["currency"] !== "XAF" || typeof amount !== "string" || !/^[1-9]\d{0,9}$/.test(amount))
    throw invalid();
  if (!SCHEDULE_FREQUENCIES.includes(frequency) || BigInt(amount) > 1000000000n) throw invalid();
  return { installmentAmount: BigInt(amount), frequency, startsAt: readDate(terms["startsAt"]) };
}

function readDate(date: unknown): Date {
  if (typeof date !== "string" || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?Z$/.test(date))
    throw invalid();
  const startsAt = new Date(date);
  if (
    !Number.isFinite(startsAt.getTime()) ||
    startsAt.toISOString() !== date.replace(/(?<!\.\d{3})Z$/, ".000Z")
  )
    throw invalid();
  return startsAt;
}

function dueDate(start: Date, frequency: string, offset: number): Date {
  const date = new Date(start);
  if (frequency !== "MONTHLY") {
    date.setUTCDate(start.getUTCDate() + offset * (frequency === "WEEKLY" ? 7 : 1));
    return date;
  }
  date.setUTCMonth(start.getUTCMonth() + offset + 1, 0);
  date.setUTCDate(Math.min(start.getUTCDate(), date.getUTCDate()));
  return date;
}

function paymentState(day: string, today: string): Installment["state"] {
  if (day < today) return "LATE";
  return day === today ? "DUE" : "UPCOMING";
}

/**
 * Builds an unpaid UTC schedule.
 * @param plan Persisted terms.
 * @param now Reference date.
 * @returns Tracking entries.
 */
export function savingsCalendar(
  plan: ReturnType<typeof readSavingsPlan>,
  now: Date,
): Installment[] {
  const today = now.toISOString().slice(0, 10);
  return Array.from({ length: plan.installmentsPerCycle * plan.cycleCount }, (_, offset) => {
    const dueAt = toIsoDateTime(dueDate(plan.startsAt, plan.frequency, offset).toISOString());
    const day = dueAt.slice(0, 10);
    return {
      index: offset + 1,
      dueAt,
      amount: {
        amount: plan.installmentAmount.toString() as Installment["amount"]["amount"],
        currency: "XAF",
      },
      state: paymentState(day, today),
    };
  });
}
