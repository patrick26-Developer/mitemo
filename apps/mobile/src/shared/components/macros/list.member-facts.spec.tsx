import { render, screen } from "@testing-library/react-native";

import { INITIAL_MEMBER_PROFILE, useMemberStore } from "../../member/store.member";
import { MemberFactList } from "./list.member-facts";

describe("MemberFactList", () => {
  beforeEach(() => useMemberStore.setState(INITIAL_MEMBER_PROFILE));

  it("liste le nom, le téléphone, la profession et la date de création, séparés par un trait", async () => {
    await render(<MemberFactList />);

    expect(screen.getAllByTestId(/^fact-row-/)).toHaveLength(4);
    expect(screen.getAllByTestId("fact-divider")).toHaveLength(3);
    expect(screen.getByText(INITIAL_MEMBER_PROFILE.name)).toBeOnTheScreen();
    expect(screen.getByText(INITIAL_MEMBER_PROFILE.phone)).toBeOnTheScreen();
  });
});
