import { fireEvent, screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import type { HomeCreateState } from "../hooks/hook.home-create";
import { HomeEmptyState } from "./empty.home";

/**
 * État de création simulé.
 * @param choosing Vrai quand les choix sont dépliés.
 * @returns L'état et ses commandes simulées.
 */
function makeCreate(choosing: boolean): HomeCreateState {
  return {
    choosing,
    form: null,
    toggleChoices: jest.fn(),
    choose: jest.fn(),
    closeForm: jest.fn(),
  };
}

describe("HomeEmptyState", () => {
  it("explique quoi ajouter et replie les choix tant que « Créer » n'est pas touché", async () => {
    const create = makeCreate(false);
    await renderWithSafeArea(<HomeEmptyState create={create} />);

    expect(screen.getByRole("header", { name: "Rien d'actif pour le moment" })).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: /^Une tontine/ })).toBeNull();
    await fireEvent.press(screen.getByRole("button", { name: "Créer" }));

    expect(create.toggleChoices).toHaveBeenCalledTimes(1);
  });

  it("transmet le choix déplié", async () => {
    const create = makeCreate(true);
    await renderWithSafeArea(<HomeEmptyState create={create} />);

    await fireEvent.press(screen.getByRole("button", { name: /^Une carte de pointage/ }));

    expect(create.choose).toHaveBeenCalledWith("card");
  });
});
