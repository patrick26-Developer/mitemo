import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
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
});
