import { screen } from "@testing-library/react-native";
import { movementsApi } from "../../../shared/api/config.api";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { ServerHistoryScreen } from "./screen.server-history";

jest.mock("../../../shared/api/config.api", () => ({ movementsApi: { list: jest.fn() } }));
jest.mock("expo-router", () => ({ router: { back: jest.fn() } }));

describe("historique connecté", () => {
  it("affiche l'état vide d'un nouveau compte sans historique fictif", async () => {
    jest.mocked(movementsApi.list).mockResolvedValue({ items: [] });
    await renderWithSafeArea(<ServerHistoryScreen />);
    expect(await screen.findByText("Aucun mouvement pour ce compte.")).toBeOnTheScreen();
    expect(screen.queryByText("Cotisation tontine")).toBeNull();
  });
  it("affiche une erreur quand le serveur est inaccessible", async () => {
    jest.mocked(movementsApi.list).mockRejectedValue(new Error("offline"));
    await renderWithSafeArea(<ServerHistoryScreen />);
    expect(await screen.findByText("Connexion indisponible. Réessayez.")).toBeOnTheScreen();
  });
});
