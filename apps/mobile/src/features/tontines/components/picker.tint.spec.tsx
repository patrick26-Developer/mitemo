import { fireEvent, render, screen } from "@testing-library/react-native";

import { TintPicker } from "./picker.tint";

describe("TintPicker", () => {
  it("propose au moins dix couleurs, qui défilent à l'horizontale", async () => {
    await render(<TintPicker value={0} onChange={jest.fn()} />);

    expect(screen.getAllByRole("radio").length).toBeGreaterThanOrEqual(10);
    expect(screen.getByTestId("tint-picker-scroll")).toHaveProp("horizontal", true);
  });

  it("coche la couleur choisie et signale le nouveau choix", async () => {
    const onChange = jest.fn();
    await render(<TintPicker value={1} onChange={onChange} />);

    expect(screen.getByRole("radio", { name: "Ambre", checked: true })).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("radio", { name: "Bleu" }));

    expect(onChange).toHaveBeenCalledWith(2);
  });
});
