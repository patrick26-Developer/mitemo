import { SheetPrimaryButton } from "../../../shared/components/atoms/button.sheet-primary";
import { SheetSecondaryButton } from "../../../shared/components/atoms/button.sheet-secondary";

/** Props du bouton d'un moyen de paiement ou de retrait. */
export interface PayMethodButtonProps {
  readonly label: string;
  /** Plein pour le moyen mis en avant, en contour pour les autres. */
  readonly filled: boolean;
  /** Couleur d'action de l'écran d'origine, bleu de marque par défaut. */
  readonly accent: string | undefined;
  readonly onPress: () => void;
}

/**
 * Bouton d'un moyen, le même pour payer et pour retirer : plein pour le moyen
 * mis en avant, en contour pour les autres.
 * @param props Libellé, mise en avant, couleur d'action et choix.
 * @returns Le bouton du moyen.
 */
export function PayMethodButton(props: PayMethodButtonProps) {
  const { label, filled, onPress } = props;
  const accent = props.accent === undefined ? {} : { accent: props.accent };

  if (filled) return <SheetPrimaryButton label={label} onPress={onPress} {...accent} />;

  return <SheetSecondaryButton label={label} onPress={onPress} {...accent} />;
}
