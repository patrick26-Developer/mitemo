import type { SheetIcon } from "../atoms/badge.sheet-icon";
import { SheetPrimaryButton } from "../atoms/button.sheet-primary";
import type { SheetButtonTone } from "../atoms/button.sheet-primary";
import { SheetText } from "../atoms/text.sheet";
import { BottomSheet } from "./sheet.bottom";

/** Contenu d'une feuille de confirmation. */
export interface ConfirmSheetContent {
  readonly title: string;
  readonly message: string;
  readonly confirmLabel: string;
  /** Teinte de l'action, bleu de marque par défaut. */
  readonly tone?: SheetButtonTone;
  /** Icône posée au-dessus du titre. */
  readonly icon?: SheetIcon;
}

/** Props d'une feuille de confirmation. */
export interface ConfirmSheetProps {
  readonly content: ConfirmSheetContent;
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
}

/**
 * Demande confirmation avant une opération irréversible ou coûteuse.
 * Renoncer passe par la croix de la feuille : pas de bouton « Annuler ».
 * @param props Contenu, visibilité, fermeture et confirmation.
 * @returns La feuille de confirmation.
 */
export function ConfirmSheet(props: ConfirmSheetProps) {
  const { content, visible, onClose, onConfirm } = props;

  return (
    <BottomSheet
      visible={visible}
      title={content.title}
      onClose={onClose}
      {...(content.icon === undefined ? {} : { icon: content.icon })}
    >
      <SheetText>{content.message}</SheetText>
      <SheetPrimaryButton
        label={content.confirmLabel}
        onPress={onConfirm}
        {...(content.tone === undefined ? {} : { tone: content.tone })}
      />
    </BottomSheet>
  );
}
