import { Pressable, ScrollView, Text, View } from "react-native";

import { TONTINE_TINT_LABELS, TONTINE_TINTS } from "../../../shared/member/model.tontine-settings";

/** Props du choix de la couleur d'une tontine. */
export interface TintPickerProps {
  /** Rang du dégradé choisi. */
  readonly value: number;
  readonly onChange: (tint: number) => void;
}

/**
 * Choix de la couleur d'une tontine : une pastille par dégradé, cerclée quand
 * elle est choisie, sur une ligne qui défile à l'horizontale comme le choix
 * d'un fond d'écran sur WhatsApp.
 * @param props Couleur choisie et changement.
 * @returns Les pastilles de couleur.
 */
export function TintPicker(props: TintPickerProps) {
  const { value, onChange } = props;

  return (
    <View className="gap-1.5">
      <Text className="text-[12px] font-semibold uppercase text-muted">Couleur</Text>
      <ScrollView
        testID="tint-picker-scroll"
        horizontal
        showsHorizontalScrollIndicator={false}
        accessibilityRole="radiogroup"
        contentContainerClassName="gap-3"
      >
        {TONTINE_TINTS.map(([main], index) => (
          <Pressable
            key={main}
            accessibilityRole="radio"
            accessibilityLabel={TONTINE_TINT_LABELS[index] ?? main}
            accessibilityState={{ checked: index === value }}
            onPress={() => onChange(index)}
            className="h-11 w-11 items-center justify-center rounded-full border-2"
            style={{ borderColor: index === value ? main : "transparent" }}
          >
            <View className="h-8 w-8 rounded-full" style={{ backgroundColor: main }} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
