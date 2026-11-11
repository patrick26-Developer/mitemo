import { View } from "react-native";

import type { SheetButtonTone } from "../atoms/button.sheet-primary";
import { SheetPrimaryButton } from "../atoms/button.sheet-primary";
import { SheetSecondaryButton } from "../atoms/button.sheet-secondary";

/** Action secondaire d'une feuille, par exemple « Retour ». */
export interface SheetRowAction {
  readonly label: string;
  readonly onPress: () => void;
}

/** Action principale d'une feuille, éventuellement destructive. */
export interface SheetRowPrimaryAction extends SheetRowAction {
  readonly tone?: SheetButtonTone;
}

/** Props de la ligne d'actions. */
export interface SheetActionRowProps {
  readonly secondary: SheetRowAction;
  readonly primary: SheetRowPrimaryAction;
}

/**
 * Deux actions d'une feuille côte à côte, à parts égales : la secondaire à
 * gauche, la principale à droite, jamais empilées.
 * @param props Action secondaire et action principale.
 * @returns La ligne d'actions.
 */
export function SheetActionRow(props: SheetActionRowProps) {
  const { secondary, primary } = props;

  return (
    <View testID="sheet-action-row" style={ROW_STYLE} className="gap-3">
      <View className="flex-1">
        <SheetSecondaryButton label={secondary.label} onPress={secondary.onPress} />
      </View>
      <View className="flex-1">
        <SheetPrimaryButton
          label={primary.label}
          onPress={primary.onPress}
          {...(primary.tone === undefined ? {} : { tone: primary.tone })}
        />
      </View>
    </View>
  );
}

/** Disposition en ligne, portée par `style` pour rester vérifiable en test. */
const ROW_STYLE = { flexDirection: "row" } as const;
