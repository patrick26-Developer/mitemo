import { fireEvent, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { renderWithSafeArea } from "../../testing/util.render-with-safe-area";
import { PressableScale } from "./scale.pressable";

describe("PressableScale", () => {
  it("déclenche l'action au toucher", async () => {
    const onPress = jest.fn();
    await renderWithSafeArea(
      <PressableScale accessibilityLabel="Ouvrir la tontine" onPress={onPress}>
        <Text>Ma tontine</Text>
      </PressableScale>,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Ouvrir la tontine" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("ignore l'action quand la zone est désactivée", async () => {
    const onPress = jest.fn();
    await renderWithSafeArea(
      <PressableScale accessibilityLabel="Ouvrir la tontine" onPress={onPress} disabled>
        <Text>Ma tontine</Text>
      </PressableScale>,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Ouvrir la tontine" }));

    expect(onPress).not.toHaveBeenCalled();
  });
});
