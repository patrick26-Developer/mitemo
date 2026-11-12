import { fireEvent, screen } from "@testing-library/react-native";
import { Wallet } from "lucide-react-native";
import { Text } from "react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import type { FilterableListConfig } from "./list.filterable";
import { FilterableList } from "./list.filterable";

interface Item {
  readonly id: string;
  readonly name: string;
  readonly done: boolean;
}

const CONFIG: FilterableListConfig<Item> = {
  items: [
    { id: "1", name: "Tontine du marché", done: false },
    { id: "2", name: "Tontine famille", done: true },
  ],
  keyOf: (item) => item.id,
  labelOf: (item) => item.name,
  isCompleted: (item) => item.done,
  searchPlaceholder: "Rechercher une tontine",
  searchSubject: "tontine",
  emptyIcon: Wallet,
  emptyStates: {
    active: { title: "Aucune tontine active", message: "Créez votre première tontine." },
    completed: { title: "Aucune tontine terminée", message: "Elles apparaîtront ici." },
  },
  renderItem: (item) => <Text>{item.name}</Text>,
};

describe("FilterableList", () => {
  it("n'affiche d'abord que les éléments actifs", async () => {
    await renderWithSafeArea(<FilterableList config={CONFIG} onAdd={jest.fn()} />);

    expect(screen.getByText("Tontine du marché")).toBeOnTheScreen();
    expect(screen.queryByText("Tontine famille")).toBeNull();
  });

  it("bascule sur les éléments terminés", async () => {
    await renderWithSafeArea(<FilterableList config={CONFIG} onAdd={jest.fn()} />);

    await fireEvent.press(screen.getByRole("tab", { name: "Archivées" }));

    expect(screen.getByText("Tontine famille")).toBeOnTheScreen();
    expect(screen.queryByText("Tontine du marché")).toBeNull();
  });

  it("explique une recherche sans résultat", async () => {
    await renderWithSafeArea(<FilterableList config={CONFIG} onAdd={jest.fn()} />);

    await fireEvent.press(screen.getByRole("button", { name: "Rechercher" }));
    await fireEvent.changeText(
      await screen.findByPlaceholderText("Rechercher une tontine"),
      "loyer",
    );

    expect(screen.getByText("Aucune tontine ne correspond à « loyer ».")).toBeOnTheScreen();
  });

  it("affiche l'état vide du filtre et propose d'ajouter", async () => {
    const onAdd = jest.fn();
    await renderWithSafeArea(<FilterableList config={{ ...CONFIG, items: [] }} onAdd={onAdd} />);

    await fireEvent.press(screen.getByRole("button", { name: "Ajouter" }));

    expect(screen.getByText("Aucune tontine active")).toBeOnTheScreen();
    expect(onAdd).toHaveBeenCalledTimes(1);
  });
});
