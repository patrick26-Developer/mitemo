import { fireEvent, render, screen } from "@testing-library/react-native";

import { makeMember, makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { MemberTimelineItem } from "./item.member-timeline";

describe("MemberTimelineItem", () => {
  it("pose le rang à gauche du membre et ouvre son historique", async () => {
    const onSelect = jest.fn();
    const member = makeMember("m2", "MEMBRE");
    await render(
      <MemberTimelineItem
        item={makeTontine({ round: 2 })}
        entry={{ member, turn: 2 }}
        onSelect={onSelect}
        onAskRemove={jest.fn()}
      />,
    );

    expect(screen.getByLabelText("Tour 2")).toBeOnTheScreen();
    expect(screen.getByText("Membre · En attente · À son tour")).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "Historique de Membre m2" }));
    expect(onSelect).toHaveBeenCalledWith(member);
  });

  it("n'a pas de trait après le dernier tour de la tontine", async () => {
    await render(
      <MemberTimelineItem
        item={makeTontine()}
        entry={{ member: makeMember("m3", "MEMBRE"), turn: 3 }}
        onSelect={jest.fn()}
        onAskRemove={jest.fn()}
      />,
    );

    expect(screen.queryByTestId("turn-connector")).toBeNull();
  });
});
