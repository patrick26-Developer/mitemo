import { useLocalSearchParams } from "expo-router";

import { TontineMembersScreen } from "../../src/features/tontines";

/**
 * Route de la liste complète des membres d'une tontine.
 * @returns L'écran des membres.
 */
export default function TontineMembersRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <TontineMembersScreen id={id} />;
}
