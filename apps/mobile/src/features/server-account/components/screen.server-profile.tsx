import { ScrollView, Text, TextInput } from "react-native";
import { SheetPrimaryButton } from "../../../shared/components/atoms/button.sheet-primary";
import { ScreenFrame } from "../../../shared/components/macros/frame.screen";
import { useServerProfile } from "../hooks/hook.server-profile";

/**
 * Profil serveur limité aux champs réellement pris en charge par le contrat.
 * @returns L’identité masquée, la modification du nom et la déconnexion.
 */
export function ServerProfileScreen() {
  const state = useServerProfile();
  return (
    <ScreenFrame>
      <ScrollView contentContainerClassName="gap-4 p-4">
        <Text className="text-2xl">Mon profil</Text>
        <Text>{state.user?.maskedPhoneNumber}</Text>
        <TextInput
          accessibilityLabel="Nom public"
          value={state.name}
          onChangeText={state.setName}
          maxLength={80}
          className="rounded-xl border border-card-border p-3"
        />
        <SheetPrimaryButton
          label="Enregistrer le nom"
          onPress={state.save}
          tone={state.pending ? "disabled" : "brand"}
        />
        <Text accessibilityLiveRegion="polite">{state.message}</Text>
        <Text>La profession et la photo ne sont pas encore synchronisées avec le serveur.</Text>
        <SheetPrimaryButton
          label="Se déconnecter"
          onPress={state.logout}
          tone={state.pending ? "disabled" : "danger"}
        />
      </ScrollView>
    </ScreenFrame>
  );
}
