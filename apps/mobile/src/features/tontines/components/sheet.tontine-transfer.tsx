import { useState } from "react";

import { FeedbackBanner } from "../../../shared/components/atoms/banner.feedback";
import { SheetPrimaryButton } from "../../../shared/components/atoms/button.sheet-primary";
import { SheetTextField } from "../../../shared/components/macros/field.sheet-text";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import type { Tontine } from "../../../shared/member/model.portfolio";
import { SELF_MEMBER_ID } from "../../../shared/member/model.portfolio";
import { parseTransfer } from "../model/model.tontine-transfer";
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
 * Choisit un membre et un montant, puis transfère depuis le solde disponible.
 * @param props Visibilité, tontine, fermeture et action de transfert.
 * @returns La feuille de transfert.
 */
export function TontineTransferSheet(props: TontineTransferSheetProps) {
  const { visible, item, onClose, onTransfer } = props;
  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recipients = item.members.filter((member) => member.id !== SELF_MEMBER_ID);

  const submit = () => {
    const parsed = parseTransfer(memberId, amount);
    if (!parsed.ok) {
      setError(parsed.message);
      return;
    }
    if (!onTransfer(memberId, parsed.value)) {
      setError("Le transfert n'a pas abouti, vérifiez votre solde.");
      return;
    }
    onClose();
  };

  return (
    <BottomSheet visible={visible} title="Transférer à un membre" onClose={onClose}>
      <TontineRecipients members={recipients} selected={memberId} onSelect={setMemberId} />
      <SheetTextField
        label="Montant (FCFA)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="number-pad"
        placeholder="5000"
      />
      {error === null ? null : <FeedbackBanner kind="error" message={error} />}
      <SheetPrimaryButton label="Transférer" onPress={submit} />
    </BottomSheet>
  );
}
