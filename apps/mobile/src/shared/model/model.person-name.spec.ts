import { MIN_PERSON_NAME_LENGTH, isValidPersonName } from "./model.person-name";

describe("isValidPersonName", () => {
  it("exige au moins deux caractères utiles", () => {
    expect(isValidPersonName(" A ")).toBe(false);
    expect(isValidPersonName("Aimée")).toBe(true);
  });

  it("accepte exactement la longueur minimale", () => {
    expect(isValidPersonName("A".repeat(MIN_PERSON_NAME_LENGTH))).toBe(true);
  });
});
