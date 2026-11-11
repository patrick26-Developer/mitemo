import { parseIsoDateInput } from "./model.date-input";

describe("parseIsoDateInput", () => {
  it("accepte une date valide au format AAAA-MM-JJ", () => {
    expect(parseIsoDateInput("2026-12-31")).toBe("2026-12-31");
  });

  it("tolère les espaces autour de la date", () => {
    expect(parseIsoDateInput(" 2026-01-05 ")).toBe("2026-01-05");
  });

  it("refuse un autre format", () => {
    expect(parseIsoDateInput("31/12/2026")).toBeNull();
    expect(parseIsoDateInput("2026-12")).toBeNull();
  });

  it("refuse un jour inexistant", () => {
    expect(parseIsoDateInput("2026-02-30")).toBeNull();
    expect(parseIsoDateInput("2026-13-01")).toBeNull();
  });
});
