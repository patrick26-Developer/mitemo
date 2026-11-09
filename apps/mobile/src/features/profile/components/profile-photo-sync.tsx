import { useProfilePhotoSync } from "../hooks/use-profile-photo-sync";

/**
 * Branche la synchronisation de la photo au niveau de l'application : le profil
 * est partagé, la photo se synchronise donc quel que soit l'écran affiché.
 * @returns Aucune interface : le composant ne rend rien.
 */
export function ProfilePhotoSync() {
  useProfilePhotoSync();

  return null;
}
