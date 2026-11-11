import { fireEvent, screen } from "@testing-library/react-native";

import { SELF_MEMBER_ID } from "../../../shared/member/model.portfolio";
import { makeMember, makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import type { TontineActionsState } from "../hooks/hook.tontine-actions";
import { TontineDetailDock } from "./dock.tontine-detail";

/** Montant de la cotisation de la tontine de test, en FCFA. */
const CONTRIBUTION = 5_000;

/**
 * Construit les actions d'une tontine pour les tests.
 * @param over Actions à remplacer.
 * @returns Les actions prêtes à être branchées sur le dock.
 */
function makeActions(over: Partial<TontineActionsState> = {}): TontineActionsState {
  return {
    feedback: null,
    addMember: jest.fn(),
    start: jest.fn(),
    contribute: jest.fn(),
    confirm: jest.fn(),
    invite: jest.fn(),
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
  it("propose de cotiser quand la cotisation est due", async () => {
    const actions = makeActions();
    await renderWithSafeArea(<TontineDetailDock item={makeTontine()} actions={actions} />);

    await fireEvent.press(screen.getByRole("button", { name: "Continuer" }));

    expect(actions.contribute).toHaveBeenCalledTimes(1);
  });

  it("ne propose rien quand le membre a payé mais que les autres non", async () => {
    await renderWithSafeArea(
      <TontineDetailDock
        item={makeTontine({
          members: [makeMember(SELF_MEMBER_ID, "ADMIN", true), makeMember("m2", "MEMBRE")],
        })}
        actions={makeActions()}
      />,
    );

    expect(screen.queryByRole("button", { name: "Continuer" })).not.toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: "Confirmer la restourne" })).not.toBeOnTheScreen();
  });

  it("demande confirmation avant de distribuer la cagnotte", async () => {
    const actions = makeActions();
    await renderWithSafeArea(
      <TontineDetailDock item={makeTontine({ members: ALL_PAID })} actions={actions} />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Confirmer la restourne" }));
    expect(
      await screen.findByRole("header", { name: "Confirmer la restourne ?" }),
    ).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole("button", { name: "Confirmer" }));

    expect(actions.confirm).toHaveBeenCalledTimes(1);
  });

  it("propose d'ajouter un membre tant que le quota n'est pas atteint", async () => {
    const actions = makeActions();
    const pending = makeTontine({
      state: "PENDING",
      totalRounds: 3,
      members: [makeMember(SELF_MEMBER_ID, "ADMIN")],
    });
    await renderWithSafeArea(<TontineDetailDock item={pending} actions={actions} />);

    await fireEvent.press(screen.getByRole("button", { name: "Ajouter un membre" }));

    expect(actions.addMember).toHaveBeenCalledTimes(1);
  });

  it("propose d'activer la restourne quand tous les membres sont réunis", async () => {
    const actions = makeActions();
    await renderWithSafeArea(
      <TontineDetailDock item={makeTontine({ state: "PENDING" })} actions={actions} />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Activer la restourne" }));

    expect(actions.start).toHaveBeenCalledTimes(1);
  });

  it("affiche le retour d'opération au-dessus des actions", async () => {
    await renderWithSafeArea(
      <TontineDetailDock
        item={makeTontine()}
        actions={makeActions({
          feedback: { kind: "success", message: `Cotisation de ${CONTRIBUTION} FCFA réglée.` },
        })}
      />,
    );

    expect(screen.getByText(`Cotisation de ${CONTRIBUTION} FCFA réglée.`)).toBeOnTheScreen();
  });
});
