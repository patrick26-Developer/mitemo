import { SheetRow } from "./sheet-row";

/** Option proposée par une liste de feuille. */
export interface SheetOption<Value extends string> {
  readonly value: Value;
  readonly label: string;
  /** Valeur secondaire affichée à droite du libellé. */
  readonly detail?: string;
}

/** Props d'une liste d'options de feuille. */
export interface SheetOptionListProps<Value extends string> {
  readonly options: readonly SheetOption<Value>[];
  readonly selected: Value;
  readonly onSelect: (value: Value) => void;
}

/**
 * Affiche des options exclusives et marque celle qui est choisie.
 * @template Value Type de la valeur portée par chaque option.
 * @param props Options, choix courant et sélection.
 * @returns La liste d'options.
 */
export function SheetOptionList<Value extends string>(props: SheetOptionListProps<Value>) {
  const { options, selected, onSelect } = props;

  return (
    <>
      {options.map((option) => (
        <SheetRow
          key={option.value}
          label={option.label}
          {...(option.detail === undefined ? {} : { value: option.detail })}
          selected={option.value === selected}
          onPress={() => onSelect(option.value)}
        />
      ))}
    </>
  );
}
