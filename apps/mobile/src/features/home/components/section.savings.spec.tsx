import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { makeCard } from "../../../shared/testing/fixtures.portfolio";
import { SavingsSection } from "./section.savings";

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));

describe("SavingsSection", () => {
  it("liste les cartes données et ouvre l'onglet épargne depuis le titre", async () => {
    await render(<SavingsSection items={[makeCard({ name: "Rentrée scolaire" })]} lead={false} />);

    expect(screen.getByText("Rentrée scolaire")).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "1 Carte de pointage" }));

    expect(router.push).toHaveBeenCalledWith("/savings");
  });
});
