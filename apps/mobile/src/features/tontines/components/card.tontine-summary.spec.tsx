import { render, screen } from "@testing-library/react-native";

import { makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { TontineSummaryCard } from "./card.tontine-summary";

describe("TontineSummaryCard", () => {
  it("affiche la cotisation, sa fréquence et le nombre de membres", async () => {
    await render(<TontineSummaryCard item={makeTontine({ contribution: 10_000n })} />);

    expect(screen.getByText("Cotisation chaque semaine")).toBeOnTheScreen();
    expect(screen.getByText(/10 000/)).toBeOnTheScreen();
    expect(screen.getByText("3 membres")).toBeOnTheScreen();
  });
});
