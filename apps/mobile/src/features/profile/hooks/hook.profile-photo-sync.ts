import * as Network from "expo-network";
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { AppState } from "react-native";

import { useMemberStore } from "../../../shared/member/store.member";
import type { MemberState } from "../../../shared/member/store.member";
import type { ProfilePhotoGateway } from "../model/model.profile-photo-gateway";
import {
  applyPhotoSyncResult,
  nextPhotoSyncAction,
  syncProfilePhoto,
} from "../model/model.profile-photo-sync";
import type { PhotoSyncSnapshot } from "../model/model.profile-photo-sync";

/**
 * Indique si l'appareil peut joindre le serveur.
 * @param state État réseau courant.
 * @returns Vrai quand la connexion est active et internet joignable.
 */
function isOnline(state: Network.NetworkState): boolean {
  return state.isConnected === true && state.isInternetReachable !== false;
}

/**
 * Extrait du profil partagé ce qui décide de la synchronisation.
 * @param state Profil du membre.
 * @returns L'état local de la photo.
 */
function snapshotOf(state: MemberState): PhotoSyncSnapshot {
  return {
    photoUri: state.photoUri,
    photoVersion: state.photoVersion,
    photoPendingUpload: state.photoPendingUpload,
  };
}

/**
 * Synchronise la photo du profil partagé, sans échanger plus de données que
 * nécessaire : envoi unique d'une photo en attente, sinon téléchargement
 * conditionnel par version.
 * @param gateway Port de synchronisation vers le serveur.
 */
async function runPhotoSync(gateway: ProfilePhotoGateway): Promise<void> {
  const state = useMemberStore.getState();
  const synced = snapshotOf(state);

  if (nextPhotoSyncAction(synced, true) === "idle") {
    return;
  }

  try {
    const result = await syncProfilePhoto(gateway, synced, true);
    const current = snapshotOf(useMemberStore.getState());
    applyPhotoSyncResult({ result, synced, current }, state);
  } catch {
    // Réseau coupé pendant l'appel : la prochaine connexion relancera la synchro.
  }
}

/**
 * Relance la synchronisation au retour de l'application au premier plan, quand
 * la connexion a pu revenir pendant que l'appareil était en veille.
 * @param sync Fonction de synchronisation du profil.
 */
async function syncOnForeground(sync: (online: boolean) => void): Promise<void> {
  sync(isOnline(await Network.getNetworkStateAsync()));
}

/**
 * Abonne un auditeur à la fin de la relecture du profil mis en cache.
 * @param onChange Auditeur appelé quand le cache est relu.
 * @returns La fonction de désabonnement.
 */
function subscribeToHydration(onChange: () => void): () => void {
  return useMemberStore.persist.onFinishHydration(onChange);
}

/**
 * Indique si le profil mis en cache a été relu de l'appareil.
 * @returns Vrai quand la relecture du cache est terminée.
 */
function isMemberHydrated(): boolean {
  return useMemberStore.persist.hasHydrated();
}

/**
 * Suit la relecture du profil mis en cache : au démarrage à froid, la
 * synchronisation attend de connaître la photo locale avant tout appel réseau.
 * @returns Vrai quand le profil a été relu de l'appareil.
 */
function useMemberHydrated(): boolean {
  return useSyncExternalStore(subscribeToHydration, isMemberHydrated);
}

/** Déclencheurs d'une synchronisation de la photo de profil. */
interface PhotoSyncTriggers {
  /** Vrai quand le profil mis en cache a été relu de l'appareil. */
  readonly hydrated: boolean;
  readonly online: boolean;
  readonly photoUri: string | null;
  readonly photoPendingUpload: boolean;
  readonly sync: (online: boolean) => void;
}

/**
 * Synchronise après la relecture du cache et à chaque changement de photo.
 * @param triggers Déclencheurs de la synchronisation.
 */
function useSyncOnChange(triggers: PhotoSyncTriggers): void {
  const { hydrated, online, photoUri, photoPendingUpload, sync } = triggers;

  useEffect(() => {
    if (hydrated) {
      sync(online);
    }
  }, [hydrated, online, photoUri, photoPendingUpload, sync]);
}

/**
 * Relance la synchronisation au retour au premier plan.
 * @param sync Fonction de synchronisation du profil.
 */
function useForegroundSync(sync: (online: boolean) => void): void {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (status) => {
      if (status === "active") {
        void syncOnForeground(sync);
      }
    });

    return () => subscription.remove();
  }, [sync]);
}

/**
 * Synchronise la photo de profil dès que la connexion revient : envoie une
 * photo en attente, sinon récupère la version distante. Les envois sont mis en
 * file pour ne jamais échanger deux photos en parallèle. Sans `gateway`, la
 * synchronisation attend la route profil de l'API.
 * @param gateway Port de synchronisation, `null` tant que l'API n'expose pas la route.
 */
export function useProfilePhotoSync(gateway: ProfilePhotoGateway | null = null) {
  const online = isOnline(Network.useNetworkState());
  const hydrated = useMemberHydrated();
  const photoUri = useMemberStore((state) => state.photoUri);
  const photoPendingUpload = useMemberStore((state) => state.photoPendingUpload);
  const queue = useRef<Promise<void>>(Promise.resolve());

  const sync = useCallback(
    (onlineNow: boolean) => {
      if (gateway === null || !onlineNow) {
        return;
      }

      queue.current = queue.current.then(() => runPhotoSync(gateway));
    },
    [gateway],
  );

  useSyncOnChange({ hydrated, online, photoUri, photoPendingUpload, sync });
  useForegroundSync(sync);
}
