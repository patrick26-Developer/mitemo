import { act, renderHook, waitFor } from "@testing-library/react-native";
import * as Network from "expo-network";
import { AppState } from "react-native";
import type { AppStateStatus, NativeEventSubscription } from "react-native";

import { INITIAL_MEMBER_PROFILE, useMemberStore } from "../../../shared/member/member-store";
import type { ProfilePhotoGateway } from "../model/profile-photo-gateway";
import { useProfilePhotoSync } from "./use-profile-photo-sync";

jest.mock("expo-network", () => ({
  useNetworkState: jest.fn(),
  getNetworkStateAsync: jest.fn(),
}));

const useNetworkState = jest.mocked(Network.useNetworkState);
const getNetworkState = jest.mocked(Network.getNetworkStateAsync);

const ONLINE = { isConnected: true, isInternetReachable: true } satisfies Network.NetworkState;
const OFFLINE = { isConnected: false, isInternetReachable: false } satisfies Network.NetworkState;

/** Écouteur du premier plan enregistré par le hook. */
let appStateListener: ((status: AppStateStatus) => void) | null = null;

/**
 * Construit un faux port de synchronisation.
 * @param overrides Comportements à remplacer.
 * @returns Le port et ses fonctions espionnes.
 */
function createGateway(overrides: Partial<ProfilePhotoGateway> = {}) {
  return {
    uploadPhoto: jest.fn().mockResolvedValue("v2"),
    downloadPhoto: jest.fn().mockResolvedValue(null),
    ...overrides,
  } satisfies ProfilePhotoGateway;
}

describe("useProfilePhotoSync", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    useMemberStore.setState(INITIAL_MEMBER_PROFILE);
    useNetworkState.mockReturnValue(ONLINE);
    getNetworkState.mockResolvedValue(ONLINE);
    appStateListener = null;
    jest.spyOn(AppState, "addEventListener").mockImplementation((_event, handler) => {
      appStateListener = handler;
      return { remove: jest.fn() } as unknown as NativeEventSubscription;
    });
  });

  it("envoie la photo choisie hors ligne dès la connexion revenue", async () => {
    useMemberStore.getState().setPhoto("file:///documents/profile-photo.jpg");
    const gateway = createGateway();

    await renderHook(() => useProfilePhotoSync(gateway));

    await waitFor(() => {
      expect(gateway.uploadPhoto).toHaveBeenCalledWith("file:///documents/profile-photo.jpg");
    });
    expect(useMemberStore.getState().photoPendingUpload).toBe(false);
    expect(useMemberStore.getState().photoVersion).toBe("v2");
  });

  it("ne fait aucun appel sans connexion", async () => {
    useNetworkState.mockReturnValue(OFFLINE);
    useMemberStore.getState().setPhoto("file:///documents/profile-photo.jpg");
    const gateway = createGateway();

    await renderHook(() => useProfilePhotoSync(gateway));

    expect(gateway.uploadPhoto).not.toHaveBeenCalled();
    expect(gateway.downloadPhoto).not.toHaveBeenCalled();
  });

  it("applique la photo téléchargée du serveur", async () => {
    const gateway = createGateway({
      downloadPhoto: jest
        .fn()
        .mockResolvedValue({ uri: "file:///documents/remote.jpg", version: "v3" }),
    });

    await renderHook(() => useProfilePhotoSync(gateway));

    await waitFor(() => {
      expect(useMemberStore.getState().photoUri).toBe("file:///documents/remote.jpg");
    });
    expect(useMemberStore.getState().photoVersion).toBe("v3");
  });

  it("attend la relecture du cache avant tout appel réseau", async () => {
    const hasHydrated = jest.spyOn(useMemberStore.persist, "hasHydrated").mockReturnValue(false);
    let finishHydration: (() => void) | undefined;
    jest.spyOn(useMemberStore.persist, "onFinishHydration").mockImplementation((listener) => {
      finishHydration = () => listener(useMemberStore.getState());
      return jest.fn();
    });
    const gateway = createGateway();

    await renderHook(() => useProfilePhotoSync(gateway));

    expect(gateway.downloadPhoto).not.toHaveBeenCalled();

    hasHydrated.mockReturnValue(true);
    await act(async () => {
      finishHydration?.();
    });

    await waitFor(() => {
      expect(gateway.downloadPhoto).toHaveBeenCalledTimes(1);
    });
  });

  it("attend la route de l'API quand aucun port n'est fourni", async () => {
    useMemberStore.getState().setPhoto("file:///documents/profile-photo.jpg");

    await renderHook(() => useProfilePhotoSync());

    expect(useMemberStore.getState().photoPendingUpload).toBe(true);
  });

  it("relance la synchro quand l'application revient au premier plan", async () => {
    useNetworkState.mockReturnValue(OFFLINE);
    useMemberStore.getState().setPhoto("file:///documents/profile-photo.jpg");
    const gateway = createGateway();

    await renderHook(() => useProfilePhotoSync(gateway));
    expect(gateway.uploadPhoto).not.toHaveBeenCalled();

    getNetworkState.mockResolvedValue(ONLINE);
    await act(async () => {
      appStateListener?.("active");
    });

    await waitFor(() => {
      expect(gateway.uploadPhoto).toHaveBeenCalledWith("file:///documents/profile-photo.jpg");
    });
  });

  it("envoie la photo choisie pendant l'envoi de la précédente", async () => {
    let resolveFirstUpload: ((version: string) => void) | undefined;
    const firstUpload = new Promise<string>((resolve) => {
      resolveFirstUpload = resolve;
    });
    const gateway = createGateway({
      uploadPhoto: jest.fn().mockReturnValueOnce(firstUpload).mockResolvedValue("v3"),
    });
    useMemberStore.getState().setPhoto("file:///documents/first.jpg");

    await renderHook(() => useProfilePhotoSync(gateway));
    await waitFor(() => {
      expect(gateway.uploadPhoto).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      useMemberStore.getState().setPhoto("file:///documents/second.jpg");
    });
    await act(async () => {
      resolveFirstUpload?.("v2");
      await firstUpload;
    });

    await waitFor(() => {
      expect(gateway.uploadPhoto).toHaveBeenCalledWith("file:///documents/second.jpg");
    });
    await waitFor(() => {
      expect(useMemberStore.getState().photoVersion).toBe("v3");
    });
    expect(useMemberStore.getState().photoUri).toBe("file:///documents/second.jpg");
    expect(useMemberStore.getState().photoPendingUpload).toBe(false);
  });
});
