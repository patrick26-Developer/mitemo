import { Info } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { MemberPhoto } from "../../../shared/components/atoms/photo.member";
import { useMemberStore } from "../../../shared/member/store.member";
import { PALETTE } from "../../../shared/theme/theme.palette";

/** Côté de l'avatar de l'accueil, en points. */
const AVATAR_SIZE = 48;

/** Props de l'en-tête de l'accueil. */
export interface HomeHeaderProps {
  /** Ouvre le résumé du membre, au toucher de l'avatar ou du nom. */
  readonly onOpenMember: () => void;
}

/**
 * Affiche la salutation et l'avatar partagé du membre ; l'avatar et le nom
 * ouvrent le résumé de ses informations.
 * @param props Ouverture du résumé du membre.
 * @returns L'en-tête de l'accueil.
 */
export function HomeHeader(props: HomeHeaderProps) {
  const photoUri = useMemberStore((state) => state.photoUri);
  const avatarInitial = useMemberStore((state) => state.avatarInitial);
  const name = useMemberStore((state) => state.name);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Voir mes informations"
      onPress={props.onOpenMember}
      className="mb-[18px] flex-row items-center gap-2.5 self-start px-4"
    >
      <MemberPhoto
        photoUri={photoUri}
        initial={avatarInitial}
        size={AVATAR_SIZE}
        testID="home-photo"
        className="border border-white"
      />
      <View className="flex-col gap-0.5">
        <Text className="text-[13px] text-on-dark-muted">Bonjour</Text>
        <View className="flex-row items-center gap-2">
          <Text className="text-[16px] font-bold text-white">{name}</Text>
          <Info size={13} color={PALETTE.white} />
        </View>
      </View>
    </Pressable>
  );
}
