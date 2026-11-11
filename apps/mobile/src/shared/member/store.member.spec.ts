import AsyncStorage from "@react-native-async-storage/async-storage";
import { waitFor } from "@testing-library/react-native";

import { INITIAL_MEMBER_PROFILE, MEMBER_STORAGE_KEY, useMemberStore } from "./store.member";

describe("useMemberStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useMemberStore.setState(INITIAL_MEMBER_PROFILE);
  });

  it("part du membre de démonstration, sans photo", () => {
    const state = useMemberStore.getState();

    expect(state.name).toBe("Précieuse Mavoungou");
    expect(state.occupation).toBe("Commerçante");
    expect(state.photoUri).toBeNull();
    expect(state.photoPendingUpload).toBe(false);
  });

  it("partage la photo choisie avec tous les écrans", () => {
    useMemberStore.getState().setPhoto("file:///documents/profile-photo.jpg");

    expect(useMemberStore.getState().photoUri).toBe("file:///documents/profile-photo.jpg");
    expect(useMemberStore.getState().photoPendingUpload).toBe(true);
  });

  it("marque la photo comme synchronisée", () => {
    useMemberStore.getState().setPhoto("file:///documents/profile-photo.jpg");
    useMemberStore.getState().markPhotoSynced("v1");

    expect(useMemberStore.getState().photoPendingUpload).toBe(false);
    expect(useMemberStore.getState().photoVersion).toBe("v1");
  });

  it("applique la photo téléchargée du serveur", () => {
    useMemberStore.getState().applyRemotePhoto("file:///documents/remote.jpg", "v2");

    expect(useMemberStore.getState().photoUri).toBe("file:///documents/remote.jpg");
    expect(useMemberStore.getState().photoVersion).toBe("v2");
    expect(useMemberStore.getState().photoPendingUpload).toBe(false);
  });

  it("enregistre un nouveau compte avec sa date de création et sans photo", () => {
    useMemberStore.getState().setPhoto("file:///ancienne-photo.jpg");

    useMemberStore.getState().registerMember(
      {
        firstName: "Aimée",
        lastName: "Mbemba",
        occupation: "Commerçante",
        phone: "+242 06 512 3456",
      },
      "2026-11-11",
    );

    expect(useMemberStore.getState()).toMatchObject({
      name: "Aimée Mbemba",
      createdAt: "2026-11-11",
      photoUri: null,
      photoVersion: null,
      photoPendingUpload: false,
    });
  });

  it("met à jour l'identité après une inscription", () => {
    useMemberStore.getState().updateIdentity({
      firstName: "Aimée",
      lastName: "Mbemba",
      occupation: "Commerçante",
      phone: "+242 06 512 3456",
    });

    expect(useMemberStore.getState().name).toBe("Aimée Mbemba");
    expect(useMemberStore.getState().firstName).toBe("Aimée");
    expect(useMemberStore.getState().lastName).toBe("Mbemba");
    expect(useMemberStore.getState().occupation).toBe("Commerçante");
    expect(useMemberStore.getState().avatarInitial).toBe("A");
    expect(useMemberStore.getState().phone).toBe("+242 06 512 3456");
  });

  it("met le profil en cache sur l'appareil", async () => {
    useMemberStore.getState().setPhoto("file:///documents/profile-photo.jpg");

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        MEMBER_STORAGE_KEY,
        expect.stringContaining("profile-photo.jpg"),
      );
    });
  });

  it("recharge le profil mis en cache au démarrage", async () => {
    await AsyncStorage.setItem(
      MEMBER_STORAGE_KEY,
      JSON.stringify({
        state: { ...INITIAL_MEMBER_PROFILE, photoUri: "file:///documents/cached.jpg" },
        version: 0,
      }),
    );

    await useMemberStore.persist.rehydrate();

    expect(useMemberStore.getState().photoUri).toBe("file:///documents/cached.jpg");
  });
});
