import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import { INITIAL_MEMBER_PROFILE, useMemberStore } from "../../../shared/member/member-store";
import { renderWithSafeArea } from "../../../shared/testing/render-with-safe-area";
import { PHOTO_ERRORS } from "../hooks/use-profile-photo";
import { saveProfilePhoto } from "../model/profile-photo-file";
import { INITIAL_PROFILE_PREFERENCES, useProfilePreferences } from "../model/profile-preferences";
import { ProfileScreen } from "./profile-screen";

jest.mock("expo-router", () => ({
  router: { replace: jest.fn(), push: jest.fn(), back: jest.fn() },
}));

jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  requestCameraPermissionsAsync: jest.fn(),
}));

jest.mock("../model/profile-photo-file", () => ({
  saveProfilePhoto: jest.fn(),
}));

/** Résultat d'un choix abouti, avec une photo carrée. */
const PICKED: ImagePicker.ImagePickerSuccessResult = {
  canceled: false,
  assets: [{ uri: "file:///gallery/avatar.jpg", width: 1024, height: 1024 }],
};

/** Résultat d'un choix annulé par le membre. */
const CANCELED: ImagePicker.ImagePickerCanceledResult = { canceled: true, assets: null };

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

describe("ProfileScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useMemberStore.setState(INITIAL_MEMBER_PROFILE);
    useProfilePreferences.setState(INITIAL_PROFILE_PREFERENCES);
  });

  it("affiche le membre connecté", async () => {
    await renderWithSafeArea(<ProfileScreen />);

    expect(screen.getByRole("header", { name: "Précieuse" })).toBeOnTheScreen();
    expect(screen.getByText("+242 06 512 34 56")).toBeOnTheScreen();
  });

  it("regroupe les actions du profil", async () => {
    await renderWithSafeArea(<ProfileScreen />);

    expect(screen.getByText("Mon compte")).toBeOnTheScreen();
    expect(screen.getByText("Préférences")).toBeOnTheScreen();
    expect(screen.getByText("Aide")).toBeOnTheScreen();
  });

  it("affiche les actions et la déconnexion", async () => {
    await renderWithSafeArea(<ProfileScreen />);

    expect(screen.getByText("Mes informations")).toBeOnTheScreen();
    expect(screen.getByText("Centre d'aide")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Se déconnecter" })).toBeOnTheScreen();
  });

  it("propose l'historique et le choix du thème", async () => {
    await renderWithSafeArea(<ProfileScreen />);

    expect(screen.getByRole("button", { name: "Historique" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Thème" })).toBeOnTheScreen();
  });

  it("ouvre l'historique dans une page dédiée", async () => {
    await renderWithSafeArea(<ProfileScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Historique" }));

    expect(router.push).toHaveBeenCalledWith("/history");
    expect(screen.queryByText("Dernières opérations")).not.toBeOnTheScreen();
  });

  it("affiche le nom du thème courant", async () => {
    await renderWithSafeArea(<ProfileScreen />);

    expect(screen.getByText("Système")).toBeOnTheScreen();
  });

  it("affiche les documents légaux", async () => {
    await renderWithSafeArea(<ProfileScreen />);

    expect(screen.getByRole("button", { name: "Politique de confidentialité" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Conditions d'utilisation" })).toBeOnTheScreen();
  });

  it("ouvre le choix de la source de la photo", async () => {
    await renderWithSafeArea(<ProfileScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Modifier la photo" }));

    expect(
      await screen.findByRole("button", { name: "Choisir dans la galerie" }),
    ).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Prendre une photo" })).toBeOnTheScreen();
  });

  it("n'ouvre la galerie qu'après le choix de la source", async () => {
    jest.mocked(ImagePicker.launchImageLibraryAsync).mockResolvedValue(CANCELED);
    await renderWithSafeArea(<ProfileScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Modifier la photo" }));

    expect(screen.getByRole("button", { name: "Choisir dans la galerie" })).toBeOnTheScreen();
    expect(ImagePicker.launchImageLibraryAsync).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByRole("button", { name: "Choisir dans la galerie" }));

    expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledTimes(1);
  });

  it("garde la feuille montée tant que le sélecteur est affiché", async () => {
    const picker = deferred<ImagePicker.ImagePickerCanceledResult>();
    jest.mocked(ImagePicker.launchImageLibraryAsync).mockReturnValue(picker.promise);
    await renderWithSafeArea(<ProfileScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Modifier la photo" }));
    await fireEvent.press(screen.getByRole("button", { name: "Choisir dans la galerie" }));

    expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Choisir dans la galerie" })).toBeOnTheScreen();

    await act(async () => {
      picker.resolve(CANCELED);
    });

    await waitFor(() =>
      expect(
        screen.queryByRole("button", { name: "Choisir dans la galerie" }),
      ).not.toBeOnTheScreen(),
    );
  });

  it("explique un échec de la galerie et laisse la feuille ouverte", async () => {
    jest.mocked(ImagePicker.launchImageLibraryAsync).mockRejectedValue(new Error("indisponible"));
    await renderWithSafeArea(<ProfileScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Modifier la photo" }));
    await fireEvent.press(screen.getByRole("button", { name: "Choisir dans la galerie" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(PHOTO_ERRORS.library);
    expect(screen.getByRole("button", { name: "Choisir dans la galerie" })).toBeOnTheScreen();
  });

  it("ferme la feuille avant la fin de l'enregistrement de la photo", async () => {
    const save = deferred<string>();
    jest.mocked(saveProfilePhoto).mockReturnValue(save.promise);
    jest.mocked(ImagePicker.launchImageLibraryAsync).mockResolvedValue(PICKED);
    await renderWithSafeArea(<ProfileScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Modifier la photo" }));
    await fireEvent.press(screen.getByRole("button", { name: "Choisir dans la galerie" }));

    await waitFor(() =>
      expect(
        screen.queryByRole("button", { name: "Choisir dans la galerie" }),
      ).not.toBeOnTheScreen(),
    );
    expect(screen.getByTestId("profile-photo-saving")).toBeOnTheScreen();
    expect(screen.getByTestId("profile-photo")).toBeOnTheScreen();

    await act(async () => {
      save.resolve("file:///documents/profile-photo.jpg");
    });

    await waitFor(() => expect(screen.queryByTestId("profile-photo-saving")).not.toBeOnTheScreen());
  });

  it("affiche la photo partagée par le profil", async () => {
    useMemberStore.getState().setPhoto("file:///documents/profile-photo.jpg");
    await renderWithSafeArea(<ProfileScreen />);

    expect(screen.getByTestId("profile-photo")).toBeOnTheScreen();
  });

  it("affiche la création du compte et l'identité de l'application", async () => {
    await renderWithSafeArea(<ProfileScreen />);

    expect(screen.getByText("Compte créé le 12/03/2026")).toBeOnTheScreen();
    expect(screen.getByText("Mitemo")).toBeOnTheScreen();
    expect(screen.getByText("version 0.0.0")).toBeOnTheScreen();
  });

  it("ouvre une feuille pour une action au lieu d'une seconde page", async () => {
    await renderWithSafeArea(<ProfileScreen />);

    fireEvent.press(screen.getByRole("button", { name: "Mes informations" }));

    expect(await screen.findByText("Nom complet")).toBeOnTheScreen();
    expect(screen.getByText("Compte vérifié")).toBeOnTheScreen();
  });

  it("enregistre le thème choisi dans la feuille", async () => {
    await renderWithSafeArea(<ProfileScreen />);

    fireEvent.press(screen.getByRole("button", { name: "Thème" }));
    fireEvent.press(await screen.findByRole("button", { name: "Sombre" }));

    expect(useProfilePreferences.getState().theme).toBe("Sombre");
    expect(screen.getAllByText("Sombre").length).toBeGreaterThan(0);
  });

  it("active la biométrie depuis la feuille de sécurité", async () => {
    await renderWithSafeArea(<ProfileScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Sécurité" }));
    const toggle = await screen.findByLabelText("Déverrouillage biométrique");
    await fireEvent(toggle, "valueChange", true);

    expect(useProfilePreferences.getState().biometrics).toBe(true);
  });

  it("coupe une catégorie de notifications", async () => {
    await renderWithSafeArea(<ProfileScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Notifications" }));
    const toggle = await screen.findByLabelText("Cotisations");
    await fireEvent(toggle, "valueChange", false);

    expect(useProfilePreferences.getState().notifications.contributions).toBe(false);
  });

  it("change la langue depuis la feuille", async () => {
    await renderWithSafeArea(<ProfileScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Langue" }));
    await fireEvent.press(await screen.findByRole("button", { name: "Anglais" }));

    expect(useProfilePreferences.getState().language).toBe("Anglais");
  });

  it("affiche les questions fréquentes dans l'aide", async () => {
    await renderWithSafeArea(<ProfileScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Centre d'aide" }));

    expect(await screen.findByText("Questions fréquentes")).toBeOnTheScreen();
    expect(screen.getByText("support@mitemo.app")).toBeOnTheScreen();
  });

  it("demande confirmation avant de se déconnecter", async () => {
    await renderWithSafeArea(<ProfileScreen />);

    fireEvent.press(screen.getByRole("button", { name: "Se déconnecter" }));

    expect(
      await screen.findByRole("button", { name: "Confirmer la déconnexion" }),
    ).toBeOnTheScreen();
  });

  it("n'affiche plus l'ancienneté dans l'en-tête", async () => {
    await renderWithSafeArea(<ProfileScreen />);

    expect(screen.queryByText(/Membre depuis/)).not.toBeOnTheScreen();
  });
});
