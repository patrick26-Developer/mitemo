import { Check } from "lucide-react-native";
import { Pressable, Text } from "react-native";

import { PALETTE } from "../../theme/theme.palette";

/** Props d'une ligne d'option. */
export interface SelectRowOptionProps {
  readonly id: string;
  readonly label: string;
  readonly selected: boolean;
  readonly onSelect: () => void;
}

/**
 * Option simple, en ligne nue, comme une ligne de récapitulatif : le libellé
 * passe en vert et se coche quand il est choisi.
 * @param props Identifiant, libellé, état et choix.
 * @returns La ligne d'option.
 */
export function SelectRowOption(props: SelectRowOptionProps) {
  const { id, label, selected, onSelect } = props;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      testID={`sheet-select-option-${id}`}
      onPress={onSelect}
      className="min-h-12 flex-row items-center justify-between py-3.5"
    >
      <Text className={`text-[15px] ${selected ? "font-semibold text-brand" : "text-ink"}`}>
        {label}
      </Text>
      {selected ? <Check size={18} color={PALETTE.brand} strokeWidth={2.6} /> : null}
    </Pressable>
  );
}
