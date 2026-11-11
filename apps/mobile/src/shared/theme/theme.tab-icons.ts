import type { LucideIcon } from "lucide-react-native";
import { House, UserRound, UsersRoundCollaboration, Wallet } from "lucide-react-native";

/**
 * Icône de chaque onglet de l'application, partagée par la barre d'onglets et
 * par les états vides, pour qu'un écran vide rappelle l'onglet où l'on est.
 */
export const TAB_ICONS = {
  home: House,
  tontines: UsersRoundCollaboration,
  savings: Wallet,
  profile: UserRound,
} as const satisfies Readonly<Record<string, LucideIcon>>;
