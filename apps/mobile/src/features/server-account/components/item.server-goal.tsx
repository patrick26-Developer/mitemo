import type { SavingsGoalResponse } from "@mitemo/contracts";
import { Text, View } from "react-native";
import { serverMoney } from "../model/model.server-money";

/** Objectif confirmé par l’API. */
interface ServerGoalItemProps {
  readonly goal: SavingsGoalResponse;
}

/**
 * Affiche une cible, sans la présenter comme une somme déjà épargnée.
 * @param props Objectif appartenant au compte.
 * @returns Le résumé du programme.
 */
export function ServerGoalItem(props: ServerGoalItemProps) {
  const { goal } = props;
  return (
    <View className="gap-2 rounded-xl border border-card-border p-4">
      <Text>{goal.name}</Text>
      <Text>Cible : {serverMoney(goal.target)}</Text>
      <Text>Première échéance : {goal.terms.startsAt}</Text>
      <Text>Aucun versement n’est déclenché par la création.</Text>
    </View>
  );
}
