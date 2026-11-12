import type { Tontine } from "./model.portfolio";

/**
 * Invitation reçue par le membre connecté : il voit la tontine telle qu'elle
 * est avant de l'accepter, en choisissant ses tours, ou de la refuser.
 */
export interface ReceivedInvitation {
  readonly id: string;
  /** Nom de l'administrateur qui a envoyé l'invitation. */
  readonly invitedBy: string;
  /** Tontine proposée, dont le membre connecté ne fait pas encore partie. */
  readonly tontine: Tontine;
}
