import { SELF_MEMBER_ID } from "../../../shared/member/model.portfolio";
import { makeMember, makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { memberTurns } from "./model.member-turns";

/** Quatre membres, dans l'ordre de passage fixé par l'administrateur. */
const MEMBERS = [
  makeMember(SELF_MEMBER_ID, "ADMIN"),
  makeMember("m2", "MEMBRE"),
  makeMember("m3", "MEMBRE"),
  makeMember("m4", "MEMBRE"),
];

describe("memberTurns", () => {
  it("numérote chaque membre par son rang de passage", () => {
    const turns = memberTurns(makeTontine({ state: "PENDING", members: MEMBERS }));

    expect(turns.map(({ member, turn }) => [member.id, turn])).toEqual([
      [SELF_MEMBER_ID, 1],
      ["m2", 2],
      ["m3", 3],
      ["m4", 4],
    ]);
  });

  it("garde l'ordre de passage pendant le cycle, quel que soit le tour en cours", () => {
    const turns = memberTurns(makeTontine({ members: MEMBERS, beneficiaryId: "m3" }));

    expect(turns.map(({ turn }) => turn)).toEqual([1, 2, 3, 4]);
  });
});
