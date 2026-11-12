import { useLocalSearchParams } from "expo-router";

import { TontineDetailScreen } from "../../src/features/tontines";
import { detailFocus } from "../../src/shared/model/model.detail-focus";

/**
 * Route de détail d'une tontine.
 * Une notification peut y ajouter `?action=pay` ou `?member=<id>` pour
 * ouvrir l'endroit exact qu'elle concerne.
 * @returns L'écran de détail de la tontine.
 */
export default function TontineDetailRoute() {
  const { id, ...params } = useLocalSearchParams<{
    id: string;
    action?: string;
    member?: string;
  }>();

  return <TontineDetailScreen id={id} focus={detailFocus(params)} />;
}
