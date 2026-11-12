import type { TontineActivity } from "../member/model.tontine-activity";

/**
 * Fil de la « Tontine du Marché Tolal » (tour 4) : Mama Nadège a reçu le
 * tour 3, et plusieurs membres ont déjà cotisé le tour en cours.
 */
export const MARCHE_TOLAL_ACTIVITY: readonly TontineActivity[] = [
  {
    id: "a1",
    kind: "joined",
    memberId: "m9",
    memberName: "David Nkodia",
    round: 1,
    at: "2026-10-20T10:00:00.000Z",
  },
  {
    id: "a2",
    kind: "received",
    memberId: "m2",
    memberName: "Mama Nadège",
    round: 3,
    at: "2026-11-05T17:00:00.000Z",
  },
  {
    id: "a3",
    kind: "paid",
    memberId: "m3",
    memberName: "Jean-Baptiste Okemba",
    round: 4,
    at: "2026-11-10T09:15:00.000Z",
  },
  {
    id: "a4",
    kind: "paid",
    memberId: "m6",
    memberName: "Pauline Elenga",
    round: 4,
    at: "2026-11-11T14:30:00.000Z",
  },
  {
    id: "a5",
    kind: "paid",
    memberId: "m9",
    memberName: "David Nkodia",
    round: 4,
    at: "2026-11-12T08:05:00.000Z",
  },
];

/** Fil de la « Tontine des Amis » (tour 5) : Jean-Baptiste a reçu le tour 4. */
export const AMIS_ACTIVITY: readonly TontineActivity[] = [
  {
    id: "b1",
    kind: "received",
    memberId: "m4",
    memberName: "Jean-Baptiste Okemba",
    round: 4,
    at: "2026-10-30T16:00:00.000Z",
  },
  {
    id: "b2",
    kind: "paid",
    memberId: "m3",
    memberName: "Clarisse Nzaba",
    round: 5,
    at: "2026-11-11T19:20:00.000Z",
  },
  {
    id: "b3",
    kind: "paid",
    memberId: "m5",
    memberName: "Pauline Elenga",
    round: 5,
    at: "2026-11-12T07:40:00.000Z",
  },
];
