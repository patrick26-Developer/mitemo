import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";

import { useMemberStore } from "../../../shared/member/store.member";
import { saveProfilePhoto } from "../model/model.profile-photo-file";

/**
 * Photo carrée, gardée en pleine qualité par le sélecteur : le redimensionnement
 * et la compression se font ensuite, une seule fois, dans `saveProfilePhoto`.
 * Une qualité de 1 évite sur Android une seconde compression de l'image pleine
 * taille (`RawImageExporter`). Sur iOS, la représentation courante évite la
 * conversion HEIC vers JPEG de l'original, longue sur les photos récentes.
 */
export const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 1,
  preferredAssetRepresentationMode:
    ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Current,
};

/** Messages affichés au membre quand un changement de photo échoue. */
export const PHOTO_ERRORS = {
  library: "La galerie n'a pas pu s'ouvrir. Réessayez.",
  cameraPermission:
    "L'accès à l'appareil photo est refusé. Autorisez-le dans les réglages du téléphone.",
  save: "La photo n'a pas pu être enregistrée. Réessayez.",
} as const;

/** Issue d'un changement de photo. */
export type PhotoChangeOutcome =
  | { readonly status: "saved" }
  | { readonly status: "canceled" }
  | { readonly status: "failed"; readonly message: string };

/** Résultat de l'ouverture d'une source de photo. */
type PickResult =
  | { readonly kind: "picked"; readonly asset: ImagePicker.ImagePickerAsset }
  | { readonly kind: "canceled" }
  | { readonly kind: "denied" };

/** Résultat d'une source, enrichi du cas où le sélecteur n'a pas pu s'ouvrir. */
type SourceResult = PickResult | { readonly kind: "failed"; readonly message: string };

/** Actions d'état et verrou d'un changement de photo. */
interface PhotoChangeState {
  readonly setPhoto: (uri: string) => void;
  readonly setPreviewUri: (uri: string | null) => void;
  readonly setIsSaving: (saving: boolean) => void;
  readonly setError: (message: string | null) => void;
  readonly saving: { current: boolean };
}

/**
 * Extrait la photo d'un résultat de sélecteur système.
 * @param result Résultat du sélecteur système.
 * @returns La photo choisie, ou `null` si le membre annule.
 */
function chosenAsset(result: ImagePicker.ImagePickerResult): ImagePicker.ImagePickerAsset | null {
  if (result.canceled) return null;

  return result.assets?.[0] ?? null;
}

/**
 * Ouvre le sélecteur système et attend le choix d'une photo. Aucune permission
 * n'est demandée en amont : `launchImageLibraryAsync` ne l'exige que sur iOS 10
 * (documentation Expo).
 * @returns La photo choisie, l'annulation ou l'échec d'ouverture.
 */
async function pickFromLibrary(): Promise<PickResult> {
  const asset = chosenAsset(await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS));

  return asset === null ? { kind: "canceled" } : { kind: "picked", asset };
}

/**
 * Demande l'accès à l'appareil photo, puis ouvre la prise de vue.
 * @returns La photo prise, le refus d'autorisation ou l'annulation.
 */
async function takePicture(): Promise<PickResult> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();

  if (!permission.granted) return { kind: "denied" };

  const asset = chosenAsset(await ImagePicker.launchCameraAsync(PICKER_OPTIONS));

  return asset === null ? { kind: "canceled" } : { kind: "picked", asset };
}

/**
 * Ouvre une source sans laisser une erreur native remonter telle quelle.
 * @param source Galerie ou appareil photo.
 * @returns La photo, l'annulation, le refus ou un message d'échec lisible.
 */
async function openSource(source: () => Promise<PickResult>): Promise<SourceResult> {
  try {
    return await source();
  } catch {
    return { kind: "failed", message: PHOTO_ERRORS.library };
  }
}

/**
 * Retient le message d'échec et renvoie l'issue correspondante.
 * @param state Actions d'état du changement de photo.
 * @param message Message affiché au membre.
 * @returns L'issue en échec.
 */
function fail(state: PhotoChangeState, message: string): PhotoChangeOutcome {
  state.setError(message);

  return { status: "failed", message };
}

/**
 * Affiche immédiatement la photo choisie, puis la remplace par sa version
 * compressée une fois enregistrée. En cas d'échec, l'ancienne photo revient.
 * @param uri URI locale de la photo choisie.
 * @param state Actions d'état du changement de photo.
 * @returns L'issue du changement.
 */
async function storeChosenPhoto(uri: string, state: PhotoChangeState): Promise<PhotoChangeOutcome> {
  state.setError(null);
  state.setPreviewUri(uri);
  state.setIsSaving(true);

  try {
    state.setPhoto(await saveProfilePhoto(uri));

    return { status: "saved" };
  } catch {
    return fail(state, PHOTO_ERRORS.save);
  } finally {
    state.setPreviewUri(null);
    state.setIsSaving(false);
  }
}

/**
 * Applique le résultat d'une source : conserve la photo, ou signale l'échec.
 *
 * Le sélecteur système venant de rendre la main, le propriétaire est prévenu
 * avant l'enregistrement : la feuille de choix peut ainsi se fermer sans
 * attendre la compression, qui se poursuit en arrière-plan.
 * @param source Galerie ou appareil photo.
 * @param state Actions d'état du changement de photo.
 * @param onPickerClosed Appelé dès que le sélecteur a rendu la main.
 * @returns L'issue du changement.
 */
async function runChange(
  source: () => Promise<PickResult>,
  state: PhotoChangeState,
  onPickerClosed: () => void,
): Promise<PhotoChangeOutcome> {
  state.setError(null);

  const picked = await openSource(source);

  if (picked.kind === "failed") return fail(state, picked.message);
  if (picked.kind === "denied") return fail(state, PHOTO_ERRORS.cameraPermission);

  onPickerClosed();

  if (picked.kind === "canceled") return { status: "canceled" };

  return storeChosenPhoto(picked.asset.uri, state);
}

/**
 * Lance un choix de photo, puis affiche et enregistre celle qui a été retenue.
 * @param source Galerie ou appareil photo.
 * @param state Actions d'état et verrou d'enregistrement.
 * @param onPickerClosed Appelé dès que le sélecteur a rendu la main.
 * @returns L'issue du changement.
 */
async function changePhoto(
  source: () => Promise<PickResult>,
  state: PhotoChangeState,
  onPickerClosed: () => void,
): Promise<PhotoChangeOutcome> {
  if (state.saving.current) return { status: "canceled" };

  state.saving.current = true;

  try {
    return await runChange(source, state, onPickerClosed);
  } finally {
    state.saving.current = false;
  }
}

/**
 * Gère la photo de profil partagée par tous les écrans. La photo choisie est
 * affichée sans attendre, puis compressée, conservée sur l'appareil et mise en
 * cache dans le store.
 * @returns L'URI de la photo, l'enregistrement, l'erreur et les actions de choix.
 */
export function useProfilePhoto() {
  const photoUri = useMemberStore((state) => state.photoUri);
  const setPhoto = useMemberStore((state) => state.setPhoto);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setError] = useState<string | null>(null);
  const saving = useRef(false);
  const state = { setPhoto, setPreviewUri, setIsSaving, setError, saving };

  return {
    photoUri: previewUri ?? photoUri,
    isSaving,
    errorMessage,
    clearError: () => setError(null),
    pickPhoto: (onPickerClosed: () => void) => changePhoto(pickFromLibrary, state, onPickerClosed),
    takePhoto: (onPickerClosed: () => void) => changePhoto(takePicture, state, onPickerClosed),
  };
}
