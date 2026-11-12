import { fireEvent, render, screen } from "@testing-library/react-native";

import { INITIAL_INVITATIONS } from "../../../shared/demo/demo.invitations";
import { firstOf } from "../../../shared/testing/fixtures.portfolio";
import { InvitationCard } from "./card.invitation";

/** Invitation de démonstration : Commerçantes de Poto-Poto. */
const INVITATION = firstOf(INITIAL_INVITATIONS);

describe("InvitationCard", () => {
  it("présente la tontine proposée et qui invite", async () => {
    await render(
      <InvitationCard invitation={INVITATION} onAccept={jest.fn()} onDecline={jest.fn()} />,
    );

    expect(screen.getByText("Commerçantes de Poto-Poto")).toBeOnTheScreen();
    expect(screen.getByText("Invitation de Mama Nadège")).toBeOnTheScreen();
    expect(screen.getByText("5 sur 12")).toBeOnTheScreen();
  });

  it("transmet l'acceptation et le refus", async () => {
    const onAccept = jest.fn();
    const onDecline = jest.fn();
    await render(
      <InvitationCard invitation={INVITATION} onAccept={onAccept} onDecline={onDecline} />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Accepter" }));
    await fireEvent.press(screen.getByRole("button", { name: "Refuser" }));

    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(onDecline).toHaveBeenCalledTimes(1);
  });
});
