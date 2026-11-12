import type { TextInputProps } from "react-native";
import { TextInput } from "react-native";

/** Champ simple commun aux formulaires connectés. */
interface TextFieldProps {
  readonly label: string;
  readonly value: string;
  readonly onChangeText: (value: string) => void;
  readonly keyboardType?: TextInputProps["keyboardType"];
}

/**
 * Associe la saisie à un libellé accessible et conserve le style commun.
 * @param props Libellé, valeur, modification et clavier éventuel.
 * @returns Le champ contrôlé.
 */
export function TextField(props: TextFieldProps) {
  const { label, value, onChangeText, keyboardType = "default" } = props;
  return (
    <TextInput
      accessibilityLabel={label}
      placeholder={label}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      className="rounded-xl border border-card-border p-3"
    />
  );
}
