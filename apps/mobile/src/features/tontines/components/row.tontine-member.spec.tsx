import { fireEvent, render, screen } from "@testing-library/react-native";

import { makeMember } from "../../../shared/testing/fixtures.portfolio";
import { TontineMemberRow } from "./row.tontine-member";

describe("TontineMemberRow", () => {
  it("affiche le rang de passage, le rôle et un paiement à jour", async () => {
    await render(<TontineMemberRow entry={{ member: makeMember("m2", "ADMIN", true), turn: 3 }} />);

    expect(screen.getByLabelText("Tour 3")).toBeOnTheScreen();
    expect(screen.getByText("Administrateur · À jour")).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: /Retirer/ })).toBeNull();
  });

  it("cercle le membre dont c'est le tour de la couleur de la tontine", async () => {
    await render(
      <TontineMemberRow
        entry={{ member: makeMember("m2", "MEMBRE"), turn: 1 }}
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
    await render(
      <TontineMemberRow
        entry={{ member: makeMember("m3", "MEMBRE"), turn: 2 }}
        onPress={onPress}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Historique de Membre m3" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("propose le retrait quand il est permis", async () => {
    const onRemove = jest.fn();
    await render(
      <TontineMemberRow
        entry={{ member: makeMember("m3", "MEMBRE"), turn: 2 }}
        onRemove={onRemove}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Retirer Membre m3" }));

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("colore l'état de la cotisation : vert à jour, rouge en attente", async () => {
    await render(
      <TontineMemberRow entry={{ member: makeMember("m2", "MEMBRE", true), turn: 1 }} />,
    );
    expect(screen.getByText("À jour")).toHaveStyle({ color: "#1F8A4C" });

    await render(<TontineMemberRow entry={{ member: makeMember("m3", "MEMBRE"), turn: 2 }} />);
    expect(screen.getByText("En attente")).toHaveStyle({ color: "#B42318" });
  });
});
