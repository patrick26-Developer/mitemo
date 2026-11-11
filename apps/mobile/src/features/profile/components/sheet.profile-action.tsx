import type { ComponentType } from "react";

import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import type {
  ProfileActionContent,
  ProfileActionId,
} from "../../../shared/model/model.profile-actions";
import { HelpSheet } from "./sheets/sheet.help";
import { IdentitySheet } from "./sheets/sheet.identity";
import { NotificationsSheet } from "./sheets/sheet.notifications";
import { PaymentSheet } from "./sheets/sheet.payment";
import { PrivacySheet } from "./sheets/sheet.privacy";
import { SecuritySheet } from "./sheets/sheet.security";
import { TermsSheet } from "./sheets/sheet.terms";

/** Contenu affiché pour chaque action ; l'historique a sa propre page. */
const ACTION_SHEETS: Readonly<Record<ProfileActionId, ComponentType | null>> = {
  tontines: null,
  cards: null,
  identity: IdentitySheet,
  payment: PaymentSheet,
  history: null,
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
