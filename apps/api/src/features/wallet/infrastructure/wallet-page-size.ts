import { BadRequestException } from "@nestjs/common";

/**
 * Enforces the upper bound of the ledger pagination query.
 * @param value Limit from the HTTP query.
 * @returns A supported limit, or the default if omitted.
 */
export function walletPageSize(value: unknown): number {
  if (value === undefined) return 20;
  if (typeof value !== "string" || !/^(?:[1-9]|[1-4][0-9]|50)$/.test(value)) {
    throw new BadRequestException("La limite doit être comprise entre 1 et 50");
  }
  return Number(value);
}
