import { describe, expect, it, vi } from "vitest";

import {
  isRetryableTransactionError,
  TransactionRaceError,
  TransactionRetryExhaustedError,
  withTransactionRetry,
} from "./transaction-retry.js";

const noSleep = (): Promise<void> => Promise.resolve();

function serializationFailure(): Error {
  return Object.assign(new Error("Transaction failed due to a write conflict or a deadlock"), {
    code: "P2034",
  });
}

describe("isRetryableTransactionError", () => {
  it("reconnaît un conflit de sérialisation, un interblocage et une course d'unicité", () => {
    expect(isRetryableTransactionError(serializationFailure())).toBe(true);
    expect(isRetryableTransactionError(new Error("could not serialize access (40001)"))).toBe(true);
    expect(isRetryableTransactionError(new Error("deadlock detected"))).toBe(true);
    expect(isRetryableTransactionError(new TransactionRaceError("clé concurrente"))).toBe(true);
  });

  it("reconnaît le conflit tel que le signale l'adaptateur pg de Prisma", () => {
    const conflict = (originalCode: string): Error =>
      Object.assign(new Error("TransactionWriteConflict"), {
        name: "DriverAdapterError",
        cause: { kind: "TransactionWriteConflict", originalCode },
      });

    expect(isRetryableTransactionError(conflict("40001"))).toBe(true);
    expect(isRetryableTransactionError(conflict("40P01"))).toBe(true);
  });

  it("ne rejoue pas une autre erreur de l'adaptateur pg", () => {
    const violation = Object.assign(new Error("UniqueConstraintViolation"), {
      cause: { kind: "UniqueConstraintViolation", originalCode: "23505" },
    });

    expect(isRetryableTransactionError(violation)).toBe(false);
  });

  it("ne rejoue jamais une erreur métier ou inconnue", () => {
    expect(isRetryableTransactionError(new Error("LEDGER_UNBALANCED"))).toBe(false);
    expect(isRetryableTransactionError("pas une erreur")).toBe(false);
    expect(isRetryableTransactionError(undefined)).toBe(false);
  });
});

describe("withTransactionRetry", () => {
  it("renvoie le résultat au premier essai réussi", async () => {
    const work = vi.fn(() => Promise.resolve("ok"));

    await expect(withTransactionRetry(work, { maxAttempts: 3, sleep: noSleep })).resolves.toBe(
      "ok",
    );
    expect(work).toHaveBeenCalledTimes(1);
  });

  it("rejoue après un conflit de sérialisation, puis réussit", async () => {
    const work = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(serializationFailure())
      .mockRejectedValueOnce(serializationFailure())
      .mockResolvedValueOnce("ok");

    await expect(withTransactionRetry(work, { maxAttempts: 3, sleep: noSleep })).resolves.toBe(
      "ok",
    );
    expect(work).toHaveBeenCalledTimes(3);
  });

  it("propage immédiatement une erreur non rejouable", async () => {
    const error = new Error("LEDGER_NEGATIVE_BALANCE");
    const work = vi.fn(() => Promise.reject(error));

    await expect(withTransactionRetry(work, { maxAttempts: 5, sleep: noSleep })).rejects.toBe(
      error,
    );
    expect(work).toHaveBeenCalledTimes(1);
  });

  it("s'arrête après le nombre maximal d'essais", async () => {
    const work = vi.fn(() => Promise.reject(serializationFailure()));

    await expect(
      withTransactionRetry(work, { maxAttempts: 4, sleep: noSleep }),
    ).rejects.toBeInstanceOf(TransactionRetryExhaustedError);
    expect(work).toHaveBeenCalledTimes(4);
  });

  it("attend un délai croissant et borné entre deux essais", async () => {
    const delays: number[] = [];
    const work = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(serializationFailure())
      .mockRejectedValueOnce(serializationFailure())
      .mockResolvedValueOnce("ok");

    await withTransactionRetry(work, {
      maxAttempts: 3,
      baseDelayMs: 10,
      random: () => 1,
      sleep: (ms) => {
        delays.push(ms);
        return Promise.resolve();
      },
    });

    expect(delays).toEqual([10, 20]);
  });

  it("refuse un nombre d'essais inférieur à un", async () => {
    await expect(
      withTransactionRetry(() => Promise.resolve(1), { maxAttempts: 0 }),
    ).rejects.toBeInstanceOf(RangeError);
  });
});
