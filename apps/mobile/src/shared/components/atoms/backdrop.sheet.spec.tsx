import { fireEvent, render, screen } from "@testing-library/react-native";

import { SheetBackdrop } from "./backdrop.sheet";

describe("SheetBackdrop", () => {
  it("ferme la feuille quand on touche le fond", async () => {
    const onPress = jest.fn();
    await render(<SheetBackdrop onPress={onPress} />);

    await fireEvent.press(screen.getByRole("button", { name: "Fermer la feuille" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
