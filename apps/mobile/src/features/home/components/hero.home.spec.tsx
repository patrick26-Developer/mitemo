import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { screen } from "@testing-library/react-native";

import { INITIAL_MEMBER_PROFILE, useMemberStore } from "../../../shared/member/store.member";
import { HomeHero } from "./hero.home";

describe("HomeHero", () => {
  beforeEach(() => useMemberStore.setState(INITIAL_MEMBER_PROFILE));

  it("réunit la salutation et le solde", async () => {
    await renderWithSafeArea(<HomeHero topInset={47} onOpenMember={jest.fn()} />);

    expect(screen.getByText("Bonjour")).toBeOnTheScreen();
    expect(screen.getByText("Solde disponible")).toBeOnTheScreen();
  });
});
