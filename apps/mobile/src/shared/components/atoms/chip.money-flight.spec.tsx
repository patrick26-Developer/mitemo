import { render, screen } from "@testing-library/react-native";

import { MoneyFlightChip } from "./chip.money-flight";

describe("MoneyFlightChip", () => {
  it("affiche le montant qui s'ajoute", async () => {
    await render(<MoneyFlightChip amount={5_500n} />);

    expect(screen.getByText("+5 500 FCFA")).toBeOnTheScreen();
  });
});
