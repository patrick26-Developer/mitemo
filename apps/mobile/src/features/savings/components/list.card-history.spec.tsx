import { screen } from "@testing-library/react-native";

import { makeCard } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { CardHistoryList } from "./list.card-history";

describe("CardHistoryList", () => {
  it("liste tous les pointages, faits puis à venir, avec le compte des faits", async () => {
    const item = makeCard({
      markersTotal: 3,
      entries: [{ at: "2026-11-02T09:15:00.000Z", amount: 5_000n, method: "MTN_MOMO" }],
    });
    await renderWithSafeArea(<CardHistoryList item={item} />);

    expect(screen.getByRole("header", { name: "Carte complète" })).toBeOnTheScreen();
    expect(screen.getByText("1 sur 3 déjà pointé")).toBeOnTheScreen();
    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
    expect(screen.getByRole("checkbox", { name: /Pointage 1/ })).toBeChecked();
    expect(screen.getAllByText("À venir")).toHaveLength(2);
  });

  it("annonce un historique vide quand aucun pointage n'est prévu", async () => {
    await renderWithSafeArea(<CardHistoryList item={makeCard({ markersTotal: 0, entries: [] })} />);

    expect(screen.getByText("Aucun pointage prévu pour cette carte.")).toBeOnTheScreen();
    expect(screen.queryByRole("checkbox")).not.toBeOnTheScreen();
  });
});
