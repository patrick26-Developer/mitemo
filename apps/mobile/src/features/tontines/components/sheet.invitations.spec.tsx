import { fireEvent, screen } from "@testing-library/react-native";

import { INITIAL_INVITATIONS } from "../../../shared/demo/demo.invitations";
import { firstOf } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import type { InvitationReplyState } from "../hooks/hook.invitation-reply";
import { InvitationsSheet } from "./sheet.invitations";

/** Invitation de démonstration. */
const INVITATION = firstOf(INITIAL_INVITATIONS);

/**
 * Construit un état de réponse espionné.
 * @param over Valeurs à remplacer.
 * @returns L'état prêt pour la feuille.
 */
function makeReply(over: Partial<InvitationReplyState> = {}): InvitationReplyState {
  return {
    invitations: [INVITATION],
    choosing: null,
    turns: 1,
    setTurns: jest.fn(),
    choose: jest.fn(),
    back: jest.fn(),
    accept: jest.fn(() => true),
    decline: jest.fn(),
    ...over,
  };
}

describe("InvitationsSheet", () => {
  it("liste les invitations et passe au choix des tours à l'acceptation", async () => {
    const reply = makeReply();
    await renderWithSafeArea(<InvitationsSheet visible reply={reply} onClose={jest.fn()} />);

    expect(screen.getByRole("header", { name: "Invitations" })).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "Accepter" }));

    expect(reply.choose).toHaveBeenCalledWith(INVITATION);
  });

  it("rejoint la tontine avec les tours choisis puis se ferme", async () => {
    const reply = makeReply({ choosing: INVITATION, turns: 2 });
    const onClose = jest.fn();
    await renderWithSafeArea(<InvitationsSheet visible reply={reply} onClose={onClose} />);

    expect(screen.getByRole("header", { name: "Choisir mes tours" })).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: "Annuler" })).toBeNull();
    await fireEvent.press(screen.getByRole("button", { name: "Rejoindre" }));

    expect(reply.accept).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("revient à la liste depuis le choix des tours", async () => {
    const reply = makeReply({ choosing: INVITATION });
    await renderWithSafeArea(<InvitationsSheet visible reply={reply} onClose={jest.fn()} />);

    await fireEvent.press(screen.getByRole("button", { name: "Retour" }));

    expect(reply.back).toHaveBeenCalledTimes(1);
  });
});
