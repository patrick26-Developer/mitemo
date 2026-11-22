import { Text, View } from "react-native";
import { TextField } from "../../../shared/components/atoms/field.text";
import { SheetPrimaryButton } from "../../../shared/components/atoms/button.sheet-primary";
import { useServerGoalCreate } from "../hooks/hook.server-goal-create";

/** Création d’objectif et relecture de la liste. */
interface ServerGoalFormProps {
  readonly onCreated: () => void;
}

/**
 * Propose un programme mensuel ; aucun paiement n’est déclenché.
 * @param props Relecture après création.
 * @returns Le formulaire d’objectif.
 */
export function ServerGoalForm(props: ServerGoalFormProps) {
  const state = useServerGoalCreate(props.onCreated);
  return (
    <View className="gap-3">
      <Text className="text-lg">Créer un objectif mensuel sans paiement</Text>
      <TextField
        label="Nom de l’objectif"
        value={state.form.name}
        onChangeText={(value) => state.update("name", value)}
      />
      <TextField
        label="Versement mensuel en XAF"
        value={state.form.amount}
        onChangeText={(value) => state.update("amount", value)}
        keyboardType="number-pad"
      />
      <TextField
        label="Nombre d’échéances"
        value={state.form.installments}
        onChangeText={(value) => state.update("installments", value)}
        keyboardType="number-pad"
      />
      <TextField
        label="Première échéance AAAA-MM-JJ"
        value={state.form.startsAt}
        onChangeText={(value) => state.update("startsAt", value)}
      />
      <SheetPrimaryButton
        label="Créer l’objectif"
        onPress={state.submit}
        tone={state.pending ? "disabled" : "brand"}
      />
      <Text accessibilityLiveRegion="polite">{state.message}</Text>
    </View>
  );
}
