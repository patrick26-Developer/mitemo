import { fireEvent, render, screen } from "@testing-library/react-native";

import { AuthFooterLink } from "./link.auth-footer";

describe("AuthFooterLink", () => {
  it("affiche l'invite et ouvre le lien", async () => {
    const onPress = jest.fn();
    await render(
      <AuthFooterLink prompt="Je n'ai pas de compte ?" label="Créer un compte" onPress={onPress} />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Créer un compte" }));

    expect(screen.getByText(/Je n'ai pas de compte \?/)).toBeOnTheScreen();
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
