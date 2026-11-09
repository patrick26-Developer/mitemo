import { PRIVACY_SECTIONS } from "../../model/profile-documents";
import { LegalSheet } from "./legal-sheet";

/** Date de dernière mise à jour de la politique, telle qu'affichée. */
const UPDATED_AT = "novembre 2026";

/**
 * Affiche la politique de confidentialité.
 * @returns Le contenu de la feuille « Politique de confidentialité ».
 */
export function PrivacySheet() {
  return <LegalSheet updatedAt={UPDATED_AT} sections={PRIVACY_SECTIONS} />;
}
