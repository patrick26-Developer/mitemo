import { fireEvent, screen } from "@testing-library/react-native";

import { makeCard } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { SavingsDetailHeader } from "./header.savings-detail";

jest.mock("expo-router", () => ({ router: { back: jest.fn(), push: jest.fn() } }));

describe("SavingsDetailHeader", () => {
  it("ouvre les options de la carte par le bouton « ⋮ »", async () => {
    await renderWithSafeArea(<SavingsDetailHeader item={makeCard({ name: "Loyer" })} />);

    await fireEvent.press(screen.getByRole("button", { name: "Options de la carte" }));

    expect(screen.getByRole("header", { name: "Options de la carte" })).toBeOnTheScreen();
  });
});
