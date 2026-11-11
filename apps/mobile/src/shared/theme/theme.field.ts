import type { ViewStyle } from "react-native";

/** Couleurs et mesures communes aux champs de saisie, calquées sur shadcn/ui. */
export const FIELD_CHROME = {
  /** Fond gris clair d'un champ au repos. */
  background: "#F4F5F8",
  /** Bordure grise d'un champ au repos. */
  border: "#D6D9E2",
  /** Bordure d'un champ au focus. */
  focusBorder: "#083EDF",
  /** Anneau de focus, bleu de marque à mi-opacité. */
  focusRing: "rgba(8, 62, 223, 0.5)",
  /** Bordure d'un champ en erreur. */
  errorBorder: "#B42318",
  /** Anneau d'un champ en erreur, rouge à faible opacité. */
  errorRing: "rgba(180, 35, 24, 0.25)",
} as const;

/** Épaisseur de l'anneau de focus ou d'erreur, en points, comme shadcn/ui. */
const RING_WIDTH = 3;

/** Écart entre l'anneau et la bordure, en points. */
const RING_OFFSET = 1;

/** État visuel d'un champ. */
export interface FieldChromeState {
  readonly focused: boolean;
  readonly invalid: boolean;
}

/**
 * Cadre neutre d'un champ : fond gris et bordure de la couleur demandée.
 * @param borderColor Couleur de la bordure.
 * @returns Le style du cadre.
 */
function plainChrome(borderColor: string): ViewStyle {
  return { backgroundColor: FIELD_CHROME.background, borderColor };
}

/**
 * Cadre d'un champ signalé : bordure colorée et anneau de trois points.
 * @param borderColor Couleur de la bordure.
 * @param ringColor Couleur de l'anneau.
 * @returns Le style du cadre et de l'anneau.
 */
function ringChrome(borderColor: string, ringColor: string): ViewStyle {
  return {
    ...plainChrome(borderColor),
    outlineColor: ringColor,
    outlineOffset: RING_OFFSET,
    outlineStyle: "solid",
    outlineWidth: RING_WIDTH,
  };
}

/**
 * Calcule le cadre d'un champ : fond et bordure gris au repos, anneau bleu au
 * focus, anneau et bordure rouges en erreur. L'anneau est dessiné en dehors de
 * la bordure, sans déplacer la mise en page, comme les `input` de shadcn/ui.
 * @param state Focus et erreur du champ.
 * @returns Le style du cadre, à poser sur le champ.
 */
export function fieldChrome(state: FieldChromeState): ViewStyle {
  if (state.invalid) return ringChrome(FIELD_CHROME.errorBorder, FIELD_CHROME.errorRing);
  if (state.focused) return ringChrome(FIELD_CHROME.focusBorder, FIELD_CHROME.focusRing);

  return plainChrome(FIELD_CHROME.border);
}
