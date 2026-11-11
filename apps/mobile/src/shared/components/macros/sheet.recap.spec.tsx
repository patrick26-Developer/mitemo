import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { SheetRecap } from "./sheet.recap";

describe("SheetRecap", () => {
  it("affiche le titre et les lignes du récapitulatif", async () => {
    await renderWithSafeArea(
      <SheetRecap
        title="Récapitulatif"
        rows={[{ label: "Restourne par tour", value: "25 000 FCFA" }]}
      />,
    );

    expect(screen.getByText("Récapitulatif")).toBeOnTheScreen();
    expect(screen.getByText("Restourne par tour")).toBeOnTheScreen();
    expect(screen.getByText("25 000 FCFA")).toBeOnTheScreen();
  });

  it("ne rend rien sans ligne", async () => {
    await renderWithSafeArea(<SheetRecap title="Récapitulatif" rows={[]} />);

    expect(screen.queryByText("Récapitulatif")).not.toBeOnTheScreen();
  });
});
