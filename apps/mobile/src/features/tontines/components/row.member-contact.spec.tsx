import { fireEvent, render, screen } from "@testing-library/react-native";

import { MemberContactRow } from "./row.member-contact";

describe("MemberContactRow", () => {
  it("affiche le contact et l'inscrit au toucher", async () => {
    const onPress = jest.fn();
    await render(
      <MemberContactRow
        contact={{ name: "Aimée Mbemba", phone: "+242065706622" }}
        onPress={onPress}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Ajouter Aimée Mbemba" }));

    expect(screen.getByText("+242 06 570 6622")).toBeOnTheScreen();
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
