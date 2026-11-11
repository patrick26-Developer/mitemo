import { render, screen } from "@testing-library/react-native";

import { ProfileHeader } from "./header.profile";

describe("ProfileHeader", () => {
  it("affiche le nom comme en-tête et le numéro", async () => {
    await render(
      <ProfileHeader
        name="Aimée Mbemba"
        initial="A"
        phone="+242 06 570 6622"
        photoUri={null}
        onChangePhoto={jest.fn()}
      />,
    );

    expect(screen.getByRole("header", { name: "Aimée Mbemba" })).toBeOnTheScreen();
    expect(screen.getByText("+242 06 570 6622")).toBeOnTheScreen();
    expect(screen.getByText("A")).toBeOnTheScreen();
  });
});
