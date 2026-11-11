import { UserPlus } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { formatPhone } from "../../../shared/format/format.phone";
import type { MemberContact } from "../../../shared/member/model.portfolio-create";
import { PALETTE } from "../../../shared/theme/theme.palette";

/** Props d'un contact proposé à l'inscription. */
export interface MemberContactRowProps {
  readonly contact: MemberContact;
  readonly onPress: () => void;
}

/**
 * Affiche un contact du répertoire qui a un compte Mitemo : son nom, son
 * numéro et l'action de l'inscrire.
 * @param props Contact et inscription.
 * @returns La ligne du contact.
 */
export function MemberContactRow(props: MemberContactRowProps) {
  const { contact, onPress } = props;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ajouter ${contact.name}`}
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-[14px] border border-card-border bg-white px-4 py-3"
    >
      <View className="h-9 w-9 items-center justify-center rounded-full bg-tab-active">
        <Text className="text-[14px] font-bold text-tab-ink">{contact.name.slice(0, 1)}</Text>
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="text-[15px] text-ink" numberOfLines={1}>
          {contact.name}
        </Text>
        <Text className="text-[12px] text-muted">{formatPhone(contact.phone)}</Text>
      </View>
      <UserPlus size={18} color={PALETTE.tabInk} />
    </Pressable>
  );
}
