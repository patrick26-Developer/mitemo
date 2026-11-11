import { fireEvent, screen } from "@testing-library/react-native";

import { INITIAL_SESSION, useSessionStore } from "../../../shared/session/store.session";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { SignOutSheet } from "./sheet.sign-out";

describe("SignOutSheet", () => {
  beforeEach(() => useSessionStore.setState({ ...INITIAL_SESSION, signedIn: true }));

  it("ferme la session et la feuille à la confirmation", async () => {
    const onClose = jest.fn();
    await renderWithSafeArea(<SignOutSheet visible onClose={onClose} />);

    await fireEvent.press(screen.getByRole("button", { name: "Confirmer la déconnexion" }));

    expect(useSessionStore.getState().signedIn).toBe(false);
    expect(onClose).toHaveBeenCalled();
  });

  it("garde la session ouverte quand la feuille se ferme par sa croix", async () => {
    const onClose = jest.fn();
    await renderWithSafeArea(<SignOutSheet visible onClose={onClose} />);

    expect(screen.queryByRole("button", { name: /Annuler/ })).toBeNull();
    await fireEvent.press(screen.getByRole("button", { name: "Fermer" }));

    expect(useSessionStore.getState().signedIn).toBe(true);
  });
});
