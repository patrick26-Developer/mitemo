import { act, renderHook } from "@testing-library/react-native";
import * as ImagePicker from "expo-image-picker";

import { useProfilePhoto } from "./use-profile-photo";

jest.mock("expo-image-picker", () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

const requestPermission = jest.mocked(ImagePicker.requestMediaLibraryPermissionsAsync);
const launchLibrary = jest.mocked(ImagePicker.launchImageLibraryAsync);

const GRANTED = { granted: true } as ImagePicker.MediaLibraryPermissionResponse;
const DENIED = { granted: false } as ImagePicker.MediaLibraryPermissionResponse;

/** Résultat d'un choix abouti, avec une photo carrée. */
const PICKED: ImagePicker.ImagePickerSuccessResult = {
  canceled: false,
  assets: [{ uri: "file:///avatar.jpg", width: 512, height: 512 }],
};

/** Résultat d'un choix annulé par le membre. */
const CANCELED: ImagePicker.ImagePickerCanceledResult = { canceled: true, assets: null };

describe("useProfilePhoto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    requestPermission.mockResolvedValue(GRANTED);
  });

  it("garde l'URI de la photo choisie", async () => {
    launchLibrary.mockResolvedValue(PICKED);
    const { result } = await renderHook(() => useProfilePhoto());

    await act(async () => {
      await result.current.pickPhoto();
    });

    expect(result.current.photoUri).toBe("file:///avatar.jpg");
  });

  it("ignore un choix annulé", async () => {
    launchLibrary.mockResolvedValue(CANCELED);
    const { result } = await renderHook(() => useProfilePhoto());

    await act(async () => {
      await result.current.pickPhoto();
    });

    expect(result.current.photoUri).toBeNull();
  });

  it("n'ouvre pas la galerie sans autorisation", async () => {
    requestPermission.mockResolvedValue(DENIED);
    const { result } = await renderHook(() => useProfilePhoto());

    await act(async () => {
      await result.current.pickPhoto();
    });

    expect(launchLibrary).not.toHaveBeenCalled();
    expect(result.current.photoUri).toBeNull();
  });
});
