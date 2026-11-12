/** Événements du fil d'une tontine, partagés avec tous ses membres. */
export const TONTINE_ACTIVITY_KINDS = ["joined", "paid", "received"] as const;

/** Événement du fil d'une tontine. Voir {@link TONTINE_ACTIVITY_KINDS}. */
export type TontineActivityKind = (typeof TONTINE_ACTIVITY_KINDS)[number];

/**
 * Événement du fil d'une tontine : un membre l'a rejointe, a cotisé ou a
 * reçu la restourne de son tour. Chaque membre de la tontine en est averti.
 */
export interface TontineActivity {
  readonly id: string;
  readonly kind: TontineActivityKind;
  readonly memberId: string;
  readonly memberName: string;
  /** Tour concerné, à partir de 1. */
  readonly round: number;
  /** Instant de l'événement, en ISO 8601 UTC. */
  readonly at: string;
}
