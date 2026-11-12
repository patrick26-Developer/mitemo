import { BadRequestException, NotFoundException } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import type { PrismaService } from "../../shared/database/prisma.service.js";
import { SavingsService } from "./savings.service.js";

const owner = "6c982d98-2d2a-4ceb-b944-bc8fa0e8ae0f";
const goal = {
  id: "083d7c80-0b1c-4a4a-bfba-43ec5655296f",
  userId: owner,
  name: "Fournitures",
  installmentAmount: 500n,
  frequency: "WEEKLY",
  installmentsPerCycle: 3,
  cycleCount: 1,
  startsAt: new Date("2026-11-30T00:00:00Z"),
  createdAt: new Date("2026-11-11T00:00:00Z"),
};

function fixture() {
  const savingsGoal = {
    create: vi.fn().mockResolvedValue(goal),
    findFirst: vi.fn().mockResolvedValue(goal),
    findMany: vi.fn().mockResolvedValue([goal]),
  };
  return { savingsGoal, service: new SavingsService({ savingsGoal } as unknown as PrismaService) };
}

describe("SavingsService", () => {
  it("persists validated terms under the authenticated owner", async () => {
    const { savingsGoal, service } = fixture();
    const result = await service.create(owner, {
      name: goal.name,
      userId: "untrusted",
      terms: {
        installmentAmount: { amount: "500", currency: "XAF" },
        frequency: goal.frequency,
        installmentsPerCycle: 3,
        cycleCount: 1,
        startsAt: goal.startsAt.toISOString(),
      },
    });
    expect(savingsGoal.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ userId: owner, installmentAmount: 500n }),
    });
    expect(result.target).toEqual({ amount: "1500", currency: "XAF" });
  });

  it("validates cursor ownership before fetching the next page", async () => {
    const { savingsGoal, service } = fixture();
    const rows = Array.from({ length: 21 }, (_, i) => ({ ...goal, id: String(i) }));
    savingsGoal.findMany.mockResolvedValueOnce(rows);
    const page = await service.list(owner, goal.id);
    expect(savingsGoal.findFirst).toHaveBeenCalledWith({ where: { userId: owner, id: goal.id } });
    expect(savingsGoal.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: owner }, cursor: { id: goal.id }, skip: 1 }),
    );
    expect(page.items).toHaveLength(20);
    expect(page.nextCursor).toBe("19");
    expect(await service.list(owner, undefined)).not.toHaveProperty("nextCursor");
  });

  it("refuses malformed and foreign identifiers without leaking goal data", async () => {
    const { savingsGoal, service } = fixture();
    await expect(service.detail(owner, "invalid")).rejects.toBeInstanceOf(BadRequestException);
    expect(savingsGoal.findFirst).not.toHaveBeenCalled();
    savingsGoal.findFirst.mockResolvedValue(null);
    await expect(service.calendar(owner, goal.id)).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.contributions(owner, goal.id)).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.list(owner, goal.id)).rejects.toBeInstanceOf(NotFoundException);
    expect(savingsGoal.findMany).not.toHaveBeenCalled();
  });

  it("provides a schedule without inventing a confirmed contribution", async () => {
    const { service } = fixture();
    const detail = await service.detail(owner, goal.id);
    expect(detail.goalId).toBe(goal.id);
    const { items } = await service.calendar(owner, goal.id);
    expect(items.map(({ dueAt }) => dueAt)).toEqual([
      "2026-11-30T00:00:00.000Z",
      "2026-12-07T00:00:00.000Z",
      "2026-12-14T00:00:00.000Z",
    ]);
    expect(items.some(({ state }) => state === "PAID")).toBe(false);
    expect(await service.contributions(owner, goal.id)).toEqual({ items: [] });
  });
});
