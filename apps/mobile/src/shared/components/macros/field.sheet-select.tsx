import { Check, ChevronDown } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { fieldChrome } from "../../theme/theme.field";
import { PALETTE } from "../../theme/theme.palette";
import { BottomSheet } from "./sheet.bottom";

/** Option d'un sélecteur de feuille. */
export interface SheetSelectOption<Value extends string> {
  readonly value: Value;
  readonly label: string;
}

/** Groupe d'options, précédé de son titre dans la liste ouverte. */
export interface SheetSelectGroup<Value extends string> {
  readonly title: string;
  readonly options: readonly SheetSelectOption<Value>[];
}

/** Props d'un sélecteur de feuille. */
export interface SheetSelectProps<Value extends string> {
  readonly label: string;
  readonly groups: readonly SheetSelectGroup<Value>[];
  readonly value: Value;
  readonly onChange: (value: Value) => void;
  /** Explication affichée sous le champ. */
  readonly hint?: string;
  /** Signale une saisie refusée : bordure et anneau rouges. */
  readonly invalid?: boolean;
}

/**
 * Retrouve le libellé de l'option choisie.
 * @param groups Groupes proposés.
 * @param value Valeur choisie.
 * @returns Le libellé, ou la valeur brute si elle n'est plus proposée.
 */
function selectedLabel<Value extends string>(
  groups: readonly SheetSelectGroup<Value>[],
  value: Value,
): string {
  const option = groups.flatMap((group) => group.options).find((entry) => entry.value === value);

  return option?.label ?? value;
}

/**
 * Affiche un champ de choix, comme un `select` de formulaire : la valeur
 * choisie reste visible dans le champ, et le toucher ouvre les options
 * groupées dans une seconde feuille, par-dessus, qui se ferme au choix. La
 * feuille du formulaire garde ainsi sa mise en page.
 * @template Value Type de la valeur portée par chaque option.
 * @param props Libellé, groupes, valeur, choix et aide.
 * @returns Le sélecteur et sa liste.
 */
export function SheetSelect<Value extends string>(props: SheetSelectProps<Value>) {
  const { label, groups, value, onChange, hint, invalid = false } = props;
  const [open, setOpen] = useState(false);
  const current = selectedLabel(groups, value);

  return (
    <View className="gap-1.5">
      <Text className="text-[12px] font-semibold uppercase text-muted">{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label} : ${current}`}
        accessibilityState={{ expanded: open }}
        testID="sheet-select-trigger"
        onPress={() => setOpen(true)}
        className="h-12 flex-row items-center justify-between rounded-[14px] border px-4"
        style={fieldChrome({ focused: open, invalid })}
      >
        <Text className="text-[15px] text-ink">{current}</Text>
        <ChevronDown size={16} color={open ? PALETTE.brand : PALETTE.muted} />
      </Pressable>
      <BottomSheet visible={open} title={label} onClose={() => setOpen(false)}>
        <SelectMenu
          groups={groups}
          value={value}
          onSelect={(next) => {
            onChange(next);
            setOpen(false);
          }}
        />
      </BottomSheet>
      {hint === undefined ? null : <Text className="text-[12px] leading-4 text-muted">{hint}</Text>}
    </View>
  );
}

/** Props de la liste d'options d'un sélecteur. */
interface SelectMenuProps<Value extends string> {
  readonly groups: readonly SheetSelectGroup<Value>[];
  readonly value: Value;
  readonly onSelect: (value: Value) => void;
}

/**
 * Affiche les options groupées par unité, dans la seconde feuille, qui
 * défile quand elles dépassent.
 * @template Value Type de la valeur portée par chaque option.
 * @param props Groupes, valeur courante et choix.
 * @returns La liste des options.
 */
function SelectMenu<Value extends string>(props: SelectMenuProps<Value>) {
  const { groups, value, onSelect } = props;

  return (
    <View testID="sheet-select-menu" className="gap-3">
      {groups.map((group) => (
        <SelectGroup key={group.title} group={group} value={value} onSelect={onSelect} />
      ))}
    </View>
  );
}

/** Props d'un groupe d'options de la liste ouverte. */
interface SelectGroupProps<Value extends string> {
  readonly group: SheetSelectGroup<Value>;
  readonly value: Value;
  readonly onSelect: (value: Value) => void;
}

/**
 * Affiche un groupe d'options sous son titre.
 * @template Value Type de la valeur portée par chaque option.
 * @param props Groupe, valeur courante et choix.
 * @returns Le groupe d'options.
 */
function SelectGroup<Value extends string>(props: SelectGroupProps<Value>) {
  const { group, value, onSelect } = props;

  return (
    <View className="gap-1">
      <Text className="px-2 pt-1 text-[12px] font-semibold uppercase text-muted">
        {group.title}
      </Text>
      {group.options.map((option) => (
        <SelectOption
          key={option.value}
          option={option}
          selected={option.value === value}
          onSelect={() => onSelect(option.value)}
        />
      ))}
    </View>
  );
}

/** Props d'une option de la liste ouverte. */
interface SelectOptionProps<Value extends string> {
  readonly option: SheetSelectOption<Value>;
  readonly selected: boolean;
  readonly onSelect: () => void;
}

/**
 * Affiche une option de la liste, cochée quand elle est choisie.
 * @param props Option, sélection et choix.
 * @returns La ligne de l'option.
 */
function SelectOption<Value extends string>(props: SelectOptionProps<Value>) {
  const { option, selected, onSelect } = props;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={option.label}
      accessibilityState={{ selected }}
      testID={`sheet-select-option-${option.value}`}
      onPress={onSelect}
      className={`min-h-11 flex-row items-center justify-between rounded-[10px] px-3 py-2.5 ${
        selected ? "bg-brand-veil" : "bg-white"
      }`}
    >
      <Text className="text-[15px] text-ink">{option.label}</Text>
      {selected ? <Check size={16} color={PALETTE.brand} strokeWidth={2.6} /> : null}
    </Pressable>
  );
}
