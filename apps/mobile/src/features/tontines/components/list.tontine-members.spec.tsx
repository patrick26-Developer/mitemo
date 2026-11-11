import { fireEvent, screen } from "@testing-library/react-native";

import { makeMember, makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { TontineMemberList } from "./list.tontine-members";

describe("TontineMemberList", () => {
  it("permet à l'administrateur de retirer les autres membres, pas lui-même", async () => {
    const onRemove = jest.fn();
    await renderWithSafeArea(
      <TontineMemberList item={makeTontine({ state: "PENDING" })} onRemove={onRemove} />,
    );

    expect(screen.getByText("Membres")).toBeOnTheScreen();
    expect(screen.getByText("3 sur 3 inscrits")).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: "Retirer Membre self" })).toBeNull();

    await fireEvent.press(screen.getByRole("button", { name: "Retirer Membre m3" }));
    expect(onRemove).not.toHaveBeenCalled();
    expect(await screen.findByRole("header", { name: "Retirer Membre m3 ?" })).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole("button", { name: "Retirer de la tontine" }));

    expect(onRemove).toHaveBeenCalledWith("m3");
  });

  it("garde chaque membre à son rang de passage et cercle le bénéficiaire du tour", async () => {
    await renderWithSafeArea(<TontineMemberList item={makeTontine()} onRemove={jest.fn()} />);

    const rows = screen.getAllByRole("button", { name: /^Historique de/ });
    expect(rows[0]).toHaveAccessibleName("Historique de Membre self");
    expect(rows[1]).toBeSelected();
    expect(screen.getByText("Membre · En attente · À son tour")).toBeOnTheScreen();
    expect(screen.getByLabelText("Tour 2")).toBeOnTheScreen();
    expect(screen.getAllByTestId("turn-connector")).toHaveLength(2);
  });

  it("ouvre l'historique de cotisation d'un membre", async () => {
    await renderWithSafeArea(
      <TontineMemberList
        item={makeTontine({
          round: 2,
          members: [makeMember("m2", "MEMBRE", true), makeMember("m3", "MEMBRE")],
          beneficiaryId: "m3",
        })}
        onRemove={jest.fn()}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Historique de Membre m2" }));

    expect(await screen.findByRole("header", { name: "Membre m2" })).toBeOnTheScreen();
    expect(screen.getByText("Tour 1")).toBeOnTheScreen();
    expect(screen.getAllByText(/· Réglé/)).toHaveLength(2);
  });
});
