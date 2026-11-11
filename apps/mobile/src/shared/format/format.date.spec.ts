import { formatDate, formatDateTime } from "./format.date";

describe("formatDate", () => {
  it("rend une date ISO au format JJ/MM/AAAA", () => {
    expect(formatDate("2026-03-12")).toBe("12/03/2026");
  });

  it("garde le jour UTC d'une date proche de minuit", () => {
    expect(formatDate("2026-03-12T23:30:00Z")).toBe("12/03/2026");
  });
});

describe("formatDateTime", () => {
  it("rend le jour et l'heure à l'heure de Brazzaville (UTC+1)", () => {
    expect(formatDateTime("2026-11-02T09:15:00.000Z")).toBe("02/11/2026 à 10:15");
  });

  it("passe au jour suivant quand l'heure de Brazzaville dépasse minuit", () => {
    expect(formatDateTime("2026-11-02T23:30:00.000Z")).toBe("03/11/2026 à 00:30");
  });
});
