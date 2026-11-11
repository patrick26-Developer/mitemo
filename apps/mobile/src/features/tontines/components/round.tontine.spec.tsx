import { render, screen } from "@testing-library/react-native";

import { TontineRound } from "./round.tontine";

describe("TontineRound", () => {
  it("affiche le tour en cours sur le total", async () => {
    await render(<TontineRound round={4} totalRounds={10} />);

    expect(screen.getByText("Tour 4 / 10")).toBeOnTheScreen();
  });
});
