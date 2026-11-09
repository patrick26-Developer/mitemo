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

/** Thème actif : celui du système, comme déclaré dans `app.json`. */
export const CURRENT_PROFILE_THEME: ProfileTheme = "Système";

/** Action proposée sur l'écran de profil. */
export interface ProfileActionContent {
  readonly id: string;
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

/** Groupes d'actions affichés tant que les écrans cibles n'existent pas. */
export const PROFILE_GROUPS: readonly ProfileGroupContent[] = [
  {
    title: "Mon compte",
    actions: [
      { id: "identity", label: "Mes informations", icon: UserRound },
      { id: "payment", label: "Moyen de paiement", icon: CreditCard },
      { id: "history", label: "Historique", icon: History },
    ],
  },
  {
    title: "Préférences",
    actions: [
      { id: "language", label: "Langue", icon: Globe },
      { id: "theme", label: "Thème", icon: SunMoon, value: CURRENT_PROFILE_THEME },
      { id: "notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    title: "Aide",
    actions: [
      { id: "security", label: "Sécurité", icon: ShieldCheck },
      { id: "help", label: "Centre d'aide", icon: CircleHelp },
    ],
  },
  {
    title: "Légal",
    actions: [
      { id: "privacy", label: "Politique de confidentialité", icon: Lock },
      { id: "terms", label: "Conditions d'utilisation", icon: FileText },
    ],
  },
];
