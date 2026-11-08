import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../shared/testing/render-with-safe-area";
import { ScreenHeader } from "./screen-header";

describe("ScreenHeader", () => {
  it("affiche le titre comme en-tête et le sous-titre", async () => {
    await renderWithSafeArea(<ScreenHeader title="Mes caisses" subtitle="2 caisses" />);

    expect(screen.getByRole("header", { name: "Mes caisses" })).toBeOnTheScreen();
    expect(screen.getByText("2 caisses")).toBeOnTheScreen();
  });
});
