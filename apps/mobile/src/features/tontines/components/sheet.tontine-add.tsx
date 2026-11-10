import type { StepGuideContent } from "../../../shared/components/macros/sheet.step-guide";
import { StepGuideSheet } from "../../../shared/components/macros/sheet.step-guide";

/** Explication de la création d'une tontine, sans quitter la liste. */
const CREATE_TONTINE_CONTENT: StepGuideContent = {
  title: "Nouvelle tontine",
  intro:
    "Une tontine réunit un groupe qui cotise à chaque tour. Le montant total est remis à un membre, dans un ordre convenu à l'avance.",
  steps: [
    "Choisissez le montant de la cotisation et sa fréquence.",
    "Invitez les membres avec votre code et fixez l'ordre des tours.",
    "Le pot est remis à un membre différent à chaque tour.",
  ],
  outro:
    "La création en ligne s'activera dès que le compte sera relié au serveur. Vos tontines existantes restent disponibles en attendant.",
};

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

  return <StepGuideSheet content={CREATE_TONTINE_CONTENT} visible={visible} onClose={onClose} />;
}
