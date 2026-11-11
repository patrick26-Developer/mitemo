import type { IsoDateTime } from "./datetime.ts";

/**
 * Plateformes mobiles qui reçoivent une notification poussée. Le jeton est
 * celui d'Expo (`ExponentPushToken[...]`), qui relaie vers APNs et FCM.
 */
export const PUSH_PLATFORMS = ["IOS", "ANDROID"] as const;

/** Plateforme d'un jeton de notification. Voir {@link PUSH_PLATFORMS}. */
export type PushPlatform = (typeof PUSH_PLATFORMS)[number];

/**
 * Enregistrement du jeton de notification de l'appareil, après acceptation
 * explicite de l'utilisateur. Une requête par jeton et par compte ; rejouer la
 * requête avec le même jeton est sans effet.
 */
export interface RegisterPushTokenRequest {
  readonly token: string;
  readonly platform: PushPlatform;
  /** Version de l'application, pour diagnostiquer un jeton obsolète. */
  readonly appVersion: string;
}

/** Résultat de l'enregistrement d'un jeton de notification. */
export interface RegisterPushTokenResponse {
  readonly registeredAt: IsoDateTime;
}
