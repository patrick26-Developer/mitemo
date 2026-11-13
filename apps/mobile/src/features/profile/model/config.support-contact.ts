import { parseSupportContact } from "./model.support-contact";

/**
 * Service client de l'application, lu à la compilation dans
 * `EXPO_PUBLIC_SUPPORT_PHONE` et validé : `null` tant qu'il n'est pas
 * configuré, et les boutons WhatsApp et Appeler restent alors masqués.
 */
export const SUPPORT_CONTACT = parseSupportContact(process.env["EXPO_PUBLIC_SUPPORT_PHONE"]);
