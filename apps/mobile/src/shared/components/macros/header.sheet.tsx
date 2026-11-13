import { X } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import type { GestureResponderHandlers } from "react-native";

import { PALETTE } from "../../theme/theme.palette";
import { SHEET_HANDLE_SHAPE } from "../../theme/theme.sheet-card";
import type { SheetIcon } from "../atoms/badge.sheet-icon";
import { SheetIconBadge } from "../atoms/badge.sheet-icon";
import type { StepIndicatorProps } from "../atoms/indicator.step";
import { StepIndicator } from "../atoms/indicator.step";

/** Titre, étapes éventuelles et fermeture de l'en-tête. */
export interface SheetHeaderContent {
  readonly title: string;
  readonly onClose: () => void;
  readonly steps: StepIndicatorProps | undefined;
  readonly icon: SheetIcon | undefined;
}

/** Props de l'en-tête glissable d'une feuille. */
export interface SheetHeaderProps {
  readonly header: SheetHeaderContent;
  readonly dragHandlers: GestureResponderHandlers;
}

/**
 * Rend la poignée, le titre et le bouton de fermeture de la feuille.
 * @param props Titre, étapes, fermeture et gestionnaires du glissement.
 * @returns L'en-tête glissable.
 */
export function SheetHeader(props: SheetHeaderProps) {
  const { title, onClose, steps, icon } = props.header;
  if (icon !== undefined) return <IconSheetHeader {...props} icon={icon} />;

  return (
    <View testID="bottom-sheet-header" {...props.dragHandlers}>
      <View className="mb-3 items-center">
        <View className="bg-ink/20" style={SHEET_HANDLE_SHAPE} />
      </View>
      <View className="mb-2 flex-row items-center justify-between gap-3">
        <Text
          accessibilityRole="header"
          numberOfLines={1}
          className="flex-1 text-[20px] font-bold text-ink"
        >
          {title}
        </Text>
        {steps === undefined ? (
          <SheetCloseButton onClose={onClose} />
        ) : (
          <StepIndicator {...steps} />
        )}
      </View>
    </View>
  );
}

/**
 * En-tête d'une feuille à icône : la croix à droite, puis l'icône centrée et
 * le titre centré dessous.
 * @param props En-tête, icône et gestionnaires du glissement.
 * @returns L'en-tête glissable.
 */
function IconSheetHeader(props: SheetHeaderProps & { readonly icon: SheetIcon }) {
  const { title, onClose } = props.header;

  return (
    <View testID="bottom-sheet-header" {...props.dragHandlers}>
      <View className="mb-1 items-center">
        <View className="bg-ink/20" style={SHEET_HANDLE_SHAPE} />
      </View>
      <View className="items-end">
        <SheetCloseButton onClose={onClose} />
      </View>
      <SheetIconBadge sheetIcon={props.icon} />
      <Text accessibilityRole="header" className="mb-2 text-center text-[20px] font-bold text-ink">
        {title}
      </Text>
    </View>
  );
}

/** Props de la croix de fermeture. */
interface SheetCloseButtonProps {
  readonly onClose: () => void;
}

/**
 * Croix ronde qui ferme la feuille.
 * @param props Fermeture.
 * @returns Le bouton « Fermer ».
 */
function SheetCloseButton(props: SheetCloseButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Fermer"
      hitSlop={8}
      onPress={props.onClose}
      className="h-9 w-9 items-center justify-center rounded-full bg-field"
    >
      <X size={18} color={PALETTE.muted} />
    </Pressable>
  );
}
