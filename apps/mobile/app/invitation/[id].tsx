import { useLocalSearchParams } from "expo-router";

import { InvitationScreen } from "../../src/features/tontines";

/**
 * Route d'une invitation reçue, ouverte depuis les notifications.
 * @returns L'écran de l'invitation.
 */
export default function InvitationRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <InvitationScreen id={id} />;
}
