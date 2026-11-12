import { useLocalSearchParams } from "expo-router";

import { SavingsDetailScreen } from "../../src/features/savings";
import { detailFocus } from "../../src/shared/model/model.detail-focus";

/**
 * Route de détail d'une carte de pointage.
 * Une notification peut y ajouter `?action=pay` ou `?member=<id>` pour
 * ouvrir l'endroit exact qu'elle concerne.
 * @returns L'écran de détail de la carte.
 */
export default function SavingsDetailRoute() {
  const { id, ...params } = useLocalSearchParams<{
    id: string;
    action?: string;
    member?: string;
  }>();

  return <SavingsDetailScreen id={id} focus={detailFocus(params)} />;
}
