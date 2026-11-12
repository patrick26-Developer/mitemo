import { fireEvent, render, screen } from "@testing-library/react-native";

import { InvitationsBanner } from "./banner.invitations";

describe("InvitationsBanner", () => {
  it("annonce les invitations reçues et ouvre la feuille", async () => {
    const onPress = jest.fn();
    await render(<InvitationsBanner count={2} onPress={onPress} />);

    await fireEvent.press(screen.getByRole("button", { name: "2 invitations à des tontines" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("disparaît sans invitation", async () => {
    await render(<InvitationsBanner count={0} onPress={jest.fn()} />);

    expect(screen.queryByRole("button")).toBeNull();
  });
});
