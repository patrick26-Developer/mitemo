import { fireEvent, render, screen } from "@testing-library/react-native";

import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { INITIAL_PRIVACY, usePrivacyStore } from "../../../shared/member/store.privacy";
import { makeCard } from "../../../shared/testing/fixtures.portfolio";
import { BalanceCard } from "./card.balance";

describe("BalanceCard", () => {
  beforeEach(() => {
    usePrivacyStore.setState(INITIAL_PRIVACY);
    usePortfolioStore.setState({
      available: 125_000n,
      tontines: [],
      cards: [makeCard({ saved: 20_000n }), makeCard({ id: "c2", saved: 5_000n })],
    });
  });

  it("affiche le solde disponible et le total mis de côté", async () => {
    await render(<BalanceCard />);

    expect(screen.getByText("Solde disponible")).toBeOnTheScreen();
    expect(screen.getByText(/125 000/)).toBeOnTheScreen();
    expect(screen.getByText("25 000 FCFA")).toBeOnTheScreen();
  });

  it("masque puis réaffiche les montants", async () => {
    await render(<BalanceCard />);

    await fireEvent.press(screen.getByRole("button", { name: "Masquer les montants" }));

    expect(screen.queryByText(/125 000/)).toBeNull();
    expect(usePrivacyStore.getState().amountsHidden).toBe(true);

    await fireEvent.press(screen.getByRole("button", { name: "Afficher les montants" }));

    expect(screen.getByText(/125 000/)).toBeOnTheScreen();
  });
});
