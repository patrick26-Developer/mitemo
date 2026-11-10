/** Sens d'une opération de l'historique. */
export type ProfileHistoryDirection = "credit" | "debit";

/** Opération affichée dans l'historique du profil. */
export interface ProfileHistoryEntry {
  readonly id: string;
  readonly label: string;
  /** Date de l'opération, en UTC. */
  readonly date: string;
  /** Montant en plus petite unité de la devise (franc CFA). */
  readonly amount: bigint;
  readonly direction: ProfileHistoryDirection;
}

/** Historique de démonstration, du plus récent au plus ancien. */
export const PROFILE_HISTORY: readonly ProfileHistoryEntry[] = [
  {
    id: "1",
    label: "Cotisation tontine",
    date: "2026-11-08",
    amount: 5_000n,
    direction: "debit",
  },
  {
    id: "2",
    label: "Dépôt sur carte",
    date: "2026-11-05",
    amount: 10_000n,
    direction: "credit",
  },
  {
    id: "3",
    label: "Versement du tour",
    date: "2026-10-28",
    amount: 45_000n,
    direction: "credit",
  },
  {
    id: "4",
    label: "Cotisation tontine",
    date: "2026-10-25",
    amount: 5_000n,
    direction: "debit",
  },
];
