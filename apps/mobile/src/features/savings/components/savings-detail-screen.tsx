import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DetailHeader } from "../../../shared/components/detail-header";
import { EmptyState } from "../../../shared/components/empty-state";
import { DEMO_SAVINGS } from "../../../shared/demo/savings";
import { SavingsDetailContent } from "./savings-detail-content";

/** Props de l'écran de détail d'une carte de pointage. */
export interface SavingsDetailScreenProps {
  /** Identifiant de la carte demandée. */
  readonly id: string;
}

/**
 * Écran de détail d'une carte de pointage, retrouvée par son identifiant.
 * @param props Identifiant de la carte.
 * @returns L'écran de détail de la carte de pointage.
 */
export function SavingsDetailScreen(props: SavingsDetailScreenProps) {
  const { id } = props;
  const insets = useSafeAreaInsets();
  const savings = DEMO_SAVINGS.find((item) => item.id === id);

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 12 }}>
      <DetailHeader title={savings?.title ?? "Carte"} />
      {savings ? (
        <SavingsDetailContent item={savings} />
      ) : (
        <EmptyState
          title="Carte introuvable"
          message="Cette carte n'existe pas ou a été supprimée."
        />
      )}
    </View>
  );
}
