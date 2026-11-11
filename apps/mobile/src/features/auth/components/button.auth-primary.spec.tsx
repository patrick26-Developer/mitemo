import { fireEvent, render, screen } from "@testing-library/react-native";

import { AuthPrimaryButton } from "./button.auth-primary";

describe("AuthPrimaryButton", () => {
  it("déclenche l'action touchée", async () => {
    const onPress = jest.fn();
    await render(<AuthPrimaryButton label="Se connecter" onPress={onPress} />);

    await fireEvent.press(screen.getByRole("button", { name: "Se connecter" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("ne réagit pas quand il est désactivé", async () => {
    const onPress = jest.fn();
    await render(<AuthPrimaryButton label="Se connecter" onPress={onPress} disabled />);

    await fireEvent.press(screen.getByRole("button", { name: "Se connecter" }));

    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Se connecter" })).toBeDisabled();
  });
});
