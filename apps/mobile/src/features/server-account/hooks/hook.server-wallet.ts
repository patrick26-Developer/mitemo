import { accountApi } from "../../../shared/api/config.api";
import { useRemoteResource } from "../../../shared/hooks/hook.remote-resource";

const loadWallet = () => accountApi.walletSummary();

/**
 * Raccorde les états d'affichage au portefeuille réellement lu par l'API.
 * @returns Données, état réseau et relecture, sans solde local de remplacement.
 */
export function useServerWallet() {
  return useRemoteResource(loadWallet);
}
