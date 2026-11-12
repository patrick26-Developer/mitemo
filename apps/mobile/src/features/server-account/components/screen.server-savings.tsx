import { ScrollView, Text } from "react-native";
import { SheetPrimaryButton } from "../../../shared/components/atoms/button.sheet-primary";
import { ScreenFrame } from "../../../shared/components/macros/frame.screen";
import { RemoteStatus } from "../../../shared/components/macros/status.remote";
import { useServerGoals } from "../hooks/hook.server-goals";
import { ServerGoalForm } from "./form.server-goal";
import { ServerGoalItem } from "./item.server-goal";

/**
 * Liste uniquement les objectifs du serveur ; les cartes locales restent séparées.
 * @returns La liste paginée et la création sans paiement.
 */
export function ServerSavingsScreen() {
  const resource = useServerGoals();
  return (
    <ScreenFrame>
      <ScrollView contentContainerClassName="gap-5 p-4">
        <Text className="text-2xl">Mes objectifs</Text>
        <RemoteStatus resource={resource} />
        {resource.data?.items.length === 0 ? <Text>Aucun objectif pour ce compte.</Text> : null}
        {resource.data?.items.map((goal) => (
          <ServerGoalItem key={goal.goalId} goal={goal} />
        ))}
        {resource.data?.nextCursor ? (
          <SheetPrimaryButton label="Objectifs suivants" onPress={resource.nextPage} />
        ) : null}
        <ServerGoalForm onCreated={resource.reload} />
      </ScrollView>
    </ScreenFrame>
  );
}
