import {
  Bell,
  CircleHelp,
  CreditCard,
  FileText,
  Globe,
  History,
  Lock,
  PiggyBank,
  ShieldCheck,
  SunMoon,
  UserRound,
  UsersRound,
} from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";

import { DEMO_SAVINGS } from "../demo/demo.savings";
import { DEMO_TONTINES } from "../demo/demo.tontines";

/**
 * Identifiants des actions du profil, chacun ouvrant sa feuille.
 *
 * Ce contenu est partagé par le profil et par la recherche globale : il vit
 * donc dans `shared/` plutôt que dans la feature qui l'affiche en premier.
 */
export const PROFILE_ACTION_IDS = [
  "tontines",
  "cards",
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

/** Nombre de tontines actives du membre de démonstration. */
const ACTIVE_TONTINE_COUNT = DEMO_TONTINES.filter((item) => item.state === "ACTIVE").length;

/** Nombre de cartes de pointage actives du membre de démonstration. */
const ACTIVE_CARD_COUNT = DEMO_SAVINGS.filter((item) => item.state === "ACTIVE").length;

/** Groupes d'actions du profil. */
export const PROFILE_GROUPS: readonly ProfileGroupContent[] = [
  {
    title: "Mes espaces",
    actions: [
      {
        id: "tontines",
        label: "Mes tontines",
        icon: UsersRound,
        value: String(ACTIVE_TONTINE_COUNT),
      },
      { id: "cards", label: "Mes cartes", icon: PiggyBank, value: String(ACTIVE_CARD_COUNT) },
    ],
  },
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
