import { render, screen } from "@testing-library/react-native";

import { makeCard } from "../../../shared/testing/fixtures.portfolio";
import { CardLevelCard } from "./card.level";

describe("CardLevelCard", () => {
  it("montre Temo puis explique le niveau et la couleur, sur la couleur de la carte", async () => {
    await render(<CardLevelCard item={makeCard({ markerAmount: 6_000n, tint: "#F5D7B0" })} />);

    expect(screen.getByTestId("mascot-temo", { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.getByText("Niveau 3 sur 5 · carte sable")).toBeOnTheScreen();
    expect(
      screen.getByText(/parce que chaque pointage est de 6 000 à 19 999 FCFA/),
    ).toBeOnTheScreen();
    expect(screen.getByTestId("card-level")).toHaveStyle({ backgroundColor: "#F5D7B0" });
  });
});
