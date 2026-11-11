import { FeedbackBanner } from "../../../shared/components/atoms/banner.feedback";
import { SheetPrimaryButton } from "../../../shared/components/atoms/button.sheet-primary";
import { SheetTextField } from "../../../shared/components/macros/field.sheet-text";
import { SheetRecap } from "../../../shared/components/macros/sheet.recap";
import type { SheetRecapRow } from "../../../shared/components/macros/sheet.recap";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import { formatAmount } from "../../../shared/format/format.amount";
import type { Tontine, TontineMember } from "../../../shared/member/model.portfolio";
import { SELF_MEMBER_ID } from "../../../shared/member/model.portfolio";
import { useTontineTransfer } from "../hooks/hook.tontine-transfer";
import type { TransferRecap } from "../model/model.tontine-transfer";
import { transferRecap } from "../model/model.tontine-transfer";
import { TontineRecipients } from "./section.tontine-recipients";

/** Props de la feuille de transfert vers un membre. */
export interface TontineTransferSheetProps {
  readonly visible: boolean;
  readonly item: Tontine;
  readonly onClose: () => void;
  /** Transfère le montant ; renvoie `true` quand l'opération a réussi. */
  readonly onTransfer: (memberId: string, amount: bigint) => boolean;
}

/**
 * Construit les lignes du récapitulatif d'un transfert en cours de saisie.
 * @param recipient Destinataire choisi, `undefined` tant qu'aucun ne l'est.
 * @param recap Valeurs calculées à partir du formulaire.
 * @returns Les lignes affichables, incomplètes tant que la saisie l'est.
 */
function recapRows(
  recipient: TontineMember | undefined,
  recap: TransferRecap,
): readonly SheetRecapRow[] {
  const rows: SheetRecapRow[] = [];
  if (recipient !== undefined) {
    rows.push({ label: "Destinataire", value: recipient.name });
  }
  if (recap.amount !== null) {
    rows.push({ label: "Montant", value: `${formatAmount(recap.amount)} FCFA` });
  }

  return rows;
}

/**
 * Choisit un membre et un montant, puis transfère depuis le solde disponible.
 * Le récapitulatif montre ce qui part avant la confirmation.
 * @param props Visibilité, tontine, fermeture et action de transfert.
 * @returns La feuille de transfert.
 */
export function TontineTransferSheet(props: TontineTransferSheetProps) {
  const { visible, item, onClose, onTransfer } = props;
  const { form, error, update, submit } = useTontineTransfer({ onTransfer, onClose });
  const recipients = item.members.filter((member) => member.id !== SELF_MEMBER_ID);
  const recipient = item.members.find((member) => member.id === form.memberId);
  const recap = transferRecap(form);
  const invalidAmount = error !== null && form.memberId !== "" && recap.amount === null;

  return (
    <BottomSheet visible={visible} title="Transférer à un membre" onClose={onClose}>
      <TontineRecipients
        members={recipients}
        selected={form.memberId}
        onSelect={(memberId) => update({ memberId })}
      />
      <SheetTextField
        label="Montant (FCFA)"
        value={form.amount}
        onChangeText={(amount) => update({ amount })}
        keyboardType="number-pad"
        placeholder="5000"
        invalid={invalidAmount}
      />
      <SheetRecap title="Transfert" rows={recapRows(recipient, recap)} />
      {error === null ? null : <FeedbackBanner kind="error" message={error} />}
      <SheetPrimaryButton label="Transférer" onPress={submit} />
    </BottomSheet>
  );
}
