import { act, renderHook } from "@testing-library/react-native";
import { PermissionStatus } from "expo";
import * as ImagePicker from "expo-image-picker";

import { INITIAL_MEMBER_PROFILE, useMemberStore } from "../../../shared/member/store.member";
import { saveProfilePhoto } from "../model/model.profile-photo-file";
import { PHOTO_ERRORS, useProfilePhoto } from "./hook.profile-photo";

jest.mock("expo-image-picker", () => ({
  UIImagePickerPreferredAssetRepresentationMode: { Current: "current" },
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  requestCameraPermissionsAsync: jest.fn(),
}));

jest.mock("../model/model.profile-photo-file", () => ({
  saveProfilePhoto: jest.fn(),
}));

const launchLibrary = jest.mocked(ImagePicker.launchImageLibraryAsync);
const launchCamera = jest.mocked(ImagePicker.launchCameraAsync);
const requestCameraPermission = jest.mocked(ImagePicker.requestCameraPermissionsAsync);
const savePhoto = jest.mocked(saveProfilePhoto);

/** Résultat d'un choix abouti, avec une photo carrée. */
const PICKED: ImagePicker.ImagePickerSuccessResult = {
  canceled: false,
  assets: [{ uri: "file:///gallery/avatar.jpg", width: 1024, height: 1024 }],
};

/** Résultat d'un choix annulé par le membre. */
const CANCELED: ImagePicker.ImagePickerCanceledResult = { canceled: true, assets: null };

/** Autorisation de l'appareil photo accordée par le membre. */
const CAMERA_GRANTED: ImagePicker.CameraPermissionResponse = {
  granted: true,
  status: PermissionStatus.GRANTED,
  canAskAgain: true,
  expires: "never",
};

/** Autorisation de l'appareil photo refusée par le membre. */
const CAMERA_DENIED: ImagePicker.CameraPermissionResponse = {
  granted: false,
  status: PermissionStatus.DENIED,
  canAskAgain: true,
  expires: "never",
};

/**
 * Promesse dont le test contrôle le moment de la résolution.
 * @returns La promesse et sa fonction de résolution.
 */
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });

  return { promise, resolve };
}

/** Absorbe la notification de retour du sélecteur quand elle n'est pas testée. */
function ignorePickerClosed(): void {}

describe("useProfilePhoto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useMemberStore.setState(INITIAL_MEMBER_PROFILE);
    savePhoto.mockResolvedValue("file:///documents/profile-photo.jpg");
    requestCameraPermission.mockResolvedValue(CAMERA_GRANTED);
  });

  it("garde la photo compressée dans le profil partagé", async () => {
    launchLibrary.mockResolvedValue(PICKED);
    const { result } = await renderHook(() => useProfilePhoto());

    const outcome = await act(async () => result.current.pickPhoto(ignorePickerClosed));

    expect(outcome).toEqual({ status: "saved" });
    expect(savePhoto).toHaveBeenCalledWith("file:///gallery/avatar.jpg");
    expect(result.current.photoUri).toBe("file:///documents/profile-photo.jpg");
  });

  it("ouvre la galerie sans conversion inutile de l'original sur iOS", async () => {
    launchLibrary.mockResolvedValue({ canceled: true, assets: null });
    const { result } = await renderHook(() => useProfilePhoto());

    await act(() => result.current.pickPhoto(jest.fn()));

    expect(launchLibrary).toHaveBeenCalledWith(
      expect.objectContaining({ preferredAssetRepresentationMode: "current", quality: 1 }),
    );
  });

  it("affiche la photo choisie avant la fin de la compression", async () => {
    launchLibrary.mockResolvedValue(PICKED);
    const compression = deferred<string>();
    savePhoto.mockReturnValue(compression.promise);
    const { result } = await renderHook(() => useProfilePhoto());
    let pending: Promise<unknown> = Promise.resolve();

    await act(async () => {
      pending = result.current.pickPhoto(ignorePickerClosed);
    });

    expect(result.current.photoUri).toBe("file:///gallery/avatar.jpg");
    expect(result.current.isSaving).toBe(true);

    await act(async () => {
      compression.resolve("file:///documents/profile-photo.jpg");
      await pending;
    });

    expect(result.current.photoUri).toBe("file:///documents/profile-photo.jpg");
    expect(result.current.isSaving).toBe(false);
  });

  it("prévient du retour du sélecteur avant la fin de l'enregistrement", async () => {
    launchLibrary.mockResolvedValue(PICKED);
    const compression = deferred<string>();
    savePhoto.mockReturnValue(compression.promise);
    const onPickerClosed = jest.fn();
    const { result } = await renderHook(() => useProfilePhoto());
    let pending: Promise<unknown> = Promise.resolve();

    await act(async () => {
      pending = result.current.pickPhoto(onPickerClosed);
    });

    expect(onPickerClosed).toHaveBeenCalledTimes(1);
    expect(savePhoto).toHaveBeenCalledWith("file:///gallery/avatar.jpg");

    await act(async () => {
      compression.resolve("file:///documents/profile-photo.jpg");
      await pending;
    });
  });

  it("signale l'échec et garde l'ancienne photo", async () => {
    useMemberStore.getState().setPhoto("file:///documents/old-photo.jpg");
    launchLibrary.mockResolvedValue(PICKED);
    savePhoto.mockRejectedValue(new Error("compression impossible"));
    const { result } = await renderHook(() => useProfilePhoto());

    const outcome = await act(async () => result.current.pickPhoto(ignorePickerClosed));

    expect(outcome).toEqual({ status: "failed", message: PHOTO_ERRORS.save });
    expect(result.current.errorMessage).toBe(PHOTO_ERRORS.save);
    expect(result.current.photoUri).toBe("file:///documents/old-photo.jpg");
    expect(result.current.isSaving).toBe(false);
  });

  it("signale un sélecteur qui ne s'ouvre pas", async () => {
    launchLibrary.mockRejectedValue(new Error("sélecteur indisponible"));
    const onPickerClosed = jest.fn();
    const { result } = await renderHook(() => useProfilePhoto());

    const outcome = await act(async () => result.current.pickPhoto(onPickerClosed));

    expect(outcome).toEqual({ status: "failed", message: PHOTO_ERRORS.library });
    expect(result.current.errorMessage).toBe(PHOTO_ERRORS.library);
    expect(onPickerClosed).not.toHaveBeenCalled();
  });

  it("ignore un choix annulé", async () => {
    launchLibrary.mockResolvedValue(CANCELED);
    const onPickerClosed = jest.fn();
    const { result } = await renderHook(() => useProfilePhoto());

    const outcome = await act(async () => result.current.pickPhoto(onPickerClosed));

    expect(outcome).toEqual({ status: "canceled" });
    expect(onPickerClosed).toHaveBeenCalledTimes(1);
    expect(savePhoto).not.toHaveBeenCalled();
    expect(result.current.photoUri).toBeNull();
    expect(result.current.errorMessage).toBeNull();
  });

  it("enregistre la photo prise avec l'appareil photo", async () => {
    launchCamera.mockResolvedValue(PICKED);
    const { result } = await renderHook(() => useProfilePhoto());

    const outcome = await act(async () => result.current.takePhoto(ignorePickerClosed));

    expect(outcome).toEqual({ status: "saved" });
    expect(requestCameraPermission).toHaveBeenCalledTimes(1);
    expect(savePhoto).toHaveBeenCalledWith("file:///gallery/avatar.jpg");
    expect(result.current.photoUri).toBe("file:///documents/profile-photo.jpg");
  });

  it("explique le refus d'accès à l'appareil photo", async () => {
    requestCameraPermission.mockResolvedValue(CAMERA_DENIED);
    const { result } = await renderHook(() => useProfilePhoto());

    const outcome = await act(async () => result.current.takePhoto(ignorePickerClosed));

    expect(outcome).toEqual({ status: "failed", message: PHOTO_ERRORS.cameraPermission });
    expect(launchCamera).not.toHaveBeenCalled();
    expect(savePhoto).not.toHaveBeenCalled();
    expect(result.current.errorMessage).toBe(PHOTO_ERRORS.cameraPermission);
    expect(result.current.photoUri).toBeNull();
  });

  it("efface le message d'erreur à la demande", async () => {
    launchLibrary.mockRejectedValue(new Error("sélecteur indisponible"));
    const { result } = await renderHook(() => useProfilePhoto());

    await act(async () => result.current.pickPhoto(ignorePickerClosed));
    await act(async () => result.current.clearError());

    expect(result.current.errorMessage).toBeNull();
  });
});
