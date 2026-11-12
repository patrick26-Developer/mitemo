import { fireEvent, render, screen } from "@testing-library/react-native";

import { InvitedMemberRow } from "./row.member-invited";

/** Invitation envoyée à un contact du répertoire. */
const AIMEE = { id: "i1", name: "Aimée Mbemba", phone: "+242065706622" } as const;

describe("InvitedMemberRow", () => {
  it("montre le contact invité, grisé, en attente de sa réponse", async () => {
    await render(<InvitedMemberRow invitation={AIMEE} />);

    expect(screen.getByText("Aimée Mbemba")).toBeOnTheScreen();
    expect(screen.getByText("Invitation envoyée")).toBeOnTheScreen();
    expect(screen.getByLabelText("Aimée Mbemba, invitation envoyée")).toHaveStyle({ opacity: 0.6 });
    expect(screen.queryByRole("button", { name: /Annuler l'invitation/ })).toBeNull();
  });

  it("permet d'annuler l'invitation quand c'est permis", async () => {
    const onCancel = jest.fn();
    await render(<InvitedMemberRow invitation={AIMEE} onCancel={onCancel} />);

    await fireEvent.press(
      screen.getByRole("button", { name: "Annuler l'invitation de Aimée Mbemba" }),
    );

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
