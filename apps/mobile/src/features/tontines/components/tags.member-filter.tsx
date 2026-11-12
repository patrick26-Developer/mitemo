import { Pressable, ScrollView, Text } from "react-native";

import type { MemberFilter, MemberFilterOption } from "../model/model.member-filter";

/** Props des étiquettes de filtre des membres. */
export interface MemberFilterTagsProps {
  readonly options: readonly MemberFilterOption[];
  readonly value: MemberFilter;
  readonly onChange: (filter: MemberFilter) => void;
}

/**
 * Affiche les filtres de la liste des membres en étiquettes défilantes,
 * chacune avec son compte, pour voir d'un coup d'œil qui est à jour.
 * @param props Étiquettes, filtre courant et changement.
 * @returns La rangée d'étiquettes.
 */
export function MemberFilterTags(props: MemberFilterTagsProps) {
  const { options, value, onChange } = props;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 px-4"
    >
      {options.map((option) => (
        <FilterTag
          key={option.value}
          option={option}
          selected={option.value === value}
          onPress={() => onChange(option.value)}
        />
      ))}
    </ScrollView>
  );
}

/** Props d'une étiquette de filtre. */
interface FilterTagProps {
  readonly option: MemberFilterOption;
  readonly selected: boolean;
  readonly onPress: () => void;
}

/**
 * Étiquette d'un filtre : pleine quand elle est choisie, contour seul sinon.
 * @param props Étiquette, sélection et choix.
 * @returns L'étiquette.
 */
function FilterTag(props: FilterTagProps) {
  const { option, selected, onPress } = props;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={option.label}
      accessibilityState={{ selected }}
      onPress={onPress}
      className={`rounded-full border px-4 py-2 ${selected ? "border-card bg-card" : "border-card-border"}`}
    >
      <Text className={`text-[14px] font-semibold ${selected ? "text-white" : "text-muted"}`}>
        {option.label}
      </Text>
    </Pressable>
  );
}
