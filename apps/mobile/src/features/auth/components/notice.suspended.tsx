import { ShieldAlert } from "lucide-react-native";
import { Text, View } from "react-native";

import { SheetIconBadge } from "../../../shared/components/atoms/badge.sheet-icon";
import { SheetSecondaryButton } from "../../../shared/components/atoms/button.sheet-secondary";
import { SupportContactSection } from "../../../shared/components/macros/section.support-contact";
import { useSupportContact } from "../../../shared/support/hook.support-contact";

/** Props de l'avis de suspension. */
export interface SuspendedNoticeProps {
  /** Ferme la session pour se connecter avec un autre numéro. */
  readonly onSwitchAccount: () => void;
  /** Faux quand la feuille porte déjà l'icône et le titre. */
  readonly heading?: boolean;
}

/**
 * Avis d'un compte suspendu après trop de codes incorrects : le membre
 * contacte le service client, sur WhatsApp ou par téléphone, ou change de
 * compte.
 * @param props Changement de compte.
 * @returns L'avis de suspension.
 */
export function SuspendedNotice(props: SuspendedNoticeProps) {
  const { contact, open } = useSupportContact();

  return (
    <View className="gap-4" accessibilityRole="alert">
      {props.heading === false ? null : <SuspendedHeading />}
      <Text className="text-center text-[14px] leading-5 text-muted">
        Trop de codes incorrects : par sécurité, votre compte est suspendu. Contactez le service
        client pour le débloquer, ou connectez-vous avec un autre compte.
      </Text>
      <SupportContactSection contact={contact} onOpen={(url) => void open(url)} />
      <SheetSecondaryButton label="Changer de compte" onPress={props.onSwitchAccount} />
    </View>
  );
}

/**
 * Bouclier et titre de l'avis, hors d'une feuille qui les porte déjà.
 * @returns L'en-tête de l'avis.
 */
function SuspendedHeading() {
  return (
    <>
      <SheetIconBadge sheetIcon={{ icon: ShieldAlert, tone: "danger" }} />
      <Text accessibilityRole="header" className="text-center text-[20px] font-bold text-ink">
        Compte suspendu
      </Text>
    </>
  );
}
