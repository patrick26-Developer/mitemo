import { ActivityIndicator, Text, View } from "react-native";
import type { RemoteResource } from "../../hooks/hook.remote-resource";
import { SheetPrimaryButton } from "../atoms/button.sheet-primary";

/** État réseau à afficher sans inventer un solde nul. */
interface RemoteStatusProps {
  readonly resource: RemoteResource<unknown>;
}

/**
 * Affiche le chargement ou un nouvel essai ; ne remplace jamais une erreur par zéro.
 * @param props État réseau de la ressource.
 * @returns L'indicateur ou l'erreur, rien après réussite.
 */
export function RemoteStatus(props: RemoteStatusProps) {
  const { resource } = props;
  if (resource.loading)
    return <ActivityIndicator accessibilityLabel="Chargement des données serveur" />;
  if (!resource.error) return null;
  return (
    <View className="gap-2">
      <Text accessibilityRole="alert">{resource.error}</Text>
      <SheetPrimaryButton label="Réessayer" onPress={resource.reload} />
    </View>
  );
}
