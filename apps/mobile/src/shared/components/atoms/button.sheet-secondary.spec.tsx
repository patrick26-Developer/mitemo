import { fireEvent, screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { SheetSecondaryButton } from "./button.sheet-secondary";

describe("SheetSecondaryButton", () => {
  it("affiche le libellé et déclenche l'action", async () => {
    const onPress = jest.fn();
    await renderWithSafeArea(<SheetSecondaryButton label="Annuler" onPress={onPress} />);

    await fireEvent.press(screen.getByRole("button", { name: "Annuler" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("accepte un libellé d'accessibilité distinct du texte", async () => {
    const onPress = jest.fn();
    await renderWithSafeArea(
      <SheetSecondaryButton
        label="Annuler"
        accessibilityLabel="Annuler la déconnexion"
        onPress={onPress}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Annuler la déconnexion" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("se borde de la couleur d'action de l'écran quand elle est fournie", async () => {
    await renderWithSafeArea(
      <SheetSecondaryButton label="Payer avec MTN MoMo" onPress={jest.fn()} accent="#CFD8FF" />,
    );

    expect(screen.getByRole("button", { name: "Payer avec MTN MoMo" })).toHaveStyle({
      borderColor: "#2044DF",
    });
  });
});
