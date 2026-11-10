import { formatFullName } from "./format.full-name";

describe("formatFullName", () => {
  it("joint le prénom et le nom", () => {
    expect(formatFullName("Aimée", "Mbemba")).toBe("Aimée Mbemba");
  });

  it("ignore les espaces autour des saisies", () => {
    expect(formatFullName("  Aimée ", " Mbemba  ")).toBe("Aimée Mbemba");
  });

  it("ne laisse pas d'espace quand le nom manque", () => {
    expect(formatFullName("Aimée", "")).toBe("Aimée");
  });
});
