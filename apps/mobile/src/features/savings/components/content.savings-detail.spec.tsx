import { screen } from "@testing-library/react-native";

import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { makeCard, makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { SavingsDetailContent } from "./content.savings-detail";

describe("SavingsDetailContent", () => {
  it("affiche la description d'une carte indépendante", async () => {
    usePortfolioStore.setState({ available: 20_000n, tontines: [], cards: [makeCard()] });
    await renderWithSafeArea(<SavingsDetailContent item={makeCard()} />);

    expect(screen.getByText("Une carte de test.")).toBeOnTheScreen();
    expect(screen.queryByText("Tontine du marché")).toBeNull();
  });

  it("présente la tontine rattachée", async () => {
    const card = makeCard({ tontineId: "t1" });
    usePortfolioStore.setState({
      available: 20_000n,
      tontines: [makeTontine({ name: "Tontine du marché" })],
      cards: [card],
    });
    await renderWithSafeArea(<SavingsDetailContent item={card} />);

    expect(screen.getAllByText("Tontine du marché").length).toBeGreaterThan(0);
  });

  it("affiche la carte récapitulative puis l'historique des pointages", async () => {
    const card = makeCard({
      entries: [{ at: "2026-11-02T09:15:00.000Z", amount: 5_000n, method: "AIRTEL_MONEY" }],
    });
    usePortfolioStore.setState({ available: 20_000n, tontines: [], cards: [card] });
    await renderWithSafeArea(<SavingsDetailContent item={card} />);

    expect(screen.getByText("Reste à épargner")).toBeOnTheScreen();
    expect(screen.getByRole("header", { name: "Carte complète" })).toBeOnTheScreen();
    expect(screen.getByText("02/11/2026 à 10:15")).toBeOnTheScreen();
  });
});
