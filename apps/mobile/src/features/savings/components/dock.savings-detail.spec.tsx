import { act, fireEvent, screen } from "@testing-library/react-native";

import { makeCard } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import type { SavingsActionsState } from "../hooks/hook.savings-actions";
import { SavingsDetailDock } from "./dock.savings-detail";
import { SIMULATED_CONFIRMATION_MS } from "../../payments";

jest.mock("../../auth", () => {
  const { Pressable, Text } = jest.requireActual("react-native");

  return {
    PinConfirm: ({ onConfirmed }: { onConfirmed: () => void }) => (
      <Pressable accessibilityRole="button" accessibilityLabel="Code juste" onPress={onConfirmed}>
        <Text>Pavé du code PIN</Text>
      </Pressable>
    ),
  };
});

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
    discard: jest.fn(),
    ...over,
  };
}

describe("SavingsDetailDock", () => {
  it("fait payer le pointage par MTN MoMo, validé sur le téléphone", async () => {
    const actions = makeActions();
    await renderWithSafeArea(
      <SavingsDetailDock item={makeCard()} actions={actions} onLayout={jest.fn()} />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Pointer 5 500 FCFA" }));
    jest.useFakeTimers();
    await fireEvent.press(screen.getByRole("button", { name: "Payer avec MTN MoMo" }));
    await act(async () => {
      jest.advanceTimersByTime(SIMULATED_CONFIRMATION_MS);
    });

    expect(actions.contribute).toHaveBeenCalledWith("MTN_MOMO");
  });

  it("prend la teinte de la carte comme couleur d'action", async () => {
    await renderWithSafeArea(
      <SavingsDetailDock
        item={makeCard({ tint: "#CDF5DD" })}
        actions={makeActions()}
        onLayout={jest.fn()}
      />,
    );

    expect(screen.getByTestId("sheet-primary-accent")).toHaveStyle({ backgroundColor: "#2AD56E" });
  });

  it("ne propose plus de pointer quand l'objectif est atteint", async () => {
    await renderWithSafeArea(
      <SavingsDetailDock
        item={makeCard({ saved: 30_000n })}
        actions={makeActions()}
        onLayout={jest.fn()}
      />,
    );

    expect(screen.queryByRole("button", { name: /Pointer/ })).not.toBeOnTheScreen();
  });

  it("propose trois moyens de retrait, Mitemo plein, puis demande le code PIN", async () => {
    const actions = makeActions();
    await renderWithSafeArea(
      <SavingsDetailDock
        item={makeCard({ saved: 30_000n, state: "COMPLETED" })}
        actions={actions}
        onLayout={jest.fn()}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Retirer" }));
    expect(screen.getByRole("button", { name: "Retirer vers MTN MoMo" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Retirer vers Airtel Money" })).toBeOnTheScreen();
    // Deux boutons pleins : « Retirer » du dock, et « Retirer vers Mitemo » seul dans la feuille.
    const filled = screen.getAllByTestId("sheet-primary-accent");
    expect(filled).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Retirer vers Mitemo" })).toContainElement(
      filled[1] ?? null,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Retirer vers Airtel Money" }));
    expect(actions.withdraw).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "Retour" })).toBeNull();
    await fireEvent.press(screen.getByRole("button", { name: "Code juste" }));

    expect(actions.withdraw).toHaveBeenCalledWith("AIRTEL_MONEY");
  });

  it("donne à Retirer la même couleur de fond que les autres actions", async () => {
    await renderWithSafeArea(
      <SavingsDetailDock
        item={makeCard({ saved: 30_000n, state: "COMPLETED", tint: "#CDF5DD" })}
        actions={makeActions()}
        onLayout={jest.fn()}
      />,
    );

    expect(screen.getByTestId("sheet-primary-accent")).toHaveStyle({ backgroundColor: "#2AD56E" });
  });

  it("ne propose pas de retirer tant que l'objectif n'est pas atteint", async () => {
    await renderWithSafeArea(
      <SavingsDetailDock item={makeCard()} actions={makeActions()} onLayout={jest.fn()} />,
    );

    expect(screen.queryByRole("button", { name: "Retirer" })).not.toBeOnTheScreen();
  });

  it("ne propose pas de retirer une carte vide", async () => {
    await renderWithSafeArea(
      <SavingsDetailDock
        item={makeCard({ saved: 0n })}
        actions={makeActions()}
        onLayout={jest.fn()}
      />,
    );

    expect(screen.queryByRole("button", { name: "Retirer" })).not.toBeOnTheScreen();
  });
  it("supprime une carte sans pointage, après confirmation", async () => {
    const actions = makeActions();
    await renderWithSafeArea(
      <SavingsDetailDock item={makeCard({ saved: 0n })} actions={actions} onLayout={jest.fn()} />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Supprimer la carte" }));
    await fireEvent.press(screen.getByRole("button", { name: "Supprimer" }));

    expect(actions.discard).toHaveBeenCalledTimes(1);
  });

  it("ne propose pas de supprimer une carte déjà pointée", async () => {
    await renderWithSafeArea(
      <SavingsDetailDock item={makeCard()} actions={makeActions()} onLayout={jest.fn()} />,
    );

    expect(screen.queryByRole("button", { name: "Supprimer la carte" })).toBeNull();
  });
});

afterEach(() => {
  jest.useRealTimers();
});
