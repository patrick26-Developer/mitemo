import { render, screen } from "@testing-library/react-native";

import { makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { TontineCycleCard } from "./card.tontine-cycle";

describe("TontineCycleCard", () => {
  it("affiche le tour en cours et son bénéficiaire", async () => {
    await render(<TontineCycleCard item={makeTontine({ round: 2, totalRounds: 3 })} />);

    expect(screen.getByText("2 sur 3")).toBeOnTheScreen();
    expect(screen.getByText("Membre m2")).toBeOnTheScreen();
  });
});
