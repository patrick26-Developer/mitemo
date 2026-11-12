import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { CardHistoryItem } from "./item.card-history";

describe("CardHistoryItem", () => {
  it("coche un pointage fait et affiche son jour, son heure, son moyen de paiement et son montant", async () => {
    await renderWithSafeArea(
      <CardHistoryItem
        row={{
          position: 1,
          done: true,
          at: "2026-11-02T09:15:00.000Z",
          amount: 7_000n,
          method: "AIRTEL_MONEY",
        }}
        accent="#CDF5DD"
      />,
    );

    expect(screen.getByRole("checkbox", { name: /Pointage 1/ })).toBeChecked();
    expect(screen.getByText("02/11/2026 à 10:15")).toBeOnTheScreen();
    expect(screen.getByText("Airtel Money")).toBeOnTheScreen();
    expect(screen.getByTestId("check-mark")).toHaveStyle({ backgroundColor: "#2AD56E" });
    expect(screen.getByText("7 000 FCFA")).toBeOnTheScreen();
  });

  it("laisse décoché un pointage à venir, avec le montant prévu", async () => {
    await renderWithSafeArea(
      <CardHistoryItem
        row={{ position: 3, done: false, at: null, amount: 5_000n, method: null }}
        accent="#CDF5DD"
      />,
    );

    expect(screen.getByRole("checkbox", { name: /Pointage 3/ })).not.toBeChecked();
    expect(screen.getByText("À venir")).toBeOnTheScreen();
    expect(screen.queryByText(/Money/)).toBeNull();
    expect(screen.getByText("5 000 FCFA")).toBeOnTheScreen();
  });
});
