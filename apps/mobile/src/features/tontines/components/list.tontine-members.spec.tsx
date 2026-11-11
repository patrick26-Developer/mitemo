import { fireEvent, render, screen } from "@testing-library/react-native";

import { makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { TontineMemberList } from "./list.tontine-members";

describe("TontineMemberList", () => {
  it("permet à l'administrateur de retirer les autres membres, pas lui-même", async () => {
    const onRemove = jest.fn();
    await render(<TontineMemberList item={makeTontine()} onRemove={onRemove} />);

    expect(screen.getByText("Membres (3)")).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: "Retirer Membre self" })).toBeNull();

    await fireEvent.press(screen.getByRole("button", { name: "Retirer Membre m3" }));

    expect(onRemove).toHaveBeenCalledWith("m3");
  });
});
