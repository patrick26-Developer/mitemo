import type {
  ProfileActionContent,
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
 * Valeur affichée à droite d'une action, selon les préférences courantes.
 * @param action Action dont la valeur est demandée.
 * @param theme Thème sélectionné.
 * @param language Langue sélectionnée.
 * @returns La valeur de la ligne, ou `undefined` si elle n'en porte pas.
 */
function valueFor(
  action: ProfileActionContent,
  theme: ProfileTheme,
  language: ProfileLanguage,
): string | undefined {
  if (action.id === "theme") return theme;
  if (action.id === "language") return language;
  return action.value;
}

/**
 * Reconstruit les groupes du profil avec le thème et la langue réellement
 * choisis, pour que les lignes ne montrent jamais une valeur périmée.
 * @param theme Thème sélectionné.
 * @param language Langue sélectionnée.
 * @returns Les groupes d'actions à afficher.
 */
export function profileGroupsFor(
  theme: ProfileTheme,
  language: ProfileLanguage,
): readonly ProfileGroupContent[] {
  return PROFILE_GROUPS.map((group) => ({
    ...group,
    actions: group.actions.map((action) => withValue(action, theme, language)),
  }));
}

/**
 * Ajoute la valeur courante à une action, sans créer de propriété vide.
 * @param action Action d'origine.
 * @param theme Thème sélectionné.
 * @param language Langue sélectionnée.
 * @returns L'action, avec sa valeur si elle en porte une.
 */
function withValue(
  action: ProfileActionContent,
  theme: ProfileTheme,
  language: ProfileLanguage,
): ProfileActionContent {
  const value = valueFor(action, theme, language);

  return value === undefined ? action : { ...action, value };
}
