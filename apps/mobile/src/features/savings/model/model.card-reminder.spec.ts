import { SELF_MEMBER_ID } from "../../../shared/member/model.portfolio";
import { makeCard, makeMember, makeTontine } from "../../../shared/testing/fixtures.portfolio";
import { cardTransferReminders } from "./model.card-reminder";

/** Tontine en cours dont la cotisation du membre est due. */
const DUE = makeTontine({ id: "t1", name: "Les Amis", contribution: 5_000n, round: 3 });

/** Carte rattachée à cette tontine. */
const LINKED = makeCard({ id: "c1", name: "Loyer", tontineId: "t1" });

describe("cardTransferReminders", () => {
  it("rappelle de verser la cotisation due depuis la carte liée à la tontine", () => {
    expect(cardTransferReminders([LINKED], [DUE])).toEqual([
      {
        id: "card-c1-t1-round-3",
        cardId: "c1",
        title: "Cotisation à verser",
        body: "La cotisation de 5 000 FCFA de « Les Amis » est due. Versez-la depuis votre carte « Loyer ».",
      },
    ]);
  });

  it("ne rappelle rien pour une carte qui n'est liée à aucune tontine", () => {
    expect(cardTransferReminders([{ ...LINKED, tontineId: null }], [DUE])).toEqual([]);
  });

  it("ne rappelle rien quand la cotisation du tour est déjà réglée", () => {
    const paid = { ...DUE, members: [makeMember(SELF_MEMBER_ID, "ADMIN", true)] };

    expect(cardTransferReminders([LINKED], [paid])).toEqual([]);
  });

  it("ne rappelle rien pour une carte terminée", () => {
    expect(cardTransferReminders([{ ...LINKED, state: "COMPLETED" }], [DUE])).toEqual([]);
  });

  it("donne un nouveau rappel à chaque tour", () => {
    const next = cardTransferReminders([LINKED], [{ ...DUE, round: 4 }]);

    expect(next[0]?.id).toBe("card-c1-t1-round-4");
  });
});
