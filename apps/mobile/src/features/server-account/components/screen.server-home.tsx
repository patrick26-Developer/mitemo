import { router } from "expo-router";
import { ScrollView, Text } from "react-native";
import { SheetPrimaryButton } from "../../../shared/components/atoms/button.sheet-primary";
import { ScreenFrame } from "../../../shared/components/macros/frame.screen";
import { RemoteStatus } from "../../../shared/components/macros/status.remote";
import { useServerWallet } from "../hooks/hook.server-wallet";
import { useSessionStore } from "../../../shared/session/store.session";
import { ServerWalletPanel } from "./panel.wallet";

/**
 * Accueil connecté isolé des écrans de démonstration locale d’Espoir.
 * @returns L’accueil du compte serveur.
 */
export function ServerHomeScreen() {
  const user = useSessionStore((state) => state.user);
  const resource = useServerWallet();
  return (
    <ScreenFrame>
      <ScrollView contentContainerClassName="gap-5 px-4 pb-8">
        <Text className="text-2xl text-ink">Bonjour {user?.displayName}</Text>
        <RemoteStatus resource={resource} />
        {resource.data ? <ServerWalletPanel wallet={resource.data} /> : null}
        <SheetPrimaryButton label="Actualiser le portefeuille" onPress={resource.reload} />
        <SheetPrimaryButton label="Voir les mouvements" onPress={() => router.push("/history")} />
        <Text>
          Les paiements sont simulés. Aucune confirmation locale ne crédite ce portefeuille.
        </Text>
      </ScrollView>
    </ScreenFrame>
  );
}
