import {
  allMembersPaid,
  canConfirmRound,
  canStartTontine,
  hasReachedQuota,
  memberContributions,
  SELF_MEMBER_ID,
} from "./model.portfolio";
import { makeMember, makeTontine } from "../testing/fixtures.portfolio";

describe("cycle d'une tontine", () => {
  it("atteint le quota quand les membres couvrent les tours", () => {
    expect(hasReachedQuota(makeTontine())).toBe(true);
    expect(hasReachedQuota(makeTontine({ totalRounds: 4 }))).toBe(false);
  });

  it("repère le tour complet seulement si tout le monde a versé", () => {
    expect(allMembersPaid(makeTontine())).toBe(false);
    expect(
      allMembersPaid(
        makeTontine({
          members: [makeMember(SELF_MEMBER_ID, "ADMIN", true), makeMember("m2", "MEMBRE", true)],
        }),
      ),
    ).toBe(true);
  });

  it("réserve le départ à l'administrateur d'une tontine complète", () => {
    const pending = makeTontine({ state: "PENDING" });

    expect(canStartTontine(pending)).toBe(true);
    expect(canStartTontine({ ...pending, totalRounds: 4 })).toBe(false);
    expect(canStartTontine({ ...pending, members: [makeMember(SELF_MEMBER_ID, "MEMBRE")] })).toBe(
      false,
    );
  });

  it("réserve la confirmation à l'administrateur, une fois tout le monde à jour", () => {
    const complete = makeTontine({
      members: [makeMember(SELF_MEMBER_ID, "ADMIN", true), makeMember("m2", "MEMBRE", true)],
    });

    expect(canConfirmRound(complete)).toBe(true);
    expect(canConfirmRound(makeTontine())).toBe(false);
    expect(canConfirmRound({ ...complete, state: "PENDING" })).toBe(false);
  });

  it("reconstitue l'historique jusqu'au tour en cours", () => {
    const running = makeTontine({
      round: 3,
      members: [makeMember(SELF_MEMBER_ID, "ADMIN", true), makeMember("m2", "MEMBRE")],
    });

    expect(memberContributions(running, SELF_MEMBER_ID)).toEqual([
      { round: 1, paid: true },
      { round: 2, paid: true },
      { round: 3, paid: true },
    ]);
    expect(memberContributions(running, "m2").at(-1)).toEqual({ round: 3, paid: false });
    expect(memberContributions(makeTontine({ state: "PENDING" }), SELF_MEMBER_ID)).toEqual([]);
  });
});
