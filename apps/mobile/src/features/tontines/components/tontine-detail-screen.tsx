import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DetailHeader } from "../../../shared/components/detail-header";
import { EmptyState } from "../../../shared/components/empty-state";
import { DEMO_TONTINES } from "../../../shared/demo/tontines";
import { TontineDetailContent } from "./tontine-detail-content";

/** Props de l'écran de détail d'une tontine. */
export interface TontineDetailScreenProps {
  /** Identifiant de la tontine demandée. */
  readonly id: string;
}

/**
 * Écran de détail d'une tontine, retrouvée par son identifiant.
 * @param props Identifiant de la tontine.
 * @returns L'écran de détail de la tontine.
 */
export function TontineDetailScreen(props: TontineDetailScreenProps) {
  const { id } = props;
  const insets = useSafeAreaInsets();
  const tontine = DEMO_TONTINES.find((item) => item.id === id);

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 12 }}>
      <DetailHeader title={tontine?.name ?? "Tontine"} />
      {tontine ? (
        <TontineDetailContent item={tontine} />
      ) : (
        <EmptyState
          title="Tontine introuvable"
          message="Cette tontine n'existe pas ou a été supprimée."
        />
      )}
    </View>
  );
}
