import { fireEvent, screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/render-with-safe-area";
import { ProfileAvatar } from "./profile-avatar";

describe("ProfileAvatar", () => {
  it("affiche l'initiale tant qu'aucune photo n'est choisie", async () => {
    await renderWithSafeArea(<ProfileAvatar initial="P" photoUri={null} onPress={jest.fn()} />);

    expect(screen.getByText("P")).toBeOnTheScreen();
    expect(screen.queryByTestId("profile-photo")).not.toBeOnTheScreen();
  });

  it("affiche la photo choisie", async () => {
    await renderWithSafeArea(
      <ProfileAvatar initial="P" photoUri="file:///avatar.jpg" onPress={jest.fn()} />,
    );

    expect(screen.getByTestId("profile-photo")).toBeOnTheScreen();
    expect(screen.queryByText("P")).not.toBeOnTheScreen();
  });

  it("déclenche le choix d'une photo", async () => {
    const onPress = jest.fn();
    await renderWithSafeArea(<ProfileAvatar initial="P" photoUri={null} onPress={onPress} />);

    fireEvent.press(screen.getByRole("button", { name: "Modifier la photo" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
