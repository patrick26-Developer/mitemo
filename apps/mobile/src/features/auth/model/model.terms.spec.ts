import { TERMS_POINTS } from "./model.terms";

describe("TERMS_POINTS", () => {
  it("ne rappelle jamais les frais au membre", () => {
    expect(TERMS_POINTS.join(" ")).not.toMatch(/frais/i);
  });
});
