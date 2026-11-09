import { Camera } from "lucide-react-native";
import { ActivityIndicator, Image, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { PressableScale } from "../../../shared/components/pressable-scale";
import { PALETTE } from "../../../shared/theme/palette";

/** Côté de l'avatar, en points. */
const AVATAR_SIZE = 64;

/** Style carré de la photo, aux dimensions de l'avatar. */
const PHOTO_STYLE = { width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2 };

/** Durée d'apparition de la nouvelle photo, en millisecondes. */
const PHOTO_FADE = 220;

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
      <View className="h-16 w-16 items-center justify-center rounded-full bg-avatar">
        {photoUri ? (
          <Animated.View key={photoUri} entering={FadeIn.duration(PHOTO_FADE)} style={PHOTO_STYLE}>
            <Image testID="profile-photo" source={{ uri: photoUri }} style={PHOTO_STYLE} />
          </Animated.View>
        ) : (
          <Text className="text-[24px] font-bold text-white">{initial}</Text>
        )}
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
