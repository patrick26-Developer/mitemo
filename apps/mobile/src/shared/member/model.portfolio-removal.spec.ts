import { canPayContribution, SELF_MEMBER_ID } from "./model.portfolio";
import { ForbiddenOperationError } from "./model.portfolio-error";
import { canDeleteCard, canDeleteTontine } from "./model.portfolio-removal";
import {
  makeCard,
  makeMember,
  makePortfolio,
  makeTontine,
  TEST_PORTFOLIO,
} from "../testing/fixtures.portfolio";

/** Administrateur de la tontine : le membre connecté. */
const ADMIN = makeMember(SELF_MEMBER_ID, "ADMIN", false);

/** Tontine pas encore lancée, administrée par le membre connecté, sans cotisation. */
const PENDING = makeTontine({
  state: "PENDING",
  members: [ADMIN, makeMember("m2", "MEMBRE", false)],
});

describe("canDeleteTontine", () => {
  it("permet de supprimer une tontine pas encore lancée, sans cotisation", () => {
    expect(canDeleteTontine(PENDING)).toBe(true);
  });

  it("refuse une tontine lancée", () => {
    expect(canDeleteTontine({ ...PENDING, state: "ACTIVE" })).toBe(false);
  });

  it("refuse une tontine qui a déjà reçu une cotisation, même d'avance", () => {
    const paid = makeMember("m2", "MEMBRE", true);
    const prepaid = { ...makeMember("m2", "MEMBRE", false), prepaidRounds: 1 };

    expect(canDeleteTontine({ ...PENDING, members: [ADMIN, paid] })).toBe(false);
    expect(canDeleteTontine({ ...PENDING, members: [ADMIN, prepaid] })).toBe(false);
  });

  it("refuse au membre qui n'administre pas la tontine", () => {
    const member = makeMember(SELF_MEMBER_ID, "MEMBRE", false);

    expect(canDeleteTontine({ ...PENDING, members: [member] })).toBe(false);
  });
});

describe("deleteTontine", () => {
  it("retire la tontine supprimée par son administrateur", () => {
    const { actions, state } = makePortfolio({ ...TEST_PORTFOLIO, tontines: [PENDING] });

    actions.deleteTontine("t1");

    expect(state().tontines).toEqual([]);
  });

  it("refuse une tontine qui ne peut plus être supprimée", () => {
    const active = { ...PENDING, state: "ACTIVE" as const };
    const { actions } = makePortfolio({ ...TEST_PORTFOLIO, tontines: [active] });

    expect(() => actions.deleteTontine("t1")).toThrow(ForbiddenOperationError);
  });
});

describe("tontine supprimée par son administrateur", () => {
  /** Tontine dont le membre connecté est simple membre, supprimée par l'administrateur. */
  const DELETED = makeTontine({
    state: "PENDING",
    deletedBy: "Grâce Mabiala",
    members: [makeMember("m1", "ADMIN", false), makeMember(SELF_MEMBER_ID, "MEMBRE", false)],
  });

  it("ne peut plus recevoir de cotisation", () => {
    expect(canPayContribution({ ...DELETED, state: "ACTIVE" })).toBe(false);
  });

  it("se retire de l'historique du membre", () => {
    const { actions, state } = makePortfolio({ ...TEST_PORTFOLIO, tontines: [DELETED] });

    actions.dismissTontine("t1");

    expect(state().tontines).toEqual([]);
  });

  it("refuse de retirer de l'historique une tontine encore en cours", () => {
    const { actions } = makePortfolio({ ...TEST_PORTFOLIO, tontines: [PENDING] });

    expect(() => actions.dismissTontine("t1")).toThrow(ForbiddenOperationError);
  });
});

describe("canDeleteCard", () => {
  it("permet de supprimer une carte sans pointage", () => {
    expect(canDeleteCard(makeCard({ entries: [], saved: 0n }))).toBe(true);
  });

  it("refuse une carte déjà pointée ou qui porte de l'épargne", () => {
    const entry = { at: "2026-11-11T09:15:00.000Z", amount: 5_000n, method: "MITEMO" } as const;

    expect(canDeleteCard(makeCard({ entries: [entry] }))).toBe(false);
    expect(canDeleteCard(makeCard({ entries: [], saved: 5_000n }))).toBe(false);
  });
});

describe("deleteCard", () => {
  it("retire une carte sans pointage", () => {
    const empty = makeCard({ entries: [], saved: 0n });
    const { actions, state } = makePortfolio({ ...TEST_PORTFOLIO, cards: [empty] });

    actions.deleteCard("c1");

    expect(state().cards).toEqual([]);
  });

  it("refuse une carte déjà pointée", () => {
    const entry = { at: "2026-11-11T09:15:00.000Z", amount: 5_000n, method: "MITEMO" } as const;
    const pointed = makeCard({ entries: [entry] });
    const { actions } = makePortfolio({ ...TEST_PORTFOLIO, cards: [pointed] });

    expect(() => actions.deleteCard("c1")).toThrow(ForbiddenOperationError);
  });
});
