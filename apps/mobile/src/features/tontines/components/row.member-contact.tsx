import { UserPlus } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { MemberPhoto } from "../../../shared/components/atoms/photo.member";
import { formatPhone } from "../../../shared/format/format.phone";
import type { MemberContact } from "../../../shared/member/model.portfolio-create";
import { PALETTE } from "../../../shared/theme/theme.palette";
import { withTapSound } from "../../../shared/feedback/api.tap-sound";

/** Ce que fait le toucher d'un contact : l'ajouter, ou l'inviter sur Mitemo. */
export type MemberContactAction = "add" | "invite";

/** Props d'une ligne de contact du répertoire. */
export interface MemberContactRowProps {
  readonly contact: MemberContact;
  readonly action: MemberContactAction;
  readonly onPress: () => void;
}

/**
 * Contact du répertoire dans l'ajout de membres : avec un compte Mitemo, il
 * s'ajoute à la tontine ; sans compte, on l'invite à rejoindre Mitemo.
 * @param props Contact, action et toucher.
 * @returns La ligne du contact.
 */
export function MemberContactRow(props: MemberContactRowProps) {
  const { contact, action, onPress } = props;
  const label = action === "add" ? `Ajouter ${contact.name}` : `Inviter ${contact.name} sur Mitemo`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={action === "add" ? withTapSound("add", onPress) : onPress}
      className="flex-row items-center gap-3 rounded-[14px] border border-card-border bg-white px-4 py-3"
    >
      <MemberPhoto
        photoUri={null}
        initial={contact.name.slice(0, 1)}
        size={36}
        seed={contact.name}
        testID="contact-photo"
      />
      <View className="flex-1 gap-0.5">
        <Text className="text-[15px] text-ink" numberOfLines={1}>
          {contact.name}
        </Text>
        <Text className="text-[12px] text-muted">{formatPhone(contact.phone)}</Text>
      </View>
      <ContactAction action={action} />
    </Pressable>
  );
}

/** Props du repère d'action d'un contact. */
interface ContactActionProps {
  readonly action: MemberContactAction;
}

/**
 * Repère à droite du contact : l'icône d'ajout, ou « Inviter » comme sur
 * WhatsApp pour un contact sans compte.
 * @param props Action du contact.
 * @returns Le repère.
 */
function ContactAction(props: ContactActionProps) {
  if (props.action === "add") return <UserPlus size={18} color={PALETTE.tabInk} />;

  return <Text className="text-[14px] font-semibold text-brand">Inviter</Text>;
}
