import { useLocalSearchParams } from "expo-router";

import { SavingsDetailScreen } from "../../src/features/savings";

/**
 * Route de détail d'une caisse.
 * @returns L'écran de détail de la caisse.
 */
export default function SavingsDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <SavingsDetailScreen id={id} />;
}
