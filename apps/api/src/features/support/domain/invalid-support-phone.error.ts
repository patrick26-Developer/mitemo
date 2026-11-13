/** Le numéro du service client configuré n'est pas un numéro de téléphone valide. */
export class InvalidSupportPhoneError extends Error {
  /**
   * Crée l'erreur avec la valeur fautive.
   * @param raw Valeur reçue, rappelée pour corriger la configuration.
   */
  constructor(raw: string) {
    super(`SUPPORT_PHONE invalide : « ${raw} » n'est pas un numéro de téléphone valide.`);
    this.name = "InvalidSupportPhoneError";
  }
}
