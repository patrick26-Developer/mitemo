import type { ViewStyle } from "react-native";

/** Ombre portée, décrite comme sur iOS. */
export interface ShadowSpec {
  /** Décalage vertical, en points ; négatif pour une ombre vers le haut. */
  readonly y: number;
  /** Rayon de flou d'iOS (`shadowRadius`), en points. */
  readonly radius: number;
  /** Opacité du noir, entre 0 et 1. */
  readonly opacity: number;
}

/**
 * Ombre CSS (`boxShadow`), rendue pareil sur iOS et Android, alors que
 * `shadow*` ne vaut que pour iOS et que `elevation` donne sur Android une
 * ombre différente, voire aucune sur une vue sans fond. Le flou CSS vaut
 * deux fois le rayon d'iOS.
 * @param spec Décalage, rayon et opacité.
 * @returns La valeur `boxShadow`.
 */
export function boxShadow(spec: ShadowSpec): string {
  return `0px ${spec.y}px ${spec.radius * 2}px rgba(0, 0, 0, ${spec.opacity})`;
}

/** Ombres de l'application, identiques sur les deux plateformes. */
export const SHADOWS = {
  /** Feuille du bas, ombre vers le haut. */
  sheet: { boxShadow: boxShadow({ y: -8, radius: 24, opacity: 0.16 }) },
  /** Toast flottant. */
  toast: { boxShadow: boxShadow({ y: 8, radius: 18, opacity: 0.1 }) },
  /** Menu déroulant d'une liste de choix. */
  menu: { boxShadow: boxShadow({ y: 4, radius: 12, opacity: 0.08 }) },
  /** Barre d'onglets, ombre vers le haut. */
  tabBar: { boxShadow: boxShadow({ y: -2, radius: 12, opacity: 0.06 }) },
  /** Pastille d'action flottante. */
  pill: { boxShadow: boxShadow({ y: 4, radius: 10, opacity: 0.08 }) },
} as const satisfies Readonly<Record<string, ViewStyle>>;
