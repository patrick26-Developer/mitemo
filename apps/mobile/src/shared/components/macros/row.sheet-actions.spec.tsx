import { fireEvent, render, screen } from "@testing-library/react-native";

import { SheetActionRow } from "./row.sheet-actions";

describe("SheetActionRow", () => {
  it("place les deux actions sur une même ligne et les déclenche", async () => {
    const onBack = jest.fn();
    const onSubmit = jest.fn();
    await render(
      <SheetActionRow
        secondary={{ label: "Retour", onPress: onBack }}
        primary={{ label: "Créer", onPress: onSubmit }}
      />,
    );

    expect(screen.getByTestId("sheet-action-row")).toHaveStyle({ flexDirection: "row" });

    await fireEvent.press(screen.getByRole("button", { name: "Retour" }));
    await fireEvent.press(screen.getByRole("button", { name: "Créer" }));

    expect(onBack).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
