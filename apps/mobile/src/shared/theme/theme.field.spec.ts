import { FIELD_CHROME, fieldChrome } from "./theme.field";

describe("fieldChrome", () => {
  it("pose un fond et une bordure gris au repos", () => {
    expect(fieldChrome({ focused: false, invalid: false })).toEqual({
      backgroundColor: FIELD_CHROME.background,
      borderColor: FIELD_CHROME.border,
    });
  });

  it("dessine un anneau bleu au focus, sans déplacer le champ", () => {
    expect(fieldChrome({ focused: true, invalid: false })).toEqual({
      backgroundColor: FIELD_CHROME.background,
      borderColor: FIELD_CHROME.focusBorder,
      outlineColor: FIELD_CHROME.focusRing,
      outlineOffset: 1,
      outlineStyle: "solid",
      outlineWidth: 3,
    });
  });

  it("dessine un anneau rouge en erreur, même quand le champ a le focus", () => {
    const error = {
      backgroundColor: FIELD_CHROME.background,
      borderColor: FIELD_CHROME.errorBorder,
      outlineColor: FIELD_CHROME.errorRing,
      outlineOffset: 1,
      outlineStyle: "solid",
      outlineWidth: 3,
    };

    expect(fieldChrome({ focused: false, invalid: true })).toEqual(error);
    expect(fieldChrome({ focused: true, invalid: true })).toEqual(error);
  });
});
