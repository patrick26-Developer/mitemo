import { NAME_MAX_LENGTH, nameCounter } from "../../model/model.form-schema";
import { SheetTextField } from "./field.sheet-text";

/** Props du champ du nom d'une tontine ou d'une carte. */
export interface SheetNameFieldProps {
  readonly value: string;
  readonly onChangeText: (value: string) => void;
  /** Explication affichée sous le champ, suivie du compteur. */
  readonly hint: string;
  /** Signale un nom refusé : bordure et anneau rouges. */
  readonly invalid?: boolean;
}

/**
 * Champ « Nom » d'une tontine ou d'une carte : la saisie s'arrête à 30
 * caractères et un compteur indique la place restante.
 * @param props Valeur, saisie, aide et erreur.
 * @returns Le champ du nom.
 */
export function SheetNameField(props: SheetNameFieldProps) {
  const { value, onChangeText, hint, invalid = false } = props;

  return (
    <SheetTextField
      label="Nom"
      value={value}
      onChangeText={onChangeText}
      hint={`${hint} ${nameCounter(value)}`}
      invalid={invalid}
      maxLength={NAME_MAX_LENGTH}
    />
  );
}
