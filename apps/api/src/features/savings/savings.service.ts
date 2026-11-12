import { randomUUID } from "node:crypto";
import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { serializeAmount, toAmountMinor, toIsoDateTime } from "@mitemo/contracts";
import type { SavingsGoalResponse, ScheduleFrequency } from "@mitemo/contracts";
import type { SavingsGoal } from "../../generated/prisma/client.js";
import { PrismaService } from "../../shared/database/prisma.service.js";
import { readSavingsPlan, savingsCalendar } from "./savings-plan.js";

const UUID = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;

function money(amount: bigint) {
  return { amount: serializeAmount(toAmountMinor(amount)), currency: "XAF" as const };
}

function summary(goal: SavingsGoal): SavingsGoalResponse {
  return {
    goalId: goal.id,
    name: goal.name,
    terms: {
      installmentAmount: money(goal.installmentAmount),
      frequency: goal.frequency as ScheduleFrequency,
      installmentsPerCycle: goal.installmentsPerCycle,
      cycleCount: goal.cycleCount,
      startsAt: toIsoDateTime(goal.startsAt.toISOString()),
    },
    createdAt: toIsoDateTime(goal.createdAt.toISOString()),
    target: money(goal.installmentAmount * BigInt(goal.installmentsPerCycle * goal.cycleCount)),
  };
}

/** Persists individual plans and reads only resources owned by the caller. */
@Injectable()
export class SavingsService {
  /**
   * Wires dependencies.
   * @param prisma PostgreSQL persistence.
   */
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  /**
   * Creates a plan without moving any money.
   * @param userId Authenticated owner.
   * @param input Untrusted goal terms.
   * @returns Created goal.
   */
  async create(userId: string, input: unknown) {
    return summary(
      await this.prisma.savingsGoal.create({
        data: { id: randomUUID(), userId, ...readSavingsPlan(input) },
      }),
    );
  }

  /**
   * Lists up to twenty plans, newest first.
   * @param userId Authenticated owner.
   * @param cursor Optional pagination cursor.
   * @returns Goal page.
   */
  async list(userId: string, cursor: unknown) {
    const anchor = cursor === undefined ? undefined : await this.owned(userId, cursor);
    const rows = await this.prisma.savingsGoal.findMany({
      where: { userId },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      ...(anchor ? { cursor: { id: anchor.id }, skip: 1 } : {}),
      take: 21,
    });
    const items = rows.slice(0, 20).map(summary);
    const nextCursor = rows.length > 20 ? items.at(-1)?.goalId : undefined;
    return nextCursor ? { items, nextCursor } : { items };
  }

  /**
   * Returns an owned plan or a generic not-found error.
   * @param userId Authenticated owner.
   * @param id Goal UUID.
   * @returns Owned goal.
   */
  async detail(userId: string, id: unknown) {
    return summary(await this.owned(userId, id));
  }

  /**
   * Computes the tracking card from the persisted schedule.
   * @param userId Authenticated owner.
   * @param id Goal UUID.
   * @returns Tracking schedule.
   */
  async calendar(userId: string, id: unknown) {
    const goal = await this.owned(userId, id);
    return {
      items: savingsCalendar(
        { ...goal, frequency: goal.frequency as ScheduleFrequency },
        new Date(),
      ),
    };
  }

  /**
   * Validates ownership before returning the history of this planning-only lot.
   * @param userId Authenticated owner.
   * @param id Goal UUID.
   * @returns Contribution history.
   */
  async contributions(userId: string, id: unknown) {
    await this.owned(userId, id);
    return { items: [] };
  }

  private async owned(userId: string, id: unknown) {
    if (typeof id !== "string" || !UUID.test(id))
      throw new BadRequestException("Identifiant invalide");
    const goal = await this.prisma.savingsGoal.findFirst({ where: { id, userId } });
    if (!goal) throw new NotFoundException();
    return goal;
  }
}
