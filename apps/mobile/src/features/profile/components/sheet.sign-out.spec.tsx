import { fireEvent, screen } from "@testing-library/react-native";

import { useMemberStore } from "../../../shared/member/store.member";
import { INITIAL_SESSION, useSessionStore } from "../../../shared/session/store.session";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { SignOutSheet } from "./sheet.sign-out";

describe("SignOutSheet", () => {
  beforeEach(() => {
    useSessionStore.setState({ ...INITIAL_SESSION, signedIn: true });
    useMemberStore.setState({ name: "Grâce MBEMBA" });
  });

  it("dit au membre qu'on est désolé de le voir partir et l'invite à rester", async () => {
    await renderWithSafeArea(<SignOutSheet visible onClose={jest.fn()} />);

    expect(screen.getByRole("header", { name: "Vous partez déjà ?" })).toBeOnTheScreen();
    expect(screen.getByText(/Nous sommes désolés de vous voir partir, Grâce/)).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Rester connecté" })).toBeOnTheScreen();
  });

  it("garde la session ouverte quand le membre choisit de rester", async () => {
    const onClose = jest.fn();
    await renderWithSafeArea(<SignOutSheet visible onClose={onClose} />);

    await fireEvent.press(screen.getByRole("button", { name: "Rester connecté" }));

    expect(useSessionStore.getState().signedIn).toBe(true);
    expect(onClose).toHaveBeenCalled();
  });

  it("ferme quand même la session si le membre le confirme", async () => {
    const onClose = jest.fn();
    await renderWithSafeArea(<SignOutSheet visible onClose={onClose} />);

    await fireEvent.press(screen.getByRole("button", { name: "Me déconnecter" }));

    expect(useSessionStore.getState().signedIn).toBe(false);
    expect(onClose).toHaveBeenCalled();
  });

  it("garde la session ouverte quand la feuille se ferme par sa croix", async () => {
    await renderWithSafeArea(<SignOutSheet visible onClose={jest.fn()} />);

    expect(screen.queryByRole("button", { name: /Annuler/ })).toBeNull();
    await fireEvent.press(screen.getByRole("button", { name: "Fermer" }));

    expect(useSessionStore.getState().signedIn).toBe(true);
  });
});
