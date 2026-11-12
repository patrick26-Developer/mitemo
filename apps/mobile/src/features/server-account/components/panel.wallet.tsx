import type { WalletSummaryResponse } from "@mitemo/contracts";
import { Text, View } from "react-native";
import { serverMoney } from "../model/model.server-money";

/** Soldes provenant exclusivement de l’API. */
interface ServerWalletPanelProps {
  readonly wallet: WalletSummaryResponse;
}

/**
 * Présente les quatre soldes serveur et signale la simulation.
 * @param props Soldes vérifiés.
 * @returns Le panneau du portefeuille.
 */
export function ServerWalletPanel(props: ServerWalletPanelProps) {
  const { wallet } = props;
  return (
    <View className="gap-3 rounded-2xl bg-card p-5">
      <Text className="text-white">Portefeuille simulé — aucun fonds réel</Text>
      <Text className="text-xl text-white">Disponible : {serverMoney(wallet.available)}</Text>
      <Text className="text-white">Affecté : {serverMoney(wallet.committed)}</Text>
      <Text className="text-white">En attente : {serverMoney(wallet.pending)}</Text>
      <Text className="text-white">Bloqué : {serverMoney(wallet.blocked)}</Text>
    </View>
  );
}
