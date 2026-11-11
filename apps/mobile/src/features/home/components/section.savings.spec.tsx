import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { makeCard } from "../../../shared/testing/fixtures.portfolio";
import { SavingsSection } from "./section.savings";

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));

describe("SavingsSection", () => {
  it("garde toute carte pas encore retirée, même remplie, et écarte les retirées", async () => {
    usePortfolioStore.setState({
      cards: [
        makeCard({ name: "Rentrée scolaire" }),
        makeCard({ id: "c2", name: "Carte remplie", state: "COMPLETED" }),
        makeCard({ id: "c3", name: "Ancienne carte", state: "ARCHIVED" }),
      ],
    });
    await render(<SavingsSection />);

    expect(screen.getByRole("button", { name: "2 Cartes de pointage" })).toBeOnTheScreen();
    expect(screen.getByText("Carte remplie")).toBeOnTheScreen();
    expect(screen.queryByText("Ancienne carte")).toBeNull();
  });

  it("ouvre l'onglet épargne depuis le titre", async () => {
    usePortfolioStore.setState({ cards: [] });
    await render(<SavingsSection />);

    await fireEvent.press(screen.getByRole("button", { name: "0 Cartes de pointage" }));

    expect(router.push).toHaveBeenCalledWith("/savings");
  });
});
