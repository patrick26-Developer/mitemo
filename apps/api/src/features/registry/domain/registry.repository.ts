/** Erreur métier du registre, sans données sensibles. */
export class RegistryError extends Error {
  /**
   * Construit un refus du registre sans données personnelles.
   * @param message Motif destiné au demandeur.
   * @param inaccessible Masque une ressource extérieure au périmètre du membre.
   */
  constructor(
    message: string,
    readonly inaccessible = false,
  ) {
    super(message);
  }
}

/** Commande déclarative effectuée par une session authentifiée. */
export interface RegistryCommand {
  readonly actorId: string;
  readonly operation:
    | "CREATE"
    | "LIST"
    | "READ"
    | "MEMBERS"
    | "INVITE"
    | "ACCEPT"
    | "DECLINE"
    | "RENAME"
    | "INVITATIONS";
  readonly resourceId?: string;
  readonly idempotencyKey?: string;
  readonly body?: unknown;
}

/** Port du registre persistant. */
export abstract class RegistryRepository {
  /**
   * Exécute une commande déclarative avec ses droits et sa traçabilité.
   * @param command Action et identité authentifiée.
   * @returns Le résultat du registre.
   */
  abstract execute(command: RegistryCommand): Promise<unknown>;
}
