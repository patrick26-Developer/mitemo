import { fireEvent, render, screen } from "@testing-library/react-native";

import { makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { TontinePicker } from "./section.tontine-picker";

const TONTINES = [makeTontine({ id: "t1", name: "Tontine du marché" })];

describe("TontinePicker", () => {
  it("marque l'option choisie", async () => {
    await render(<TontinePicker tontines={TONTINES} selected={null} onSelect={jest.fn()} />);

    expect(screen.getByRole("button", { name: "Aucune tontine" })).toBeSelected();
    expect(screen.getByRole("button", { name: "Tontine du marché" })).not.toBeSelected();
  });

  it("transmet la tontine ou l'absence de tontine", async () => {
    const onSelect = jest.fn();
    await render(<TontinePicker tontines={TONTINES} selected="t1" onSelect={onSelect} />);

    await fireEvent.press(screen.getByRole("button", { name: "Tontine du marché" }));
    await fireEvent.press(screen.getByRole("button", { name: "Aucune tontine" }));

    expect(onSelect.mock.calls).toEqual([["t1"], [null]]);
  });
});
