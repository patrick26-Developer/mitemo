import { fireEvent, screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { SheetStepper } from "./field.sheet-stepper";

describe("SheetStepper", () => {
  it("affiche sa valeur et son aide", async () => {
    await renderWithSafeArea(
      <SheetStepper
        label="Participants"
        value={6}
        min={2}
        max={50}
        onChange={jest.fn()}
        hint="Vous inclus."
      />,
    );

    expect(screen.getByLabelText("Participants : 6")).toBeOnTheScreen();
    expect(screen.getByText("Vous inclus.")).toBeOnTheScreen();
  });

  it("ajoute et retire une unité", async () => {
    const onChange = jest.fn();
    await renderWithSafeArea(
      <SheetStepper label="Participants" value={6} min={2} max={50} onChange={onChange} />,
    );

    await fireEvent.press(screen.getByLabelText("Augmenter Participants"));
    await fireEvent.press(screen.getByLabelText("Diminuer Participants"));

    expect(onChange).toHaveBeenNthCalledWith(1, 7);
    expect(onChange).toHaveBeenNthCalledWith(2, 5);
  });

  it("désactive les boutons aux bornes", async () => {
    await renderWithSafeArea(
      <SheetStepper label="Participants" value={2} min={2} max={50} onChange={jest.fn()} />,
    );

    expect(screen.getByLabelText("Diminuer Participants")).toBeDisabled();
    expect(screen.getByLabelText("Augmenter Participants")).toBeEnabled();
  });
});
