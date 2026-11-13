import { act, fireEvent, screen } from "@testing-library/react-native";

import { SELF_MEMBER_ID } from "../../../shared/member/model.portfolio";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { firstOf, makeMember, makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { useCelebrationStore } from "../../../shared/feedback/store.celebration";
import { useMoneyFlightStore } from "../../../shared/feedback/store.money-flight";
import { useToastStore } from "../../../shared/feedback/store.toast";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { TontineDetailScreen } from "./screen.tontine-detail";
import { SIMULATED_CONFIRMATION_MS } from "../../payments";

jest.mock("../../auth", () => {
  const { Pressable, Text } = jest.requireActual("react-native");

  return {
    PinConfirm: ({ onConfirmed }: { onConfirmed: () => void }) => (
      <Pressable accessibilityRole="button" accessibilityLabel="Code juste" onPress={onConfirmed}>
        <Text>Pavé du code PIN</Text>
      </Pressable>
    ),
  };
});

describe("TontineDetailScreen", () => {
  beforeEach(() => {
    usePortfolioStore.getState().reset();
  });

  it("affiche la tontine demandée", async () => {
    await renderWithSafeArea(<TontineDetailScreen id="1" />);

    expect(screen.getByRole("header", { name: "Tontine du Marché Tolal" })).toBeOnTheScreen();
    expect(screen.getAllByText(/5 000/).length).toBeGreaterThan(0);
    expect(screen.getByText("Membres : ")).toBeOnTheScreen();
  });

  it("s'ouvre sur la feuille « Cotiser » depuis la notification de cotisation", async () => {
    await renderWithSafeArea(<TontineDetailScreen id="2" focus={{ pay: true, memberId: null }} />);

    expect(await screen.findByRole("header", { name: "Cotiser" })).toBeOnTheScreen();
  });

  it("s'ouvre sur la fiche du membre dont parle la notification", async () => {
    await renderWithSafeArea(<TontineDetailScreen id="1" focus={{ pay: false, memberId: "m9" }} />);

    expect(await screen.findByRole("header", { name: "David Nkodia" })).toBeOnTheScreen();
  });

  it("affiche le cycle et le bénéficiaire", async () => {
    await renderWithSafeArea(<TontineDetailScreen id="1" />);

    expect(screen.getByText("En cours")).toBeOnTheScreen();
    expect(screen.getByText("Tour 4 sur 10")).toBeOnTheScreen();
    expect(screen.getAllByText("Mama Nadège").length).toBeGreaterThan(0);
  });

  it("propose de cotiser d'avance quand la cotisation est réglée mais que le tour n'est pas complet", async () => {
    await renderWithSafeArea(<TontineDetailScreen id="1" />);

    expect(screen.getByRole("button", { name: /^Cotiser d'avance/ })).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: "Confirmer la restourne" })).not.toBeOnTheScreen();
  });

  it("cotise depuis le dock par Airtel Money, validé sur le téléphone", async () => {
    useMoneyFlightStore.setState({ flight: null });
    useCelebrationStore.setState({ burst: null });
    await renderWithSafeArea(<TontineDetailScreen id="2" />);

    await fireEvent.press(screen.getByRole("button", { name: /^Cotiser/ }));
    jest.useFakeTimers();
    await fireEvent.press(screen.getByRole("button", { name: "Payer avec Airtel Money" }));
    await act(async () => {
      jest.advanceTimersByTime(SIMULATED_CONFIRMATION_MS);
    });

    expect(useToastStore.getState().toast?.message).toBe("Cotisation réglée par Airtel Money.");
    expect(
      firstOf(usePortfolioStore.getState().tontines.filter((item) => item.id === "2")).members.find(
        (member) => member.id === SELF_MEMBER_ID,
      )?.paidCurrentRound,
    ).toBe(true);
    expect(useMoneyFlightStore.getState().flight).not.toBeNull();
    expect(useCelebrationStore.getState().burst).toBeNull();
  });

  it("demande confirmation avant de verser la restourne du tour", async () => {
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

    await fireEvent.press(screen.getByRole("button", { name: "Confirmer la restourne" }));
    expect(
      await screen.findByRole("header", { name: "Confirmer la restourne ?" }),
    ).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole("button", { name: "Confirmer" }));

    expect(useToastStore.getState().toast?.message).toBe(
      "Restourne confirmée : elle est versée au membre dont c'est le tour.",
    );
    expect(firstOf(usePortfolioStore.getState().tontines).round).toBe(2);
  });

  it("ne propose plus de partager ni d'inviter une fois la tontine lancée", async () => {
    await renderWithSafeArea(<TontineDetailScreen id="1" />);

    expect(screen.queryByRole("button", { name: "Partager l'invitation" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Ajouter un membre" })).toBeNull();
  });

  it("garde un seul bouton d'ajout dans l'en-tête tant qu'il manque des membres", async () => {
    usePortfolioStore.setState({
      tontines: [makeTontine({ state: "PENDING", members: [makeMember(SELF_MEMBER_ID, "ADMIN")] })],
    });
    await renderWithSafeArea(<TontineDetailScreen id="t1" />);

    expect(screen.getAllByRole("button", { name: "Ajouter un membre" })).toHaveLength(1);
    expect(screen.queryByRole("button", { name: "Partager l'invitation" })).toBeNull();
  });

  it("ouvre les réglages de l'administrateur depuis « Plus d'options »", async () => {
    await renderWithSafeArea(<TontineDetailScreen id="1" />);

    await fireEvent.press(screen.getByRole("button", { name: "Plus d'options" }));
    await fireEvent.changeText(screen.getByLabelText("Nom"), "Tontine du Grand Marché");
    await fireEvent.press(screen.getByRole("button", { name: "Enregistrer" }));

    expect(screen.getByRole("header", { name: "Tontine du Grand Marché" })).toBeOnTheScreen();
  });

  it("affiche un état vide quand la tontine n'existe pas", async () => {
    await renderWithSafeArea(<TontineDetailScreen id="inconnue" />);

    expect(screen.getByText("Tontine introuvable")).toBeOnTheScreen();
  });
});

afterEach(() => {
  jest.useRealTimers();
});
