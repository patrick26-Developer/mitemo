import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { SeeAllMembersButton } from "./button.see-all-members";

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));

describe("SeeAllMembersButton", () => {
  it("annonce le nombre de membres et ouvre la liste complète", async () => {
    await render(<SeeAllMembersButton tontineId="1" count={42} />);

    await fireEvent.press(screen.getByRole("button", { name: "Voir tous les membres (42)" }));

    expect(router.push).toHaveBeenCalledWith("/tontine-members/1");
  });
});
