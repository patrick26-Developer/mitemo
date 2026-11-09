import {
  Bell,
  CircleHelp,
  CreditCard,
  FileText,
  Globe,
  History,
  Lock,
  ShieldCheck,
  SunMoon,
  UserRound,
} from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";

/** Thèmes proposés par l'application. */
export const PROFILE_THEMES = ["Système", "Clair", "Sombre"] as const;

/** Thème de l'application. Voir {@link PROFILE_THEMES}. */
export type ProfileTheme = (typeof PROFILE_THEMES)[number];

/** Langues proposées par l'application. */
export const PROFILE_LANGUAGES = ["Français", "Lingala", "Anglais"] as const;

/** Langue de l'interface. Voir {@link PROFILE_LANGUAGES}. */
export type ProfileLanguage = (typeof PROFILE_LANGUAGES)[number];

/** Identifiants des actions du profil, chacun ouvrant sa feuille. */
export const PROFILE_ACTION_IDS = [
  "identity",
  "payment",
  "history",
  "language",
  "theme",
  "notifications",
  "security",
  "help",
  "privacy",
  "terms",
] as const;

/** Action du profil. Voir {@link PROFILE_ACTION_IDS}. */
export type ProfileActionId = (typeof PROFILE_ACTION_IDS)[number];

/** Action proposée sur l'écran de profil. */
export interface ProfileActionContent {
  readonly id: ProfileActionId;
  readonly label: string;
  readonly icon: LucideIcon;
  /** Valeur courante affichée à droite du libellé, quand la ligne en porte une. */
  readonly value?: string;
}

/** Groupe d'actions du profil, sous un même titre. */
export interface ProfileGroupContent {
  readonly title: string;
  readonly actions: readonly ProfileActionContent[];
}

/** Groupes d'actions du profil. */
export const PROFILE_GROUPS: readonly ProfileGroupContent[] = [
  {
    title: "Mon compte",
    actions: [
      { id: "identity", label: "Informations personnelles", icon: UserRound },
      { id: "security", label: "Sécurité", icon: ShieldCheck },
      { id: "payment", label: "Moyen de paiement", icon: CreditCard },
      { id: "history", label: "Historique", icon: History },
    ],
  },
  {
    title: "Préférences",
    actions: [
      { id: "language", label: "Langue", icon: Globe, value: "Français" },
      { id: "theme", label: "Thème", icon: SunMoon, value: "Système" },
      { id: "notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    title: "Aide",
    actions: [{ id: "help", label: "Centre d'aide", icon: CircleHelp }],
  },
  {
    title: "Légal",
    actions: [
      { id: "privacy", label: "Politique de confidentialité", icon: Lock },
      { id: "terms", label: "Conditions d'utilisation", icon: FileText },
    ],
  },
];

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
