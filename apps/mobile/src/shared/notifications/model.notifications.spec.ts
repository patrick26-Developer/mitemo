import { SELF_MEMBER_ID } from "../member/model.portfolio";
import type { TontineActivity } from "../member/model.tontine-activity";
import { makeCard, makeMember, makeTontine } from "../testing/fixtures.portfolio";
import { buildNotifications } from "./model.notifications";

/** Instant de référence des tests, en UTC. */
const NOW = "2026-11-12T10:00:00.000Z";

/**
 * Événement du fil d'une tontine.
 * @param over Champs à remplacer.
 * @returns L'événement de test.
 */
function activity(over: Partial<TontineActivity>): TontineActivity {
  return {
    id: "a1",
    kind: "paid",
    memberId: "m2",
    memberName: "Mama Nadège",
    round: 1,
    at: "2026-11-12T07:00:00.000Z",
    ...over,
  };
}

describe("buildNotifications", () => {
  it("annonce une invitation avec l'avatar de qui invite, et ouvre la tontine", () => {
    const [notification] = buildNotifications({
      tontines: [],
      cards: [],
      invitations: [{ id: "i1", invitedBy: "Mama Nadège", tontine: makeTontine({ name: "Poto" }) }],
      now: NOW,
    });

    expect(notification).toMatchObject({
      title: "Mama Nadège vous invite",
      visual: { kind: "avatar", name: "Mama Nadège" },
      href: "/invitation/i1",
      area: "tontines",
    });
  });

  it("rappelle la cotisation due avec une icône, et ouvre directement son paiement", () => {
    const [notification] = buildNotifications({
      tontines: [makeTontine()],
      cards: [],
      invitations: [],
      now: NOW,
    });

    expect(notification).toMatchObject({
      id: "pay-t1-1",
      visual: { kind: "icon", icon: "due" },
      href: "/tontine/t1?action=pay",
      subject: "tontine:t1",
    });
  });

  it("relaie le fil des autres membres, du plus récent au plus ancien", () => {
    const tontine = makeTontine({
      members: [makeMember(SELF_MEMBER_ID, "ADMIN", true)],
      activity: [
        activity({ id: "a1", kind: "joined", at: "2026-11-10T10:00:00.000Z" }),
        activity({ id: "a2", kind: "received", memberName: "Serge Makosso" }),
        activity({ id: "a3", memberId: SELF_MEMBER_ID }),
      ],
    });

    const notifications = buildNotifications({
      tontines: [tontine],
      cards: [],
      invitations: [],
      now: NOW,
    });

    expect(notifications.map((item) => item.title)).toEqual([
      "Serge Makosso a reçu son tour",
      "Mama Nadège a rejoint la tontine",
    ]);
    expect(notifications[0]).toMatchObject({ time: "Il y a 3 h", href: "/tontine/t1?member=m2" });
  });

  it("rappelle une carte en cours dans l'onglet Cartes", () => {
    const [notification] = buildNotifications({
      tontines: [],
      cards: [makeCard()],
      invitations: [],
      now: NOW,
    });

    expect(notification).toMatchObject({ area: "savings", visual: { kind: "icon", icon: "card" } });
    expect(notification?.href).toBe(`/savings-detail/${makeCard().id}?action=pay`);
  });
});
