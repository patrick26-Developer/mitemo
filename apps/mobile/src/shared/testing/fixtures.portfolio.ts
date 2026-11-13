import type { SavingsCard, Tontine, TontineMember } from "../member/model.portfolio";
import { SELF_MEMBER_ID } from "../member/model.portfolio";
import type { PortfolioContext, PortfolioState } from "../member/model.portfolio-actions";
import { createPortfolioActions } from "../member/model.portfolio-actions";

/**
 * Construit un membre de tontine pour les tests.
 * @param id Identifiant du membre.
 * @param role Rôle dans la tontine.
 * @param paid `true` quand la cotisation du tour est réglée.
 * @returns Le membre prêt à être utilisé, avec un seul tour.
 */
export function makeMember(id: string, role: "ADMIN" | "MEMBRE", paid = false): TontineMember {
  return { id, name: `Membre ${id}`, role, paidCurrentRound: paid, turns: 1 };
}

/** Membres par défaut : le membre connecté administrateur et deux invités. */
const DEFAULT_MEMBERS: readonly TontineMember[] = [
  makeMember(SELF_MEMBER_ID, "ADMIN"),
  makeMember("m2", "MEMBRE"),
  makeMember("m3", "MEMBRE"),
];

/**
 * Construit une tontine de test autour du membre connecté.
 * @param over Valeurs à remplacer.
 * @returns La tontine complète.
 */
export function makeTontine(over: Partial<Tontine> = {}): Tontine {
  return {
    id: "t1",
    name: "Tontine de test",
    contribution: 5_000n,
    frequency: { unit: "semaine", interval: 1 },
    round: 1,
    totalRounds: 3,
    state: "ACTIVE",
    members: DEFAULT_MEMBERS,
    beneficiaryId: "m2",
    description: "Une tontine de test.",
    headerColors: ["#2CCA86", "#62F79D"],
    invitationCode: null,
    invitations: [],
    ...over,
  };
}

/**
 * Construit une carte de pointage de test.
 * @param over Valeurs à remplacer.
 * @returns La carte complète.
 */
export function makeCard(over: Partial<SavingsCard> = {}): SavingsCard {
  return {
    id: "c1",
    name: "Carte de test",
    goal: 30_000n,
    markerAmount: 5_000n,
    markersTotal: 6,
    frequency: { unit: "semaine", interval: 1 },
    startDate: "2026-11-01",
    saved: 20_000n,
    deadline: "2030-12-31",
    tint: "#CFD8FF",
    state: "ACTIVE",
    description: "Une carte de test.",
    tontineId: null,
    fee: 3_000n,
    entries: [],
    ...over,
  };
}

/**
 * Renvoie le premier élément d'une liste, en refusant une liste vide.
 * @param items Liste non vide attendue.
 * @returns Le premier élément.
 */
export function firstOf<Item>(items: readonly Item[]): Item {
  const [first] = items;
  if (first === undefined) throw new Error("Liste vide.");
  return first;
}

/** Portefeuille de test, avec un solde et des entités maîtrisés. */
export const TEST_PORTFOLIO = {
  available: 20_000n,
  tontines: [makeTontine()],
  cards: [makeCard()],
  invitations: [],
} as const;

/**
 * Branche les opérations du portefeuille sur un état local en mémoire.
 * @param initial État de départ.
 * @returns Les actions et l'accès à l'état courant.
 */
export function makePortfolio(
  initial: Pick<PortfolioState, "available" | "tontines" | "cards" | "invitations">,
) {
  let state = initial;
  const context: PortfolioContext = {
    get: () => state as PortfolioState,
    set: (update) => {
      const patch = typeof update === "function" ? update(state as PortfolioState) : update;
      state = { ...state, ...patch };
    },
  };

  return { actions: createPortfolioActions(context), state: () => state };
}
