/** États de la connexion affichés au membre. */
export const CONNECTION_STATUSES = ["online", "offline", "restored"] as const;

/**
 * État de la connexion : `online` (rien à dire), `offline` (réseau coupé) ou
 * `restored` (réseau revenu, annoncé un court instant).
 */
export type ConnectionStatus = (typeof CONNECTION_STATUSES)[number];

/** État du réseau tel que le décrit l'appareil ; un champ absent est inconnu. */
export interface NetworkSnapshot {
  readonly isConnected?: boolean;
  readonly isInternetReachable?: boolean;
}

/**
 * Dit si l'appareil peut joindre Internet. Un état encore inconnu compte comme
 * connecté, pour ne pas afficher de fausse alerte au démarrage.
 * @param network État du réseau.
 * @returns Vrai sauf coupure avérée.
 */
export function isOnline(network: NetworkSnapshot): boolean {
  return network.isConnected !== false && network.isInternetReachable !== false;
}

/**
 * Fait évoluer l'état affiché quand le réseau change : la coupure est
 * annoncée tout de suite, son retour seulement après une coupure.
 * @param current État affiché.
 * @param online Vrai quand l'appareil joint Internet.
 * @returns Le nouvel état affiché.
 */
export function nextConnectionStatus(current: ConnectionStatus, online: boolean): ConnectionStatus {
  if (!online) return "offline";
  return current === "offline" ? "restored" : current;
}
