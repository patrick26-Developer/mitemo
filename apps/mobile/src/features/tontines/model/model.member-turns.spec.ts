import { SELF_MEMBER_ID } from "../../../shared/member/model.portfolio";
import { makeMember, makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { memberTurns, previewTurns, turnsLabel } from "./model.member-turns";

/** Quatre membres, dans l'ordre de passage fixé par l'administrateur. */
const MEMBERS = [
  makeMember(SELF_MEMBER_ID, "ADMIN"),
  makeMember("m2", "MEMBRE"),
  makeMember("m3", "MEMBRE"),
  makeMember("m4", "MEMBRE"),
];

/** Huit tours : m2 en prend trois, à la suite. */
const LONG = makeTontine({
  totalRounds: 8,
  members: [
    makeMember(SELF_MEMBER_ID, "ADMIN"),
    { ...makeMember("m2", "MEMBRE"), turns: 3 },
    makeMember("m3", "MEMBRE"),
    makeMember("m4", "MEMBRE"),
    makeMember("m5", "MEMBRE"),
    makeMember("m6", "MEMBRE"),
  ],
});

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

  it("répète un membre à chacun de ses tours, à la suite", () => {
    const ids = memberTurns(LONG).map(({ member }) => member.id);

    expect(ids.slice(0, 5)).toEqual([SELF_MEMBER_ID, "m2", "m2", "m2", "m3"]);
  });
});

describe("previewTurns", () => {
  it("montre les premiers rangs avant le départ", () => {
    const preview = previewTurns({ ...LONG, state: "PENDING" }, 3);

    expect(preview.map(({ turn }) => turn)).toEqual([1, 2, 3]);
  });

  it("part du rang qui précède le tour en cours pendant le cycle", () => {
    const preview = previewTurns({ ...LONG, round: 5 }, 3);

    expect(preview.map(({ turn }) => turn)).toEqual([4, 5, 6]);
  });

  it("garde une fenêtre pleine en fin de cycle", () => {
    const preview = previewTurns({ ...LONG, round: 8 }, 3);

    expect(preview.map(({ turn }) => turn)).toEqual([6, 7, 8]);
  });
});

describe("turnsLabel", () => {
  it("nomme le tour unique d'un membre", () => {
    expect(turnsLabel(LONG, "m3")).toBe("Tour 5");
  });

  it("énumère les tours d'un membre qui en a pris plusieurs", () => {
    expect(turnsLabel(LONG, "m2")).toBe("Tours 2, 3 et 4");
  });
});
