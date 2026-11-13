import { fireEvent, screen } from "@testing-library/react-native";

import { playFeedbackSound } from "../../../shared/feedback/api.feedback-effects";
import {
  INITIAL_FEEDBACK_PREFERENCES,
  useFeedbackPreferences,
} from "../../../shared/feedback/store.feedback-preferences";
import { useMemberStore } from "../../../shared/member/store.member";
import { INITIAL_SESSION, useSessionStore } from "../../../shared/session/store.session";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { SignOutSheet } from "./sheet.sign-out";

jest.mock("../../../shared/feedback/api.feedback-effects", () => ({
  playFeedbackSound: jest.fn(async () => true),
}));

describe("SignOutSheet", () => {
  beforeEach(() => {
    jest.mocked(playFeedbackSound).mockClear();
    useFeedbackPreferences.setState(INITIAL_FEEDBACK_PREFERENCES);
    useSessionStore.setState({ ...INITIAL_SESSION, signedIn: true });
    useMemberStore.setState({ name: "Grâce MBEMBA" });
  });

  it("s'excuse auprès du membre, prénom en gras, et l'invite à rester", async () => {
    await renderWithSafeArea(<SignOutSheet visible onClose={jest.fn()} />);

    expect(screen.getByRole("header", { name: "Vous partez déjà ?" })).toBeOnTheScreen();
    expect(screen.getByText(/Nous sommes désolés de vous voir partir/)).toBeOnTheScreen();
    expect(screen.getByText("Grâce")).toHaveStyle({ fontWeight: "700" });
    expect(screen.getByRole("button", { name: "Je reste" })).toBeOnTheScreen();
  });

  it("garde la session ouverte quand le membre reste", async () => {
    const onClose = jest.fn();
    await renderWithSafeArea(<SignOutSheet visible onClose={onClose} />);

    await fireEvent.press(screen.getByRole("button", { name: "Je reste" }));

    expect(useSessionStore.getState().signedIn).toBe(true);
    expect(onClose).toHaveBeenCalled();
    expect(playFeedbackSound).not.toHaveBeenCalled();
  });

  it("marque la déconnexion en rouge, comme une action grave", async () => {
    await renderWithSafeArea(<SignOutSheet visible onClose={jest.fn()} />);

    expect(screen.getByRole("button", { name: "Je me déconnecte" })).toHaveStyle({
      borderColor: "#B42318",
    });
  });

  it("ferme la session avec le son d'au revoir si le membre le confirme", async () => {
    const onClose = jest.fn();
    await renderWithSafeArea(<SignOutSheet visible onClose={onClose} />);

    await fireEvent.press(screen.getByRole("button", { name: "Je me déconnecte" }));

    expect(useSessionStore.getState().signedIn).toBe(false);
    expect(onClose).toHaveBeenCalled();
    expect(playFeedbackSound).toHaveBeenCalledWith("farewell");
  });

  it("garde la session ouverte quand la feuille se ferme par sa croix", async () => {
    await renderWithSafeArea(<SignOutSheet visible onClose={jest.fn()} />);

    await fireEvent.press(screen.getByRole("button", { name: "Fermer" }));

    expect(useSessionStore.getState().signedIn).toBe(true);
  });
});
