import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../shared/testing/render-with-safe-area";
import { DetailHeader } from "./detail-header";

describe("DetailHeader", () => {
  it("affiche le titre et un bouton de retour", async () => {
    await renderWithSafeArea(<DetailHeader title="Loyer de Janvier" />);

    expect(screen.getByRole("header", { name: "Loyer de Janvier" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Retour" })).toBeOnTheScreen();
  });
});
