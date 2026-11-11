import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { makeCard } from "../../../shared/testing/fixtures.portfolio";
import { SavingsSection } from "./section.savings";

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));

describe("SavingsSection", () => {
  it("ne compte que les cartes actives", async () => {
    usePortfolioStore.setState({
      cards: [
        makeCard({ name: "Rentrée scolaire" }),
        makeCard({ id: "c2", name: "Ancienne carte", state: "COMPLETED" }),
      ],
    });
    await render(<SavingsSection />);

    expect(screen.getByRole("button", { name: "1 Carte de pointage" })).toBeOnTheScreen();
    expect(screen.getByText("Rentrée scolaire")).toBeOnTheScreen();
    expect(screen.queryByText("Ancienne carte")).toBeNull();
  });

  it("ouvre l'onglet épargne depuis le titre", async () => {
    usePortfolioStore.setState({ cards: [] });
    await render(<SavingsSection />);

    await fireEvent.press(screen.getByRole("button", { name: "0 Cartes de pointage" }));

    expect(router.push).toHaveBeenCalledWith("/savings");
  });
});
