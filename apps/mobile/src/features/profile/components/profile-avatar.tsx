import { Camera } from "lucide-react-native";
import { ActivityIndicator, View } from "react-native";

import { MemberPhoto } from "../../../shared/components/member-photo";
import { PressableScale } from "../../../shared/components/pressable-scale";
import { PALETTE } from "../../../shared/theme/palette";

/** Côté de l'avatar, en points. */
const AVATAR_SIZE = 64;

/** Absorbe l'appui pendant l'enregistrement, sans rouvrir la galerie. */
function ignorePress(): void {}

/** Props de l'avatar du profil. */
export interface ProfileAvatarProps {
  /** Initiale affichée tant qu'aucune photo n'est choisie. */
  readonly initial: string;
  /** URI de la photo choisie, ou `null` avant le premier choix. */
  readonly photoUri: string | null;
  /** Vrai pendant la compression et l'enregistrement de la photo choisie. */
  readonly isSaving?: boolean;
  readonly onPress: () => void;
}

/**
 * Affiche la photo du membre, ou son initiale, avec l'action de modification et
 * l'avancement de l'enregistrement.
 * @param props Initiale, photo, enregistrement en cours et action de choix.
 * @returns L'avatar cliquable.
 */
export function ProfileAvatar(props: ProfileAvatarProps) {
  const { initial, photoUri, isSaving = false, onPress } = props;
  const label = isSaving ? "Enregistrement de la photo" : "Modifier la photo";
  const handlePress = isSaving ? ignorePress : onPress;

  return (
    <PressableScale
      accessibilityLabel={label}
      onPress={handlePress}
      className="h-16 w-16 rounded-full"
    >
      <View className="h-16 w-16">
        <MemberPhoto
          photoUri={photoUri}
          initial={initial}
          size={AVATAR_SIZE}
          testID="profile-photo"
        />
        {isSaving ? (
          <View
            testID="profile-photo-saving"
            className="absolute inset-0 items-center justify-center rounded-full bg-black/35"
          >
            <ActivityIndicator color={PALETTE.white} />
          </View>
        ) : null}
        <View className="absolute -bottom-0.5 -right-0.5 h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-tab-active">
          <Camera size={12} color={PALETTE.tabInk} />
        </View>
      </View>
    </PressableScale>
  );
}
