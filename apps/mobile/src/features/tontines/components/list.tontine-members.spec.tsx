import { fireEvent, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { makeMember, makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { TontineMemberList } from "./list.tontine-members";

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));

/** Tontine en cours de 8 tours, un membre par tour. */
const CROWDED = makeTontine({
  id: "t8",
  round: 5,
  totalRounds: 8,
  members: Array.from({ length: 8 }, (_, index) => makeMember(`m${index + 1}`, "MEMBRE")),
});

describe("TontineMemberList", () => {
  it("permet à l'administrateur de retirer les autres membres, pas lui-même", async () => {
    const onRemove = jest.fn();
    await renderWithSafeArea(
      <TontineMemberList item={makeTontine({ state: "PENDING" })} onRemove={onRemove} />,
    );

    expect(screen.getByText("Membres")).toBeOnTheScreen();
    expect(screen.getByText("3 inscrits")).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: "Retirer Membre self" })).toBeNull();

    await fireEvent.press(screen.getByRole("button", { name: "Retirer Membre m3" }));
    expect(onRemove).not.toHaveBeenCalled();
    expect(await screen.findByRole("header", { name: "Retirer Membre m3 ?" })).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole("button", { name: "Retirer de la tontine" }));

    expect(onRemove).toHaveBeenCalledWith("m3");
  });

  it("garde chaque membre à son rang de passage et cercle le bénéficiaire du tour", async () => {
    await renderWithSafeArea(
      <TontineMemberList item={makeTontine({ round: 2 })} onRemove={jest.fn()} />,
    );

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
    expect(screen.getByText("Membre de la tontine · Tour 1")).toBeOnTheScreen();
  });

  it("limite l'aperçu autour du tour en cours et ouvre la liste complète", async () => {
    await renderWithSafeArea(<TontineMemberList item={CROWDED} onRemove={jest.fn()} />);

    expect(screen.getAllByRole("button", { name: /^Historique de/ })).toHaveLength(5);
    expect(screen.getByLabelText("Tour 4")).toBeOnTheScreen();
    expect(screen.queryByLabelText("Tour 1")).toBeNull();

    await fireEvent.press(screen.getByRole("button", { name: "Voir tous les membres (8)" }));

    expect(router.push).toHaveBeenCalledWith("/tontine-members/t8");
  });

  it("ne propose pas la liste complète quand tout tient dans l'aperçu", async () => {
    await renderWithSafeArea(<TontineMemberList item={makeTontine()} onRemove={jest.fn()} />);

    expect(screen.queryByRole("button", { name: /Voir tous les membres/ })).toBeNull();
  });

  it("montre les invitations envoyées, grisées, sans rang de passage", async () => {
    const onCancelInvitation = jest.fn();
    const pending = makeTontine({
      state: "PENDING",
      totalRounds: 5,
      members: [makeMember("self", "ADMIN")],
      invitations: [{ id: "i1", name: "Aimée Mbemba", phone: "+242065706622" }],
    });
    await renderWithSafeArea(
      <TontineMemberList
        item={pending}
        onRemove={jest.fn()}
        onCancelInvitation={onCancelInvitation}
      />,
    );

    expect(screen.getByText("1 inscrit · 1 invité")).toBeOnTheScreen();
    expect(screen.getByText("Invitation envoyée")).toBeOnTheScreen();
    expect(screen.queryByLabelText("Tour 2")).toBeNull();
    await fireEvent.press(
      screen.getByRole("button", { name: "Annuler l'invitation de Aimée Mbemba" }),
    );
    expect(onCancelInvitation).toHaveBeenCalledWith("i1");
  });
});
