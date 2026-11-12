import { render, screen } from "@testing-library/react-native";
import { Coins, Users } from "lucide-react-native";

import { FactList } from "./list.facts";

/** Deux informations d'une tontine en création. */
const ITEMS = [
  { id: "participants", icon: Users, label: "Participants", value: "6 membres" },
  { id: "pot", icon: Coins, label: "Restourne par tour", value: "25 000 FCFA" },
] as const;

describe("FactList", () => {
  it("affiche chaque information, son libellé au-dessus de sa valeur, avec son icône", async () => {
    await render(<FactList items={ITEMS} />);

    expect(screen.getByText("Participants")).toBeOnTheScreen();
    expect(screen.getByText("6 membres")).toBeOnTheScreen();
    expect(screen.getAllByTestId(/^fact-row-/)).toHaveLength(2);
    expect(
      screen.getByTestId("fact-icon-participants", { includeHiddenElements: true }),
    ).toBeOnTheScreen();
  });

  it("sépare les informations par un trait, sans trait avant la première", async () => {
    await render(<FactList items={ITEMS} />);

    expect(screen.getAllByTestId("fact-divider")).toHaveLength(1);
  });

  it("ne rend rien sans information", async () => {
    await render(<FactList items={[]} />);

    expect(screen.queryByTestId(/^fact-row-/)).toBeNull();
  });
});
