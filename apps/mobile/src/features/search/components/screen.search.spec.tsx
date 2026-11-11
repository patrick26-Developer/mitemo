import { fireEvent, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { SearchScreen } from "./screen.search";

jest.mock("expo-router", () => ({ router: { push: jest.fn(), back: jest.fn() } }));

describe("SearchScreen", () => {
  it("propose des suggestions avant toute saisie", async () => {
    await renderWithSafeArea(<SearchScreen />);

    expect(screen.getByText("Suggestions")).toBeOnTheScreen();
  });

  it("remplit la recherche avec une suggestion", async () => {
    await renderWithSafeArea(<SearchScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Rechercher Loyer" }));

    expect(screen.getByDisplayValue("Loyer")).toBeOnTheScreen();
  });

  it("revient à l'écran précédent", async () => {
    await renderWithSafeArea(<SearchScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Retour" }));

    expect(router.back).toHaveBeenCalledTimes(1);
  });
});
