/** Aucun numéro de service client n'est configuré. */
export class SupportContactUnavailableError extends Error {
  /** Crée l'erreur, avec un message pour l'exploitation. */
  constructor() {
    super("Aucun numéro de service client n'est configuré.");
    this.name = "SupportContactUnavailableError";
  }
}
