import { Text } from "react-native";

import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { SheetInfoCard } from "./card.sheet-info";

describe("SheetInfoCard", () => {
  it("affiche le contenu de la carte", async () => {
    await renderWithSafeArea(
      <SheetInfoCard>
        <Text>Comment cotiser ?</Text>
        <Text>Chaque membre cotise à son tour.</Text>
      </SheetInfoCard>,
    );

    expect(screen.getByText("Comment cotiser ?")).toBeOnTheScreen();
    expect(screen.getByText("Chaque membre cotise à son tour.")).toBeOnTheScreen();
  });
});
