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
    expect(screen.queryByRole("button")).toBeNull();
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
