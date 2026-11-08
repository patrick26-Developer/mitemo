import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../shared/testing/render-with-safe-area";
import { ScreenHeader } from "./screen-header";

describe("ScreenHeader", () => {
  it("affiche le titre comme en-tête et le sous-titre", async () => {
    await renderWithSafeArea(
      <ScreenHeader title="Mes cartes de pointage" subtitle="2 cartes de pointage" />,
    );

    expect(screen.getByRole("header", { name: "Mes cartes de pointage" })).toBeOnTheScreen();
    expect(screen.getByText("2 cartes de pointage")).toBeOnTheScreen();
  });
});
