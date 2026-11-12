import { fireEvent, screen } from "@testing-library/react-native";

import { INITIAL_PORTFOLIO } from "../../../shared/member/model.portfolio-initial";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { TontineMembersScreen } from "./screen.tontine-members";

jest.mock("expo-router", () => ({ router: { back: jest.fn(), push: jest.fn() } }));

describe("TontineMembersScreen", () => {
  beforeEach(() => {
    usePortfolioStore.setState({ ...INITIAL_PORTFOLIO });
  });

  it("liste tous les membres avec leurs tours", async () => {
    await renderWithSafeArea(<TontineMembersScreen id="1" />);

    expect(screen.getByRole("header", { name: "Membres" })).toBeOnTheScreen();
    expect(screen.getByText("Tontine du Marché Tolal")).toBeOnTheScreen();
    expect(screen.getByText("Mama Nadège")).toBeOnTheScreen();
    expect(screen.getByText(/Tours 2 et 3/)).toBeOnTheScreen();
  });

  it("filtre les membres en attente de cotisation", async () => {
    await renderWithSafeArea(<TontineMembersScreen id="1" />);

    await fireEvent.press(screen.getByRole("button", { name: /^En attente/ }));

    expect(screen.getByText("Clarisse Nzaba")).toBeOnTheScreen();
    expect(screen.queryByText("Mama Nadège")).toBeNull();
  });

  it("cherche un membre par son nom", async () => {
    await renderWithSafeArea(<TontineMembersScreen id="1" />);

    await fireEvent.changeText(screen.getByPlaceholderText("Rechercher un membre"), "leonie");

    expect(screen.getByText("Léonie Bantsimba")).toBeOnTheScreen();
    expect(screen.queryByText("Mama Nadège")).toBeNull();
  });

  it("explique une recherche sans résultat", async () => {
    await renderWithSafeArea(<TontineMembersScreen id="1" />);

    await fireEvent.changeText(screen.getByPlaceholderText("Rechercher un membre"), "zzz");

    expect(screen.getByText("Aucun membre trouvé")).toBeOnTheScreen();
  });

  it("ouvre l'historique d'un membre", async () => {
    await renderWithSafeArea(<TontineMembersScreen id="1" />);

    await fireEvent.press(screen.getByRole("button", { name: "Historique de Serge Makosso" }));

    expect(await screen.findByRole("header", { name: "Serge Makosso" })).toBeOnTheScreen();
  });

  it("signale une tontine introuvable", async () => {
    await renderWithSafeArea(<TontineMembersScreen id="absente" />);

    expect(screen.getByText("Tontine introuvable")).toBeOnTheScreen();
  });
});
