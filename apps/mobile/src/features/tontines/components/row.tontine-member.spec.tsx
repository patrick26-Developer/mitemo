import { fireEvent, render, screen } from "@testing-library/react-native";

import { makeMember } from "../../../shared/testing/fixtures.portfolio";
import { TontineMemberRow } from "./row.tontine-member";

describe("TontineMemberRow", () => {
  it("indique le rôle et un paiement à jour, en texte", async () => {
    await render(
      <TontineMemberRow
        member={makeMember("m2", "ADMIN", true)}
        canRemove={false}
        onRemove={jest.fn()}
      />,
    );

    expect(screen.getByText("Administrateur · À jour")).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: /Retirer/ })).toBeNull();
  });

  it("signale le membre dont c'est le tour", async () => {
    await render(
      <TontineMemberRow
        member={makeMember("m2", "MEMBRE")}
        canRemove={false}
        onRemove={jest.fn()}
      />,
    );

    expect(screen.getByText("Membre · En attente")).toBeOnTheScreen();

    await render(
      <TontineMemberRow
        member={makeMember("m2", "MEMBRE")}
        canRemove={false}
        onRemove={jest.fn()}
        focused
        onPress={jest.fn()}
      />,
    );

    expect(screen.getByText("Membre · En attente · À son tour")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Historique de Membre m2" })).toBeSelected();
  });

  it("ouvre l'historique du membre au clic", async () => {
    const onPress = jest.fn();
    await render(
      <TontineMemberRow
        member={makeMember("m3", "MEMBRE")}
        canRemove={false}
        onRemove={jest.fn()}
        onPress={onPress}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Historique de Membre m3" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("propose le retrait quand il est permis", async () => {
    const onRemove = jest.fn();
    await render(
      <TontineMemberRow member={makeMember("m3", "MEMBRE")} canRemove onRemove={onRemove} />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Retirer Membre m3" }));

    expect(screen.getByText("Membre · En attente")).toBeOnTheScreen();
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
