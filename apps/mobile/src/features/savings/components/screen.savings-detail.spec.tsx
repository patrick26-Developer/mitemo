import { fireEvent, screen } from "@testing-library/react-native";

import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import {
  firstOf,
  makeCard,
  makeMember,
  makeTontine,
} from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { SELF_MEMBER_ID } from "../../../shared/member/model.portfolio";
import { SavingsDetailScreen } from "./screen.savings-detail";

describe("SavingsDetailScreen", () => {
  beforeEach(() => {
    usePortfolioStore.getState().reset();
  });

  it("affiche la carte demandée", async () => {
    await renderWithSafeArea(<SavingsDetailScreen id="1" />);

    expect(screen.getByRole("header", { name: "Loyer de Janvier" })).toBeOnTheScreen();
    expect(screen.getByText(/20 000/)).toBeOnTheScreen();
    expect(screen.getByText(/30 000 FCFA/)).toBeOnTheScreen();
  });

  it("affiche l'échéance et le reste à épargner", async () => {
    await renderWithSafeArea(<SavingsDetailScreen id="1" />);

    expect(screen.getByText("31 décembre 2026")).toBeOnTheScreen();
    expect(screen.getByText("10 000 FCFA")).toBeOnTheScreen();
  });

  it("propose de pointer et de retirer depuis le dock", async () => {
    await renderWithSafeArea(<SavingsDetailScreen id="1" />);

    expect(screen.getByRole("button", { name: "Pointer 5 000 FCFA" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Retirer" })).toBeOnTheScreen();
  });

  it("ajoute un marqueur et confirme l'opération dans le dock", async () => {
    await renderWithSafeArea(<SavingsDetailScreen id="1" />);

    await fireEvent.press(screen.getByRole("button", { name: "Pointer 5 000 FCFA" }));

    expect(await screen.findByText("Un marqueur a été ajouté.")).toBeOnTheScreen();
    expect(firstOf(usePortfolioStore.getState().cards).saved).toBe(25_000n);
  });

  it("demande confirmation avant de retirer l'épargne", async () => {
    await renderWithSafeArea(<SavingsDetailScreen id="1" />);

    await fireEvent.press(screen.getByRole("button", { name: "Retirer" }));
    expect(await screen.findByRole("header", { name: "Retirer l'épargne ?" })).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole("button", { name: "Retirer l'épargne" }));

    expect(
      await screen.findByText("L'épargne a rejoint votre solde disponible."),
    ).toBeOnTheScreen();
    expect(firstOf(usePortfolioStore.getState().cards).saved).toBe(0n);
  });

  it("ne propose pas de régler une cotisation déjà payée", async () => {
    await renderWithSafeArea(<SavingsDetailScreen id="1" />);

    expect(screen.queryByRole("button", { name: "Régler la cotisation" })).not.toBeOnTheScreen();
  });

  it("règle la cotisation de la tontine depuis le contenu", async () => {
    const tontine = makeTontine({
      id: "t1",
      members: [makeMember(SELF_MEMBER_ID, "ADMIN", false), makeMember("m2", "MEMBRE", true)],
    });
    usePortfolioStore.setState({
      available: 0n,
      tontines: [tontine],
      cards: [makeCard({ id: "c1", tontineId: "t1", saved: 20_000n })],
    });
    await renderWithSafeArea(<SavingsDetailScreen id="c1" />);

    await fireEvent.press(screen.getByRole("button", { name: "Régler la cotisation" }));

    expect(await screen.findByText("Cotisation de la tontine réglée.")).toBeOnTheScreen();
    expect(firstOf(usePortfolioStore.getState().tontines).members[0]?.paidCurrentRound).toBe(true);
  });

  it("affiche un état vide quand la carte n'existe pas", async () => {
    await renderWithSafeArea(<SavingsDetailScreen id="inconnue" />);

    expect(screen.getByText("Carte introuvable")).toBeOnTheScreen();
  });
});
