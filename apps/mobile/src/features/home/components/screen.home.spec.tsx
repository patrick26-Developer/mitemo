import { screen } from "@testing-library/react-native";

import { INITIAL_MEMBER_PROFILE, useMemberStore } from "../../../shared/member/store.member";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { HomeScreen } from "./screen.home";

describe("HomeScreen", () => {
  beforeEach(() => {
    useMemberStore.setState(INITIAL_MEMBER_PROFILE);
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
    expect(screen.getByText("2 500 FCFA")).toBeOnTheScreen();
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
});
