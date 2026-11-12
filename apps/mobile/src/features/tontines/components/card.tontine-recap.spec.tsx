import { render, screen } from "@testing-library/react-native";

import { makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { TontineRecapCard } from "./card.tontine-recap";

describe("TontineRecapCard", () => {
  it("réunit la cotisation, le plan, l'avancement et les informations du tour", async () => {
    await render(<TontineRecapCard item={makeTontine({ contribution: 10_000n })} />);

    expect(screen.getByText("Cotisation du tour")).toBeOnTheScreen();
    expect(screen.getByText("Fréquence : ")).toBeOnTheScreen();
    expect(screen.getByText("En cours")).toBeOnTheScreen();
    expect(screen.getByText("Tour 1 sur 3")).toBeOnTheScreen();
    expect(screen.getByTestId("progress-fill")).toBeOnTheScreen();
    expect(screen.getByText("Restourne du tour")).toBeOnTheScreen();
    expect(screen.getByTestId("tontine-fact-icon-beneficiary")).toBeOnTheScreen();
  });

  it("pose la teinte claire de la tontine sous un motif de bruit", async () => {
    await render(<TontineRecapCard item={makeTontine()} />);

    expect(screen.getByTestId("tontine-recap-card")).toHaveStyle({ backgroundColor: "#62F79D" });
    expect(screen.getByTestId("noise-pattern")).toBeOnTheScreen();
  });
});
