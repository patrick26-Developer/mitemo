import { fireEvent, screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../testing/render-with-safe-area";
import { SheetPrimaryButton } from "./sheet-primary-button";

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
});
