import type { ComponentType } from "react";

import { BottomSheet } from "../../../shared/components/bottom-sheet";
import type { ProfileActionContent, ProfileActionId } from "../model/profile-content";
import { HelpSheet } from "./sheets/help-sheet";
import { IdentitySheet } from "./sheets/identity-sheet";
import { LanguageSheet } from "./sheets/language-sheet";
import { NotificationsSheet } from "./sheets/notifications-sheet";
import { PaymentSheet } from "./sheets/payment-sheet";
import { PrivacySheet } from "./sheets/privacy-sheet";
import { SecuritySheet } from "./sheets/security-sheet";
import { TermsSheet } from "./sheets/terms-sheet";
import { ThemeSheet } from "./sheets/theme-sheet";

/** Contenu affiché pour chaque action ; l'historique a sa propre page. */
const ACTION_SHEETS: Readonly<Record<ProfileActionId, ComponentType | null>> = {
  identity: IdentitySheet,
  payment: PaymentSheet,
  history: null,
  language: LanguageSheet,
  theme: ThemeSheet,
  notifications: NotificationsSheet,
  security: SecuritySheet,
  help: HelpSheet,
  privacy: PrivacySheet,
  terms: TermsSheet,
};

/** Props de la feuille d'action du profil. */
export interface ProfileActionSheetProps {
  /** Action choisie, ou `null` quand aucune feuille n'est ouverte. */
  readonly action: ProfileActionContent | null;
  readonly onClose: () => void;
}

/**
 * Ouvre la feuille correspondant à l'action choisie, sans quitter le profil.
 * @param props Action choisie et fermeture.
 * @returns La feuille d'action.
 */
export function ProfileActionSheet(props: ProfileActionSheetProps) {
  const { action, onClose } = props;
  const Content = action === null ? null : ACTION_SHEETS[action.id];

  return (
    <BottomSheet
      visible={action !== null}
      title={action === null ? "" : action.label}
      onClose={onClose}
    >
      {Content ? <Content /> : null}
    </BottomSheet>
  );
}
