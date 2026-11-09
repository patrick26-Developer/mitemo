import type { ProfilePhotoGateway } from "./profile-photo-gateway";

/** Actions possibles de la synchronisation de la photo. */
export const PHOTO_SYNC_ACTIONS = ["idle", "upload", "download"] as const;

/** Action à mener pour synchroniser la photo de profil. */
export type PhotoSyncAction = (typeof PHOTO_SYNC_ACTIONS)[number];

/** État local de la photo, suffisant pour choisir l'action de synchronisation. */
export interface PhotoSyncSnapshot {
  readonly photoUri: string | null;
  readonly photoVersion: string | null;
  readonly photoPendingUpload: boolean;
}

/** Résultat d'une synchronisation, à appliquer au profil partagé. */
export type PhotoSyncResult =
  | { readonly kind: "uploaded"; readonly version: string }
  | { readonly kind: "downloaded"; readonly uri: string; readonly version: string }
  | { readonly kind: "idle" };

/** Actions du profil partagé qu'une synchronisation peut déclencher. */
export interface PhotoSyncActions {
  /**
   * Marque la photo comme synchronisée.
   * @param version Version distante renvoyée par le serveur.
   */
  markPhotoSynced(version: string): void;

  /**
   * Remplace la photo locale par celle téléchargée du serveur.
   * @param uri URI locale de la photo téléchargée.
   * @param version Version distante de cette photo.
   */
  applyRemotePhoto(uri: string, version: string): void;
}

/**
 * Choisit l'action à mener : envoyer une photo choisie hors ligne, récupérer
 * une photo distante absente de l'appareil, ou ne rien faire.
 * @param snapshot État local de la photo.
 * @param online Vrai quand le serveur est joignable.
 * @returns L'action de synchronisation.
 */
export function nextPhotoSyncAction(snapshot: PhotoSyncSnapshot, online: boolean): PhotoSyncAction {
  if (!online) {
    return "idle";
  }

  if (snapshot.photoPendingUpload && snapshot.photoUri !== null) {
    return "upload";
  }

  if (snapshot.photoUri === null) {
    return "download";
  }

  return "idle";
}

/**
 * Synchronise la photo avec le serveur en n'échangeant que le strict nécessaire :
 * un envoi quand une photo attend, un téléchargement conditionnel sinon.
 * @param gateway Port de synchronisation vers le serveur.
 * @param snapshot État local de la photo.
 * @param online Vrai quand le serveur est joignable.
 * @returns Le résultat à appliquer au profil partagé.
 * @throws {Error} quand l'appel réseau échoue.
 */
export async function syncProfilePhoto(
  gateway: ProfilePhotoGateway,
  snapshot: PhotoSyncSnapshot,
  online: boolean,
): Promise<PhotoSyncResult> {
  const action = nextPhotoSyncAction(snapshot, online);

  if (action === "upload" && snapshot.photoUri !== null) {
    return { kind: "uploaded", version: await gateway.uploadPhoto(snapshot.photoUri) };
  }

  if (action === "download") {
    const remote = await gateway.downloadPhoto(snapshot.photoVersion);

    return remote === null
      ? { kind: "idle" }
      : { kind: "downloaded", uri: remote.uri, version: remote.version };
  }

  return { kind: "idle" };
}

/** Résultat d'une synchronisation confronté à l'état du profil à son retour. */
export interface PhotoSyncOutcome {
  readonly result: PhotoSyncResult;
  /** Photo sur laquelle portait la synchronisation. */
  readonly synced: PhotoSyncSnapshot;
  /** Photo du profil au retour de l'appel réseau. */
  readonly current: PhotoSyncSnapshot;
}

/**
 * Applique au profil le résultat d'une synchronisation, sauf si le membre a
 * choisi une autre photo pendant l'appel réseau : le résultat porterait alors
 * sur une photo qui n'est plus affichée.
 * @param outcome Résultat de la synchronisation et photos comparées.
 * @param actions Actions du profil partagé.
 */
export function applyPhotoSyncResult(outcome: PhotoSyncOutcome, actions: PhotoSyncActions): void {
  const { result, synced, current } = outcome;

  if (synced.photoUri !== current.photoUri) {
    return;
  }

  if (result.kind === "uploaded") {
    actions.markPhotoSynced(result.version);
  }

  if (result.kind === "downloaded") {
    actions.applyRemotePhoto(result.uri, result.version);
  }
}
