/** Ce qui autorise une connexion HTTP non chiffrée. */
export interface BaseUrlPolicy {
  /** Vrai en développement : HTTP toléré vers la machine ou le réseau local. */
  readonly allowLocalHttp: boolean;
}

/** URL de base validée, ou raison du refus. */
export type ApiBaseUrl =
  | { readonly ok: true; readonly url: string }
  | { readonly ok: false; readonly reason: "missing" | "invalid" | "insecure" };

/** Hôtes joignables en HTTP en développement : machine, émulateur Android, réseau local. */
const LOCAL_HOST =
  /^(localhost|127\.0\.0\.1|10\.0\.2\.2|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)$/;

/**
 * Lit l'URL d'une chaîne, sans lever d'exception.
 * @param raw Chaîne reçue.
 * @returns L'URL, ou `null` si la chaîne n'en est pas une.
 */
function toUrl(raw: string): URL | null {
  try {
    return new URL(raw);
  } catch (error) {
    if (error instanceof TypeError) return null;
    throw error;
  }
}

/**
 * Indique si l'URL est une simple origine, sans identifiants, requête ni ancre :
 * un secret ou un paramètre glissé dans l'URL partirait avec chaque requête.
 * @param url URL à vérifier.
 * @returns `true` quand l'URL est propre.
 */
function isPlainOrigin(url: URL): boolean {
  return url.username === "" && url.password === "" && url.search === "" && url.hash === "";
}

/**
 * Indique si le protocole de l'URL est acceptable : HTTPS toujours, HTTP
 * seulement en développement et vers la machine ou le réseau local.
 * @param url URL à vérifier.
 * @param policy Tolérance du HTTP local.
 * @returns `true` quand la connexion est acceptable.
 */
function isSecureEnough(url: URL, policy: BaseUrlPolicy): boolean {
  if (url.protocol === "https:") return true;
  return url.protocol === "http:" && policy.allowLocalHttp && LOCAL_HOST.test(url.hostname);
}

/**
 * Valide l'URL de base de l'API à la frontière : HTTPS obligatoire, sauf en
 * développement vers la machine ou le réseau local ; jamais d'identifiants
 * ni de paramètres dans l'URL.
 * @param raw Valeur de `EXPO_PUBLIC_API_URL`.
 * @param policy Tolérance du HTTP local.
 * @returns L'URL sans barre finale, ou la raison du refus.
 */
export function parseApiBaseUrl(raw: string | undefined, policy: BaseUrlPolicy): ApiBaseUrl {
  if (raw === undefined || raw.trim() === "") return { ok: false, reason: "missing" };
  const url = toUrl(raw.trim());
  if (url === null || !isPlainOrigin(url)) return { ok: false, reason: "invalid" };
  if (!isSecureEnough(url, policy)) return { ok: false, reason: "insecure" };
  return { ok: true, url: url.href.replace(/\/+$/, "") };
}
