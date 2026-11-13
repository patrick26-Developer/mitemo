import { View } from "react-native";

import type { SheetButtonTone } from "../atoms/button.sheet-primary";
import { SheetPrimaryButton } from "../atoms/button.sheet-primary";
import { SheetSecondaryButton } from "../atoms/button.sheet-secondary";

/** Action secondaire d'une feuille, par exemple « Retour ». */
export interface SheetRowAction {
  readonly label: string;
  readonly onPress: () => void;
}

/** Action secondaire, bordée de rouge quand elle est grave. */
export interface SheetRowSecondaryAction extends SheetRowAction {
  /** `danger` pour une action grave, bordée de rouge. */
  readonly tone?: "danger";
}

/** Action principale d'une feuille, éventuellement destructive. */
export interface SheetRowPrimaryAction extends SheetRowAction {
  readonly tone?: SheetButtonTone;
  /** Couleur d'action de l'écran ; elle remplace la teinte. */
  readonly accent?: string;
}

/** Props de la ligne d'actions. */
export interface SheetActionRowProps {
  readonly secondary: SheetRowSecondaryAction;
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
        <SheetSecondaryButton
          label={secondary.label}
          onPress={secondary.onPress}
          {...(secondary.tone === undefined ? {} : { tone: secondary.tone })}
        />
      </View>
      <View className="flex-1">
        <SheetPrimaryButton
          label={primary.label}
          onPress={primary.onPress}
          {...(primary.tone === undefined ? {} : { tone: primary.tone })}
          {...(primary.accent === undefined ? {} : { accent: primary.accent })}
        />
      </View>
    </View>
  );
}

/** Disposition en ligne, portée par `style` pour rester vérifiable en test. */
const ROW_STYLE = { flexDirection: "row" } as const;
