import { STEP_SLIDE_OFFSET, stepDirection, stepEnteringFrames } from "./model.step-direction";

describe("stepDirection", () => {
  it("avance vers une étape suivante et revient vers une précédente", () => {
    expect(stepDirection(0, 1)).toBe("forward");
    expect(stepDirection(2, 1)).toBe("back");
  });

  it("considère la première ouverture comme une avance", () => {
    expect(stepDirection(0, 0)).toBe("forward");
  });
});

describe("stepEnteringFrames", () => {
  it("fait entrer l'étape suivante par la droite, en fondu, légèrement réduite", () => {
    const frames = stepEnteringFrames("forward");

    expect(frames.from).toEqual({
      opacity: 0,
      transform: [{ translateX: STEP_SLIDE_OFFSET }, { scale: 0.98 }],
    });
    expect(frames.to).toEqual({ opacity: 1, transform: [{ translateX: 0 }, { scale: 1 }] });
  });

  it("fait revenir l'étape précédente par la gauche", () => {
    expect(stepEnteringFrames("back").from.transform[0]).toEqual({
      translateX: -STEP_SLIDE_OFFSET,
    });
  });

  it("glisse d'un geste court, pas de toute la largeur de l'écran", () => {
    expect(STEP_SLIDE_OFFSET).toBeLessThanOrEqual(32);
  });
});
