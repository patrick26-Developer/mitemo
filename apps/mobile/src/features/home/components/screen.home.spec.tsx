import { fireEvent, screen } from "@testing-library/react-native";
import { router, useIsFocused } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { INITIAL_MEMBER_PROFILE, useMemberStore } from "../../../shared/member/store.member";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { HomeScreen } from "./screen.home";

jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
  useIsFocused: jest.fn(),
}));

jest.mock("expo-status-bar", () => ({ StatusBar: jest.fn(() => null) }));

/**
 * Lit le style passé à la barre d'état au dernier rendu.
 * @returns Le style reçu, ou `undefined` si la barre n'a pas été rendue.
 */
function lastStatusBarStyle(): string | undefined {
  const calls = jest.mocked(StatusBar).mock.calls;

  return calls.at(-1)?.[0].style;
}

describe("HomeScreen", () => {
  beforeEach(() => {
    useMemberStore.setState(INITIAL_MEMBER_PROFILE);
    jest.mocked(useIsFocused).mockReturnValue(true);
  });

  it("salue le membre connecté", async () => {
    await renderWithSafeArea(<HomeScreen />);

    expect(screen.getByText("Bonjour")).toBeOnTheScreen();
    expect(screen.getByText("Précieuse Mavoungou")).toBeOnTheScreen();
  });

  it("affiche la photo partagée du membre", async () => {
    useMemberStore.getState().setPhoto("file:///documents/profile-photo.jpg");
    await renderWithSafeArea(<HomeScreen />);

    expect(screen.getByTestId("home-photo")).toBeOnTheScreen();
  });

  it("affiche le solde disponible et le montant mis de côté", async () => {
    await renderWithSafeArea(<HomeScreen />);

    expect(screen.getByText("Solde disponible")).toBeOnTheScreen();
    expect(screen.getByText(/12 500/)).toBeOnTheScreen();
    expect(screen.getByText("28 000 FCFA")).toBeOnTheScreen();
  });

  it("liste les tontines du membre", async () => {
    await renderWithSafeArea(<HomeScreen />);

    expect(screen.getByText("2 Tontines")).toBeOnTheScreen();
    expect(screen.getByText("Tontine du Marché Tolal")).toBeOnTheScreen();
    expect(screen.getByText("Tour 4 / 10")).toBeOnTheScreen();
  });

  it("liste les cartes de pointage du membre", async () => {
    await renderWithSafeArea(<HomeScreen />);

    expect(screen.getByText("2 Cartes de pointage")).toBeOnTheScreen();
    expect(screen.getByText("Loyer de Janvier")).toBeOnTheScreen();
  });

  it("coupe l'effet de bord natif avec une vue de garde placée avant le défilement", async () => {
    await renderWithSafeArea(<HomeScreen />);

    expect(screen.getByTestId("home-scroll-guard")).toHaveStyle({ height: 0 });
  });

  it("affiche des icônes claires quand l'accueil a le focus", async () => {
    await renderWithSafeArea(<HomeScreen />);

    expect(lastStatusBarStyle()).toBe("light");
  });

  it("garde des icônes sombres quand l'accueil n'a pas le focus", async () => {
    jest.mocked(useIsFocused).mockReturnValue(false);
    await renderWithSafeArea(<HomeScreen />);

    expect(lastStatusBarStyle()).toBe("dark");
  });

  it("ouvre le résumé du membre depuis son avatar, puis mène au profil", async () => {
    await renderWithSafeArea(<HomeScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Voir mes informations" }));
    expect(screen.getByText("Nom complet")).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole("button", { name: "Voir mon profil" }));
    expect(router.push).toHaveBeenCalledWith("/profile");
  });
});
