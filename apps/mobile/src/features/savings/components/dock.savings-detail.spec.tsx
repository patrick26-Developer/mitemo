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
    ...over,
  };
}

describe("SavingsDetailDock", () => {
  it("fait payer le pointage par MTN MoMo, validé sur le téléphone", async () => {
    const actions = makeActions();
    await renderWithSafeArea(
      <SavingsDetailDock item={makeCard()} actions={actions} onLayout={jest.fn()} />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Pointer 5 000 FCFA" }));
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

  it("demande confirmation avant de retirer l'épargne d'une carte remplie", async () => {
    const actions = makeActions();
    await renderWithSafeArea(
      <SavingsDetailDock
        item={makeCard({ saved: 30_000n, state: "COMPLETED" })}
        actions={actions}
        onLayout={jest.fn()}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Retirer" }));
    expect(await screen.findByRole("header", { name: "Retirer l'épargne ?" })).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole("button", { name: "Retirer l'épargne" }));

    expect(actions.withdraw).toHaveBeenCalledTimes(1);
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
});

afterEach(() => {
  jest.useRealTimers();
});
