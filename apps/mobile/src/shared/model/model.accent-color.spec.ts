import { accentColors, contrastRatio, darkenColor } from "./model.accent-color";

describe("contrastRatio", () => {
  it("vaut 21 entre le noir et le blanc, et 1 entre deux couleurs égales", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
    expect(contrastRatio("#2044DF", "#2044DF")).toBeCloseTo(1, 5);
  });
});

describe("accentColors", () => {
  it.each([
    ["#CFD8FF", "#2044DF", "#FFFFFF"],
    ["#CDF5DD", "#2AD56E", "#0E1423"],
    ["#F5D7B0", "#DF8C20", "#0E1423"],
    ["#F2C9E4", "#CE3198", "#FFFFFF"],
  ])("fonce la teinte %s en %s, avec un texte %s", (tint, background, foreground) => {
    expect(accentColors(tint)).toEqual({ background, foreground });
  });

  it("garde un contraste d'au moins 4,5:1 pour chaque teinte des cartes", () => {
    for (const tint of ["#CFD8FF", "#CDF5DD", "#F5D7B0", "#F2C9E4"]) {
      const { background, foreground } = accentColors(tint);

      expect(contrastRatio(background, foreground)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("traite un gris sans teinte", () => {
    expect(accentColors("#EEEEEE")).toEqual({ background: "#808080", foreground: "#0E1423" });
  });
});

describe("darkenColor", () => {
  it("fonce légèrement une couleur en gardant sa teinte", () => {
    expect(darkenColor("#62F79D")).toBe("#28F479");
    expect(darkenColor("#FFFFFF")).toBe("#E0E0E0");
  });
});
