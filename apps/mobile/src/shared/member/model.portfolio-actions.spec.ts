import { canPayContribution, SELF_MEMBER_ID } from "./model.portfolio";
import type { CreateCardInput, CreateTontineInput } from "./model.portfolio-create";
import {
  ForbiddenOperationError,
  InsufficientFundsError,
  UnknownEntityError,
} from "./model.portfolio-error";
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
      totalRounds: 6,
      participantCount: 3,
      description: "Créée depuis les tests.",
    };

    actions.createTontine(input);

    expect(state().tontines).toHaveLength(2);
    expect(state().tontines[0]?.name).toBe("Nouvelle tontine");
    expect(state().tontines[0]?.members).toHaveLength(3);
    expect(state().tontines[0]?.members[0]?.role).toBe("ADMIN");
  });
});

describe("createCard", () => {
  it("ajoute la carte en tête, rattachée à la tontine choisie", () => {
    const { actions, state } = makePortfolio(TEST_PORTFOLIO);
    const input: CreateCardInput = {
      name: "Nouvelle carte",
      markerAmount: 2_000n,
      markersTotal: 5,
      deadline: "2027-01-31",
      tontineId: "t1",
      description: "Créée depuis les tests.",
    };

    actions.createCard(input);

    expect(state().cards[0]?.name).toBe("Nouvelle carte");
    expect(state().cards[0]?.tontineId).toBe("t1");
    expect(state().cards[0]?.saved).toBe(0n);
  });
});

describe("contributeTontine", () => {
  it("débite le solde et marque la cotisation réglée", () => {
    const { actions, state } = makePortfolio(TEST_PORTFOLIO);

    actions.contributeTontine("t1");

    expect(state().available).toBe(15_000n);
    expect(canPayContribution(firstOf(state().tontines))).toBe(false);
  });

  it("refuse une cotisation au-delà du solde sans rien modifier", () => {
    const { actions, state } = makePortfolio({ ...TEST_PORTFOLIO, available: 1_000n });

    expect(() => actions.contributeTontine("t1")).toThrow(InsufficientFundsError);
    expect(state().available).toBe(1_000n);
  });

  it("refuse une cotisation déjà réglée", () => {
    const paid = makeTontine({ members: [makeMember(SELF_MEMBER_ID, "ADMIN", true)] });
    const { actions } = makePortfolio({ ...TEST_PORTFOLIO, tontines: [paid] });

    expect(() => actions.contributeTontine("t1")).toThrow(ForbiddenOperationError);
  });
});

describe("withdrawTontine", () => {
  it("verse la cagnotte au bénéficiaire et passe au tour suivant", () => {
    const beneficiary = makeTontine({ beneficiaryId: SELF_MEMBER_ID });
    const { actions, state } = makePortfolio({ ...TEST_PORTFOLIO, tontines: [beneficiary] });

    actions.withdrawTontine("t1");

    expect(state().available).toBe(30_000n);
    expect(state().tontines[0]?.round).toBe(2);
  });

  it("refuse le retrait à un membre qui n'est pas bénéficiaire", () => {
    const { actions } = makePortfolio(TEST_PORTFOLIO);

    expect(() => actions.withdrawTontine("t1")).toThrow(ForbiddenOperationError);
  });
});

describe("transferToMember", () => {
  it("débite le solde disponible", () => {
    const { actions, state } = makePortfolio(TEST_PORTFOLIO);

    actions.transferToMember("t1", "m2", 3_000n);

    expect(state().available).toBe(17_000n);
  });

  it("refuse un destinataire inconnu", () => {
    const { actions } = makePortfolio(TEST_PORTFOLIO);

    expect(() => actions.transferToMember("t1", "absent", 1_000n)).toThrow(UnknownEntityError);
  });

  it("refuse un montant supérieur au solde", () => {
    const { actions } = makePortfolio(TEST_PORTFOLIO);

    expect(() => actions.transferToMember("t1", "m2", 50_000n)).toThrow(InsufficientFundsError);
  });
});

describe("inviteMember", () => {
  it("crée puis conserve le même code d'invitation", () => {
    const { actions, state } = makePortfolio(TEST_PORTFOLIO);

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
  it("débite un marqueur et l'ajoute à l'épargne", () => {
    const { actions, state } = makePortfolio(TEST_PORTFOLIO);

    actions.contributeCard("c1");

    expect(state().available).toBe(15_000n);
    expect(state().cards[0]?.saved).toBe(25_000n);
  });

  it("refuse une carte clôturée", () => {
    const completed = makeCard({ state: "COMPLETED" });
    const { actions } = makePortfolio({ ...TEST_PORTFOLIO, cards: [completed] });

    expect(() => actions.contributeCard("c1")).toThrow(ForbiddenOperationError);
  });

  it("refuse un versement au-delà du solde", () => {
    const { actions } = makePortfolio({ ...TEST_PORTFOLIO, available: 1_000n });

    expect(() => actions.contributeCard("c1")).toThrow(InsufficientFundsError);
  });
});

describe("withdrawCard", () => {
  it("verse l'épargne sur le solde et vide la carte", () => {
    const { actions, state } = makePortfolio(TEST_PORTFOLIO);

    actions.withdrawCard("c1");

    expect(state().available).toBe(40_000n);
    expect(state().cards[0]?.saved).toBe(0n);
    expect(state().cards[0]?.state).toBe("COMPLETED");
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
