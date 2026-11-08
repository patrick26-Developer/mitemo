import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../shared/testing/render-with-safe-area";
import { DetailRow } from "./detail-row";

describe("DetailRow", () => {
  it("affiche le libellé et sa valeur", async () => {
    await renderWithSafeArea(<DetailRow label="Objectif" value="30 000 FCFA" />);

    expect(screen.getByText("Objectif")).toBeOnTheScreen();
    expect(screen.getByText("30 000 FCFA")).toBeOnTheScreen();
  });
});
