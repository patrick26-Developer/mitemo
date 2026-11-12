import { fireEvent, screen } from "@testing-library/react-native";
import { Wallet } from "lucide-react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { EmptyState } from "./state.empty";

describe("EmptyState", () => {
  it("affiche le titre et le message", async () => {
    await renderWithSafeArea(
      <EmptyState title="Carte introuvable" message="Cette carte a été supprimée." />,
    );

    expect(screen.getByRole("header", { name: "Carte introuvable" })).toBeOnTheScreen();
    expect(screen.getByText("Cette carte a été supprimée.")).toBeOnTheScreen();
    expect(screen.queryByTestId("empty-state-icon")).toBeNull();
  });

  it("centre l'icône de l'onglet au-dessus du titre", async () => {
    await renderWithSafeArea(
      <EmptyState title="Aucune carte" message="Créez-en une." icon={Wallet} />,
    );

    expect(screen.getByTestId("empty-state-icon")).toBeOnTheScreen();
  });

  it("propose une action quand elle est fournie", async () => {
    const onPress = jest.fn();
    await renderWithSafeArea(
      <EmptyState title="Vide" message="Rien ici." action={{ label: "Créer", onPress }} />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Créer" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
