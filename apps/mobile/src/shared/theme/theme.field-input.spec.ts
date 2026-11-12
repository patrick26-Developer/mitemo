import { FIELD_INPUT_RESET } from "./theme.field-input";

describe("FIELD_INPUT_RESET", () => {
  it("retire la marge, la bordure et l'interligne de police qu'Android ajoute aux champs", () => {
    expect(FIELD_INPUT_RESET).toEqual({
      padding: 0,
      borderWidth: 0,
      includeFontPadding: false,
      textAlignVertical: "center",
    });
  });
});
