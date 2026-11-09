import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DEMO_MEMBER } from "../../../shared/demo/member";
import { useProfilePhoto } from "../hooks/use-profile-photo";
import { PROFILE_GROUPS } from "../model/profile-content";
import { ProfileFooter } from "./profile-footer";
import { ProfileGroup } from "./profile-group";
import { ProfileHeader } from "./profile-header";
import { ProfileSignOut } from "./profile-sign-out";

/**
 * Écran du profil du membre connecté.
 * @returns L'écran du profil.
 */
export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { photoUri, pickPhoto } = useProfilePhoto();

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingTop: insets.top + 12 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-6 pb-10">
        <ProfileHeader member={DEMO_MEMBER} photoUri={photoUri} onChangePhoto={pickPhoto} />
        {PROFILE_GROUPS.map((group) => (
          <ProfileGroup key={group.title} group={group} />
        ))}
        <ProfileSignOut />
        <ProfileFooter createdAt={DEMO_MEMBER.createdAt} />
      </View>
    </ScrollView>
  );
}
