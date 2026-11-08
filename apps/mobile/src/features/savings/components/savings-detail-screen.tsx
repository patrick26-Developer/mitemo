import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DetailHeader } from "../../../shared/components/detail-header";
import { EmptyState } from "../../../shared/components/empty-state";
import { DEMO_SAVINGS } from "../../../shared/demo/savings";
import { SavingsDetailContent } from "./savings-detail-content";

/** Props de l'écran de détail d'une caisse. */
export interface SavingsDetailScreenProps {
  /** Identifiant de la caisse demandée. */
  readonly id: string;
}

/**
 * Écran de détail d'une caisse, retrouvée par son identifiant.
 * @param props Identifiant de la caisse.
 * @returns L'écran de détail de la caisse.
 */
export function SavingsDetailScreen(props: SavingsDetailScreenProps) {
  const { id } = props;
  const insets = useSafeAreaInsets();
  const savings = DEMO_SAVINGS.find((item) => item.id === id);

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 12 }}>
      <DetailHeader title={savings?.title ?? "Caisse"} />
      {savings ? (
        <SavingsDetailContent item={savings} />
      ) : (
        <EmptyState
          title="Caisse introuvable"
          message="Cette caisse n'existe pas ou a été supprimée."
        />
      )}
    </View>
  );
}
