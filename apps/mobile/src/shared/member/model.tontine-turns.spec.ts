import { makeMember, makeTontine } from "../testing/fixtures.portfolio";
import {
  canInviteMembers,
  freeTurns,
  memberDue,
  selfDue,
  takenTurns,
  turnOrder,
} from "./model.tontine-turns";

/** Tontine de 6 tours : le membre connecté prend 1 tour, m2 en prend 3, m3 en prend 1. */
const SHARED = makeTontine({
  totalRounds: 6,
  members: [
    makeMember("self", "ADMIN"),
    { ...makeMember("m2", "MEMBRE"), turns: 3 },
    makeMember("m3", "MEMBRE"),
  ],
});

describe("takenTurns", () => {
  it("additionne les tours pris par chaque membre", () => {
    expect(takenTurns(SHARED)).toBe(5);
  });
});

describe("freeTurns", () => {
  it("compte les tours encore libres", () => {
    expect(freeTurns(SHARED)).toBe(1);
  });

  it("ne descend jamais sous zéro", () => {
    expect(freeTurns({ ...SHARED, totalRounds: 4 })).toBe(0);
  });
});

describe("turnOrder", () => {
  it("place les tours d'un même membre à la suite, dans l'ordre des membres", () => {
    expect(turnOrder(SHARED)).toEqual(["self", "m2", "m2", "m2", "m3"]);
  });
});

describe("memberDue", () => {
  it("multiplie la cotisation par le nombre de tours du membre", () => {
    const [, partner] = SHARED.members;
    if (partner === undefined) throw new Error("Membre manquant.");

    expect(memberDue(SHARED, partner)).toBe(15_000n);
  });
});

describe("selfDue", () => {
  it("compte une cotisation par tour pris par le membre connecté", () => {
    const tontine = makeTontine({ members: [{ ...makeMember("self", "MEMBRE"), turns: 2 }] });

    expect(selfDue(tontine)).toBe(10_000n);
  });

  it("vaut une cotisation quand le membre connecté n'y participe pas", () => {
    expect(selfDue(makeTontine({ members: [] }))).toBe(5_000n);
  });
});

describe("canInviteMembers", () => {
  it("n'ouvre les invitations qu'avant le lancement, tant qu'il manque des membres", () => {
    const pending = { ...SHARED, state: "PENDING" as const, totalRounds: 8 };

    expect(canInviteMembers(pending)).toBe(true);
    expect(canInviteMembers({ ...pending, totalRounds: 5 })).toBe(false);
    expect(canInviteMembers({ ...pending, state: "ACTIVE" })).toBe(false);
  });
});
