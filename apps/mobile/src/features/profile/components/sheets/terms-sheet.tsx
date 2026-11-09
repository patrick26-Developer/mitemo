import { SheetText } from "../../../../shared/components/sheet-text";
import { TERMS_SECTIONS } from "../../model/profile-documents";
import { LegalContent } from "./legal-content";

/**
 * Affiche les conditions d'utilisation.
 * @returns Le contenu de la feuille « Conditions d'utilisation ».
 */
export function TermsSheet() {
  return (
    <>
      <SheetText>Dernière mise à jour : novembre 2026.</SheetText>
      <LegalContent sections={TERMS_SECTIONS} />
    </>
  );
}
