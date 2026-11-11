import { SELF_MEMBER_ID } from "./model.portfolio";
import { ForbiddenOperationError } from "./model.portfolio-error";
import {
  makeMember,
  makePortfolio,
  makeTontine,
  TEST_PORTFOLIO,
} from "../testing/fixtures.portfolio";

/** Contact du répertoire qui a un compte Mitemo. */
const AIMEE = { name: "Aimée Mbemba", phone: "+242065706622" } as const;

describe("addMember", () => {
  it("inscrit le contact choisi tant que le quota n'est pas atteint", () => {
    const pending = makeTontine({
      state: "PENDING",
      totalRounds: 3,
      members: [makeMember(SELF_MEMBER_ID, "ADMIN")],
    });
    const { actions, state } = makePortfolio({ ...TEST_PORTFOLIO, tontines: [pending] });

    actions.addMember("t1", AIMEE);

    expect(state().tontines[0]?.members).toHaveLength(2);
    expect(state().tontines[0]?.members[1]).toMatchObject({
      name: "Aimée Mbemba",
      phone: "+242065706622",
      role: "MEMBRE",
    });
  });

  it("refuse un contact déjà membre", () => {
    const pending = makeTontine({
      state: "PENDING",
      totalRounds: 3,
      members: [makeMember(SELF_MEMBER_ID, "ADMIN")],
    });
    const { actions } = makePortfolio({ ...TEST_PORTFOLIO, tontines: [pending] });
    actions.addMember("t1", AIMEE);

    expect(() => actions.addMember("t1", AIMEE)).toThrow(ForbiddenOperationError);
  });

  it("refuse un membre de plus quand le quota est atteint", () => {
    const { actions } = makePortfolio({
      ...TEST_PORTFOLIO,
      tontines: [makeTontine({ state: "PENDING" })],
    });

    expect(() => actions.addMember("t1", AIMEE)).toThrow(ForbiddenOperationError);
  });

  it("refuse l'ajout à un simple membre", () => {
    const pending = makeTontine({
      state: "PENDING",
      members: [makeMember(SELF_MEMBER_ID, "MEMBRE")],
    });
    const { actions } = makePortfolio({ ...TEST_PORTFOLIO, tontines: [pending] });

    expect(() => actions.addMember("t1", AIMEE)).toThrow(ForbiddenOperationError);
  });
});

describe("startTontine", () => {
  it("lance la tontine complète et ouvre le premier tour", () => {
    const { actions, state } = makePortfolio({
      ...TEST_PORTFOLIO,
      tontines: [makeTontine({ state: "PENDING" })],
    });

    actions.startTontine("t1");

    expect(state().tontines[0]?.state).toBe("ACTIVE");
    expect(state().tontines[0]?.round).toBe(1);
    expect(state().tontines[0]?.beneficiaryId).toBe(SELF_MEMBER_ID);
  });

  it("refuse le départ tant que le quota n'est pas atteint", () => {
    const pending = makeTontine({
      state: "PENDING",
      members: [makeMember(SELF_MEMBER_ID, "ADMIN")],
    });
    const { actions } = makePortfolio({ ...TEST_PORTFOLIO, tontines: [pending] });

    expect(() => actions.startTontine("t1")).toThrow(ForbiddenOperationError);
  });

  it("refuse le départ à un simple membre", () => {
    const pending = makeTontine({
      state: "PENDING",
      members: [makeMember(SELF_MEMBER_ID, "MEMBRE"), makeMember("m2", "ADMIN")],
    });
    const { actions } = makePortfolio({ ...TEST_PORTFOLIO, tontines: [pending] });

    expect(() => actions.startTontine("t1")).toThrow(ForbiddenOperationError);
  });
});

describe("confirmRound", () => {
  it("distribue la cagnotte au bénéficiaire puis ouvre le tour suivant", () => {
    const paid = makeTontine({
      beneficiaryId: SELF_MEMBER_ID,
      members: [
        makeMember(SELF_MEMBER_ID, "ADMIN", true),
        makeMember("m2", "MEMBRE", true),
        makeMember("m3", "MEMBRE", true),
      ],
    });
    const { actions, state } = makePortfolio({ ...TEST_PORTFOLIO, tontines: [paid] });

    actions.confirmRound("t1");

    expect(state().available).toBe(30_000n);
    expect(state().tontines[0]?.round).toBe(2);
  });

  it("refuse la confirmation tant que tous les membres n'ont pas versé", () => {
    const { actions } = makePortfolio(TEST_PORTFOLIO);

    expect(() => actions.confirmRound("t1")).toThrow(ForbiddenOperationError);
  });

  it("refuse la confirmation à un simple membre", () => {
    const paid = makeTontine({
      members: [makeMember(SELF_MEMBER_ID, "MEMBRE", true), makeMember("m2", "ADMIN", true)],
    });
    const { actions } = makePortfolio({ ...TEST_PORTFOLIO, tontines: [paid] });

    expect(() => actions.confirmRound("t1")).toThrow(ForbiddenOperationError);
  });
});
