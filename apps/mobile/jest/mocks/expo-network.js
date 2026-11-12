/**
 * Double de test d'expo-network : le module natif n'existe pas dans Jest.
 * L'appareil est connecté par défaut ; un test simule une coupure avec son
 * propre `jest.mock("expo-network", ...)`.
 */

/**
 * État réseau d'un appareil connecté.
 * @returns {{ isConnected: boolean, isInternetReachable: boolean }} L'état réseau.
 */
export function useNetworkState() {
  return { isConnected: true, isInternetReachable: true };
}

/**
 * État réseau lu une fois, connecté.
 * @returns {Promise<{ isConnected: boolean, isInternetReachable: boolean }>} L'état réseau.
 */
export async function getNetworkStateAsync() {
  return { isConnected: true, isInternetReachable: true };
}
