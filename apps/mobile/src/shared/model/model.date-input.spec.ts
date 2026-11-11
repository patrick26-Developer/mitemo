import { parseFrenchDateInput } from "./model.date-input";

describe("parseFrenchDateInput", () => {
  it("convertit une date française en date ISO", () => {
    expect(parseFrenchDateInput("31/12/2026")).toBe("2026-12-31");
    expect(parseFrenchDateInput("5/1/2026")).toBe("2026-01-05");
  });

  it("tolère les espaces autour de la date", () => {
    expect(parseFrenchDateInput(" 28/02/2027 ")).toBe("2027-02-28");
  });

  it("refuse un autre format", () => {
    expect(parseFrenchDateInput("2026-12-31")).toBeNull();
    expect(parseFrenchDateInput("31/12")).toBeNull();
    expect(parseFrenchDateInput("31/12/26")).toBeNull();
  });

  it("refuse un jour ou un mois inexistant", () => {
    expect(parseFrenchDateInput("30/02/2026")).toBeNull();
    expect(parseFrenchDateInput("31/13/2026")).toBeNull();
  });
});
