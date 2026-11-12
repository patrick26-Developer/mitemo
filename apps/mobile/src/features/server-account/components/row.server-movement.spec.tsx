import type { WalletMovement } from "@mitemo/contracts";
import { screen } from "@testing-library/react-native";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { ServerMovementRow } from "./row.server-movement";

it("annonce la simulation et respecte le montant signé reçu", async () => {
  const movement = {
    movementId: "019a6f4b-e680-7000-8000-000000000001",
    occurredAt: "2026-11-12T15:00:00.000Z",
    kind: "FEE",
    amount: { amount: "-500", currency: "XAF" },
    description: "Frais simulés",
    simulated: true,
  } as WalletMovement;
  await renderWithSafeArea(<ServerMovementRow movement={movement} />);
  expect(screen.getByText("-500 XAF")).toBeOnTheScreen();
  expect(screen.getByText("Opération simulée")).toBeOnTheScreen();
});
