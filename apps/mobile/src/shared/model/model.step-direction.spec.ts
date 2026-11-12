import { stepDirection } from "./model.step-direction";

describe("stepDirection", () => {
  it("avance vers une étape suivante et revient vers une précédente", () => {
    expect(stepDirection(0, 1)).toBe("forward");
    expect(stepDirection(2, 1)).toBe("back");
  });

  it("considère la première ouverture comme une avance", () => {
    expect(stepDirection(0, 0)).toBe("forward");
  });
});
