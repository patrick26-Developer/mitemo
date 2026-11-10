/** Photo distante téléchargée, avec sa version. */
export interface RemoteProfilePhoto {
  readonly uri: string;
  readonly version: string;
}

/**
 * Port de synchronisation de la photo de profil avec le serveur.
 * L'implémentation HTTP arrivera avec la route profil de l'API.
 */
export interface ProfilePhotoGateway {
  /**
   * Envoie la photo locale au serveur.
   * @param localUri URI locale de la photo compressée.
   * @returns La version distante de la photo envoyée.
   */
  uploadPhoto(localUri: string): Promise<string>;

  /**
   * Récupère la photo distante si sa version diffère de celle connue.
   * @param knownVersion Version connue, `null` au premier chargement.
   * @returns La photo téléchargée, ou `null` si elle est inchangée ou absente.
   */
  downloadPhoto(knownVersion: string | null): Promise<RemoteProfilePhoto | null>;
}
