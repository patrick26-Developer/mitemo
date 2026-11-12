import type { ReceivedInvitation } from "../member/model.invitation";

/**
 * Invitation reçue livrée avec l'application tant que l'API n'est pas
 * branchée : une tontine de 12 tours dont 7 sont déjà pris, pour montrer
 * l'acceptation avec choix du nombre de tours et le refus.
 */
export const INITIAL_INVITATIONS: readonly ReceivedInvitation[] = [
  {
    id: "invitation-poto-poto",
    invitedBy: "Mama Nadège",
    tontine: {
      id: "4",
      name: "Commerçantes de Poto-Poto",
      contribution: 2_500n,
      frequency: { unit: "semaine", interval: 1 },
      round: 1,
      totalRounds: 12,
      state: "PENDING",
      beneficiaryId: "p1",
      description:
        "Tontine hebdomadaire des commerçantes du marché de Poto-Poto. Chacune prend un ou plusieurs tours.",
      headerColors: ["#F2A0B5", "#FBD0DA"],
      invitationCode: null,
      invitations: [],
      members: [
        { id: "p1", name: "Mama Nadège", role: "ADMIN", paidCurrentRound: false, turns: 2 },
        { id: "p2", name: "Pauline Elenga", role: "MEMBRE", paidCurrentRound: false, turns: 3 },
        { id: "p3", name: "Léonie Bantsimba", role: "MEMBRE", paidCurrentRound: false, turns: 1 },
        { id: "p4", name: "Clarisse Nzaba", role: "MEMBRE", paidCurrentRound: false, turns: 1 },
      ],
    },
  },
];
