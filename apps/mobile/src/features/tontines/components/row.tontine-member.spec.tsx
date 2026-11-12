import { useMemberStore } from "../../../shared/member/store.member";
import { SELF_MEMBER_ID } from "../../../shared/member/model.portfolio";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { makeMember } from "../../../shared/testing/fixtures.portfolio";
import { TontineMemberRow } from "./row.tontine-member";

describe("TontineMemberRow", () => {
  it("affiche l'avatar du membre, son rôle et un paiement à jour", async () => {
    await render(<TontineMemberRow member={makeMember("m2", "ADMIN", true)} />);

    expect(screen.getByText("M")).toBeOnTheScreen();
    expect(screen.getByText("Administrateur · À jour")).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: /Retirer/ })).toBeNull();
  });

  it("cercle le membre dont c'est le tour de la couleur de la tontine", async () => {
    await render(
      <TontineMemberRow
        member={makeMember("m2", "MEMBRE")}
        focusAccent="#2044DF"
        onPress={jest.fn()}
      />,
    );

    const row = screen.getByRole("button", { name: "Historique de Membre m2" });
    expect(screen.getByText("Membre · En attente · À son tour")).toBeOnTheScreen();
    expect(row).toBeSelected();
    expect(row).toHaveStyle({ borderColor: "#2044DF", outlineColor: "#2044DF80" });
  });

  it("ouvre l'historique du membre au clic", async () => {
    const onPress = jest.fn();
    await render(<TontineMemberRow member={makeMember("m3", "MEMBRE")} onPress={onPress} />);

    await fireEvent.press(screen.getByRole("button", { name: "Historique de Membre m3" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("propose le retrait quand il est permis", async () => {
    const onRemove = jest.fn();
    await render(<TontineMemberRow member={makeMember("m3", "MEMBRE")} onRemove={onRemove} />);

    await fireEvent.press(screen.getByRole("button", { name: "Retirer Membre m3" }));

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("rappelle les tours du membre quand ils sont donnés", async () => {
    await render(
      <TontineMemberRow member={makeMember("m2", "MEMBRE", true)} turnsLabel="Tours 2 et 3" />,
    );

    expect(screen.getByText("Membre · À jour · Tours 2 et 3")).toBeOnTheScreen();
  });

  it("colore l'état de la cotisation : vert à jour, rouge en attente", async () => {
    await render(<TontineMemberRow member={makeMember("m2", "MEMBRE", true)} />);
    expect(screen.getByText("À jour")).toHaveStyle({ color: "#1F8A4C" });

    await render(<TontineMemberRow member={makeMember("m3", "MEMBRE")} />);
    expect(screen.getByText("En attente")).toHaveStyle({ color: "#B42318" });
  });

  it("montre la photo de profil du membre à la place de son initiale", async () => {
    useMemberStore.setState({ photoUri: "file:///photo.jpg" });
    await render(<TontineMemberRow member={makeMember(SELF_MEMBER_ID, "ADMIN", true)} />);

    expect(screen.getByTestId("member-row-photo")).toBeOnTheScreen();
    useMemberStore.setState({ photoUri: null });
  });
});
