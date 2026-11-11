import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { PinKey } from "./key.pin";

describe("PinKey", () => {
  it("affiche son chiffre et réagit au toucher", async () => {
    const onPress = jest.fn();
    await render(<PinKey label="5" onPress={onPress} />);

    await fireEvent.press(screen.getByRole("button", { name: "5" }));

    expect(screen.getByText("5")).toBeOnTheScreen();
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("affiche un contenu libre avec son propre libellé", async () => {
    await render(
      <PinKey plain accessibilityLabel="Effacer" onPress={jest.fn()}>
        <Text>⌫</Text>
      </PinKey>,
    );

    expect(screen.getByRole("button", { name: "Effacer" })).toBeOnTheScreen();
    expect(screen.getByText("⌫")).toBeOnTheScreen();
  });

  it("garde un libellé générique sans chiffre ni libellé", async () => {
    await render(<PinKey onPress={jest.fn()} />);

    expect(screen.getByRole("button", { name: "Touche" })).toBeOnTheScreen();
  });
});
