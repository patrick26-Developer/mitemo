import { SheetText } from "../../../shared/components/atoms/text.sheet";
import { SheetStepper } from "../../../shared/components/macros/field.sheet-stepper";
import type { ReceivedInvitation } from "../../../shared/member/model.invitation";
import { freeTurns } from "../../../shared/member/model.tontine-turns";
import { turnsChoiceHint } from "../model/model.invitation-reply";

/** Props du choix du nombre de tours. */
export interface InvitationTurnsStepProps {
  readonly invitation: ReceivedInvitation;
  readonly turns: number;
  readonly onChange: (turns: number) => void;
}

/**
 * Fait choisir le nombre de tours pris en rejoignant une tontine, borné par
 * les tours encore libres ; chaque tour est une part cotisée à chaque tour.
 * @param props Invitation, tours choisis et changement.
 * @returns Le choix du nombre de tours.
 */
export function InvitationTurnsStep(props: InvitationTurnsStepProps) {
  const { invitation, turns, onChange } = props;
  const { tontine } = invitation;

  return (
    <>
      <SheetText>
        {`Combien de tours prenez-vous dans « ${tontine.name} » ? Vos tours se suivent dans l'ordre de passage.`}
      </SheetText>
      <SheetStepper
        label="Nombre de tours"
        value={turns}
        min={1}
        max={Math.max(freeTurns(tontine), 1)}
        onChange={onChange}
        hint={turnsChoiceHint(tontine, turns)}
      />
    </>
  );
}
