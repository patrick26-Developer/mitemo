import { render, screen } from "@testing-library/react-native";

import { makeCard } from "../../../shared/testing/fixtures.portfolio";
import { CardContributionsGrid } from "./grid.card-contributions";

/** Carte échue de 3 pointages : un réglé, un manqué, un entamé. */
const CARD = makeCard({
  markersTotal: 3,
  startDate: "2026-01-05",
  deadline: "2026-01-26",
  entries: [
    { at: "2026-01-06T09:00:00.000Z", amount: 5_000n, method: "MTN_MOMO" },
    { at: "2026-01-20T09:00:00.000Z", amount: 1_000n, method: "AIRTEL_MONEY" },
  ],
});

describe("CardContributionsGrid", () => {
  it("dessine une case par pointage prévu, et résume l'assiduité", async () => {
    await render(<CardContributionsGrid item={CARD} />);

    expect(screen.getByText("Assiduité")).toBeOnTheScreen();
    expect(screen.getByText("1 pointage réglé sur 3")).toBeOnTheScreen();
    expect(screen.getAllByTestId(/^contribution-level-/)).toHaveLength(3);
    expect(screen.getByLabelText("Pointage du 12 janvier 2026 : rien versé")).toBeOnTheScreen();
  });
});
