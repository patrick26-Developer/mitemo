import { formatDate } from "./format-date";

describe("formatDate", () => {
  it("rend une date ISO au format JJ/MM/AAAA", () => {
    expect(formatDate("2026-03-12")).toBe("12/03/2026");
  });

  it("garde le jour UTC d'une date proche de minuit", () => {
    expect(formatDate("2026-03-12T23:30:00Z")).toBe("12/03/2026");
  });
});
