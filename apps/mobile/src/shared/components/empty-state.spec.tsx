import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../shared/testing/render-with-safe-area";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("affiche le titre et le message", async () => {
    await renderWithSafeArea(
      <EmptyState title="Carte introuvable" message="Cette carte a été supprimée." />,
    );

    expect(screen.getByRole("header", { name: "Carte introuvable" })).toBeOnTheScreen();
    expect(screen.getByText("Cette carte a été supprimée.")).toBeOnTheScreen();
  });
});
