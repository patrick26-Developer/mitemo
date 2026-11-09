import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";

/** Photo carrée, recadrée et compressée avant affichage. */
const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
};

/**
 * Gère la photo de profil choisie dans la galerie de l'appareil.
 * @returns L'URI de la photo, `null` tant qu'aucune n'est choisie, et l'action de choix.
 */
export function useProfilePhoto() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const pickPhoto = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
      const asset = result.assets?.[0];

      if (result.canceled || asset === undefined) {
        return;
      }

      setPhotoUri(asset.uri);
    } catch {
      // La galerie a échoué : le membre garde sa photo actuelle.
    }
  }, []);

  return { photoUri, pickPhoto };
}
