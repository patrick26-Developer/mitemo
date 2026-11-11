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

  it("place en tête le membre dont c'est le tour, puis les suivants dans l'ordre", () => {
    const turns = memberTurns(makeTontine({ members: MEMBERS, beneficiaryId: "m3" }));

    expect(turns.map(({ member, turn }) => [member.id, turn])).toEqual([
      ["m3", 3],
      ["m4", 4],
      [SELF_MEMBER_ID, 1],
      ["m2", 2],
    ]);
  });
});
