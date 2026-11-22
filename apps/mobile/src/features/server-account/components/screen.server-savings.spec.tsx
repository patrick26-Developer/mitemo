import { screen } from "@testing-library/react-native";
import { savingsApi } from "../../../shared/api/config.api";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { ServerSavingsScreen } from "./screen.server-savings";

jest.mock("../../../shared/api/config.api", () => ({
  savingsApi: { list: jest.fn(), create: jest.fn() },
}));
describe("objectifs serveur", () => {
  it("annonce une liste vide sans reprendre les cartes locales", async () => {
    jest.mocked(savingsApi.list).mockResolvedValue({ items: [] });
    await renderWithSafeArea(<ServerSavingsScreen />);
    expect(await screen.findByText("Aucun objectif pour ce compte.")).toBeOnTheScreen();
  });
  it("distingue une erreur d'une absence d'objectifs", async () => {
    jest.mocked(savingsApi.list).mockRejectedValue(new Error("offline"));
    await renderWithSafeArea(<ServerSavingsScreen />);
    expect(await screen.findByText("Connexion indisponible. Réessayez.")).toBeOnTheScreen();
    expect(screen.queryByText("Aucun objectif pour ce compte.")).toBeNull();
  });
});
