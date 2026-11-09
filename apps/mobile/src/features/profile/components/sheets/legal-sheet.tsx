import { SheetText } from "../../../../shared/components/sheet-text";
import type { ProfileLegalSection } from "../../model/profile-documents";
import { LegalContent } from "./legal-content";

/** Props d'un document légal affiché dans une feuille. */
export interface LegalSheetProps {
  /** Date de dernière mise à jour, telle qu'affichée au membre. */
  readonly updatedAt: string;
  readonly sections: readonly ProfileLegalSection[];
}

/**
 * Affiche un document légal daté et ses sections.
 * @param props Date de mise à jour et sections du document.
 * @returns Le contenu du document légal.
 */
export function LegalSheet(props: LegalSheetProps) {
  const { updatedAt, sections } = props;

  return (
    <>
      <SheetText>{`Dernière mise à jour : ${updatedAt}.`}</SheetText>
      <LegalContent sections={sections} />
    </>
  );
}
