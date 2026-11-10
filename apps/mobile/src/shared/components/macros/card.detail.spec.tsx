import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { DetailCard } from "./card.detail";
import { DetailRow } from "../atoms/row.detail";

describe("DetailCard", () => {
  it("affiche les lignes de détail qu'il contient", async () => {
    await renderWithSafeArea(
      <DetailCard>
        <DetailRow label="Prénom" value="Précieuse" />
        <DetailRow label="Nom" value="Mavoungou" />
      </DetailCard>,
    );

    expect(screen.getByText("Prénom")).toBeOnTheScreen();
    expect(screen.getByText("Précieuse")).toBeOnTheScreen();
    expect(screen.getByText("Nom")).toBeOnTheScreen();
    expect(screen.getByText("Mavoungou")).toBeOnTheScreen();
  });
});
