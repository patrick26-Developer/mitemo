import { Check, ChevronDown } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

import { fieldChrome } from "../../theme/theme.field";
import { PALETTE } from "../../theme/theme.palette";

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
 * Affiche un champ qui ouvre une liste d'options groupées, comme un `select`
 * de formulaire : la valeur choisie reste visible dans le champ.
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
        <ChevronDown size={16} color={PALETTE.muted} />
      </Pressable>
      {hint === undefined ? null : <Text className="text-[12px] leading-4 text-muted">{hint}</Text>}
      <SelectMenu
        label={label}
        groups={groups}
        value={value}
        visible={open}
        onClose={() => setOpen(false)}
        onSelect={(next) => {
          onChange(next);
          setOpen(false);
        }}
      />
    </View>
  );
}

/** Props de la liste ouverte d'un sélecteur. */
interface SelectMenuProps<Value extends string> {
  readonly label: string;
  readonly groups: readonly SheetSelectGroup<Value>[];
  readonly value: Value;
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly onSelect: (value: Value) => void;
}

/**
 * Affiche la liste des options dans une feuille montante, groupée par unité.
 * @template Value Type de la valeur portée par chaque option.
 * @param props Libellé, groupes, valeur, visibilité et choix.
 * @returns La liste ouverte.
 */
function SelectMenu<Value extends string>(props: SelectMenuProps<Value>) {
  const { label, groups, value, visible, onClose, onSelect } = props;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fermer la liste"
          className="absolute inset-0 bg-ink/60"
          onPress={onClose}
        />
        <View
          testID="sheet-select-menu"
          className="max-h-[70%] gap-3 rounded-t-[26px] border border-card-border bg-white px-5 pb-6 pt-4"
        >
          <Text accessibilityRole="header" className="text-[17px] font-bold text-ink">
            {label}
          </Text>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-4">
            {groups.map((group) => (
              <SelectGroup key={group.title} group={group} value={value} onSelect={onSelect} />
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
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
    <View className="gap-2">
      <Text className="text-[12px] font-semibold uppercase text-muted">{group.title}</Text>
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
      className={`min-h-11 flex-row items-center justify-between rounded-[14px] border px-4 py-2.5 ${
        selected ? "border-brand bg-brand-veil" : "border-card-border bg-white"
      }`}
    >
      <Text className="text-[15px] text-ink">{option.label}</Text>
      {selected ? <Check size={16} color={PALETTE.brand} strokeWidth={2.6} /> : null}
    </Pressable>
  );
}
