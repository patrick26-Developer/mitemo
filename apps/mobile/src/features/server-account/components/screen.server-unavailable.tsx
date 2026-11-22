import { Text } from "react-native";
import { ScreenFrame } from "../../../shared/components/macros/frame.screen";

/**
 * N’affiche pas les tontines locales comme des données du compte serveur.
 * @returns L’état explicite d’une fonctionnalité non raccordée.
 */
export function ServerUnavailableScreen() {
  return (
    <ScreenFrame>
      <Text className="p-5">
        Ce parcours n’est pas encore connecté au serveur Preview. Aucune opération financière n’est
        disponible ici.
      </Text>
    </ScreenFrame>
  );
}
