import { accentColors } from "../../model/model.accent-color";
import type { AccentColors } from "../../model/model.accent-color";
import { PALETTE } from "../../theme/theme.palette";
import { FilledButtonFace } from "./face.button-filled";
import { PressableScale } from "./scale.pressable";

/** Teintes proposées pour un bouton principal de feuille. */
export const SHEET_BUTTON_TONES = ["brand", "danger", "disabled"] as const;

/** Teinte d'un bouton principal de feuille. Voir {@link SHEET_BUTTON_TONES}. */
export type SheetButtonTone = (typeof SHEET_BUTTON_TONES)[number];

/** Couleurs de chaque teinte : fond (repris par la bordure) et libellé blanc. */
const TONE_COLORS: Readonly<Record<SheetButtonTone, AccentColors>> = {
  brand: { background: PALETTE.brand, foreground: PALETTE.white },
  danger: { background: PALETTE.danger, foreground: PALETTE.white },
  disabled: { background: "#E4E7EE", foreground: PALETTE.muted },
};

/** Props d'un bouton principal de feuille. */
export interface SheetPrimaryButtonProps {
  readonly label: string;
  readonly onPress: () => void;
  /** Libellé annoncé aux lecteurs d'écran, quand il diffère du texte visible. */
  readonly accessibilityLabel?: string;
  /** Teinte du fond, bleu de marque par défaut ; « disabled » grise et désactive le bouton. */
  readonly tone?: SheetButtonTone;
  /**
   * Couleur d'action propre à l'écran, par exemple la teinte d'une carte. Elle
   * remplace la teinte ; elle est foncée et son texte choisi pour rester lisible.
   */
  readonly accent?: string;
}

/**
 * Affiche l'action principale d'une feuille, pleine, centrée et texturée
 * d'un grain discret proche de sa couleur.
 * @param props Libellé, action, libellé d'accessibilité, teinte et couleur d'action.
 * @returns Le bouton principal.
 */
export function SheetPrimaryButton(props: SheetPrimaryButtonProps) {
  const { label, onPress, accessibilityLabel = label, tone = "brand", accent } = props;

  return (
    <PressableScale
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={tone === "disabled"}
    >
      <FilledButtonFace
        label={label}
        colors={
          accent === undefined || tone === "disabled" ? TONE_COLORS[tone] : accentColors(accent)
        }
        testID={accent === undefined ? "sheet-primary-fill" : "sheet-primary-accent"}
      />
    </PressableScale>
  );
}
