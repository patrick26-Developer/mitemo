import { Text, View } from "react-native";

import { BottomSheet } from "../../../shared/components/bottom-sheet";
import { SheetSection } from "../../../shared/components/sheet-section";
import { SheetText } from "../../../shared/components/sheet-text";

/** Étapes de création d'une tontine, expliquées dans la feuille. */
const CREATE_TONTINE_STEPS = [
  "Choisissez le montant de la cotisation et sa fréquence.",
  "Invitez les membres avec votre code et fixez l'ordre des tours.",
  "Le pot est remis à un membre différent à chaque tour.",
] as const;

/** Props de la feuille de création d'une tontine. */
export interface TontineAddSheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
}

/**
 * Explique la création d'une tontine sans quitter la liste.
 * @param props Visibilité et fermeture de la feuille.
 * @returns La feuille « Nouvelle tontine ».
 */
export function TontineAddSheet(props: TontineAddSheetProps) {
  const { visible, onClose } = props;

  return (
    <BottomSheet visible={visible} title="Nouvelle tontine" onClose={onClose}>
      <SheetText>
        {
          "Une tontine réunit un groupe qui cotise à chaque tour. Le montant total est remis à un membre, dans un ordre convenu à l'avance."
        }
      </SheetText>
      <SheetSection title="Comment ça marche">
        {CREATE_TONTINE_STEPS.map((step, index) => (
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
          "La création en ligne s'activera dès que le compte sera relié au serveur. Vos tontines existantes restent disponibles en attendant."
        }
      </SheetText>
    </BottomSheet>
  );
}
