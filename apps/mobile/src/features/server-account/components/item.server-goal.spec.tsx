import type { SavingsGoalResponse } from "@mitemo/contracts";
import { screen } from "@testing-library/react-native";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { ServerGoalItem } from "./item.server-goal";

it("affiche une cible sans la déclarer versée", async () => {
  const goal = {
    goalId: "019a6f4b-e680-7000-8000-000000000001",
    name: "Fournitures",
    target: { amount: "1500", currency: "XAF" },
    terms: { startsAt: "2026-11-30T00:00:00.000Z" },
  } as SavingsGoalResponse;
  await renderWithSafeArea(<ServerGoalItem goal={goal} />);
  expect(screen.getByText(/Cible :/)).toBeOnTheScreen();
  expect(screen.getByText("Aucun versement n’est déclenché par la création.")).toBeOnTheScreen();
});
