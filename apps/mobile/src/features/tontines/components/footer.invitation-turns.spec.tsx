import { fireEvent, render, screen } from "@testing-library/react-native";

import { InvitationTurnsFooter } from "./footer.invitation-turns";

describe("InvitationTurnsFooter", () => {
  it("place Retour et Rejoindre sur une même ligne", async () => {
    const onBack = jest.fn();
    const onJoin = jest.fn();
    await render(<InvitationTurnsFooter onBack={onBack} onJoin={onJoin} />);

    expect(screen.getByTestId("sheet-action-row")).toHaveStyle({ flexDirection: "row" });
    await fireEvent.press(screen.getByRole("button", { name: "Retour" }));
    await fireEvent.press(screen.getByRole("button", { name: "Rejoindre" }));

    expect(onBack).toHaveBeenCalledTimes(1);
    expect(onJoin).toHaveBeenCalledTimes(1);
  });
});
