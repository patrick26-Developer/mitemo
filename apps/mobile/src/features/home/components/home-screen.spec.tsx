import { render, screen } from "@testing-library/react-native";

import { HomeScreen } from "./home-screen";

describe("HomeScreen", () => {
  it("affiche le nom du produit comme titre", async () => {
    await render(<HomeScreen />);

    expect(screen.getByRole("header", { name: "Mitemo" })).toBeOnTheScreen();
  });

  it("présente la proposition de valeur", async () => {
    await render(<HomeScreen />);

    expect(screen.getByText(/épargne collective/i)).toBeOnTheScreen();
  });
});
