import { Text, View } from "react-native";

import { ProfileAvatar } from "./avatar.profile";

/** Props de l'en-tête du profil. */
export interface ProfileHeaderProps {
  readonly name: string;
  /** Initiale affichée tant qu'aucune photo n'est choisie. */
  readonly initial: string;
  readonly phone: string;
  /** URI de la photo partagée, ou `null` avant le premier choix. */
  readonly photoUri: string | null;
  /** Vrai pendant l'enregistrement de la photo choisie. */
  readonly photoSaving?: boolean;
  readonly onChangePhoto: () => void;
}

/**
 * Affiche la photo, le nom et le numéro du membre.
 * @param props Membre à afficher, photo partagée, enregistrement et modification.
 * @returns L'en-tête du profil.
 */
export function ProfileHeader(props: ProfileHeaderProps) {
  const { name, initial, phone, photoUri, photoSaving = false, onChangePhoto } = props;

  return (
    <View className="flex-row items-center gap-4 px-4">
      <ProfileAvatar
        initial={initial}
        photoUri={photoUri}
        isSaving={photoSaving}
        onPress={onChangePhoto}
      />
      <View className="flex-1 gap-0.5">
        <Text accessibilityRole="header" className="text-[24px] font-bold text-ink">
          {name}
        </Text>
        <Text className="text-[14px] text-muted">{phone}</Text>
      </View>
    </View>
  );
}
