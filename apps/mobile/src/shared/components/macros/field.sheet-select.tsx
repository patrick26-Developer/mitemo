import { ChevronDown } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { fieldChrome } from "../../theme/theme.field";
import { PALETTE } from "../../theme/theme.palette";
import { SelectCardOption } from "../atoms/option.select-card";
import { SelectRowOption } from "../atoms/option.select-row";
import { BottomSheet } from "./sheet.bottom";

/** Option d'un sélecteur de feuille. */
export interface SheetSelectOption<Value extends string> {
  readonly value: Value;
  readonly label: string;
  /** Détail sous le libellé : une liste d'options détaillées s'affiche en cartes. */
  readonly description?: string;
  /** Couleur de la pastille d'une carte, par exemple celle d'une tontine. */
  readonly accent?: string;
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
    <View testID="sheet-select-menu" className="gap-5">
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
 * Affiche un groupe d'options sous son titre : en cartes quand elles sont
 * détaillées, sinon en lignes séparées d'un trait fin.
 * @template Value Type de la valeur portée par chaque option.
 * @param props Groupe, valeur courante et choix.
 * @returns Le groupe et ses options.
 */
function SelectGroup<Value extends string>(props: SelectGroupProps<Value>) {
  const { group, value, onSelect } = props;
  const detailed = group.options.some((option) => option.description !== undefined);

  return (
    <View className={detailed ? "gap-2" : ""}>
      <Text className="pb-1 text-[12px] font-semibold uppercase text-muted">{group.title}</Text>
      {group.options.map((option, index) => (
        <SelectOption
          key={option.value}
          option={option}
          detailed={detailed}
          divided={!detailed && index > 0}
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
  readonly detailed: boolean;
  /** Trace le trait fin qui la sépare de l'option précédente. */
  readonly divided: boolean;
  readonly selected: boolean;
  readonly onSelect: () => void;
}

/**
 * Affiche une option en carte détaillée ou en ligne, précédée de son trait.
 * @template Value Type de la valeur portée par l'option.
 * @param props Option, présentation, état et choix.
 * @returns L'option.
 */
function SelectOption<Value extends string>(props: SelectOptionProps<Value>) {
  const { option, selected, onSelect } = props;
  if (props.detailed) {
    const item = { id: option.value, label: option.label, accent: option.accent };
    return (
      <SelectCardOption
        item={{ ...item, description: option.description ?? "" }}
        selected={selected}
        onSelect={onSelect}
      />
    );
  }

  return (
    <View>
      {props.divided ? (
        <View testID="sheet-select-divider" className="h-px bg-card-border" />
      ) : null}
      <SelectRowOption
        id={option.value}
        label={option.label}
        selected={selected}
        onSelect={onSelect}
      />
    </View>
  );
}
