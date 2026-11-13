import { fireEvent, render, screen } from "@testing-library/react-native";

import { SelectCardOption } from "./option.select-card";

/** Tontine proposée au rattachement. */
const ITEM = { id: "t1", label: "Les Amis", description: "6 membres · 5 000 FCFA par tour" };

describe("SelectCardOption", () => {
  it("montre le détail, la couleur de l'option et transmet le toucher", async () => {
    const onSelect = jest.fn();
    await render(
      <SelectCardOption
        item={{ ...ITEM, accent: "#2CCA86" }}
        selected={false}
        onSelect={onSelect}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: /Les Amis/ }));

    expect(screen.getByText("6 membres · 5 000 FCFA par tour")).toBeOnTheScreen();
    expect(screen.getByTestId("sheet-select-swatch-t1")).toHaveStyle({
      backgroundColor: "#2CCA86",
    });
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("garde une pastille neutre sans couleur", async () => {
    await render(
      <SelectCardOption item={{ ...ITEM, accent: undefined }} selected onSelect={jest.fn()} />,
    );

    expect(screen.getByTestId("sheet-select-swatch-t1")).not.toHaveStyle({
      backgroundColor: "#2CCA86",
    });
    expect(screen.getByRole("button", { name: /Les Amis/ })).toBeSelected();
  });
});
