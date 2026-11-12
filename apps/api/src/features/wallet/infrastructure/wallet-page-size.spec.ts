import { describe, expect, it } from "vitest";
import { walletPageSize } from "./wallet-page-size.js";

describe("wallet movement pagination", () => {
  it("defaults to twenty items and accepts the supported bounds", () => {
    expect(walletPageSize(undefined)).toBe(20);
    expect(walletPageSize("1")).toBe(1);
    expect(walletPageSize("50")).toBe(50);
  });

  it("rejects out-of-range, fractional and repeated limits", () => {
    for (const value of ["0", "51", "1.5", ["1", "2"]]) {
      expect(() => walletPageSize(value)).toThrow("La limite doit être comprise entre 1 et 50");
    }
  });
});
