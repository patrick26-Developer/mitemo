import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { SearchResultRow } from "./row.search-result";

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));

describe("SearchResultRow", () => {
  it("affiche le résultat et ouvre sa page", async () => {
    await render(
      <SearchResultRow
        entry={{
          id: "page-tontines",
          title: "Tontines",
          subtitle: "Tous mes groupes",
          kind: "page",
          href: "/tontines",
        }}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Ouvrir Tontines" }));

    expect(screen.getByText("Tous mes groupes")).toBeOnTheScreen();
    expect(router.push).toHaveBeenCalledWith("/tontines");
  });
});
