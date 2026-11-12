import { Image, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { avatarColor } from "../../model/model.avatar-color";

/** Durée d'apparition de la photo, en millisecondes. */
const PHOTO_FADE = 220;

/** Part du côté occupée par l'initiale, pour rester lisible à toutes les tailles. */
const INITIAL_RATIO = 0.375;

/** Props de la photo ronde d'un membre. */
export interface MemberPhotoProps {
  /** URI de la photo choisie, ou `null` avant le premier choix. */
  readonly photoUri: string | null;
  /** Initiale affichée tant qu'aucune photo n'est choisie. */
  readonly initial: string;
  /** Côté du cercle, en points. */
  readonly size: number;
  readonly testID: string;
  /** Nom de la personne : il choisit la couleur de fond, comme sur WhatsApp. */
  readonly seed?: string;
  /** Classe supplémentaire du cercle, par exemple sa bordure. */
  readonly className?: string;
}

/**
 * Affiche la photo partagée du membre, ou son initiale à défaut.
 * @param props Photo, initiale, taille, identifiant de test et classe du cercle.
 * @returns La photo ronde du membre.
 */
export function MemberPhoto(props: MemberPhotoProps) {
  const { photoUri, initial, size, testID, className, seed } = props;
  const circle = { width: size, height: size, borderRadius: size / 2 };
  const background = { backgroundColor: avatarColor(seed ?? initial) };
  const initialStyle = { fontSize: Math.round(size * INITIAL_RATIO) };

  return (
    <View
      className={`items-center justify-center overflow-hidden rounded-full ${className ?? ""}`}
      style={[circle, background]}
    >
      {photoUri ? (
        <Animated.View key={photoUri} entering={FadeIn.duration(PHOTO_FADE)} style={circle}>
          <Image testID={testID} source={{ uri: photoUri }} style={circle} />
        </Animated.View>
      ) : (
        <Text className="font-bold text-white" style={initialStyle}>
          {initial}
        </Text>
      )}
    </View>
  );
}
