import { Text, View } from "react-native";

import type { DemoMember } from "../../../shared/demo/member";
import { ProfileAvatar } from "./profile-avatar";

/** Props de l'en-tête du profil. */
export interface ProfileHeaderProps {
  readonly member: DemoMember;
  /** URI de la photo choisie, ou `null` avant le premier choix. */
  readonly photoUri: string | null;
  readonly onChangePhoto: () => void;
}

/**
 * Affiche la photo, le nom, le numéro et l'ancienneté du membre.
 * @param props Membre à afficher, photo courante et action de modification.
 * @returns L'en-tête du profil.
 */
export function ProfileHeader(props: ProfileHeaderProps) {
  const { member, photoUri, onChangePhoto } = props;

  return (
    <View className="flex-row items-center gap-4 px-4">
      <ProfileAvatar initial={member.avatarInitial} photoUri={photoUri} onPress={onChangePhoto} />
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
