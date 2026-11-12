import { SheetText } from "../../../shared/components/atoms/text.sheet";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";

/** Props de la feuille « Code PIN oublié ». */
export interface ForgotPinSheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
}

/**
 * Explique, dans une feuille du bas plutôt qu'une alerte, que la
 * réinitialisation du code arrivera avec l'API.
 * @param props Visibilité et fermeture.
 * @returns La feuille d'explication.
 */
export function ForgotPinSheet(props: ForgotPinSheetProps) {
  const { visible, onClose } = props;

  return (
    <BottomSheet visible={visible} title="Code PIN oublié" onClose={onClose}>
      <SheetText>La réinitialisation par SMS sera disponible prochainement.</SheetText>
    </BottomSheet>
  );
}
