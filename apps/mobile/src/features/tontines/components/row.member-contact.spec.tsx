import { fireEvent, render, screen } from "@testing-library/react-native";

import { MemberContactRow } from "./row.member-contact";

/** Contact du répertoire, au format E.164. */
const CONTACT = { name: "Aimée Mbemba", phone: "+242065706622" };

describe("MemberContactRow", () => {
  it("ajoute un contact qui a un compte Mitemo", async () => {
    const onPress = jest.fn();
    await render(<MemberContactRow contact={CONTACT} action="add" onPress={onPress} />);

    await fireEvent.press(screen.getByRole("button", { name: "Ajouter Aimée Mbemba" }));

    expect(screen.getByText("+242 06 570 6622")).toBeOnTheScreen();
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("invite sur Mitemo un contact qui n'a pas de compte", async () => {
    const onPress = jest.fn();
    await render(<MemberContactRow contact={CONTACT} action="invite" onPress={onPress} />);

    await fireEvent.press(screen.getByRole("button", { name: "Inviter Aimée Mbemba sur Mitemo" }));

    expect(screen.getByText("Inviter")).toBeOnTheScreen();
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
