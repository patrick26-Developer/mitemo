import { fireEvent, screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { ListHeader } from "./header.list";

describe("ListHeader", () => {
  it("affiche le filtre et les actions rapides", async () => {
    await renderWithSafeArea(
      <ListHeader topInset={0} filter="active" onFilterChange={jest.fn()} />,
    );

    expect(screen.getByRole("tab", { name: "Actives" })).toBeSelected();
    expect(screen.getByRole("button", { name: "Rechercher" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Ajouter" })).toBeOnTheScreen();
  });

  it("ouvre un champ de recherche sur place", async () => {
    await renderWithSafeArea(
      <ListHeader
        topInset={0}
        filter="active"
        onFilterChange={jest.fn()}
        search={{ query: "", onChange: jest.fn(), placeholder: "Rechercher une tontine" }}
      />,
    );

    fireEvent.press(screen.getByRole("button", { name: "Rechercher" }));

    expect(await screen.findByPlaceholderText("Rechercher une tontine")).toBeOnTheScreen();
  });

  it("remonte le filtre choisi", async () => {
    const onFilterChange = jest.fn();
    await renderWithSafeArea(
      <ListHeader topInset={0} filter="active" onFilterChange={onFilterChange} />,
    );

    fireEvent.press(screen.getByRole("tab", { name: "Terminées" }));

    expect(onFilterChange).toHaveBeenCalledWith("completed");
  });
});
