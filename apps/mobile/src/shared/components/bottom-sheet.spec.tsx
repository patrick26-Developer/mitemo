import { screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { renderWithSafeArea } from "../testing/render-with-safe-area";
import { BottomSheet } from "./bottom-sheet";

describe("BottomSheet", () => {
  it("affiche le titre et le contenu quand elle est visible", async () => {
    await renderWithSafeArea(
      <BottomSheet visible title="Mes informations" onClose={jest.fn()}>
        <Text>Contenu de la feuille</Text>
      </BottomSheet>,
    );

    expect(screen.getByRole("header", { name: "Mes informations" })).toBeOnTheScreen();
    expect(screen.getByText("Contenu de la feuille")).toBeOnTheScreen();
    expect(screen.getByTestId("grid-background")).toBeOnTheScreen();
  });

  it("ne rend rien quand elle est fermée", async () => {
    await renderWithSafeArea(
      <BottomSheet visible={false} title="Mes informations" onClose={jest.fn()}>
        <Text>Contenu de la feuille</Text>
      </BottomSheet>,
    );

    expect(screen.queryByText("Contenu de la feuille")).not.toBeOnTheScreen();
  });
});
