import { useLocalSearchParams } from "expo-router";

import { TontineDetailScreen } from "../../src/features/tontines";

/**
 * Route de détail d'une tontine.
 * @returns L'écran de détail de la tontine.
 */
export default function TontineDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <TontineDetailScreen id={id} />;
}
