import type { StepGuideContent } from "../../../shared/components/step-guide-sheet";
import { StepGuideSheet } from "../../../shared/components/step-guide-sheet";

/** Explication de la création d'une carte de pointage, sans quitter la liste. */
const CREATE_CARD_CONTENT: StepGuideContent = {
  title: "Nouvelle carte",
  intro:
    "Une carte de pointage suit une épargne vers un objectif. Chaque versement fait avancer la barre, sans changer vos autres cartes.",
  steps: [
    "Donnez un nom à la carte et fixez son objectif.",
    "Choisissez une échéance pour vous rappeler d'épargner.",
    "Ajoutez des versements quand vous le souhaitez.",
  ],
  outro:
    "La création en ligne s'activera dès que le compte sera relié au serveur. Vos cartes existantes restent disponibles en attendant.",
};

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

  return <StepGuideSheet content={CREATE_CARD_CONTENT} visible={visible} onClose={onClose} />;
}
