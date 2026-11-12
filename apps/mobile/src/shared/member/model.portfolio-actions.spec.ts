import { canPayContribution, SELF_MEMBER_ID } from "./model.portfolio";
import type { CreateCardInput, CreateTontineInput } from "./model.portfolio-create";
import { ForbiddenOperationError, InsufficientFundsError } from "./model.portfolio-error";
import { INITIAL_PORTFOLIO } from "./model.portfolio-initial";
import {
  firstOf,
  makeCard,
  makeMember,
  makePortfolio,
  makeTontine,
  TEST_PORTFOLIO,
} from "../testing/fixtures.portfolio";

describe("createTontine", () => {
  it("ajoute la tontine en tête, administrée par le membre connecté", () => {
    const { actions, state } = makePortfolio(TEST_PORTFOLIO);
    const input: CreateTontineInput = {
      name: "Nouvelle tontine",
      contribution: 10_000n,
      frequency: { unit: "mois", interval: 1 },
      participantCount: 3,
      description: "Créée depuis les tests.",
    };

    const created = actions.createTontine(input);

    expect(created).toBe(state().tontines[0]);
    expect(state().tontines).toHaveLength(2);
    expect(state().tontines[0]?.name).toBe("Nouvelle tontine");
    expect(state().tontines[0]?.members).toHaveLength(1);
    expect(state().tontines[0]?.members[0]?.role).toBe("ADMIN");
    expect(state().tontines[0]?.totalRounds).toBe(3);
    expect(state().tontines[0]?.state).toBe("PENDING");
  });
});

describe("createCard", () => {
  it("ajoute la carte en tête, rattachée à la tontine choisie", () => {
    const { actions, state } = makePortfolio(TEST_PORTFOLIO);
    const input: CreateCardInput = {
      name: "Nouvelle carte",
      goal: 10_000n,
      markerAmount: 2_000n,
      markersTotal: 5,
      frequency: { unit: "mois", interval: 1 },
      startDate: "2026-11-01",
      deadline: "2027-01-31",
      tontineId: "t1",
      description: "Créée depuis les tests.",
    };

    actions.createCard(input);

    expect(state().cards[0]?.name).toBe("Nouvelle carte");
    expect(state().cards[0]?.tontineId).toBe("t1");
    expect(state().cards[0]?.saved).toBe(0n);
    expect(state().cards[0]?.fee).toBe(1_000n);
    expect(state().cards[0]?.entries).toEqual([]);
  });
});

describe("contributeTontine", () => {
  it("marque la cotisation réglée, payée par l'opérateur, sans toucher au solde de l'app", () => {
    const { actions, state } = makePortfolio(TEST_PORTFOLIO);

    actions.contributeTontine("t1");

    expect(state().available).toBe(TEST_PORTFOLIO.available);
    expect(canPayContribution(firstOf(state().tontines))).toBe(false);
  });

  it("accepte une cotisation même avec un solde vide", () => {
    const { actions, state } = makePortfolio({ ...TEST_PORTFOLIO, available: 0n });

    actions.contributeTontine("t1");

    expect(canPayContribution(firstOf(state().tontines))).toBe(false);
  });

  it("cotise le tour suivant d'avance quand le tour en cours est réglé", () => {
    const paid = makeTontine({ members: [makeMember(SELF_MEMBER_ID, "ADMIN", true)] });
    const { actions, state } = makePortfolio({ ...TEST_PORTFOLIO, tontines: [paid] });

    actions.contributeTontine("t1");

    expect(state().tontines[0]?.members[0]?.prepaidRounds).toBe(1);
  });

  it("refuse une cotisation quand tous les tours restants sont réglés", () => {
    const self = { ...makeMember(SELF_MEMBER_ID, "ADMIN", true), prepaidRounds: 2 };
    const paid = makeTontine({ members: [self] });
    const { actions } = makePortfolio({ ...TEST_PORTFOLIO, tontines: [paid] });

    expect(() => actions.contributeTontine("t1")).toThrow(ForbiddenOperationError);
  });
});

describe("inviteMember", () => {
  /** Tontine à lancer, où il manque encore deux membres. */
  const OPEN = makeTontine({ state: "PENDING", members: [makeMember(SELF_MEMBER_ID, "ADMIN")] });

  it("crée puis conserve le même code d'invitation", () => {
    const { actions, state } = makePortfolio({ ...TEST_PORTFOLIO, tontines: [OPEN] });

    const first = actions.inviteMember("t1");
    const second = actions.inviteMember("t1");

    expect(first).toHaveLength(6);
    expect(second).toBe(first);
    expect(state().tontines[0]?.invitationCode).toBe(first);
  });

  it("refuse l'invitation à un membre simple", () => {
    const simple = makeTontine({ members: [makeMember(SELF_MEMBER_ID, "MEMBRE")] });
    const { actions } = makePortfolio({ ...TEST_PORTFOLIO, tontines: [simple] });

    expect(() => actions.inviteMember("t1")).toThrow(ForbiddenOperationError);
  });

  it("refuse de partager une tontine lancée ou complète", () => {
    const full = makeTontine({ id: "t2", state: "PENDING" });
    const { actions } = makePortfolio({ ...TEST_PORTFOLIO, tontines: [makeTontine(), full] });

    expect(() => actions.inviteMember("t1")).toThrow(
      "Cette tontine n'accepte plus de nouveaux membres.",
    );
    expect(() => actions.inviteMember("t2")).toThrow(
      "Cette tontine n'accepte plus de nouveaux membres.",
    );
  });
});

describe("removeMember", () => {
  it("retire un autre membre de la tontine", () => {
    const { actions, state } = makePortfolio(TEST_PORTFOLIO);

    actions.removeMember("t1", "m2");

    expect(state().tontines[0]?.members.map((entry) => entry.id)).toEqual([SELF_MEMBER_ID, "m3"]);
  });

  it("refuse de retirer le membre connecté", () => {
    const { actions } = makePortfolio(TEST_PORTFOLIO);

    expect(() => actions.removeMember("t1", SELF_MEMBER_ID)).toThrow(ForbiddenOperationError);
  });
});

describe("contributeCard", () => {
  /** Pointage payé par Airtel Money. */
  const PAYMENT = { at: "2026-11-11T09:15:00.000Z", method: "AIRTEL_MONEY" } as const;

  it("ajoute un marqueur payé par Mobile Money sans toucher au solde Mitemo", () => {
    const { actions, state } = makePortfolio(TEST_PORTFOLIO);

    actions.contributeCard("c1", PAYMENT);

    expect(state().available).toBe(20_000n);
    expect(state().cards[0]?.saved).toBe(25_000n);
    expect(state().cards[0]?.entries).toEqual([
      { at: "2026-11-11T09:15:00.000Z", amount: 5_000n, method: "AIRTEL_MONEY" },
    ]);
  });

  it("refuse une carte clôturée", () => {
    const completed = makeCard({ state: "COMPLETED" });
    const { actions } = makePortfolio({ ...TEST_PORTFOLIO, cards: [completed] });

    expect(() => actions.contributeCard("c1", PAYMENT)).toThrow(ForbiddenOperationError);
  });

  it("débite le solde quand le marqueur est payé depuis Mitemo", () => {
    const { actions, state } = makePortfolio(TEST_PORTFOLIO);

    actions.contributeCard("c1", { ...PAYMENT, method: "MITEMO" });

    expect(state().available).toBe(15_000n);
    expect(state().cards[0]?.entries.at(-1)?.method).toBe("MITEMO");
  });

  it("refuse un paiement depuis Mitemo au-delà du solde", () => {
    const { actions } = makePortfolio({ ...TEST_PORTFOLIO, available: 1_000n });

    expect(() => actions.contributeCard("c1", { ...PAYMENT, method: "MITEMO" })).toThrow(
      InsufficientFundsError,
    );
  });
});

describe("withdrawCard", () => {
  it("verse l'épargne d'une carte remplie sur le solde et l'archive", () => {
    const full = makeCard({ saved: 30_000n, state: "COMPLETED" });
    const { actions, state } = makePortfolio({ ...TEST_PORTFOLIO, cards: [full] });

    actions.withdrawCard("c1");

    expect(state().available).toBe(50_000n);
    expect(state().cards[0]?.state).toBe("ARCHIVED");
  });

  it("refuse de retirer une carte dont l'objectif n'est pas atteint", () => {
    const { actions } = makePortfolio(TEST_PORTFOLIO);

    expect(() => actions.withdrawCard("c1")).toThrow(ForbiddenOperationError);
  });

  it("refuse de retirer deux fois une carte archivée", () => {
    const archived = makeCard({ saved: 30_000n, state: "ARCHIVED" });
    const { actions } = makePortfolio({ ...TEST_PORTFOLIO, cards: [archived] });

    expect(() => actions.withdrawCard("c1")).toThrow(ForbiddenOperationError);
  });

  it("refuse le retrait d'une carte vide", () => {
    const empty = makeCard({ saved: 0n });
    const { actions } = makePortfolio({ ...TEST_PORTFOLIO, cards: [empty] });

    expect(() => actions.withdrawCard("c1")).toThrow();
  });
});

describe("transferCardToTontine", () => {
  it("règle la cotisation avec l'épargne de la carte rattachée", () => {
    const linked = makeCard({ tontineId: "t1" });
    const { actions, state } = makePortfolio({ ...TEST_PORTFOLIO, cards: [linked] });

    actions.transferCardToTontine("c1");

    expect(state().cards[0]?.saved).toBe(15_000n);
    expect(canPayContribution(firstOf(state().tontines))).toBe(false);
  });

  it("refuse une carte sans tontine rattachée", () => {
    const { actions } = makePortfolio(TEST_PORTFOLIO);

    expect(() => actions.transferCardToTontine("c1")).toThrow(ForbiddenOperationError);
  });

  it("refuse une épargne insuffisante pour la cotisation", () => {
    const linked = makeCard({ tontineId: "t1", saved: 1_000n });
    const { actions } = makePortfolio({ ...TEST_PORTFOLIO, cards: [linked] });

    expect(() => actions.transferCardToTontine("c1")).toThrow(InsufficientFundsError);
  });
});

describe("reset", () => {
  it("revient au portefeuille initial", () => {
    const { actions, state } = makePortfolio({ ...TEST_PORTFOLIO, available: 1n });

    actions.reset();

    expect(state().available).toBe(INITIAL_PORTFOLIO.available);
    expect(state().tontines).toEqual(INITIAL_PORTFOLIO.tontines);
  });
});
