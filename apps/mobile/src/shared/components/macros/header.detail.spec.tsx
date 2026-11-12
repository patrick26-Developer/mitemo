import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { DetailHeader } from "./header.detail";

describe("DetailHeader", () => {
  it("affiche le titre et un bouton de retour", async () => {
    await renderWithSafeArea(<DetailHeader title="Loyer de Janvier" />);

    expect(screen.getByRole("header", { name: "Loyer de Janvier" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Retour" })).toBeOnTheScreen();
  });

  it("donne au bouton de retour la couleur d'action de l'écran", async () => {
    await renderWithSafeArea(<DetailHeader title="Loyer" accent="#CFD8FF" />);

    expect(screen.getByRole("button", { name: "Retour" })).toHaveStyle({
      backgroundColor: "#2044DF",
    });
  });
});
