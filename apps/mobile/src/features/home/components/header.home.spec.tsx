import { fireEvent, render, screen } from "@testing-library/react-native";

import { INITIAL_MEMBER_PROFILE, useMemberStore } from "../../../shared/member/store.member";
import { HomeHeader } from "./header.home";

describe("HomeHeader", () => {
  beforeEach(() => useMemberStore.setState(INITIAL_MEMBER_PROFILE));

  it("salue le membre par son nom et affiche son initiale sans photo", async () => {
    useMemberStore.getState().updateIdentity({
      firstName: "Aimée",
      lastName: "Mbemba",
      occupation: "Commerçante",
      phone: "+242 06 570 6622",
    });
    await render(<HomeHeader onOpenMember={jest.fn()} />);

    expect(screen.getByText("Bonjour")).toBeOnTheScreen();
    expect(screen.getByText("Aimée Mbemba")).toBeOnTheScreen();
    expect(screen.getByText("A")).toBeOnTheScreen();
  });

  it("affiche la photo choisie", async () => {
    useMemberStore.getState().setPhoto("file:///documents/profile-photo.jpg");
    await render(<HomeHeader onOpenMember={jest.fn()} />);

    expect(screen.getByTestId("home-photo")).toBeOnTheScreen();
  });

  it("ouvre le résumé du membre quand on touche son avatar ou son nom", async () => {
    const onOpenMember = jest.fn();
    await render(<HomeHeader onOpenMember={onOpenMember} />);

    await fireEvent.press(screen.getByRole("button", { name: "Voir mes informations" }));

    expect(onOpenMember).toHaveBeenCalledTimes(1);
  });
});
