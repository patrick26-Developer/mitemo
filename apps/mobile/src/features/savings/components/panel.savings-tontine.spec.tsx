import { fireEvent, screen } from "@testing-library/react-native";

import { SELF_MEMBER_ID } from "../../../shared/member/model.portfolio";
import { makeCard, makeMember, makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { SavingsTontinePanel } from "./panel.savings-tontine";

describe("SavingsTontinePanel", () => {
  it("propose de régler la cotisation due avec l'épargne de la carte", async () => {
    const onTransfer = jest.fn();
    await renderWithSafeArea(
      <SavingsTontinePanel
        item={makeCard({ tontineId: "t1" })}
        tontine={makeTontine({
          members: [makeMember(SELF_MEMBER_ID, "ADMIN", false), makeMember("m2", "MEMBRE", true)],
        })}
        onTransfer={onTransfer}
      />,
    );

    expect(screen.getByText(/Tontine de test/)).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "Régler la cotisation" }));

    expect(onTransfer).toHaveBeenCalledTimes(1);
  });

  it("ne propose rien quand la cotisation est déjà réglée", async () => {
    await renderWithSafeArea(
      <SavingsTontinePanel
        item={makeCard({ tontineId: "t1" })}
        tontine={makeTontine({
          members: [makeMember(SELF_MEMBER_ID, "ADMIN", true), makeMember("m2", "MEMBRE", true)],
        })}
        onTransfer={jest.fn()}
      />,
    );

    expect(screen.queryByRole("button", { name: "Régler la cotisation" })).not.toBeOnTheScreen();
  });

  it("ne propose rien quand la carte n'est rattachée à aucune tontine", async () => {
    await renderWithSafeArea(
      <SavingsTontinePanel item={makeCard()} tontine={makeTontine()} onTransfer={jest.fn()} />,
    );

    expect(screen.queryByRole("button", { name: "Régler la cotisation" })).not.toBeOnTheScreen();
  });
});
