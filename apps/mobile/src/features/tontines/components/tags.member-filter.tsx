import { Pressable, ScrollView, Text } from "react-native";

import { accentColors } from "../../../shared/model/model.accent-color";
import { PALETTE } from "../../../shared/theme/theme.palette";
import type { MemberFilter, MemberFilterOption } from "../model/model.member-filter";

/** Props des étiquettes de filtre des membres. */
export interface MemberFilterTagsProps {
  readonly options: readonly MemberFilterOption[];
  readonly value: MemberFilter;
  readonly onChange: (filter: MemberFilter) => void;
  /** Teinte de la tontine, portée par l'étiquette choisie. */
  readonly accent: string;
}

/**
 * Affiche les filtres de la liste des membres en étiquettes défilantes,
 * chacune avec son compte, pour voir d'un coup d'œil qui est à jour.
 * @param props Étiquettes, filtre courant et changement.
 * @returns La rangée d'étiquettes.
 */
export function MemberFilterTags(props: MemberFilterTagsProps) {
  const { options, value, onChange, accent } = props;

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
          accent={accent}
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
  readonly accent: string;
  readonly onPress: () => void;
}

/**
 * Étiquette d'un filtre : pleine quand elle est choisie, contour seul sinon.
 * @param props Étiquette, sélection et choix.
 * @returns L'étiquette.
 */
function FilterTag(props: FilterTagProps) {
  const { option, selected, accent, onPress } = props;
  const colors = accentColors(accent);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={option.label}
      accessibilityState={{ selected }}
      onPress={onPress}
      className={`rounded-full border px-4 py-2 ${selected ? "" : "border-card-border"}`}
      style={
        selected ? { backgroundColor: colors.background, borderColor: colors.background } : null
      }
    >
      <Text
        className="text-[14px] font-semibold"
        style={{ color: selected ? colors.foreground : PALETTE.muted }}
      >
        {option.label}
      </Text>
    </Pressable>
  );
}
