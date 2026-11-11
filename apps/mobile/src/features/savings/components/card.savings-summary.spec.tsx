import { render, screen } from "@testing-library/react-native";

import { makeCard } from "../../../shared/testing/fixtures.portfolio";
import { SavingsSummaryCard } from "./card.savings-summary";

describe("SavingsSummaryCard", () => {
  it("affiche le montant épargné et l'objectif", async () => {
    await render(
      <SavingsSummaryCard
        item={makeCard({ saved: 20_000n, markerAmount: 5_000n, markersTotal: 6 })}
      />,
    );

    expect(screen.getByText("Montant actuel")).toBeOnTheScreen();
    expect(screen.getByText(/20 000/)).toBeOnTheScreen();
    expect(screen.getByText("Objectif 30 000 FCFA")).toBeOnTheScreen();
  });
});
