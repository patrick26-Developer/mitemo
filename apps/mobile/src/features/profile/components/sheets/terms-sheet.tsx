import { TERMS_SECTIONS } from "../../model/profile-documents";
import { LegalSheet } from "./legal-sheet";

/** Date de dernière mise à jour des conditions, telle qu'affichée. */
const UPDATED_AT = "novembre 2026";

/**
 * Affiche les conditions d'utilisation.
 * @returns Le contenu de la feuille « Conditions d'utilisation ».
 */
export function TermsSheet() {
  return <LegalSheet updatedAt={UPDATED_AT} sections={TERMS_SECTIONS} />;
}
