import { Pressable, Text, View } from "react-native";

/** Option d'un contrôle segmenté. */
export interface SegmentedControlOption<Value extends string> {
  readonly value: Value;
  readonly label: string;
}

/** Props du contrôle segmenté. */
export interface SegmentedControlProps<Value extends string> {
  readonly options: readonly SegmentedControlOption<Value>[];
  readonly value: Value;
  readonly onChange: (value: Value) => void;
}

/** Courbe continue d'iOS, appliquée au fond et aux segments. */
const CONTINUOUS_CORNERS = { borderCurve: "continuous" } as const;

/**
 * Affiche un choix exclusif entre plusieurs segments.
 * @template Value Type de la valeur portée par chaque option.
 * @param props Options, valeur courante et gestion du changement.
 * @returns Le contrôle segmenté.
 */
export function SegmentedControl<Value extends string>(props: SegmentedControlProps<Value>) {
  const { options, value, onChange } = props;

  return (
    <View
      accessibilityRole="tablist"
      className="flex-row gap-1 rounded-full bg-tab-active p-1"
      style={CONTINUOUS_CORNERS}
    >
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={option.label}
            onPress={() => onChange(option.value)}
            className={`rounded-full px-3 py-2  ${selected ? "bg-white" : ""}`}
            style={CONTINUOUS_CORNERS}
          >
            <Text
              className={`text-[14px] font-semibold ${selected ? "text-tab-ink" : "text-muted"}`}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
