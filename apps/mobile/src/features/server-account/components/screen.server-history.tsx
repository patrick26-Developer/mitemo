import { ScrollView, Text } from "react-native";
import { SheetPrimaryButton } from "../../../shared/components/atoms/button.sheet-primary";
import { DetailHeader } from "../../../shared/components/macros/header.detail";
import { ScreenFrame } from "../../../shared/components/macros/frame.screen";
import { RemoteStatus } from "../../../shared/components/macros/status.remote";
import { useServerMovements } from "../hooks/hook.server-movements";
import { ServerMovementRow } from "./row.server-movement";

/**
 * Historique réel du compte, y compris son état vide après une inscription.
 * @returns Les pages des mouvements serveur.
 */
export function ServerHistoryScreen() {
  const resource = useServerMovements();
  return (
    <ScreenFrame>
      <DetailHeader title="Historique" />
      <ScrollView contentContainerClassName="gap-3 p-4">
        <RemoteStatus resource={resource} />
        {resource.data?.items.length === 0 ? <Text>Aucun mouvement pour ce compte.</Text> : null}
        {resource.data?.items.map((movement) => (
          <ServerMovementRow key={movement.movementId} movement={movement} />
        ))}
        {resource.data?.nextCursor ? (
          <SheetPrimaryButton label="Mouvements suivants" onPress={resource.nextPage} />
        ) : null}
        <SheetPrimaryButton label="Actualiser l’historique" onPress={resource.reload} />
      </ScrollView>
    </ScreenFrame>
  );
}
