import { Camera } from "lucide-react-native";
import { Image, Pressable, Text, View } from "react-native";

import { PALETTE } from "../../../shared/theme/palette";

/** Côté de l'avatar, en points. */
const AVATAR_SIZE = 64;

/** Style carré de la photo, aux dimensions de l'avatar. */
const PHOTO_STYLE = { width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2 };

/** Props de l'avatar du profil. */
export interface ProfileAvatarProps {
  /** Initiale affichée tant qu'aucune photo n'est choisie. */
  readonly initial: string;
  /** URI de la photo choisie, ou `null` avant le premier choix. */
  readonly photoUri: string | null;
  readonly onPress: () => void;
}

/**
 * Affiche la photo du membre, ou son initiale, avec l'action de modification.
 * @param props Initiale, photo courante et action de choix d'une photo.
 * @returns L'avatar cliquable.
 */
export function ProfileAvatar(props: ProfileAvatarProps) {
  const { initial, photoUri, onPress } = props;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Modifier la photo"
      hitSlop={8}
      onPress={onPress}
      className="h-16 w-16 items-center justify-center rounded-full bg-avatar"
    >
      {photoUri ? (
        <Image testID="profile-photo" source={{ uri: photoUri }} style={PHOTO_STYLE} />
      ) : (
        <Text className="text-[24px] font-bold text-white">{initial}</Text>
      )}
      <View className="absolute -bottom-0.5 -right-0.5 h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-tab-active">
        <Camera size={12} color={PALETTE.tabInk} />
      </View>
    </Pressable>
  );
}
