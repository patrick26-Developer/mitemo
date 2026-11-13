import { firstNameOf } from "./model.first-name";

describe("firstNameOf", () => {
  it("garde le premier mot du nom complet", () => {
    expect(firstNameOf("  Grâce   MBEMBA ")).toBe("Grâce");
  });

  it("rend une chaîne vide sans nom", () => {
    expect(firstNameOf("   ")).toBe("");
  });
});
