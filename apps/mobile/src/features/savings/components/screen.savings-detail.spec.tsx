import { act, fireEvent, screen } from "@testing-library/react-native";

import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import {
  firstOf,
  makeCard,
  makeMember,
  makeTontine,
} from "../../../shared/testing/fixtures.portfolio";
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

    expect(screen.getByRole("button", { name: "Pointer 5 000 FCFA" })).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: "Retirer" })).not.toBeOnTheScreen();
  });

  it("pointe par l'opérateur choisi, puis l'inscrit dans l'historique", async () => {
    await renderWithSafeArea(<SavingsDetailScreen id="1" />);

    await fireEvent.press(screen.getByRole("button", { name: "Pointer 5 000 FCFA" }));
    jest.useFakeTimers();
    await fireEvent.press(screen.getByRole("button", { name: "Payer avec Airtel Money" }));
    await act(async () => {
      jest.advanceTimersByTime(SIMULATED_CONFIRMATION_MS);
    });

    expect(useToastStore.getState().toast?.message).toBe("Pointage réglé par Airtel Money.");
    const card = firstOf(usePortfolioStore.getState().cards);
    expect(card.saved).toBe(25_000n);
    expect(card.entries.at(-1)?.method).toBe("AIRTEL_MONEY");
  });

  it("annonce en toast un solde Mitemo insuffisant", async () => {
    usePortfolioStore.setState({ available: 0n });
    await renderWithSafeArea(<SavingsDetailScreen id="1" />);

    await fireEvent.press(screen.getByRole("button", { name: "Pointer 5 000 FCFA" }));
    await fireEvent.press(screen.getByRole("button", { name: "Payer avec Mitemo" }));
    await fireEvent.press(screen.getByRole("button", { name: "Code juste" }));

    expect(useToastStore.getState().toast?.kind).toBe("error");
    expect(firstOf(usePortfolioStore.getState().cards).saved).toBe(20_000n);
  });

  it("demande confirmation avant de retirer l'épargne d'une carte remplie", async () => {
    usePortfolioStore.setState({
      cards: [makeCard({ id: "c1", saved: 30_000n, state: "COMPLETED" })],
    });
    await renderWithSafeArea(<SavingsDetailScreen id="c1" />);

    await fireEvent.press(screen.getByRole("button", { name: "Retirer" }));
    expect(await screen.findByRole("header", { name: "Retirer l'épargne ?" })).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole("button", { name: "Retirer l'épargne" }));

    expect(useToastStore.getState().toast?.message).toBe(
      "L'épargne a rejoint votre solde disponible.",
    );
    expect(firstOf(usePortfolioStore.getState().cards).state).toBe("ARCHIVED");
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

    expect(useToastStore.getState().toast?.message).toBe("Cotisation de la tontine réglée.");
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
