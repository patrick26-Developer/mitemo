import { fireEvent, screen } from "@testing-library/react-native";

import { SELF_MEMBER_ID } from "../../../shared/member/model.portfolio";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { firstOf, makeMember, makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { TontineDetailScreen } from "./screen.tontine-detail";

describe("TontineDetailScreen", () => {
  beforeEach(() => {
    usePortfolioStore.getState().reset();
  });

  it("affiche la tontine demandée", async () => {
    await renderWithSafeArea(<TontineDetailScreen id="1" />);

    expect(screen.getByRole("header", { name: "Tontine du Marché Tolal" })).toBeOnTheScreen();
    expect(screen.getAllByText(/5 000/).length).toBeGreaterThan(0);
    expect(screen.getByText("10 membres")).toBeOnTheScreen();
  });

  it("affiche le cycle et le bénéficiaire", async () => {
    await renderWithSafeArea(<TontineDetailScreen id="1" />);

    expect(screen.getByText("Cycle en cours")).toBeOnTheScreen();
    expect(screen.getByText("4 sur 10")).toBeOnTheScreen();
    expect(screen.getAllByText("Mama Nadège").length).toBeGreaterThan(0);
  });

  it("propose de transférer depuis le dock, sans cotisation déjà réglée", async () => {
    await renderWithSafeArea(<TontineDetailScreen id="1" />);

    expect(screen.getByRole("button", { name: "Transférer" })).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: /Cotiser/ })).not.toBeOnTheScreen();
  });

  it("cotise depuis le dock quand la cotisation est due", async () => {
    await renderWithSafeArea(<TontineDetailScreen id="2" />);

    await fireEvent.press(screen.getByRole("button", { name: "Cotiser 10 000 FCFA" }));

    expect(await screen.findByText("Cotisation réglée pour ce tour.")).toBeOnTheScreen();
    expect(
      firstOf(usePortfolioStore.getState().tontines.filter((item) => item.id === "2")).members.find(
        (member) => member.id === SELF_MEMBER_ID,
      )?.paidCurrentRound,
    ).toBe(true);
  });

  it("demande confirmation avant de recevoir la cagnotte", async () => {
    usePortfolioStore.setState({
      tontines: [
        makeTontine({
          id: "t1",
          round: 1,
          totalRounds: 3,
          beneficiaryId: SELF_MEMBER_ID,
          members: [makeMember(SELF_MEMBER_ID, "ADMIN", true), makeMember("m2", "MEMBRE", true)],
        }),
      ],
    });
    await renderWithSafeArea(<TontineDetailScreen id="t1" />);

    await fireEvent.press(screen.getByRole("button", { name: "Retirer la cagnotte" }));
    expect(await screen.findByRole("header", { name: "Recevoir la cagnotte ?" })).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole("button", { name: "Recevoir" }));

    expect(await screen.findByText("Cagnotte versée sur votre solde.")).toBeOnTheScreen();
    expect(firstOf(usePortfolioStore.getState().tontines).round).toBe(2);
  });

  it("ouvre la feuille de transfert depuis le dock", async () => {
    await renderWithSafeArea(<TontineDetailScreen id="1" />);

    await fireEvent.press(screen.getByRole("button", { name: "Transférer" }));

    expect(await screen.findByRole("header", { name: "Transférer à un membre" })).toBeOnTheScreen();
  });

  it("crée un code d'invitation pour l'administrateur", async () => {
    await renderWithSafeArea(<TontineDetailScreen id="1" />);

    await fireEvent.press(screen.getByRole("button", { name: "Créer un code d'invitation" }));

    expect(await screen.findByText("Code d'invitation prêt à partager.")).toBeOnTheScreen();
    expect(screen.queryByText("Régénérer le code")).not.toBeOnTheScreen();
    expect(
      screen.queryByRole("button", { name: "Créer un code d'invitation" }),
    ).not.toBeOnTheScreen();
  });

  it("affiche un état vide quand la tontine n'existe pas", async () => {
    await renderWithSafeArea(<TontineDetailScreen id="inconnue" />);

    expect(screen.getByText("Tontine introuvable")).toBeOnTheScreen();
  });
});
