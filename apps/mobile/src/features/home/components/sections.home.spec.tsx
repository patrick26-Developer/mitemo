import { fireEvent, screen } from "@testing-library/react-native";

import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { makeCard, makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { HomeSections } from "./sections.home";

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));

describe("HomeSections", () => {
  beforeEach(() => {
    usePortfolioStore.getState().reset();
  });

  it("masque la section des cartes quand aucune carte n'est active", async () => {
    usePortfolioStore.setState({
      tontines: [makeTontine({ name: "Tontine du marché" })],
      cards: [],
    });
    await renderWithSafeArea(<HomeSections />);

    expect(screen.getByRole("button", { name: "1 Tontine active" })).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: /Cartes? actives?/ })).toBeNull();
  });

  it("masque la section des tontines quand aucune tontine n'est lancée", async () => {
    usePortfolioStore.setState({
      tontines: [makeTontine({ state: "PENDING" })],
      cards: [makeCard()],
    });
    await renderWithSafeArea(<HomeSections />);

    expect(screen.queryByRole("button", { name: /Tontines? actives?$/ })).toBeNull();
    expect(screen.getByRole("button", { name: "1 Carte active" })).toBeOnTheScreen();
  });

  it("limite l'aperçu à quelques tontines, avec le total des actives et un indicateur", async () => {
    const tontines = Array.from({ length: 7 }, (_, index) =>
      makeTontine({ id: `t${index}`, name: `Tontine ${index + 1}` }),
    );
    usePortfolioStore.setState({ tontines, cards: [] });
    await renderWithSafeArea(<HomeSections />);

    expect(screen.getByRole("button", { name: "7 Tontines actives" })).toBeOnTheScreen();
    expect(screen.getByText("Tontine 5")).toBeOnTheScreen();
    expect(screen.queryByText("Tontine 6")).toBeNull();
    expect(screen.getAllByTestId(/^page-dot-/)).toHaveLength(5);
  });

  it("invite à créer quand rien n'est actif, puis ouvre le formulaire choisi", async () => {
    usePortfolioStore.setState({ tontines: [], cards: [] });
    await renderWithSafeArea(<HomeSections />);

    expect(screen.getByTestId("mitemo-logo")).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "Créer" }));
    await fireEvent.press(screen.getByRole("button", { name: /^Une tontine/ }));

    expect(screen.getByRole("progressbar", { name: /Étape 1 sur 4/ })).toBeOnTheScreen();
  });

  it("ouvre la création d'une carte de pointage depuis le même choix", async () => {
    usePortfolioStore.setState({ tontines: [], cards: [] });
    await renderWithSafeArea(<HomeSections />);

    await fireEvent.press(screen.getByRole("button", { name: "Créer" }));
    await fireEvent.press(screen.getByRole("button", { name: /^Une carte de pointage/ }));

    expect(screen.getByRole("progressbar", { name: /Étape 1 sur 2/ })).toBeOnTheScreen();
  });
});
