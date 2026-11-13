import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { DEMO_MEMBER } from "../demo/demo.member";
import { formatFullName } from "../format/format.full-name";

/** Identité et photo du membre, partagées par tous les écrans. */
export interface MemberProfile {
  readonly firstName: string;
  readonly lastName: string;
  /** Profession ou formation, utilisée pour les indicateurs de suivi. */
  readonly occupation: string;
  readonly name: string;
  /** Initiale affichée tant qu'aucune photo n'est choisie. */
  readonly avatarInitial: string;
  /** Numéro au format international, affiché en lecture seule sur le profil. */
  readonly phone: string;
  /** Date de création du compte, en UTC. */
  readonly createdAt: string;
  /** URI locale de la photo, `null` tant qu'aucune photo n'est choisie. */
  readonly photoUri: string | null;
  /** Version distante de la photo connue du serveur, `null` avant la première synchro. */
  readonly photoVersion: string | null;
  /** Vrai quand la photo locale n'a pas encore été envoyée au serveur. */
  readonly photoPendingUpload: boolean;
}

/** Identité mise à jour à la fin d'une inscription. */
export interface MemberIdentity {
  readonly firstName: string;
  readonly lastName: string;
  readonly occupation: string;
  readonly phone: string;
}

/** État partagé du membre et actions qui le modifient. */
export interface MemberState extends MemberProfile {
  /**
   * Remplace l'identité du membre, par exemple après une modification.
   * @param identity Prénom, nom, profession et numéro au format international.
   */
  updateIdentity: (identity: MemberIdentity) => void;
  /**
   * Enregistre le compte créé sur l'appareil : identité, date de création, et
   * aucune photo héritée d'un compte précédent.
   * @param identity Prénom, nom, profession et numéro au format international.
   * @param createdAt Date de création, au format `AAAA-MM-JJ` en UTC.
   */
  /**
   * Retient le numéro du compte ouvert à la connexion, pour que le profil et
   * les vérifications du code PIN parlent du même compte.
   * @param phone Numéro au format international.
   */
  rememberPhone: (phone: string) => void;
  registerMember: (identity: MemberIdentity, createdAt: string) => void;
  /**
   * Enregistre la photo choisie et la marque à envoyer au serveur.
   * @param photoUri URI locale de la photo compressée.
   */
  setPhoto: (photoUri: string) => void;
  /**
   * Marque la photo comme synchronisée avec le serveur.
   * @param photoVersion Version distante renvoyée par le serveur.
   */
  markPhotoSynced: (photoVersion: string) => void;
  /**
   * Remplace la photo par celle téléchargée du serveur.
   * @param photoUri URI locale de la photo téléchargée.
   * @param photoVersion Version distante de cette photo.
   */
  applyRemotePhoto: (photoUri: string, photoVersion: string) => void;
}

/**
 * Champs du profil déduits d'une identité : nom complet et initiale.
 * @param identity Prénom, nom, profession et numéro.
 * @returns Les champs d'identité du profil.
 */
function identityState(
  identity: MemberIdentity,
): MemberIdentity & Pick<MemberProfile, "name" | "avatarInitial"> {
  const name = formatFullName(identity.firstName, identity.lastName);

  return { ...identity, name, avatarInitial: name.charAt(0).toUpperCase() };
}

/** Profil initial, tant que l'authentification n'est pas branchée. */
export const INITIAL_MEMBER_PROFILE: MemberProfile = {
  ...DEMO_MEMBER,
  photoUri: null,
  photoVersion: null,
  photoPendingUpload: false,
};

/** Clé de persistance du profil sur l'appareil. */
export const MEMBER_STORAGE_KEY = "mitemo-member";

/**
 * Profil du membre, partagé par l'accueil et le profil. L'état est mis en
 * cache sur l'appareil : la photo s'affiche immédiatement au redémarrage,
 * sans nouvel appel réseau.
 */
export const useMemberStore = create<MemberState>()(
  persist(
    (set) => ({
      ...INITIAL_MEMBER_PROFILE,
      updateIdentity: (identity) => set(identityState(identity)),
      rememberPhone: (phone) => set({ phone }),
      registerMember: (identity, createdAt) =>
        set({
          ...identityState(identity),
          createdAt,
          photoUri: null,
          photoVersion: null,
          photoPendingUpload: false,
        }),
      setPhoto: (photoUri) => set({ photoUri, photoPendingUpload: true }),
      markPhotoSynced: (photoVersion) => set({ photoPendingUpload: false, photoVersion }),
      applyRemotePhoto: (photoUri, photoVersion) =>
        set({ photoUri, photoVersion, photoPendingUpload: false }),
    }),
    {
      name: MEMBER_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
