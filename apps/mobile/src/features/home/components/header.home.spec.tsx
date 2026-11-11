import { render, screen } from "@testing-library/react-native";

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
    await render(<HomeHeader />);

    expect(screen.getByText("Bonjour")).toBeOnTheScreen();
    expect(screen.getByText("Aimée Mbemba")).toBeOnTheScreen();
    expect(screen.getByText("A")).toBeOnTheScreen();
  });

  it("affiche la photo choisie", async () => {
    useMemberStore.getState().setPhoto("file:///documents/profile-photo.jpg");
    await render(<HomeHeader />);

    expect(screen.getByTestId("home-photo")).toBeOnTheScreen();
  });
});
