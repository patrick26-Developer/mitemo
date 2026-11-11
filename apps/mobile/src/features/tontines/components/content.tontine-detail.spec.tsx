import { screen } from "@testing-library/react-native";

import { SELF_MEMBER_ID } from "../../../shared/member/model.portfolio";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { makeMember, makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { TontineDetailContent } from "./content.tontine-detail";

describe("TontineDetailContent", () => {
  it("montre les outils d'administration à l'administrateur", async () => {
    const tontine = makeTontine({ state: "PENDING" });
    usePortfolioStore.setState({ available: 20_000n, tontines: [tontine], cards: [] });
    await renderWithSafeArea(<TontineDetailContent item={tontine} />);

    expect(screen.getByText("Membres")).toBeOnTheScreen();
    expect(screen.getByText("3 sur 3 inscrits")).toBeOnTheScreen();
    expect(screen.getByTestId("tontine-recap-card")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Retirer Membre m2" })).toBeOnTheScreen();
    expect(screen.getByText("Une tontine de test.")).toBeOnTheScreen();
  });

  it("cache les outils d'administration à un simple membre", async () => {
    const tontine = makeTontine({
      members: [makeMember(SELF_MEMBER_ID, "MEMBRE"), makeMember("m2", "ADMIN")],
    });
    usePortfolioStore.setState({ available: 20_000n, tontines: [tontine], cards: [] });
    await renderWithSafeArea(<TontineDetailContent item={tontine} />);

    expect(screen.queryByRole("button", { name: /^Retirer Membre/ })).toBeNull();
  });
});
