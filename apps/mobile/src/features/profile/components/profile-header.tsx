import { Text, View } from "react-native";

import type { DemoMember } from "../../../shared/demo/member";

/** Props de l'en-tête du profil. */
export interface ProfileHeaderProps {
  readonly member: DemoMember;
}

/**
 * Affiche l'avatar, le nom, le numéro et l'ancienneté du membre.
 * @param props Membre à afficher.
 * @returns L'en-tête du profil.
 */
export function ProfileHeader(props: ProfileHeaderProps) {
  const { member } = props;

  return (
    <View className="flex-row items-center gap-4 px-4">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-avatar">
        <Text className="text-[24px] font-bold text-white">{member.avatarInitial}</Text>
      </View>
      <View className="flex-1 gap-0.5">
        <Text accessibilityRole="header" className="text-[24px] font-bold text-ink">
          {member.name}
        </Text>
        <Text className="text-[14px] text-muted">{member.phone}</Text>
        <Text className="text-[12px] text-muted">{member.joinedAt}</Text>
      </View>
    </View>
  );
}
