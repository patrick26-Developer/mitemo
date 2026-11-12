/** Pages de la présentation, dans l'ordre d'affichage. */
export const ONBOARDING_SLIDE_IDS = ["tontines", "payment", "savings"] as const;

/** Page de la présentation. Voir {@link ONBOARDING_SLIDE_IDS}. */
export type OnboardingSlideId = (typeof ONBOARDING_SLIDE_IDS)[number];

/** Contenu d'une page de la présentation. */
export interface OnboardingSlide {
  readonly id: OnboardingSlideId;
  readonly title: string;
  readonly message: string;
}

/** Les trois pages montrées au premier lancement, avant la connexion. */
export const ONBOARDING_SLIDES: readonly OnboardingSlide[] = [
  {
    id: "tontines",
    title: "Vos tontines, sans cahier",
    message:
      "Créez une tontine, invitez vos proches : chacun accepte l'invitation et choisit son nombre de tours.",
  },
  {
    id: "payment",
    title: "Cotisez en un geste",
    message:
      "Payez avec MTN MoMo, Airtel Money ou votre solde Mitemo. La tontine se met à jour toute seule.",
  },
  {
    id: "savings",
    title: "Épargnez pas à pas",
    message:
      "Une carte de pointage vous aide à mettre de côté, marqueur après marqueur, jusqu'à votre objectif.",
  },
];

/**
 * Page suivante de la présentation, sans dépasser la dernière.
 * @param index Page courante, à partir de 0.
 * @param total Nombre de pages.
 * @returns L'indice de la page suivante.
 */
export function nextSlide(index: number, total: number): number {
  return Math.min(index + 1, total - 1);
}

/**
 * Indique si la page courante est la dernière.
 * @param index Page courante, à partir de 0.
 * @param total Nombre de pages.
 * @returns `true` sur la dernière page.
 */
export function isLastSlide(index: number, total: number): boolean {
  return index >= total - 1;
}
