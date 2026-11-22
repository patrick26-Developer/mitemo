import type { WalletSummaryResponse } from "@mitemo/contracts";
import { screen } from "@testing-library/react-native";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { ServerWalletPanel } from "./panel.wallet";

it("sépare l'argent en attente du solde disponible", async () => {
  const money = (amount: string) => ({ amount, currency: "XAF" });
  const wallet = {
    available: money("0"),
    committed: money("0"),
    pending: money("500"),
    blocked: money("0"),
    simulated: true,
  } as WalletSummaryResponse;
  await renderWithSafeArea(<ServerWalletPanel wallet={wallet} />);
  expect(screen.getByText("Disponible : 0 XAF")).toBeOnTheScreen();
  expect(screen.getByText("En attente : 500 XAF")).toBeOnTheScreen();
});
