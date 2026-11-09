import { act, renderHook, waitFor } from "@testing-library/react-native";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

import { INITIAL_MEMBER_PROFILE, useMemberStore } from "../../../shared/member/member-store";
import { saveProfilePhoto } from "../model/profile-photo-file";
import { PHOTO_ERRORS } from "./use-profile-photo";
import { useProfilePhotoSheet } from "./use-profile-photo-sheet";

jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  requestCameraPermissionsAsync: jest.fn(),
}));

jest.mock("../model/profile-photo-file", () => ({
  saveProfilePhoto: jest.fn(),
}));

const launchLibrary = jest.mocked(ImagePicker.launchImageLibraryAsync);
const savePhoto = jest.mocked(saveProfilePhoto);
const alert = jest.spyOn(Alert, "alert").mockImplementation();

/** Résultat d'un choix abouti, avec une photo carrée. */
const PICKED: ImagePicker.ImagePickerSuccessResult = {
  canceled: false,
  assets: [{ uri: "file:///gallery/avatar.jpg", width: 1024, height: 1024 }],
};

/** Résultat d'un choix annulé par le membre. */
const CANCELED: ImagePicker.ImagePickerCanceledResult = { canceled: true, assets: null };

/** Titre de l'alerte d'un enregistrement impossible. */
const SAVE_FAILED_TITLE = "Photo non modifiée";

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

describe("useProfilePhotoSheet", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useMemberStore.setState(INITIAL_MEMBER_PROFILE);
    savePhoto.mockResolvedValue("file:///documents/profile-photo.jpg");
  });

  it("ouvre la feuille depuis l'avatar", async () => {
    const { result } = await renderHook(() => useProfilePhotoSheet());

    expect(result.current.sheetProps.visible).toBe(false);

    await act(() => result.current.headerProps.onChangePhoto());

    expect(result.current.sheetProps.visible).toBe(true);
  });

  it("garde la feuille ouverte tant que le sélecteur est affiché", async () => {
    const picker = deferred<ImagePicker.ImagePickerCanceledResult>();
    launchLibrary.mockReturnValue(picker.promise);
    const { result } = await renderHook(() => useProfilePhotoSheet());

    await act(() => result.current.headerProps.onChangePhoto());
    await act(() => result.current.sheetProps.onPickFromLibrary());

    expect(result.current.sheetProps.visible).toBe(true);

    await act(async () => {
      picker.resolve(CANCELED);
    });

    await waitFor(() => expect(result.current.sheetProps.visible).toBe(false));
  });

  it("ferme la feuille dès le retour du sélecteur, avant l'enregistrement", async () => {
    const save = deferred<string>();
    savePhoto.mockReturnValue(save.promise);
    launchLibrary.mockResolvedValue(PICKED);
    const { result } = await renderHook(() => useProfilePhotoSheet());

    await act(() => result.current.headerProps.onChangePhoto());
    await act(() => result.current.sheetProps.onPickFromLibrary());

    await waitFor(() => expect(result.current.sheetProps.visible).toBe(false));
    expect(result.current.headerProps.photoSaving).toBe(true);

    await act(async () => {
      save.resolve("file:///documents/profile-photo.jpg");
    });

    expect(result.current.headerProps.photoSaving).toBe(false);
    expect(result.current.headerProps.photoUri).toBe("file:///documents/profile-photo.jpg");
  });

  it("garde la feuille ouverte et explique un sélecteur qui ne s'ouvre pas", async () => {
    launchLibrary.mockRejectedValue(new Error("sélecteur indisponible"));
    const { result } = await renderHook(() => useProfilePhotoSheet());

    await act(() => result.current.headerProps.onChangePhoto());
    await act(() => result.current.sheetProps.onPickFromLibrary());

    await waitFor(() => expect(result.current.sheetProps.errorMessage).toBe(PHOTO_ERRORS.library));
    expect(result.current.sheetProps.visible).toBe(true);
  });

  it("annonce un enregistrement impossible après la fermeture", async () => {
    savePhoto.mockRejectedValue(new Error("compression impossible"));
    launchLibrary.mockResolvedValue(PICKED);
    const { result } = await renderHook(() => useProfilePhotoSheet());

    await act(() => result.current.headerProps.onChangePhoto());
    await act(() => result.current.sheetProps.onPickFromLibrary());

    await waitFor(() => expect(alert).toHaveBeenCalledWith(SAVE_FAILED_TITLE, PHOTO_ERRORS.save));
    expect(result.current.sheetProps.visible).toBe(false);
    expect(result.current.headerProps.photoUri).toBeNull();
  });

  it("efface l'erreur à la fermeture", async () => {
    launchLibrary.mockRejectedValue(new Error("sélecteur indisponible"));
    const { result } = await renderHook(() => useProfilePhotoSheet());

    await act(() => result.current.headerProps.onChangePhoto());
    await act(() => result.current.sheetProps.onPickFromLibrary());
    await waitFor(() => expect(result.current.sheetProps.errorMessage).toBe(PHOTO_ERRORS.library));

    await act(() => result.current.sheetProps.onClose());

    expect(result.current.sheetProps.visible).toBe(false);
    expect(result.current.sheetProps.errorMessage).toBeNull();
  });

  it("efface l'erreur d'une tentative précédente à la réouverture", async () => {
    savePhoto.mockRejectedValue(new Error("compression impossible"));
    launchLibrary.mockResolvedValue(PICKED);
    const { result } = await renderHook(() => useProfilePhotoSheet());

    await act(() => result.current.headerProps.onChangePhoto());
    await act(() => result.current.sheetProps.onPickFromLibrary());
    await waitFor(() => expect(result.current.sheetProps.errorMessage).toBe(PHOTO_ERRORS.save));

    await act(() => result.current.headerProps.onChangePhoto());

    expect(result.current.sheetProps.visible).toBe(true);
    expect(result.current.sheetProps.errorMessage).toBeNull();
  });
});
