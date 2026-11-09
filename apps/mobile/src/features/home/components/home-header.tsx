import { Info } from "lucide-react-native";
import { Image, Text, View } from "react-native";

import { useMemberStore } from "../../../shared/member/member-store";
import { PALETTE } from "../../../shared/theme/palette";

/** Côté de l'avatar de l'accueil, en points. */
const AVATAR_SIZE = 48;

/** Style rond de la photo, aux dimensions de l'avatar. */
const PHOTO_STYLE = { width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2 };

/**
 * Affiche la salutation et l'avatar partagé du membre.
 * @returns L'en-tête de l'accueil.
 */
export function HomeHeader() {
  const photoUri = useMemberStore((state) => state.photoUri);
  const avatarInitial = useMemberStore((state) => state.avatarInitial);
  const name = useMemberStore((state) => state.name);

  return (
    <View className="mb-[18px] flex-row items-center gap-2.5 px-4">
      <View className="h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white bg-avatar">
        {photoUri ? (
          <Image testID="home-photo" source={{ uri: photoUri }} style={PHOTO_STYLE} />
        ) : (
          <Text className="text-[18px] font-bold text-white">{avatarInitial}</Text>
        )}
      </View>
      <View className="flex-col gap-0.5">
        <Text className="text-[13px] text-on-dark-muted">Bonjour</Text>
        <View className="flex-row items-center gap-2">
          <Text className="text-[16px] font-bold text-white">{name}</Text>
          <Info size={13} color={PALETTE.white} />
        </View>
      </View>
    </View>
  );
}
