import { act, fireEvent, screen } from "@testing-library/react-native";

import { SELF_MEMBER_ID } from "../../../shared/member/model.portfolio";
import { makeMember, makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import type { TontineActionsState } from "../hooks/hook.tontine-actions";
import { TontineDetailDock } from "./dock.tontine-detail";
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
 * Construit les actions d'une tontine pour les tests.
 * @param over Actions à remplacer.
 * @returns Les actions prêtes à être branchées sur le dock.
 */
function makeActions(over: Partial<TontineActionsState> = {}): TontineActionsState {
  return {
    invite: jest.fn(),
    cancelInvitation: jest.fn(),
    start: jest.fn(),
    contribute: jest.fn(),
    confirm: jest.fn(),
    share: jest.fn(),
    remove: jest.fn(),
    ...over,
  };
}

/** Tous les membres ont réglé leur cotisation du tour. */
const ALL_PAID = [
  makeMember(SELF_MEMBER_ID, "ADMIN", true),
  makeMember("m2", "MEMBRE", true),
  makeMember("m3", "MEMBRE", true),
];

describe("TontineDetailDock", () => {
  it("fait cotiser par MTN MoMo, validé sur le téléphone, quand la cotisation est due", async () => {
    const actions = makeActions();
    await renderWithSafeArea(
      <TontineDetailDock item={makeTontine()} actions={actions} onLayout={jest.fn()} />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Cotiser 5 000 FCFA" }));
    expect(actions.contribute).not.toHaveBeenCalled();

    jest.useFakeTimers();

    await fireEvent.press(screen.getByRole("button", { name: "Payer avec MTN MoMo" }));
    await act(async () => {
      jest.advanceTimersByTime(SIMULATED_CONFIRMATION_MS);
    });

    expect(actions.contribute).toHaveBeenCalledWith("MTN_MOMO");
  });

  it("teinte l'action de la couleur de la tontine", async () => {
    await renderWithSafeArea(
      <TontineDetailDock item={makeTontine()} actions={makeActions()} onLayout={jest.fn()} />,
    );

    expect(screen.getByTestId("sheet-primary-accent")).toBeOnTheScreen();
  });

  it("propose de cotiser le tour suivant d'avance une fois le tour réglé", async () => {
    await renderWithSafeArea(
      <TontineDetailDock
        item={makeTontine({
          members: [makeMember(SELF_MEMBER_ID, "ADMIN", true), makeMember("m2", "MEMBRE")],
        })}
        actions={makeActions()}
        onLayout={jest.fn()}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Cotiser d'avance 5 000 FCFA" }));

    expect(await screen.findByText("2 sur 3")).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: "Confirmer la restourne" })).not.toBeOnTheScreen();
  });

  it("ne propose plus rien quand le total à verser est atteint", async () => {
    const self = { ...makeMember(SELF_MEMBER_ID, "ADMIN", true), prepaidRounds: 2 };
    await renderWithSafeArea(
      <TontineDetailDock
        item={makeTontine({ members: [self, makeMember("m2", "MEMBRE")] })}
        actions={makeActions()}
        onLayout={jest.fn()}
      />,
    );

    expect(screen.queryByRole("button", { name: /Cotiser/ })).not.toBeOnTheScreen();
  });

  it("demande confirmation avant de distribuer la cagnotte", async () => {
    const actions = makeActions();
    await renderWithSafeArea(
      <TontineDetailDock
        item={makeTontine({ members: ALL_PAID })}
        actions={actions}
        onLayout={jest.fn()}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Confirmer la restourne" }));
    expect(
      await screen.findByRole("header", { name: "Confirmer la restourne ?" }),
    ).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole("button", { name: "Confirmer" }));

    expect(actions.confirm).toHaveBeenCalledTimes(1);
  });

  it("grise « Cotiser » en attendant les membres, et laisse l'administrateur partager", async () => {
    const actions = makeActions();
    const pending = makeTontine({
      state: "PENDING",
      totalRounds: 3,
      members: [makeMember(SELF_MEMBER_ID, "ADMIN")],
    });
    await renderWithSafeArea(
      <TontineDetailDock item={pending} actions={actions} onLayout={jest.fn()} />,
    );

    expect(screen.getByRole("button", { name: "En attente de 2 membres" })).toBeDisabled();
    await fireEvent.press(screen.getByRole("button", { name: "Partager l'invitation" }));

    expect(actions.share).toHaveBeenCalledTimes(1);
  });

  it("montre aussi l'attente à un simple membre, sans partage", async () => {
    const pending = makeTontine({
      state: "PENDING",
      totalRounds: 2,
      members: [makeMember(SELF_MEMBER_ID, "MEMBRE")],
    });
    await renderWithSafeArea(
      <TontineDetailDock item={pending} actions={makeActions()} onLayout={jest.fn()} />,
    );

    expect(screen.getByRole("button", { name: "En attente de 1 membre" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Partager l'invitation" })).toBeNull();
  });

  it("propose d'activer la restourne quand tous les membres sont réunis", async () => {
    const actions = makeActions();
    await renderWithSafeArea(
      <TontineDetailDock
        item={makeTontine({ state: "PENDING" })}
        actions={actions}
        onLayout={jest.fn()}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Activer la restourne" }));

    expect(actions.start).toHaveBeenCalledTimes(1);
  });
});

afterEach(() => {
  jest.useRealTimers();
});
