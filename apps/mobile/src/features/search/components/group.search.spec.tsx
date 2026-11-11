import { render, screen } from "@testing-library/react-native";

import { SearchGroup } from "./group.search";

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));

describe("SearchGroup", () => {
  it("affiche le titre et un résultat par entrée", async () => {
    await render(
      <SearchGroup
        group={{
          title: "Tontines",
          results: [
            { id: "1", title: "Tontine du marché", subtitle: "Tour 2", kind: "tontine", href: "/" },
            { id: "2", title: "Tontine famille", subtitle: "Tour 1", kind: "tontine", href: "/" },
          ],
        }}
      />,
    );

    expect(screen.getByText("Tontines")).toBeOnTheScreen();
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });
});
