import type { AppNotification } from "./model.notification";
import { badgeCounts, badgeLabel, inScope } from "./model.notification-badges";

/**
 * Notification de test.
 * @param id Identifiant.
 * @param subject Tontine ou carte concernée.
 * @returns La notification.
 */
function notification(id: string, subject: string): AppNotification {
  return {
    id,
    subject,
    area: subject.startsWith("card:") ? "savings" : "tontines",
    title: "Titre",
    message: "Message",
    time: "Tour 1",
    visual: { kind: "icon", icon: "due" },
    href: "/tontine/1",
  };
}

/** Rien n'a encore été vu. */
const NOTHING_SEEN = { bell: [], tontines: [], savings: [] };

/** Trois notifications pour deux tontines, et une pour une carte. */
const ITEMS = [
  notification("a", "tontine:1"),
  notification("b", "tontine:1"),
  notification("c", "tontine:2"),
  notification("d", "card:c1"),
];

describe("badgeCounts", () => {
  it("compte les tontines et les cartes avec du nouveau, pas leurs notifications", () => {
    expect(badgeCounts(ITEMS, NOTHING_SEEN)).toEqual({ bell: 4, tontines: 2, savings: 1 });
  });

  it("vide la pastille d'un onglet visité, puis la rallume à la notification suivante", () => {
    const seen = { ...NOTHING_SEEN, tontines: ["a", "b", "c"] };
    expect(badgeCounts(ITEMS, seen).tontines).toBe(0);

    const next = [...ITEMS, notification("e", "tontine:2")];
    expect(badgeCounts(next, seen).tontines).toBe(1);
  });

  it("vide la cloche une fois la feuille ouverte, sans toucher aux onglets", () => {
    const seen = { ...NOTHING_SEEN, bell: ["a", "b", "c", "d"] };

    expect(badgeCounts(ITEMS, seen)).toEqual({ bell: 0, tontines: 2, savings: 1 });
  });
});

describe("inScope", () => {
  it("donne toutes les notifications à la cloche, celles de son onglet sinon", () => {
    expect(inScope(ITEMS, "bell")).toHaveLength(4);
    expect(inScope(ITEMS, "savings").map((item) => item.id)).toEqual(["d"]);
  });
});

describe("badgeLabel", () => {
  it("n'affiche rien à zéro, le nombre jusqu'à 9, puis « 9+ »", () => {
    expect(badgeLabel(0)).toBeNull();
    expect(badgeLabel(9)).toBe("9");
    expect(badgeLabel(10)).toBe("9+");
  });
});
