import { fireEvent, render, screen } from "@testing-library/react-native";

import { ProfileLinkCard } from "./card.profile-link";

describe("ProfileLinkCard", () => {
  it("mène au profil au toucher", async () => {
    const onPress = jest.fn();
    await render(<ProfileLinkCard onPress={onPress} />);

    await fireEvent.press(screen.getByRole("button", { name: "Voir mon profil" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
