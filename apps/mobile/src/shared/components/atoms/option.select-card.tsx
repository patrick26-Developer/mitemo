import { Check, Link2Off } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { PALETTE } from "../../theme/theme.palette";

/** Option détaillée, présentée en carte. */
export interface SelectCardOptionItem {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  /** Couleur de la pastille, par exemple celle de la tontine ; neutre sans couleur. */
  readonly accent: string | undefined;
}

/** Props d'une carte d'option. */
export interface SelectCardOptionProps {
  readonly item: SelectCardOptionItem;
  readonly selected: boolean;
  readonly onSelect: () => void;
}

/**
 * Option détaillée, en carte : pastille de couleur, libellé, détail en
 * dessous et coche ; la carte choisie prend le contour de la couleur de l'app.
 * @param props Option, état et choix.
 * @returns La carte d'option.
 */
export function SelectCardOption(props: SelectCardOptionProps) {
  const { item, selected, onSelect } = props;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.label}, ${item.description}`}
      accessibilityState={{ selected }}
      testID={`sheet-select-option-${item.id}`}
      onPress={onSelect}
      className={`flex-row items-center gap-3 rounded-[16px] border-[1.5px] p-3.5 ${
        selected ? "border-brand bg-brand-veil" : "border-transparent bg-field"
      }`}
    >
      <OptionSwatch id={item.id} accent={item.accent} />
      <View className="flex-1 gap-0.5">
        <Text className="text-[15px] font-semibold text-ink">{item.label}</Text>
        <Text className="text-[13px] text-muted">{item.description}</Text>
      </View>
      {selected ? <Check size={18} color={PALETTE.brand} strokeWidth={2.6} /> : null}
    </Pressable>
  );
}

/** Props de la pastille d'une option. */
interface OptionSwatchProps {
  readonly id: string;
  readonly accent: string | undefined;
}

/**
 * Pastille de l'option : sa couleur, ou un fond neutre barré d'une icône
 * pour l'option « sans rattachement ».
 * @param props Identifiant et couleur de l'option.
 * @returns La pastille.
 */
function OptionSwatch(props: OptionSwatchProps) {
  const { id, accent } = props;
  if (accent !== undefined) {
    return (
      <View
        testID={`sheet-select-swatch-${id}`}
        className="h-10 w-10 rounded-[12px]"
        style={{ backgroundColor: accent }}
      />
    );
  }

  return (
    <View
      testID={`sheet-select-swatch-${id}`}
      className="h-10 w-10 items-center justify-center rounded-[12px] bg-card-border"
    >
      <Link2Off size={18} color={PALETTE.muted} />
    </View>
  );
}
