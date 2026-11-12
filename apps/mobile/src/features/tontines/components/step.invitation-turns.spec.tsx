import { fireEvent, render, screen } from "@testing-library/react-native";

import { INITIAL_INVITATIONS } from "../../../shared/demo/demo.invitations";
import { firstOf } from "../../../shared/testing/fixtures.portfolio";
import { InvitationTurnsStep } from "./step.invitation-turns";

/** Invitation de démonstration : 5 tours libres. */
const INVITATION = firstOf(INITIAL_INVITATIONS);

describe("InvitationTurnsStep", () => {
  it("explique ce qu'engage le nombre de tours et le fait varier", async () => {
    const onChange = jest.fn();
    await render(<InvitationTurnsStep invitation={INVITATION} turns={2} onChange={onChange} />);

    expect(screen.getByText(/cotiserez 5 000 FCFA à chaque tour/)).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "Augmenter Nombre de tours" }));

    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("borne le choix aux tours encore libres", async () => {
    await render(<InvitationTurnsStep invitation={INVITATION} turns={5} onChange={jest.fn()} />);

    expect(screen.getByRole("button", { name: "Augmenter Nombre de tours" })).toBeDisabled();
  });
});
