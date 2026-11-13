import { SupportContactUnavailableError } from "../domain/support-contact-unavailable.error.js";
import type { SupportContact } from "../domain/support-contact.settings.js";
import type { SupportPhone } from "../domain/support-phone.value-object.js";

/** Contact du service client, numéro garanti. */
export interface AvailableSupportContact {
  readonly phone: SupportPhone;
  /** Durée de vie en cache, en secondes. */
  readonly maxAgeSeconds: number;
}

/**
 * Donne le contact du service client aux applications.
 * @throws {SupportContactUnavailableError} si aucun numéro n'est configuré.
 */
export class GetSupportContactUseCase {
  /**
   * Retient le contact fixé par l'exploitation.
   * @param settings Contact fixé par l'exploitation.
   */
  constructor(private readonly settings: SupportContact) {}

  /**
   * Lit le contact configuré.
   * @returns Le numéro et sa durée de vie en cache.
   * @throws {SupportContactUnavailableError} si aucun numéro n'est configuré.
   */
  execute(): AvailableSupportContact {
    const { phone, maxAgeSeconds } = this.settings;
    if (phone === null) throw new SupportContactUnavailableError();

    return { phone, maxAgeSeconds };
  }
}
