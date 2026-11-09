import { SheetText } from "../../../../shared/components/sheet-text";
import { PRIVACY_SECTIONS } from "../../model/profile-documents";
import { LegalContent } from "./legal-content";

/**
 * Affiche la politique de confidentialité.
 * @returns Le contenu de la feuille « Politique de confidentialité ».
 */
export function PrivacySheet() {
  return (
    <>
      <SheetText>Dernière mise à jour : novembre 2026.</SheetText>
      <LegalContent sections={PRIVACY_SECTIONS} />
    </>
  );
}
