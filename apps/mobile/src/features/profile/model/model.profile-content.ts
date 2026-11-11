import type {
  ProfileActionContent,
  ProfileCounts,
  ProfileGroupContent,
} from "../../../shared/model/model.profile-actions";
import { PROFILE_GROUPS } from "../../../shared/model/model.profile-actions";

/** Thèmes proposés par l'application. */
export const PROFILE_THEMES = ["Système", "Clair", "Sombre"] as const;

/** Thème de l'application. Voir {@link PROFILE_THEMES}. */
export type ProfileTheme = (typeof PROFILE_THEMES)[number];

/** Langues proposées par l'application. */
export const PROFILE_LANGUAGES = ["Français", "Lingala", "Anglais"] as const;

/** Langue de l'interface. Voir {@link PROFILE_LANGUAGES}. */
export type ProfileLanguage = (typeof PROFILE_LANGUAGES)[number];

/**
 * Préférences et compteurs qui déterminent les valeurs affichées.
 */
interface ProfileDisplay {
  readonly theme: ProfileTheme;
  readonly language: ProfileLanguage;
  readonly counts: ProfileCounts;
}

/**
 * Valeur affichée à droite d'une action, selon les préférences courantes.
 * @param action Action dont la valeur est demandée.
 * @param display Thème, langue et compteurs courants.
 * @returns La valeur de la ligne, ou `undefined` si elle n'en porte pas.
 */
function valueFor(action: ProfileActionContent, display: ProfileDisplay): string | undefined {
  if (action.id === "theme") return display.theme;
  if (action.id === "language") return display.language;
  if (action.id === "tontines") return String(display.counts.tontines);
  if (action.id === "cards") return String(display.counts.cards);
  return action.value;
}

/**
 * Reconstruit les groupes du profil avec le thème, la langue et les compteurs
 * réellement choisis, pour que les lignes ne montrent jamais une valeur périmée.
 * @param theme Thème sélectionné.
 * @param language Langue sélectionnée.
 * @param counts Nombres de tontines et de cartes actives.
 * @returns Les groupes d'actions à afficher.
 */
export function profileGroupsFor(
  theme: ProfileTheme,
  language: ProfileLanguage,
  counts: ProfileCounts,
): readonly ProfileGroupContent[] {
  const display: ProfileDisplay = { theme, language, counts };

  return PROFILE_GROUPS.map((group) => ({
    ...group,
    actions: group.actions.map((action) => withValue(action, display)),
  }));
}

/**
 * Ajoute la valeur courante à une action, sans créer de propriété vide.
 * @param action Action d'origine.
 * @param display Thème, langue et compteurs courants.
 * @returns L'action, avec sa valeur si elle en porte une.
 */
function withValue(action: ProfileActionContent, display: ProfileDisplay): ProfileActionContent {
  const value = valueFor(action, display);

  return value === undefined ? action : { ...action, value };
}
