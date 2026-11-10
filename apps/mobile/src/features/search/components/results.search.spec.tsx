import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { SearchResults } from "./results.search";

describe("SearchResults", () => {
  it("propose des suggestions avant la saisie", async () => {
    await renderWithSafeArea(<SearchResults query="" debouncedQuery="" onSuggestion={jest.fn()} />);

    expect(screen.getByText("Suggestions")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Rechercher Tontine" })).toBeOnTheScreen();
  });

  it("affiche un squelette pendant la stabilisation de la saisie", async () => {
    await renderWithSafeArea(
      <SearchResults query="loy" debouncedQuery="" onSuggestion={jest.fn()} />,
    );

    expect(screen.getByTestId("search-skeleton")).toBeOnTheScreen();
  });

  it("affiche les résultats groupés", async () => {
    await renderWithSafeArea(
      <SearchResults query="loyer" debouncedQuery="loyer" onSuggestion={jest.fn()} />,
    );

    expect(screen.getByText("Cartes")).toBeOnTheScreen();
    expect(screen.getByText("Loyer de Janvier")).toBeOnTheScreen();
  });

  it("affiche un état vide quand rien ne correspond", async () => {
    await renderWithSafeArea(
      <SearchResults query="zzz" debouncedQuery="zzz" onSuggestion={jest.fn()} />,
    );

    expect(screen.getByText("Aucun résultat")).toBeOnTheScreen();
  });
});
