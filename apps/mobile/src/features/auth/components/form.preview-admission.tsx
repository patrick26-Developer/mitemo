import { Text, TextInput, View } from "react-native";
import { SheetPrimaryButton } from "../../../shared/components/atoms/button.sheet-primary";
import { usePreviewAdmission } from "../hooks/hook.preview-admission";

/**
 * Reçoit un laissez-passer temporaire sans demander la clé secrète du serveur.
 * @returns La saisie masquée et son état d'enregistrement.
 */
export function PreviewAdmissionForm() {
  const state = usePreviewAdmission();
  return (
    <View className="gap-3">
      <Text>Collez le laissez-passer temporaire fourni par votre responsable de test.</Text>
      <TextInput
        accessibilityLabel="Laissez-passer testeur"
        value={state.value}
        onChangeText={state.setValue}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        className="rounded-xl border border-card-border p-3"
      />
      <SheetPrimaryButton label="Enregistrer l'admission" onPress={state.save} />
      <Text accessibilityLiveRegion="polite">{state.message}</Text>
    </View>
  );
}
