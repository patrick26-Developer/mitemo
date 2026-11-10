import { formatCountLabel } from "./model.home-content";

describe("formatCountLabel", () => {
  it("accorde le libellé au nombre affiché", () => {
    expect(formatCountLabel(0, "Carte de pointage", "Cartes de pointage")).toBe(
      "0 Cartes de pointage",
    );
    expect(formatCountLabel(1, "Tontine", "Tontines")).toBe("1 Tontine");
    expect(formatCountLabel(4, "Tontine", "Tontines")).toBe("4 Tontines");
  });
});
