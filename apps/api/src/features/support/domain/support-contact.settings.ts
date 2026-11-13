import type { SupportPhone } from "./support-phone.value-object.js";

/** Contact du service client, tel que fixé par l'exploitation. */
export interface SupportContact {
  /** Numéro joint par WhatsApp ou par appel, `null` tant qu'il n'est pas configuré. */
  readonly phone: SupportPhone | null;
  /** Durée pendant laquelle les applications gardent le numéro en cache, en secondes. */
  readonly maxAgeSeconds: number;
}

/**
 * Port de lecture du contact du service client. Classe abstraite pour servir
 * de jeton d'injection sans dépendre de NestJS.
 */
export abstract class SupportContactSettings implements SupportContact {
  abstract readonly phone: SupportPhone | null;
  abstract readonly maxAgeSeconds: number;
}
