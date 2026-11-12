import { fireEvent, render, screen } from "@testing-library/react-native";

import { TintPicker } from "./picker.tint";

describe("TintPicker", () => {
  it("coche la couleur choisie et signale le nouveau choix", async () => {
    const onChange = jest.fn();
    await render(<TintPicker value={1} onChange={onChange} />);

    expect(screen.getByRole("radio", { name: "Ambre", checked: true })).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("radio", { name: "Bleu" }));

    expect(onChange).toHaveBeenCalledWith(2);
  });
});
