import { fireEvent, screen } from "@testing-library/react-native";

import { makeCard } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import type { SavingsActionsState } from "../hooks/hook.savings-actions";
import { SavingsDetailDock } from "./dock.savings-detail";

/**
 * Construit les actions d'une carte pour les tests.
 * @param over Actions à remplacer.
 * @returns Les actions prêtes à être branchées sur le dock.
 */
function makeActions(over: Partial<SavingsActionsState> = {}): SavingsActionsState {
  return {
    contribute: jest.fn(),
    withdraw: jest.fn(),
    transfer: jest.fn(),
    ...over,
  };
}

describe("SavingsDetailDock", () => {
  it("propose de pointer le montant d'un marqueur", async () => {
    const actions = makeActions();
    await renderWithSafeArea(<SavingsDetailDock item={makeCard()} actions={actions} />);

    await fireEvent.press(screen.getByRole("button", { name: "Pointer 5 000 FCFA" }));

    expect(actions.contribute).toHaveBeenCalledTimes(1);
  });

  it("ne propose plus de pointer quand l'objectif est atteint", async () => {
    await renderWithSafeArea(
      <SavingsDetailDock item={makeCard({ saved: 30_000n })} actions={makeActions()} />,
    );

    expect(screen.queryByRole("button", { name: /Pointer/ })).not.toBeOnTheScreen();
  });

  it("demande confirmation avant de retirer l'épargne", async () => {
    const actions = makeActions();
    await renderWithSafeArea(<SavingsDetailDock item={makeCard()} actions={actions} />);

    await fireEvent.press(screen.getByRole("button", { name: "Retirer" }));
    expect(await screen.findByRole("header", { name: "Retirer l'épargne ?" })).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole("button", { name: "Retirer l'épargne" }));

    expect(actions.withdraw).toHaveBeenCalledTimes(1);
  });

  it("ne propose pas de retirer une carte vide", async () => {
    await renderWithSafeArea(
      <SavingsDetailDock item={makeCard({ saved: 0n })} actions={makeActions()} />,
    );

    expect(screen.queryByRole("button", { name: "Retirer" })).not.toBeOnTheScreen();
  });
});
