import { fireEvent, screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { FIELD_CHROME } from "../../theme/theme.field";
import { SheetTextField } from "./field.sheet-text";

describe("SheetTextField", () => {
  it("affiche son libellé, sa valeur et son aide", async () => {
    await renderWithSafeArea(
      <SheetTextField
        label="Cotisation"
        value="5000"
        onChangeText={jest.fn()}
        hint="Montant versé à chaque tour."
      />,
    );

    expect(screen.getByLabelText("Cotisation")).toBeOnTheScreen();
    expect(screen.getByDisplayValue("5000")).toBeOnTheScreen();
    expect(screen.getByText("Montant versé à chaque tour.")).toBeOnTheScreen();
  });

  it("dessine un anneau bleu au focus", async () => {
    await renderWithSafeArea(
      <SheetTextField label="Cotisation" value="" onChangeText={jest.fn()} />,
    );

    await fireEvent(screen.getByLabelText("Cotisation"), "focus");

    expect(screen.getByTestId("sheet-text-field-chrome")).toHaveStyle({
      outlineWidth: 3,
      outlineColor: FIELD_CHROME.focusRing,
    });
  });

  it("laisse l'habillage à l'enveloppe : le champ garde sa marge au focus, même sur Android", async () => {
    await renderWithSafeArea(
      <SheetTextField label="Cotisation" value="" onChangeText={jest.fn()} />,
    );

    await fireEvent(screen.getByLabelText("Cotisation"), "focus");

    expect(screen.getByTestId("sheet-text-field-chrome")).toHaveStyle({ paddingHorizontal: 16 });
    expect(screen.getByLabelText("Cotisation")).toHaveStyle({ padding: 0, borderWidth: 0 });
  });

  it("dessine une bordure et un anneau rouges sur une saisie refusée", async () => {
    await renderWithSafeArea(
      <SheetTextField label="Cotisation" value="" onChangeText={jest.fn()} invalid />,
    );

    expect(screen.getByTestId("sheet-text-field-chrome")).toHaveStyle({
      borderColor: FIELD_CHROME.errorBorder,
      outlineWidth: 3,
      outlineColor: FIELD_CHROME.errorRing,
    });
  });
});
