import { Bell, CircleHelp, CreditCard, Globe, ShieldCheck, UserRound } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";

/** Action proposée sur l'écran de profil. */
export interface ProfileActionContent {
  readonly id: string;
  readonly label: string;
  readonly icon: LucideIcon;
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
    ],
  },
  {
    title: "Préférences",
    actions: [
      { id: "language", label: "Langue", icon: Globe },
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
];
