import { fireEvent, screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../shared/testing/render-with-safe-area";
import { ListHeader } from "./list-header";

describe("ListHeader", () => {
  it("affiche le filtre et les actions rapides", async () => {
    await renderWithSafeArea(<ListHeader filter="active" onFilterChange={jest.fn()} />);

    expect(screen.getByRole("tab", { name: "Actives" })).toBeSelected();
    expect(screen.getByRole("button", { name: "Rechercher" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Ajouter" })).toBeOnTheScreen();
  });

  it("remonte le filtre choisi", async () => {
    const onFilterChange = jest.fn();
    await renderWithSafeArea(<ListHeader filter="active" onFilterChange={onFilterChange} />);

    fireEvent.press(screen.getByRole("tab", { name: "Terminées" }));

    expect(onFilterChange).toHaveBeenCalledWith("completed");
  });
});
