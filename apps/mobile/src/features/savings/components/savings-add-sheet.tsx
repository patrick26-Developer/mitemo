import { Text, View } from "react-native";

import { BottomSheet } from "../../../shared/components/bottom-sheet";
import { SheetSection } from "../../../shared/components/sheet-section";
import { SheetText } from "../../../shared/components/sheet-text";

/** Étapes de création d'une carte de pointage, expliquées dans la feuille. */
const CREATE_CARD_STEPS = [
  "Donnez un nom à la carte et fixez son objectif.",
  "Choisissez une échéance pour vous rappeler d'épargner.",
  "Ajoutez des versements quand vous le souhaitez.",
] as const;

/** Props de la feuille de création d'une carte de pointage. */
export interface SavingsAddSheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
}

/**
 * Explique la création d'une carte de pointage sans quitter la liste.
 * @param props Visibilité et fermeture de la feuille.
 * @returns La feuille « Nouvelle carte ».
 */
export function SavingsAddSheet(props: SavingsAddSheetProps) {
  const { visible, onClose } = props;

  return (
    <BottomSheet visible={visible} title="Nouvelle carte" onClose={onClose}>
      <SheetText>
        Une carte de pointage suit une épargne vers un objectif. Chaque versement fait avancer la
        barre, sans changer vos autres cartes.
      </SheetText>
      <SheetSection title="Comment ça marche">
        {CREATE_CARD_STEPS.map((step, index) => (
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
      <SheetText>
        {
          "La création en ligne s'activera dès que le compte sera relié au serveur. Vos cartes existantes restent disponibles en attendant."
        }
      </SheetText>
    </BottomSheet>
  );
}
