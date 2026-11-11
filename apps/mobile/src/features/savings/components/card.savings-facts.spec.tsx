import { screen } from "@testing-library/react-native";

import { makeCard } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { SavingsFactsCard } from "./card.savings-facts";

describe("SavingsFactsCard", () => {
  it("affiche l'échéance, les marqueurs restants et le reste à épargner", async () => {
    await renderWithSafeArea(<SavingsFactsCard item={makeCard()} tontineName={null} />);

    expect(screen.getByText("31 décembre 2026")).toBeOnTheScreen();
    expect(screen.getByText("2 sur 6")).toBeOnTheScreen();
    expect(screen.getByText("10 000 FCFA")).toBeOnTheScreen();
  });

  it("nomme la tontine rattachée quand elle existe", async () => {
    await renderWithSafeArea(
      <SavingsFactsCard item={makeCard({ tontineId: "t1" })} tontineName="Tontine du Marché" />,
    );

    expect(screen.getByText("Tontine rattachée")).toBeOnTheScreen();
    expect(screen.getByText("Tontine du Marché")).toBeOnTheScreen();
  });

  it("masque la tontine quand la carte est indépendante", async () => {
    await renderWithSafeArea(<SavingsFactsCard item={makeCard()} tontineName={null} />);

    expect(screen.queryByText("Tontine rattachée")).not.toBeOnTheScreen();
  });
});
