import { Directory, File, Paths } from "expo-file-system";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

/** Largeur maximale de la photo de profil, en pixels. */
export const PROFILE_PHOTO_WIDTH = 512;

/** Qualité JPEG de la photo : compromis lisibilité / données échangées. */
export const PROFILE_PHOTO_QUALITY = 0.7;

/** Préfixe des fichiers de photo conservés dans le dossier documents. */
export const PROFILE_PHOTO_FILE_PREFIX = "profile-photo";

/**
 * Nom du fichier de la nouvelle photo. Chaque choix reçoit un nom unique :
 * l'interface ne peut donc pas réafficher l'image mise en cache sous l'ancien URI.
 * @param takenAt Date du choix, en millisecondes depuis l'époque Unix.
 * @returns Le nom de fichier, extension comprise.
 */
function profilePhotoFileName(takenAt: number): string {
  return `${PROFILE_PHOTO_FILE_PREFIX}-${takenAt}.jpg`;
}

/**
 * Supprime les photos de profil des choix précédents, en gardant la nouvelle.
 * @param keep Photo du choix courant, conservée sur l'appareil.
 */
function removePreviousPhotos(keep: File): void {
  const entries = new Directory(Paths.document).list();

  for (const entry of entries) {
    const isPreviousPhoto =
      entry instanceof File &&
      entry.name.startsWith(PROFILE_PHOTO_FILE_PREFIX) &&
      entry.uri !== keep.uri;

    if (isPreviousPhoto) {
      removePhoto(entry);
    }
  }
}

/**
 * Supprime une photo devenue inutile, sans bloquer l'affichage de la nouvelle
 * si le fichier est verrouillé par le système.
 * @param photo Fichier de l'ancienne photo.
 */
function removePhoto(photo: File): void {
  try {
    photo.delete();
  } catch {
    // Fichier verrouillé : la nouvelle photo reste affichée, le nettoyage attendra.
  }
}

/**
 * Redimensionne et compresse la photo choisie, puis la conserve dans le
 * dossier documents pour qu'elle survive aux redémarrages sans être renvoyée.
 * @param sourceUri URI de la photo choisie dans la galerie.
 * @param takenAt Date du choix, en millisecondes depuis l'époque Unix.
 * @returns L'URI locale stable de la photo enregistrée.
 */
export async function saveProfilePhoto(
  sourceUri: string,
  takenAt: number = Date.now(),
): Promise<string> {
  const context = ImageManipulator.manipulate(sourceUri).resize({ width: PROFILE_PHOTO_WIDTH });
  const rendered = await context.renderAsync();
  const resized = await rendered.saveAsync({
    compress: PROFILE_PHOTO_QUALITY,
    format: SaveFormat.JPEG,
  });

  const destination = new File(Paths.document, profilePhotoFileName(takenAt));
  await new File(resized.uri).copy(destination, { overwrite: true });
  removePreviousPhotos(destination);

  return destination.uri;
}
