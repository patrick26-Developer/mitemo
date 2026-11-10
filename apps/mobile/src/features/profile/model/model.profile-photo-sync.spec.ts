import type { ProfilePhotoGateway } from "./model.profile-photo-gateway";
import {
  applyPhotoSyncResult,
  nextPhotoSyncAction,
  syncProfilePhoto,
} from "./model.profile-photo-sync";
import type { PhotoSyncActions, PhotoSyncSnapshot } from "./model.profile-photo-sync";

/** Photo en attente d'envoi, choisie hors ligne. */
const PENDING_PHOTO: PhotoSyncSnapshot = {
  photoUri: "file:///documents/profile-photo.jpg",
  photoVersion: null,
  photoPendingUpload: true,
};

/** Membre sans photo locale, qui doit récupérer celle du serveur. */
const NO_LOCAL_PHOTO: PhotoSyncSnapshot = {
  photoUri: null,
  photoVersion: "v1",
  photoPendingUpload: false,
};

/**
 * Construit un faux port de synchronisation.
 * @param overrides Comportements à remplacer.
 * @returns Le port et ses fonctions espionnes.
 */
function createGateway(overrides: Partial<ProfilePhotoGateway> = {}) {
  const gateway: ProfilePhotoGateway = {
    uploadPhoto: jest.fn().mockResolvedValue("v2"),
    downloadPhoto: jest.fn().mockResolvedValue(null),
    ...overrides,
  };

  return gateway;
}

describe("nextPhotoSyncAction", () => {
  it("ne fait rien hors ligne", () => {
    expect(nextPhotoSyncAction(PENDING_PHOTO, false)).toBe("idle");
  });

  it("envoie une photo en attente dès que la connexion revient", () => {
    expect(nextPhotoSyncAction(PENDING_PHOTO, true)).toBe("upload");
  });

  it("télécharge la photo quand l'appareil n'en a pas", () => {
    expect(nextPhotoSyncAction(NO_LOCAL_PHOTO, true)).toBe("download");
  });

  it("ne fait rien quand la photo locale est déjà synchronisée", () => {
    const synced: PhotoSyncSnapshot = {
      photoUri: "file:///documents/profile-photo.jpg",
      photoVersion: "v1",
      photoPendingUpload: false,
    };

    expect(nextPhotoSyncAction(synced, true)).toBe("idle");
  });
});

describe("syncProfilePhoto", () => {
  it("envoie une seule fois la photo en attente", async () => {
    const gateway = createGateway();

    const result = await syncProfilePhoto(gateway, PENDING_PHOTO, true);

    expect(gateway.uploadPhoto).toHaveBeenCalledTimes(1);
    expect(gateway.uploadPhoto).toHaveBeenCalledWith("file:///documents/profile-photo.jpg");
    expect(gateway.downloadPhoto).not.toHaveBeenCalled();
    expect(result).toEqual({ kind: "uploaded", version: "v2" });
  });

  it("télécharge la photo distante et sa version", async () => {
    const gateway = createGateway({
      downloadPhoto: jest
        .fn()
        .mockResolvedValue({ uri: "file:///documents/remote.jpg", version: "v3" }),
    });

    const result = await syncProfilePhoto(gateway, NO_LOCAL_PHOTO, true);

    expect(gateway.downloadPhoto).toHaveBeenCalledWith("v1");
    expect(result).toEqual({
      kind: "downloaded",
      uri: "file:///documents/remote.jpg",
      version: "v3",
    });
  });

  it("ne fait aucun appel hors ligne", async () => {
    const gateway = createGateway();

    const result = await syncProfilePhoto(gateway, PENDING_PHOTO, false);

    expect(gateway.uploadPhoto).not.toHaveBeenCalled();
    expect(gateway.downloadPhoto).not.toHaveBeenCalled();
    expect(result).toEqual({ kind: "idle" });
  });

  it("signale une photo distante inchangée", async () => {
    const gateway = createGateway({ downloadPhoto: jest.fn().mockResolvedValue(null) });

    const result = await syncProfilePhoto(gateway, NO_LOCAL_PHOTO, true);

    expect(result).toEqual({ kind: "idle" });
  });
});

/**
 * Construit les actions espionnes du profil partagé.
 * @returns Les actions et leurs espions.
 */
function createActions(): jest.Mocked<PhotoSyncActions> {
  return { markPhotoSynced: jest.fn(), applyRemotePhoto: jest.fn() };
}

describe("applyPhotoSyncResult", () => {
  it("marque la photo envoyée comme synchronisée", () => {
    const actions = createActions();

    applyPhotoSyncResult(
      {
        result: { kind: "uploaded", version: "v2" },
        synced: PENDING_PHOTO,
        current: PENDING_PHOTO,
      },
      actions,
    );

    expect(actions.markPhotoSynced).toHaveBeenCalledWith("v2");
  });

  it("ignore l'envoi terminé si le membre a choisi une autre photo entre-temps", () => {
    const actions = createActions();
    const current: PhotoSyncSnapshot = {
      photoUri: "file:///documents/newer-photo.jpg",
      photoVersion: null,
      photoPendingUpload: true,
    };

    applyPhotoSyncResult(
      { result: { kind: "uploaded", version: "v2" }, synced: PENDING_PHOTO, current },
      actions,
    );

    expect(actions.markPhotoSynced).not.toHaveBeenCalled();
  });

  it("applique la photo téléchargée au profil resté sans photo", () => {
    const actions = createActions();

    applyPhotoSyncResult(
      {
        result: { kind: "downloaded", uri: "file:///documents/remote.jpg", version: "v3" },
        synced: NO_LOCAL_PHOTO,
        current: NO_LOCAL_PHOTO,
      },
      actions,
    );

    expect(actions.applyRemotePhoto).toHaveBeenCalledWith("file:///documents/remote.jpg", "v3");
  });

  it("ignore la photo téléchargée si le membre a choisi une photo entre-temps", () => {
    const actions = createActions();
    const current: PhotoSyncSnapshot = {
      photoUri: "file:///documents/profile-photo.jpg",
      photoVersion: null,
      photoPendingUpload: true,
    };

    applyPhotoSyncResult(
      {
        result: { kind: "downloaded", uri: "file:///documents/remote.jpg", version: "v3" },
        synced: NO_LOCAL_PHOTO,
        current,
      },
      actions,
    );

    expect(actions.applyRemotePhoto).not.toHaveBeenCalled();
  });

  it("ne touche à rien quand la photo distante est inchangée", () => {
    const actions = createActions();

    applyPhotoSyncResult(
      { result: { kind: "idle" }, synced: NO_LOCAL_PHOTO, current: NO_LOCAL_PHOTO },
      actions,
    );

    expect(actions.markPhotoSynced).not.toHaveBeenCalled();
    expect(actions.applyRemotePhoto).not.toHaveBeenCalled();
  });
});
