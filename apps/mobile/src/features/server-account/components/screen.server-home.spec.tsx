import { screen } from "@testing-library/react-native";
import { accountApi } from "../../../shared/api/config.api";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { ServerHomeScreen } from "./screen.server-home";

jest.mock("../../../shared/api/config.api", () => ({ accountApi: { walletSummary: jest.fn() } }));
jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));
const money = (amount: string) => ({ amount, currency: "XAF" });

describe("accueil serveur", () => {
  it("annonce le chargement sans afficher le faux solde local", async () => {
    jest.mocked(accountApi.walletSummary).mockReturnValue(new Promise(() => {}));
    await renderWithSafeArea(<ServerHomeScreen />);
    expect(screen.getByLabelText("Chargement des données serveur")).toBeOnTheScreen();
    expect(screen.queryByText(/12.500/)).toBeNull();
  });
  it("affiche les soldes reçus du serveur et la simulation", async () => {
    jest.mocked(accountApi.walletSummary).mockResolvedValue({
      available: money("0"),
      committed: money("0"),
      pending: money("0"),
      blocked: money("0"),
      simulated: true,
    } as never);
    await renderWithSafeArea(<ServerHomeScreen />);
    expect(await screen.findByText("Disponible : 0 XAF")).toBeOnTheScreen();
    expect(screen.getByText(/Portefeuille simulé/)).toBeOnTheScreen();
  });
  it("montre une erreur réseau sans la convertir en solde nul", async () => {
    jest.mocked(accountApi.walletSummary).mockRejectedValue(new Error("offline"));
    await renderWithSafeArea(<ServerHomeScreen />);
    expect(await screen.findByText("Connexion indisponible. Réessayez.")).toBeOnTheScreen();
    expect(screen.queryByText(/Disponible :/)).toBeNull();
  });
});
