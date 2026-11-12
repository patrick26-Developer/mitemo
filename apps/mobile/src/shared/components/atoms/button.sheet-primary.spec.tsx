import { fireEvent, screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { SheetPrimaryButton } from "./button.sheet-primary";

describe("SheetPrimaryButton", () => {
  it("affiche le libellé et déclenche l'action", async () => {
    const onPress = jest.fn();
    await renderWithSafeArea(<SheetPrimaryButton label="Enregistrer" onPress={onPress} />);

    await fireEvent.press(screen.getByRole("button", { name: "Enregistrer" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("accepte un libellé d'accessibilité distinct du texte", async () => {
    const onPress = jest.fn();
    await renderWithSafeArea(
      <SheetPrimaryButton
        label="Se déconnecter"
        accessibilityLabel="Confirmer la déconnexion"
        onPress={onPress}
      />,
    );

    expect(screen.getByText("Se déconnecter")).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "Confirmer la déconnexion" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("fonce la couleur d'action de l'écran, avec un texte lisible dessus", async () => {
    await renderWithSafeArea(
      <SheetPrimaryButton label="Pointer" onPress={jest.fn()} accent="#CFD8FF" />,
    );

    expect(screen.getByTestId("sheet-primary-accent")).toHaveStyle({ backgroundColor: "#2044DF" });
    expect(screen.getByText("Pointer")).toHaveStyle({ color: "#FFFFFF" });
  });
});
