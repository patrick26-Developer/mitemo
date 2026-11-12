import { isLastSlide, nextSlide, ONBOARDING_SLIDES } from "./model.onboarding-slides";

describe("ONBOARDING_SLIDES", () => {
  it("présente les tontines, le paiement mobile et les cartes de pointage", () => {
    expect(ONBOARDING_SLIDES.map((slide) => slide.id)).toEqual(["tontines", "payment", "savings"]);
  });
});

describe("nextSlide", () => {
  it("avance d'une page sans dépasser la dernière", () => {
    expect(nextSlide(0, 3)).toBe(1);
    expect(nextSlide(2, 3)).toBe(2);
  });
});

describe("isLastSlide", () => {
  it("reconnaît la dernière page", () => {
    expect(isLastSlide(2, 3)).toBe(true);
    expect(isLastSlide(1, 3)).toBe(false);
  });
});
