import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../shared/testing/render-with-safe-area";
import { PlaceholderScreen } from "./placeholder-screen";

describe("PlaceholderScreen", () => {
  it("affiche le titre de la section comme en-tête", async () => {
    await renderWithSafeArea(<PlaceholderScreen title="Caisses" />);

    expect(screen.getByRole("header", { name: "Caisses" })).toBeOnTheScreen();
  });
});
