import { screen } from "@testing-library/react-native";

import { useMoneyFlightStore } from "../../../shared/feedback/store.money-flight";
import { makeCard } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { SavingsRecapCard } from "./card.savings-recap";

describe("SavingsRecapCard", () => {
  it("réunit le montant actuel, l'objectif et le statut de progression", async () => {
    await renderWithSafeArea(<SavingsRecapCard item={makeCard()} tontineName={null} />);

    expect(screen.getByText("Montant actuel")).toBeOnTheScreen();
    expect(screen.getByText(/20 000/)).toBeOnTheScreen();
    expect(screen.getByText("Objectif : 30 000 FCFA")).toBeOnTheScreen();
    expect(screen.getByText("En cours")).toBeOnTheScreen();
    expect(screen.getByText("4 sur 6 pointages")).toBeOnTheScreen();
  });

  it("reçoit l'argent de chaque pointage sur le montant actuel", async () => {
    useMoneyFlightStore.setState({ measureTarget: null });
    await renderWithSafeArea(<SavingsRecapCard item={makeCard()} tontineName={null} />);

    expect(useMoneyFlightStore.getState().measureTarget).not.toBeNull();
  });

  it("détaille le reste, la création et l'échéance, sans frais", async () => {
    await renderWithSafeArea(<SavingsRecapCard item={makeCard()} tontineName={null} />);

    expect(screen.getByText("Reste à épargner")).toBeOnTheScreen();
    expect(screen.getByText("10 000 FCFA")).toBeOnTheScreen();
    expect(screen.queryByText(/Frais/)).toBeNull();
    expect(screen.getByText("Créée le")).toBeOnTheScreen();
    expect(screen.getByText("1 novembre 2026")).toBeOnTheScreen();
    expect(screen.getByText("Échéance")).toBeOnTheScreen();
    expect(screen.getByText("31 décembre 2026")).toBeOnTheScreen();
  });

  it("nomme la tontine liée quand la carte en a une", async () => {
    await renderWithSafeArea(
      <SavingsRecapCard item={makeCard({ tontineId: "t1" })} tontineName="Tontine du Marché" />,
    );

    expect(screen.getByText("Tontine liée")).toBeOnTheScreen();
    expect(screen.getByText("Tontine du Marché")).toBeOnTheScreen();
  });

  it("masque la tontine quand la carte est indépendante", async () => {
    await renderWithSafeArea(<SavingsRecapCard item={makeCard()} tontineName={null} />);

    expect(screen.queryByText("Tontine liée")).not.toBeOnTheScreen();
  });

  it("sépare chaque ligne d'information par un trait", async () => {
    await renderWithSafeArea(<SavingsRecapCard item={makeCard()} tontineName={null} />);

    expect(screen.getAllByTestId("recap-fact-divider")).toHaveLength(2);
  });

  it("pose une petite icône devant chaque ligne d'information", async () => {
    await renderWithSafeArea(
      <SavingsRecapCard item={makeCard({ tontineId: "t1" })} tontineName="Tontine du Marché" />,
    );

    for (const kind of ["remaining", "created", "deadline", "tontine"]) {
      expect(screen.getByTestId(`recap-fact-icon-${kind}`)).toBeOnTheScreen();
    }
  });

  it("sépare aussi la tontine liée des autres lignes", async () => {
    await renderWithSafeArea(
      <SavingsRecapCard item={makeCard({ tontineId: "t1" })} tontineName="Tontine du Marché" />,
    );

    expect(screen.getAllByTestId("recap-fact-divider")).toHaveLength(3);
  });

  it("détaille l'objectif, le montant et la fréquence sous le montant actuel", async () => {
    await renderWithSafeArea(<SavingsRecapCard item={makeCard()} tontineName={null} />);

    expect(screen.getByText(/Fréquence :/)).toBeOnTheScreen();
    expect(screen.getByText("chaque semaine", { exact: false })).toBeOnTheScreen();
    expect(screen.getByText(/Montant :/)).toBeOnTheScreen();
  });

  it("texture la carte d'un grain proche de sa couleur", async () => {
    await renderWithSafeArea(<SavingsRecapCard item={makeCard()} tontineName={null} />);

    expect(screen.getByTestId("noise-pattern")).toBeOnTheScreen();
  });
});
