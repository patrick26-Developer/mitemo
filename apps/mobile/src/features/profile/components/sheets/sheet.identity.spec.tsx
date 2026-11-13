import { fireEvent, screen } from "@testing-library/react-native";

import { INITIAL_MEMBER_PROFILE, useMemberStore } from "../../../../shared/member/store.member";
import { renderWithSafeArea } from "../../../../shared/testing/util.render-with-safe-area";
import { IdentitySheet } from "./sheet.identity";

describe("IdentitySheet", () => {
  beforeEach(() => {
    useMemberStore.setState(INITIAL_MEMBER_PROFILE);
  });

  it("affiche l'identité du membre", async () => {
    await renderWithSafeArea(<IdentitySheet />);

    expect(screen.getByText("Précieuse Mavoungou")).toBeOnTheScreen();
    expect(screen.getByText("Commerçante")).toBeOnTheScreen();
    expect(screen.getAllByTestId("fact-divider")).toHaveLength(3);
    expect(screen.getByRole("button", { name: "Modifier mes informations" })).toBeOnTheScreen();
  });

  it("modifie l'identité depuis le profil", async () => {
    await renderWithSafeArea(<IdentitySheet />);

    await fireEvent.press(screen.getByRole("button", { name: "Modifier mes informations" }));
    await fireEvent.changeText(screen.getByLabelText("Prénom"), "Aimée");
    await fireEvent.changeText(screen.getByLabelText("Nom"), "Mbemba");
    await fireEvent.changeText(screen.getByLabelText("Profession ou formation"), "Couturière");
    await fireEvent.press(screen.getByRole("button", { name: "Enregistrer" }));

    expect(useMemberStore.getState().name).toBe("Aimée Mbemba");
    expect(useMemberStore.getState().occupation).toBe("Couturière");
    expect(screen.getByText("Aimée Mbemba")).toBeOnTheScreen();
  });

  it("refuse un prénom trop court", async () => {
    await renderWithSafeArea(<IdentitySheet />);

    await fireEvent.press(screen.getByRole("button", { name: "Modifier mes informations" }));
    await fireEvent.changeText(screen.getByLabelText("Prénom"), "A");
    await fireEvent.press(screen.getByRole("button", { name: "Enregistrer" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/au moins deux caractères/);
    expect(useMemberStore.getState().name).toBe("Précieuse Mavoungou");
  });

  it("n'affiche pas de bouton Annuler pendant la modification", async () => {
    await renderWithSafeArea(<IdentitySheet />);

    await fireEvent.press(screen.getByRole("button", { name: "Modifier mes informations" }));

    expect(screen.queryByRole("button", { name: /Annuler/ })).toBeNull();
  });
});
