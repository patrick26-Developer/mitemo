import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DottedBackground } from "../../../shared/components/atoms/background.dotted";
import { useMemberStore } from "../../../shared/member/store.member";
import { useProfileActions } from "../hooks/hook.profile-actions";
import { useProfileCounts } from "../hooks/hook.profile-counts";
import { useProfilePhotoSheet } from "../hooks/hook.profile-photo-sheet";
import { profileGroupsFor } from "../model/model.profile-content";
import { useProfilePreferences } from "../model/model.profile-preferences";
import { PhotoSheet } from "./sheet.photo";
import { ProfileActionSheet } from "./sheet.profile-action";
import { ProfileFooter } from "./footer.profile";
import { ProfileGroup } from "./group.profile";
import { ProfileHeader } from "./header.profile";
import { ProfileSignOut } from "./card.profile-sign-out";
import { SignOutSheet } from "./sheet.sign-out";

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
  const counts = useProfileCounts();
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
          {profileGroupsFor(theme, language, counts).map((group) => (
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
