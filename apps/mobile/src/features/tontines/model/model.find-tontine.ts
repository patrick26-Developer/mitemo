import type { ReceivedInvitation } from "../../../shared/member/model.invitation";
import type { Tontine } from "../../../shared/member/model.portfolio";

/** Tontines suivies et invitations reçues, où chercher une tontine. */
export interface TontineSources {
  readonly tontines: readonly Tontine[];
  readonly invitations: readonly ReceivedInvitation[];
}

/**
 * Retrouve une tontine suivie, ou celle d'une invitation reçue : ses membres
 * restent consultables avant de répondre.
 * @param sources Tontines et invitations du membre.
 * @param id Identifiant de la tontine.
 * @returns La tontine, ou `undefined` si elle est introuvable.
 */
export function findTontine(sources: TontineSources, id: string): Tontine | undefined {
  return (
    sources.tontines.find((item) => item.id === id) ??
    sources.invitations.find((invitation) => invitation.tontine.id === id)?.tontine
  );
}
