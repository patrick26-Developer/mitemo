import { fireEvent, screen } from "@testing-library/react-native";

import { SELF_MEMBER_ID } from "../../../shared/member/model.portfolio";
import { makeMember, makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import type { TontineActionsState } from "../hooks/hook.tontine-actions";
import { TontineDetailDock } from "./dock.tontine-detail";

/**
 * Construit les actions d'une tontine pour les tests.
 * @param over Actions à remplacer.
 * @returns Les actions prêtes à être branchées sur le dock.
 */
function makeActions(over: Partial<TontineActionsState> = {}): TontineActionsState {
  return {
    feedback: null,
    contribute: jest.fn(),
    withdraw: jest.fn(),
    invite: jest.fn(),
    remove: jest.fn(),
    transfer: jest.fn(() => true),
    ...over,
  };
}

describe("TontineDetailDock", () => {
  it("propose de cotiser quand la cotisation est due", async () => {
    const actions = makeActions();
    await renderWithSafeArea(<TontineDetailDock item={makeTontine()} actions={actions} />);

    await fireEvent.press(screen.getByRole("button", { name: "Cotiser 5 000 FCFA" }));

    expect(actions.contribute).toHaveBeenCalledTimes(1);
  });

  it("ne propose pas de cotiser quand la cotisation est réglée", async () => {
    await renderWithSafeArea(
      <TontineDetailDock
        item={makeTontine({
          members: [makeMember(SELF_MEMBER_ID, "ADMIN", true), makeMember("m2", "MEMBRE", true)],
        })}
        actions={makeActions()}
      />,
    );

    expect(screen.queryByRole("button", { name: /Cotiser/ })).not.toBeOnTheScreen();
  });

  it("demande confirmation avant de recevoir la cagnotte", async () => {
    const actions = makeActions();
    await renderWithSafeArea(
      <TontineDetailDock item={makeTontine({ beneficiaryId: SELF_MEMBER_ID })} actions={actions} />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Retirer la cagnotte" }));
    expect(await screen.findByRole("header", { name: "Recevoir la cagnotte ?" })).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole("button", { name: "Recevoir" }));

    expect(actions.withdraw).toHaveBeenCalledTimes(1);
  });

  it("ouvre la feuille de transfert depuis l'action secondaire", async () => {
    await renderWithSafeArea(<TontineDetailDock item={makeTontine()} actions={makeActions()} />);

    await fireEvent.press(screen.getByRole("button", { name: "Transférer" }));

    expect(await screen.findByRole("header", { name: "Transférer à un membre" })).toBeOnTheScreen();
  });

  it("affiche le retour d'opération au-dessus des actions", async () => {
    await renderWithSafeArea(
      <TontineDetailDock
        item={makeTontine()}
        actions={makeActions({
          feedback: { kind: "success", message: "Cotisation réglée pour ce tour." },
        })}
      />,
    );

    expect(screen.getByText("Cotisation réglée pour ce tour.")).toBeOnTheScreen();
  });
});
