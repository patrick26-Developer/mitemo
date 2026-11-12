import { render, screen } from "@testing-library/react-native";

import { HistoryRow } from "./row.history";

describe("HistoryRow", () => {
  it("signe négativement une sortie d'argent", async () => {
    await render(
      <HistoryRow
        entry={{
          id: "1",
          label: "Cotisation tontine",
          date: "2026-11-08",
          amount: 5_000n,
          direction: "debit",
        }}
      />,
    );

    expect(screen.getByText("Cotisation tontine")).toBeOnTheScreen();
    expect(screen.getByText("-5 000 FCFA")).toBeOnTheScreen();
  });

  it("signe positivement une entrée d'argent", async () => {
    await render(
      <HistoryRow
        entry={{
          id: "2",
          label: "Restourne reçue",
          date: "2026-11-01",
          amount: 75_000n,
          direction: "credit",
        }}
      />,
    );

    expect(screen.getByText("+75 000 FCFA")).toBeOnTheScreen();
  });
});
