import type { SupportContact } from "../domain/support-contact.settings.js";
import { SupportPhone } from "../domain/support-phone.value-object.js";

/** Durée de vie du numéro dans le cache des applications : une journée, en secondes. */
export const SUPPORT_CONTACT_MAX_AGE_SECONDS = 86_400;

/**
 * Lit le contact du service client dans l'environnement, validé au démarrage :
 * un numéro invalide empêche l'API de démarrer plutôt que d'être servi.
 * @param env Variables d'environnement.
 * @returns Le contact, numéro `null` quand `SUPPORT_PHONE` est absent ou vide.
 * @throws {InvalidSupportPhoneError} si `SUPPORT_PHONE` n'est pas un numéro valide.
 */
export function readSupportContactSettings(
  env: Readonly<Record<string, string | undefined>>,
): SupportContact {
  const raw = env["SUPPORT_PHONE"]?.trim() ?? "";

  return {
    phone: raw === "" ? null : SupportPhone.parse(raw),
    maxAgeSeconds: SUPPORT_CONTACT_MAX_AGE_SECONDS,
  };
}
