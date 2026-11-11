import { render, screen } from "@testing-library/react-native";

import { makeCard } from "../../../shared/testing/fixtures.portfolio";
import { SavingsPanel } from "./panel.savings";

describe("SavingsPanel", () => {
  it("affiche le montant, l'objectif, les marqueurs et l'échéance", async () => {
    await render(
      <SavingsPanel
        item={makeCard({
          saved: 15_000n,
          markerAmount: 5_000n,
          markersTotal: 6,
          deadline: "2026-12-31",
        })}
      />,
    );

    expect(screen.getByText(/15 000/)).toBeOnTheScreen();
    expect(screen.getByText("30 000 FCFA")).toBeOnTheScreen();
    expect(screen.getByText("3 / 6")).toBeOnTheScreen();
    expect(screen.getByText(/31 décembre 2026/)).toBeOnTheScreen();
  });
});
