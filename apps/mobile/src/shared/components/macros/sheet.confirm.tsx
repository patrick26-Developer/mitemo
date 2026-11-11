import { Text } from "react-native";

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
 * @param props Contenu, visibilité, fermeture et confirmation.
 * @returns La feuille de confirmation.
 */
export function ConfirmSheet(props: ConfirmSheetProps) {
  const { content, visible, onClose, onConfirm } = props;

  return (
    <BottomSheet visible={visible} title={content.title} onClose={onClose}>
      <SheetText>{content.message}</SheetText>
      <SheetPrimaryButton
        label={content.confirmLabel}
        onPress={onConfirm}
        {...(content.tone === undefined ? {} : { tone: content.tone })}
      />
      <Text
        accessibilityRole="button"
        accessibilityLabel="Annuler"
        onPress={onClose}
        className="py-2 text-center text-[14px] text-muted"
      >
        Annuler
      </Text>
    </BottomSheet>
  );
}
