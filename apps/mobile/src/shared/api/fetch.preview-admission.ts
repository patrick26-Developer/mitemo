import * as SecureStore from "expo-secure-store";
import type { ApiBaseUrl } from "./model.api-base-url";
import type { FetchFn } from "./transport.http";

/** Clé du laissez-passer testeur, distincte du secret serveur et de la session. */
export const ADMISSION_STORAGE_KEY = "mitemo-preview-admission";

const ADMISSION_PATHS = new Set(["/auth/register", "/auth/login", "/auth/verify"]);

function acceptsAdmission(url: string, origin: ApiBaseUrl): boolean {
  if (!origin.ok) return false;
  const target = new URL(url);
  return target.origin === new URL(origin.url).origin && ADMISSION_PATHS.has(target.pathname);
}

/**
 * Ajoute l'admission aux seules routes publiques de l'origine API validée.
 * @param transport Transport injecté.
 * @param origin Origine API validée par la configuration.
 * @returns Le transport enrichi, sans secret compilé dans Expo.
 */
export function withPreviewAdmission(transport: FetchFn, origin: ApiBaseUrl): FetchFn {
  return async (url, init) => {
    if (!acceptsAdmission(url, origin)) return transport(url, init);
    const admission = await SecureStore.getItemAsync(ADMISSION_STORAGE_KEY);
    const headers = new Headers(init.headers);
    if (admission) headers.set("x-mitemo-preview-admission", admission);
    return transport(url, { ...init, headers });
  };
}
