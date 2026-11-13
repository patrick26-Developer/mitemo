import { SELF_MEMBER_ID } from "./model.portfolio";
import {
  canPayAhead,
  markSelfPaidAhead,
  nextRoundPayment,
  payingRound,
  prepaidRounds,
  reachedContributionLimit,
  selfPaidTotal,
  selfTotalDue,
} from "./model.tontine-prepay";
import { makeMember, makeTontine } from "../testing/fixtures.portfolio";

/**
 * Tontine active au tour donné, où le membre connecté a pris 2 tours.
 * @param round Tour en cours.
 * @param self Changements apportés au membre connecté.
 * @returns La tontine de test.
 */
function active(round: number, self: Partial<ReturnType<typeof makeMember>> = {}) {
  return makeTontine({
    state: "ACTIVE",
    round,
    totalRounds: 5,
    contribution: 5_000n,
    members: [{ ...makeMember(SELF_MEMBER_ID, "MEMBRE"), turns: 2, ...self }],
  });
}

describe("canPayAhead", () => {
  it("refuse d'avancer tant que le tour en cours n'est pas réglé", () => {
    expect(canPayAhead(active(2, { paidCurrentRound: false }))).toBe(false);
  });

  it("permet de cotiser le tour suivant une fois le tour en cours réglé", () => {
    expect(canPayAhead(active(2, { paidCurrentRound: true }))).toBe(true);
  });

  it("s'arrête quand tous les tours restants sont déjà payés", () => {
    expect(canPayAhead(active(2, { paidCurrentRound: true, prepaidRounds: 3 }))).toBe(false);
    expect(canPayAhead(active(5, { paidCurrentRound: true }))).toBe(false);
  });

  it("refuse une avance sur une tontine supprimée", () => {
    const paid = makeTontine({
      deletedBy: "Grâce Mabiala",
      members: [makeMember(SELF_MEMBER_ID, "MEMBRE", true)],
    });

    expect(canPayAhead(paid)).toBe(false);
  });
});

describe("selfTotalDue et selfPaidTotal", () => {
  it("le total à verser vaut cotisation × parts × nombre de tours", () => {
    expect(selfTotalDue(active(1))).toBe(50_000n);
  });

  it("compte les tours passés, le tour en cours et les tours d'avance", () => {
    const tontine = active(2, { paidCurrentRound: true, prepaidRounds: 1 });

    expect(selfPaidTotal(tontine)).toBe(30_000n);
  });

  it("ne dépasse jamais le total à verser, à chaque tour et pour toute avance", () => {
    for (let round = 1; round <= 5; round += 1) {
      let tontine = active(round, { paidCurrentRound: true });
      for (let step = 0; step < 10 && canPayAhead(tontine); step += 1) {
        tontine = markSelfPaidAhead([tontine], tontine.id)[0] ?? tontine;
      }
      expect(selfPaidTotal(tontine)).toBe(selfTotalDue(tontine));
    }
  });
});

describe("markSelfPaidAhead", () => {
  it("ajoute un tour d'avance au membre connecté", () => {
    const [tontine] = markSelfPaidAhead([active(2, { paidCurrentRound: true })], "t1");

    expect(tontine === undefined ? 0 : prepaidRounds(tontine)).toBe(1);
  });
});

describe("nextRoundPayment", () => {
  it("consomme un tour d'avance au passage du tour", () => {
    expect(nextRoundPayment({ paidCurrentRound: true, prepaidRounds: 2 })).toEqual({
      paidCurrentRound: true,
      prepaidRounds: 1,
    });
  });

  it("remet la cotisation à régler sans avance", () => {
    expect(nextRoundPayment({ paidCurrentRound: true })).toEqual({
      paidCurrentRound: false,
      prepaidRounds: 0,
    });
  });
});

describe("payingRound", () => {
  it("vise le tour en cours tant qu'il n'est pas réglé", () => {
    expect(payingRound(active(2))).toBe(2);
  });

  it("vise le premier tour à venir qui n'est pas encore payé", () => {
    expect(payingRound(active(2, { paidCurrentRound: true, prepaidRounds: 1 }))).toBe(4);
  });
});

describe("reachedContributionLimit", () => {
  it("annonce la limite quand tout le cycle est versé", () => {
    const self = { ...makeMember(SELF_MEMBER_ID, "ADMIN", true), prepaidRounds: 2 };

    expect(reachedContributionLimit(makeTontine({ members: [self] }))).toBe(true);
  });

  it("n'annonce rien tant qu'un tour reste à verser", () => {
    const self = makeMember(SELF_MEMBER_ID, "ADMIN", true);

    expect(reachedContributionLimit(makeTontine({ members: [self] }))).toBe(false);
  });
});
