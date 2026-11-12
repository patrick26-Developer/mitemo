import { fireEvent, render, screen } from "@testing-library/react-native";

import { makeMember, makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { MemberSearchRow } from "./row.member-search";

/** Invitation envoyée par l'administrateur. */
const AIMEE = { id: "i1", name: "Aimée Mbemba", phone: "+242065706622" } as const;

describe("MemberSearchRow", () => {
  it("rappelle les tours du membre et cercle le bénéficiaire du tour", async () => {
    const member = makeMember("m2", "MEMBRE");
    await render(
      <MemberSearchRow
        item={makeTontine({ round: 2 })}
        row={{ kind: "member", member }}
        onSelect={jest.fn()}
        onCancelInvitation={jest.fn()}
      />,
    );

    expect(screen.getByText("Membre · En attente · Tour 2 · À son tour")).toBeOnTheScreen();
  });

  it("laisse l'administrateur annuler une invitation avant le départ", async () => {
    const onCancelInvitation = jest.fn();
    await render(
      <MemberSearchRow
        item={makeTontine({ state: "PENDING", invitations: [AIMEE] })}
        row={{ kind: "invited", invitation: AIMEE }}
        onSelect={jest.fn()}
        onCancelInvitation={onCancelInvitation}
      />,
    );

    await fireEvent.press(
      screen.getByRole("button", { name: "Annuler l'invitation de Aimée Mbemba" }),
    );

    expect(onCancelInvitation).toHaveBeenCalledWith("i1");
  });
});
