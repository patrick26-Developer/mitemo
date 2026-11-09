import { screen } from "@testing-library/react-native";

import { renderWithSafeArea } from "../../../shared/testing/render-with-safe-area";
import { HistoryScreen } from "./history-screen";

jest.mock("expo-router", () => ({ router: { back: jest.fn() } }));

describe("HistoryScreen", () => {
  it("affiche les opérations et le retour", async () => {
    await renderWithSafeArea(<HistoryScreen />);

    expect(screen.getByRole("header", { name: "Historique" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Retour" })).toBeOnTheScreen();
    expect(screen.getByText("Versement du tour")).toBeOnTheScreen();
    expect(screen.getByText("+45 000 FCFA")).toBeOnTheScreen();
  });
});
