import { act, fireEvent, screen } from "@testing-library/react-native";

import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import {
  firstOf,
  makeCard,
  makeMember,
  makeTontine,
} from "../../../shared/testing/fixtures.portfolio";
import { useCelebrationStore } from "../../../shared/feedback/store.celebration";
import { useMoneyFlightStore } from "../../../shared/feedback/store.money-flight";
import { useToastStore } from "../../../shared/feedback/store.toast";
import { renderWithSafeArea } from "../../../shared/testing/util.render-with-safe-area";
import { SELF_MEMBER_ID } from "../../../shared/member/model.portfolio";
import { SavingsDetailScreen } from "./screen.savings-detail";
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

describe("SavingsDetailScreen", () => {
  beforeEach(() => {
    usePortfolioStore.getState().reset();
  });

  it("montre l'assiduité façon GitHub une fois l'échéance passée", async () => {
    usePortfolioStore.setState({
      cards: [makeCard({ startDate: "2020-01-06", deadline: "2020-02-10", markersTotal: 5 })],
    });
    await renderWithSafeArea(<SavingsDetailScreen id="c1" />);

    expect(screen.getByText("Assiduité")).toBeOnTheScreen();
    expect(screen.getAllByTestId(/^contribution-level-/)).toHaveLength(5);
  });

  it("garde la grille d'assiduité cachée avant l'échéance", async () => {
    usePortfolioStore.setState({ cards: [makeCard({ deadline: "2999-12-31" })] });
    await renderWithSafeArea(<SavingsDetailScreen id="c1" />);

    expect(screen.queryByText("Assiduité")).toBeNull();
  });

  it("affiche la carte demandée", async () => {
    await renderWithSafeArea(<SavingsDetailScreen id="1" />);

    expect(screen.getByRole("header", { name: "Loyer de Janvier" })).toBeOnTheScreen();
    expect(screen.getByText(/20 000/)).toBeOnTheScreen();
    expect(screen.getByText(/30 000 FCFA/)).toBeOnTheScreen();
  });

  it("s'ouvre sur le pointage depuis la notification de la carte", async () => {
    await renderWithSafeArea(<SavingsDetailScreen id="1" focus={{ pay: true, memberId: null }} />);

    expect(await screen.findByRole("header", { name: "Pointer" })).toBeOnTheScreen();
  });

  it("affiche l'échéance et le reste à épargner", async () => {
    await renderWithSafeArea(<SavingsDetailScreen id="1" />);

    expect(screen.getByText("31 décembre 2026")).toBeOnTheScreen();
    expect(screen.getByText("10 000 FCFA")).toBeOnTheScreen();
  });

  it("propose de pointer, sans retrait tant que la carte n'est pas remplie", async () => {
    await renderWithSafeArea(<SavingsDetailScreen id="1" />);

    expect(screen.getByRole("button", { name: "Pointer 5 500 FCFA" })).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: "Retirer" })).not.toBeOnTheScreen();
  });

  it("pointe par l'opérateur choisi, puis l'inscrit dans l'historique", async () => {
    useMoneyFlightStore.setState({ flight: null });
    useCelebrationStore.setState({ burst: null });
    await renderWithSafeArea(<SavingsDetailScreen id="1" />);

    await fireEvent.press(screen.getByRole("button", { name: "Pointer 5 500 FCFA" }));
    jest.useFakeTimers();
    await fireEvent.press(screen.getByRole("button", { name: "Payer avec Airtel Money" }));
    await act(async () => {
      jest.advanceTimersByTime(SIMULATED_CONFIRMATION_MS);
    });

    expect(useToastStore.getState().toast?.message).toBe("Pointage réglé par Airtel Money.");
    const card = firstOf(usePortfolioStore.getState().cards);
    expect(card.saved).toBe(25_000n);
    expect(card.entries.at(-1)?.method).toBe("AIRTEL_MONEY");
    expect(useMoneyFlightStore.getState().flight?.amount).toBe(5_500n);
    expect(useCelebrationStore.getState().burst).toBeNull();
  });

  it("annonce en toast un solde Mitemo insuffisant", async () => {
    usePortfolioStore.setState({ available: 0n });
    await renderWithSafeArea(<SavingsDetailScreen id="1" />);

    await fireEvent.press(screen.getByRole("button", { name: "Pointer 5 500 FCFA" }));
    await fireEvent.press(screen.getByRole("button", { name: "Payer avec Mitemo" }));
    await fireEvent.press(screen.getByRole("button", { name: "Code juste" }));

    expect(useToastStore.getState().toast?.kind).toBe("error");
    expect(firstOf(usePortfolioStore.getState().cards).saved).toBe(20_000n);
  });

  it("retire l'épargne d'une carte remplie vers le solde Mitemo, une fois le code PIN saisi", async () => {
    usePortfolioStore.setState({
      cards: [makeCard({ id: "c1", saved: 30_000n, state: "COMPLETED" })],
    });
    await renderWithSafeArea(<SavingsDetailScreen id="c1" />);

    await fireEvent.press(screen.getByRole("button", { name: "Retirer" }));
    await fireEvent.press(screen.getByRole("button", { name: "Retirer vers Mitemo" }));
    await fireEvent.press(screen.getByRole("button", { name: "Code juste" }));

    expect(useToastStore.getState().toast?.message).toBe(
      "L'épargne a rejoint votre solde disponible.",
    );
    expect(firstOf(usePortfolioStore.getState().cards).state).toBe("ARCHIVED");
  });

  it("retire l'épargne vers MTN MoMo sans la verser au solde", async () => {
    usePortfolioStore.setState({
      available: 0n,
      cards: [makeCard({ id: "c1", saved: 30_000n, state: "COMPLETED" })],
    });
    await renderWithSafeArea(<SavingsDetailScreen id="c1" />);

    await fireEvent.press(screen.getByRole("button", { name: "Retirer" }));
    await fireEvent.press(screen.getByRole("button", { name: "Retirer vers MTN MoMo" }));
    await fireEvent.press(screen.getByRole("button", { name: "Code juste" }));

    expect(useToastStore.getState().toast?.message).toMatch(
      /^Retrait de 30.000 FCFA vers MTN MoMo lancé\.$/,
    );
    expect(usePortfolioStore.getState().available).toBe(0n);
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

    expect(useToastStore.getState().toast?.message).toBe(
      "Cotisation réglée : la carte repart sur une copie neuve.",
    );
    expect(firstOf(usePortfolioStore.getState().tontines).members[0]?.paidCurrentRound).toBe(true);
  });

  it("affiche un état vide quand la carte n'existe pas", async () => {
    await renderWithSafeArea(<SavingsDetailScreen id="inconnue" />);

    expect(screen.getByText("Carte introuvable")).toBeOnTheScreen();
  });
});

afterEach(() => {
  jest.useRealTimers();
});
