import { fireEvent, screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { SheetNameField } from "./field.sheet-name";

describe("SheetNameField", () => {
  it("limite la saisie à 30 caractères et affiche le compteur sous l'aide", async () => {
    await renderWithSafeArea(
      <SheetNameField
        value="Tontine du Marché"
        onChangeText={jest.fn()}
        hint="Le nom que verront les membres."
      />,
    );

    expect(screen.getByLabelText("Nom").props["maxLength"]).toBe(30);
    expect(screen.getByText("Le nom que verront les membres. 17/30")).toBeOnTheScreen();
  });

  it("transmet la saisie", async () => {
    const onChangeText = jest.fn();
    await renderWithSafeArea(<SheetNameField value="" onChangeText={onChangeText} hint="Aide." />);

    await fireEvent.changeText(screen.getByLabelText("Nom"), "Épargne");

    expect(onChangeText).toHaveBeenCalledWith("Épargne");
  });
});
