import { screen } from "@testing-library/react-native";

import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { NotificationsSheet } from "./sheet.notifications";

describe("NotificationsSheet", () => {
  it("rassure le membre quand rien n'est attendu", async () => {
    usePortfolioStore.setState({ tontines: [], cards: [] });
    await renderWithSafeArea(<NotificationsSheet visible onClose={jest.fn()} />);

    expect(screen.getByText(/Vous êtes à jour/)).toBeOnTheScreen();
  });

  it("liste les actions attendues", async () => {
    usePortfolioStore.setState({
      tontines: [makeTontine({ name: "Tontine du marché" })],
      cards: [],
    });
    await renderWithSafeArea(<NotificationsSheet visible onClose={jest.fn()} />);

    expect(screen.getByText("Cotisation à régler")).toBeOnTheScreen();
    expect(screen.getByText(/Tontine du marché : 5 000 FCFA/)).toBeOnTheScreen();
  });
});
