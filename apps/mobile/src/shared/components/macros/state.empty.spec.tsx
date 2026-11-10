import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { EmptyState } from "./state.empty";

describe("EmptyState", () => {
  it("affiche le titre et le message", async () => {
    await renderWithSafeArea(
      <EmptyState title="Carte introuvable" message="Cette carte a été supprimée." />,
    );

    expect(screen.getByRole("header", { name: "Carte introuvable" })).toBeOnTheScreen();
    expect(screen.getByText("Cette carte a été supprimée.")).toBeOnTheScreen();
  });
});
