import { fireEvent, render, screen } from "@testing-library/react-native";

import { SEARCH_SUGGESTIONS } from "../model/model.search-content";
import { SearchSuggestions } from "./suggestions.search";

describe("SearchSuggestions", () => {
  it("propose chaque suggestion et transmet celle touchée", async () => {
    const onSelect = jest.fn();
    await render(<SearchSuggestions onSelect={onSelect} />);

    expect(screen.getAllByRole("button")).toHaveLength(SEARCH_SUGGESTIONS.length);

    await fireEvent.press(screen.getByRole("button", { name: "Rechercher Sécurité" }));

    expect(onSelect).toHaveBeenCalledWith("Sécurité");
  });
});
