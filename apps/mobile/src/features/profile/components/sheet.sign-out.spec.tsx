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

  it("garde la session ouverte à l'annulation", async () => {
    const onClose = jest.fn();
    await renderWithSafeArea(<SignOutSheet visible onClose={onClose} />);

    await fireEvent.press(screen.getByRole("button", { name: "Annuler la déconnexion" }));

    expect(useSessionStore.getState().signedIn).toBe(true);
    expect(onClose).toHaveBeenCalled();
  });
});
