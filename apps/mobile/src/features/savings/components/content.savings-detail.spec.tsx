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
});
