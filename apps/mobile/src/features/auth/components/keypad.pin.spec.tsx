import { fireEvent, render, screen } from "@testing-library/react-native";

import { PinKeypad } from "./keypad.pin";

describe("PinKeypad", () => {
  it("transmet chaque chiffre touché, zéro compris", async () => {
    const onPressDigit = jest.fn();
    await render(<PinKeypad onPressDigit={onPressDigit} onErase={jest.fn()} />);

    await fireEvent.press(screen.getByRole("button", { name: "9" }));
    await fireEvent.press(screen.getByRole("button", { name: "0" }));

    expect(onPressDigit.mock.calls).toEqual([["9"], ["0"]]);
  });

  it("efface le dernier chiffre", async () => {
    const onErase = jest.fn();
    await render(<PinKeypad onPressDigit={jest.fn()} onErase={onErase} />);

    await fireEvent.press(screen.getByRole("button", { name: "Effacer" }));

    expect(onErase).toHaveBeenCalledTimes(1);
  });

  it("ne propose « Oublié ? » que si l'écran le gère", async () => {
    const onForgot = jest.fn();
    const { rerender } = await render(<PinKeypad onPressDigit={jest.fn()} onErase={jest.fn()} />);
    expect(screen.queryByRole("button", { name: "Code PIN oublié" })).toBeNull();

    await rerender(<PinKeypad onPressDigit={jest.fn()} onErase={jest.fn()} onForgot={onForgot} />);
    await fireEvent.press(screen.getByRole("button", { name: "Code PIN oublié" }));

    expect(onForgot).toHaveBeenCalledTimes(1);
  });
});
