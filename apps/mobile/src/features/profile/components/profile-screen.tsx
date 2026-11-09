import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DottedBackground } from "../../../shared/components/dotted-background";
import { useMemberStore } from "../../../shared/member/member-store";
import { useProfileActions } from "../hooks/use-profile-actions";
import { useProfilePhotoSheet } from "../hooks/use-profile-photo-sheet";
import { profileGroupsFor } from "../model/profile-content";
import { useProfilePreferences } from "../model/profile-preferences";
import { PhotoSheet } from "./photo-sheet";
import { ProfileActionSheet } from "./profile-action-sheet";
import { ProfileFooter } from "./profile-footer";
import { ProfileGroup } from "./profile-group";
import { ProfileHeader } from "./profile-header";
import { ProfileSignOut } from "./profile-sign-out";
import { SignOutSheet } from "./sign-out-sheet";

/**
 * Écran du profil du membre connecté, alimenté par le profil partagé.
 * @returns L'écran du profil.
 */
export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const photo = useProfilePhotoSheet();
  const { selectedAction, selectAction, closeAction } = useProfileActions();
  const [signOutOpen, setSignOutOpen] = useState(false);
  const { theme, language } = useProfilePreferences();
  const { name, avatarInitial: initial, phone, createdAt } = useMemberStore();

  return (
    <View className="flex-1 bg-white">
      <DottedBackground />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: insets.top + 12 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6 pb-10">
          <ProfileHeader name={name} initial={initial} phone={phone} {...photo.headerProps} />
          {profileGroupsFor(theme, language).map((group) => (
            <ProfileGroup key={group.title} group={group} onSelect={selectAction} />
          ))}
          <ProfileSignOut createdAt={createdAt} onPress={() => setSignOutOpen(true)} />
          <ProfileFooter />
        </View>
      </ScrollView>
      <ProfileActionSheet action={selectedAction} onClose={closeAction} />
      <PhotoSheet {...photo.sheetProps} />
      <SignOutSheet visible={signOutOpen} onClose={() => setSignOutOpen(false)} />
    </View>
  );
}
