import { screen } from "@testing-library/react-native";
import { View } from "react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { DetailRow } from "./row.detail";

describe("DetailRow", () => {
  it("affiche le libellé et sa valeur", async () => {
    await renderWithSafeArea(<DetailRow label="Objectif" value="30 000 FCFA" />);

    expect(screen.getByText("Objectif")).toBeOnTheScreen();
    expect(screen.getByText("30 000 FCFA")).toBeOnTheScreen();
  });

  it("pose l'icône fournie devant le libellé", async () => {
    await renderWithSafeArea(
      <DetailRow label="Frais" value="3 000 FCFA" icon={<View testID="row-icon" />} />,
    );

    expect(screen.getByTestId("row-icon")).toBeOnTheScreen();
  });
});
