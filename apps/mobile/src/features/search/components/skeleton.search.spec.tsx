import { render, screen } from "@testing-library/react-native";

import { SearchSkeleton } from "./skeleton.search";

describe("SearchSkeleton", () => {
  it("affiche l'état de chargement", async () => {
    await render(<SearchSkeleton />);

    expect(screen.getByTestId("search-skeleton")).toBeOnTheScreen();
  });
});
