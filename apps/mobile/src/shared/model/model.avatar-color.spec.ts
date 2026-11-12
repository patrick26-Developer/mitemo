import { AVATAR_COLORS, avatarColor } from "./model.avatar-color";

describe("avatarColor", () => {
  it("donne toujours la même couleur à la même personne", () => {
    expect(avatarColor("Mama Nadège")).toBe(avatarColor("Mama Nadège"));
    expect(AVATAR_COLORS).toContain(avatarColor("Mama Nadège"));
  });

  it("varie les couleurs d'une personne à l'autre", () => {
    const names = ["Aimée", "Serge", "Pauline", "Alphonse", "Léonie", "Clarisse", "David"];
    expect(new Set(names.map(avatarColor)).size).toBeGreaterThan(3);
  });
});
