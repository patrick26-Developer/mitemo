import type { WalletMovement } from "@mitemo/contracts";
import { Text, View } from "react-native";
import { serverMoney } from "../model/model.server-money";

/** Mouvement déjà autorisé et confirmé par le serveur. */
interface ServerMovementRowProps {
  readonly movement: WalletMovement;
}

/**
 * Affiche les données du grand livre, sans opération inventée.
 * @param props Mouvement reçu de l’API.
 * @returns La ligne de l’historique.
 */
export function ServerMovementRow(props: ServerMovementRowProps) {
  const { movement } = props;
  return (
    <View className="gap-1 rounded-xl border border-card-border p-3">
      <Text>{movement.description}</Text>
      <Text>{serverMoney(movement.amount)}</Text>
      <Text>{movement.occurredAt}</Text>
      {movement.simulated ? <Text>Opération simulée</Text> : null}
    </View>
  );
}
