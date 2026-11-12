import type { Tontine } from "../member/model.portfolio";
import { AMIS_ACTIVITY, MARCHE_TOLAL_ACTIVITY } from "./demo.activity";

/**
 * Tontines livrées avec l'application tant que l'API n'est pas branchée.
 * Le membre connecté administre la première et participe à la deuxième en
 * simple membre : les deux vues de l'écran de détail sont ainsi visibles.
 * Mama Nadège a pris deux tours dans la première, placés à la suite (2 et 3),
 * et chaque bénéficiaire suit l'ordre de passage. Les deux premières ont un
 * fil d'activité, relayé dans les notifications.
 */
export const INITIAL_TONTINES: readonly Tontine[] = [
  {
    id: "1",
    name: "Tontine du Marché Tolal",
    contribution: 5_000n,
    frequency: { unit: "semaine", interval: 1 },
    round: 4,
    totalRounds: 10,
    state: "ACTIVE",
    beneficiaryId: "m3",
    description:
      "Tontine hebdomadaire du marché Tolal. Chaque membre cotise 5 000 FCFA par semaine et reçoit la restourne à son tour.",
    headerColors: ["#2CCA86", "#62F79D"],
    invitationCode: null,
    invitations: [],
    activity: MARCHE_TOLAL_ACTIVITY,
    members: [
      { id: "self", name: "Précieuse Mavoungou", role: "ADMIN", paidCurrentRound: true, turns: 1 },
      { id: "m2", name: "Mama Nadège", role: "MEMBRE", paidCurrentRound: true, turns: 2 },
      { id: "m3", name: "Jean-Baptiste Okemba", role: "MEMBRE", paidCurrentRound: true, turns: 1 },
      { id: "m4", name: "Clarisse Nzaba", role: "MEMBRE", paidCurrentRound: false, turns: 1 },
      { id: "m5", name: "Serge Makosso", role: "MEMBRE", paidCurrentRound: true, turns: 1 },
      { id: "m6", name: "Pauline Elenga", role: "MEMBRE", paidCurrentRound: true, turns: 1 },
      { id: "m7", name: "Alphonse Mabiala", role: "MEMBRE", paidCurrentRound: false, turns: 1 },
      { id: "m8", name: "Léonie Bantsimba", role: "MEMBRE", paidCurrentRound: true, turns: 1 },
      { id: "m9", name: "David Nkodia", role: "MEMBRE", paidCurrentRound: true, turns: 1 },
    ],
  },
  {
    id: "2",
    name: "Tontine des Amis",
    contribution: 10_000n,
    frequency: { unit: "mois", interval: 1 },
    round: 5,
    totalRounds: 6,
    state: "ACTIVE",
    beneficiaryId: "m5",
    description:
      "Tontine mensuelle du groupe d'amis. La restourne est remise à un membre différent chaque mois.",
    headerColors: ["#F5B94A", "#FAD98C"],
    invitationCode: null,
    invitations: [],
    activity: AMIS_ACTIVITY,
    members: [
      { id: "m1", name: "Serge Makosso", role: "ADMIN", paidCurrentRound: true, turns: 1 },
      {
        id: "self",
        name: "Précieuse Mavoungou",
        role: "MEMBRE",
        paidCurrentRound: false,
        turns: 1,
      },
      { id: "m3", name: "Clarisse Nzaba", role: "MEMBRE", paidCurrentRound: true, turns: 1 },
      { id: "m4", name: "Jean-Baptiste Okemba", role: "MEMBRE", paidCurrentRound: false, turns: 1 },
      { id: "m5", name: "Pauline Elenga", role: "MEMBRE", paidCurrentRound: true, turns: 1 },
      { id: "m6", name: "David Nkodia", role: "MEMBRE", paidCurrentRound: false, turns: 1 },
    ],
  },
  {
    id: "3",
    name: "Tontine du Quartier",
    contribution: 3_000n,
    frequency: { unit: "semaine", interval: 1 },
    round: 8,
    totalRounds: 8,
    state: "COMPLETED",
    beneficiaryId: "m8",
    description: "Tontine de quartier arrivée au bout de ses huit tours, clôturée normalement.",
    headerColors: ["#9DB6F5", "#C9D6FF"],
    invitationCode: null,
    invitations: [],
    members: [
      { id: "self", name: "Précieuse Mavoungou", role: "ADMIN", paidCurrentRound: true, turns: 1 },
      { id: "m2", name: "Mama Nadège", role: "MEMBRE", paidCurrentRound: true, turns: 1 },
      { id: "m3", name: "Alphonse Mabiala", role: "MEMBRE", paidCurrentRound: true, turns: 1 },
      { id: "m4", name: "Léonie Bantsimba", role: "MEMBRE", paidCurrentRound: true, turns: 1 },
      { id: "m5", name: "Serge Makosso", role: "MEMBRE", paidCurrentRound: true, turns: 1 },
      { id: "m6", name: "Sylvie Tchicaya", role: "MEMBRE", paidCurrentRound: true, turns: 1 },
      { id: "m7", name: "David Nkodia", role: "MEMBRE", paidCurrentRound: true, turns: 1 },
      { id: "m8", name: "Clarisse Nzaba", role: "MEMBRE", paidCurrentRound: true, turns: 1 },
    ],
  },
];
