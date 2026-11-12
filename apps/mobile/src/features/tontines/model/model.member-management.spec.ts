import { makeMember, makeTontine } from "../../../shared/testing/fixtures.portfolio";
import {
  canCancelInvitation,
  canRemove,
  currentTurnAccent,
  removalContent,
} from "./model.member-management";

/** Tontine en préparation administrée par le membre connecté. */
const PENDING = makeTontine({ state: "PENDING" });

describe("canRemove", () => {
  it("permet à l'administrateur de retirer un autre membre avant le départ", () => {
    expect(canRemove(PENDING, makeMember("m2", "MEMBRE"))).toBe(true);
    expect(canRemove(PENDING, makeMember("self", "ADMIN"))).toBe(false);
    expect(canRemove(makeTontine(), makeMember("m2", "MEMBRE"))).toBe(false);
  });
});

describe("canCancelInvitation", () => {
  it("réserve l'annulation à l'administrateur avant le départ", () => {
    expect(canCancelInvitation(PENDING)).toBe(true);
    expect(canCancelInvitation(makeTontine())).toBe(false);
    expect(canCancelInvitation({ ...PENDING, members: [makeMember("self", "MEMBRE")] })).toBe(
      false,
    );
  });
});

describe("currentTurnAccent", () => {
  it("colore seulement le rang du tour en cours d'une tontine active", () => {
    const active = makeTontine({ round: 2 });

    expect(currentTurnAccent(active, 2)).toBeDefined();
    expect(currentTurnAccent(active, 1)).toBeUndefined();
    expect(currentTurnAccent({ ...active, state: "PENDING" }, 2)).toBeUndefined();
  });
});

describe("removalContent", () => {
  it("nomme le membre et la tontine", () => {
    const content = removalContent(PENDING, makeMember("m2", "MEMBRE"));

    expect(content.title).toBe("Retirer Membre m2 ?");
    expect(content.message).toContain("« Tontine de test »");
  });
});
