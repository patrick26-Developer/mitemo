import { reduceMotionMode } from "./model.motion";

describe("reduceMotionMode", () => {
  it("suit le réglage du système tant que le membre garde les animations", () => {
    expect(reduceMotionMode(true)).toBe("system");
  });

  it("coupe toutes les animations quand le membre les désactive", () => {
    expect(reduceMotionMode(false)).toBe("always");
  });
});
