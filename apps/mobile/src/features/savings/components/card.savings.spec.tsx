import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { makeCard } from "../../../shared/testing/fixtures.portfolio";
import { SavingsCard } from "./card.savings";

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));

describe("SavingsCard", () => {
  it("affiche le nom de la carte et ouvre son détail", async () => {
    await render(<SavingsCard item={makeCard({ id: "c7", name: "Rentrée scolaire" })} index={0} />);

    await fireEvent.press(screen.getByRole("button", { name: "Ouvrir Rentrée scolaire" }));

    expect(screen.getByText("Rentrée scolaire")).toBeOnTheScreen();
    expect(router.push).toHaveBeenCalledWith("/savings-detail/c7");
  });
});
