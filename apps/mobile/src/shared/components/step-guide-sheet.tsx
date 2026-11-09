import { Text, View } from "react-native";

import { BottomSheet } from "./bottom-sheet";
import { SheetSection } from "./sheet-section";
import { SheetText } from "./sheet-text";

/** Contenu d'une feuille qui explique une création en plusieurs étapes. */
export interface StepGuideContent {
  readonly title: string;
  readonly intro: string;
  readonly steps: readonly string[];
  readonly outro: string;
}

/** Props d'une feuille qui explique une création en plusieurs étapes. */
export interface StepGuideSheetProps {
  readonly content: StepGuideContent;
  readonly visible: boolean;
  readonly onClose: () => void;
}

/**
 * Explique une création en étapes numérotées, sans quitter la liste.
 * @param props Contenu, visibilité et fermeture de la feuille.
 * @returns La feuille à étapes.
 */
export function StepGuideSheet(props: StepGuideSheetProps) {
  const { content, visible, onClose } = props;

  return (
    <BottomSheet visible={visible} title={content.title} onClose={onClose}>
      <SheetText>{content.intro}</SheetText>
      <SheetSection title="Comment ça marche">
        {content.steps.map((step, index) => (
          <View
            key={step}
            className="flex-row items-center gap-3 rounded-[14px] border border-card-border px-4 py-3"
          >
            <View className="h-6 w-6 items-center justify-center rounded-full bg-brand">
              <Text className="text-[12px] font-bold text-white">{index + 1}</Text>
            </View>
            <Text className="flex-1 text-[14px] leading-5 text-ink">{step}</Text>
          </View>
        ))}
      </SheetSection>
      <SheetText>{content.outro}</SheetText>
    </BottomSheet>
  );
}
