import { fireEvent, screen } from "@testing-library/react-native";

import { INITIAL_MEMBER_PROFILE, useMemberStore } from "../../../../shared/member/store.member";
import { renderWithSafeArea } from "../../../../shared/testing/util.render-with-safe-area";
import { IdentityEditForm } from "./form.identity-edit";

describe("IdentityEditForm", () => {
  beforeEach(() => useMemberStore.setState(INITIAL_MEMBER_PROFILE));

  it("enregistre l'identité modifiée puis se ferme", async () => {
    const onDone = jest.fn();
    await renderWithSafeArea(<IdentityEditForm onDone={onDone} />);

    await fireEvent.changeText(screen.getByLabelText("Prénom"), "Aimée");
    await fireEvent.press(screen.getByRole("button", { name: "Enregistrer" }));

    expect(useMemberStore.getState().firstName).toBe("Aimée");
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("signale une saisie invalide sans fermer", async () => {
    const onDone = jest.fn();
    await renderWithSafeArea(<IdentityEditForm onDone={onDone} />);

    await fireEvent.changeText(screen.getByLabelText("Prénom"), "A");
    await fireEvent.press(screen.getByRole("button", { name: "Enregistrer" }));

    expect(screen.getByRole("alert")).toBeOnTheScreen();
    expect(onDone).not.toHaveBeenCalled();
  });

  it("ne propose qu'Enregistrer, la croix de la feuille servant à abandonner", async () => {
    await renderWithSafeArea(<IdentityEditForm onDone={jest.fn()} />);

    expect(screen.getByRole("button", { name: "Enregistrer" })).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: /Annuler/ })).toBeNull();
  });
});
