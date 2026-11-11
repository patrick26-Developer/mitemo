import { useState } from "react";

import type { TransferFormState } from "../model/model.tontine-transfer";
import { INITIAL_TRANSFER_FORM, parseTransfer } from "../model/model.tontine-transfer";

/** Dépendances d'un transfert vers un membre. */
export interface TransferFormConfig {
  /** Transfère le montant ; renvoie `true` quand l'opération a réussi. */
  readonly onTransfer: (memberId: string, amount: bigint) => boolean;
  /** Appelé quand la feuille doit se fermer après un transfert réussi. */
  readonly onClose: () => void;
}

/** Message affiché quand le solde du membre ne couvre pas le transfert. */
const REFUSED_MESSAGE = "Le transfert n'a pas abouti, vérifiez votre solde.";

/** Saisie, erreur et action d'un transfert vers un membre. */
export interface TransferForm {
  readonly form: TransferFormState;
  readonly error: string | null;
  readonly update: (patch: Partial<TransferFormState>) => void;
  /** Valide la saisie puis transfère, ou affiche le message à corriger. */
  readonly submit: () => void;
}

/** Dépendances d'une tentative de transfert. */
interface SubmitDeps {
  readonly form: TransferFormState;
  readonly onTransfer: TransferFormConfig["onTransfer"];
  readonly onClose: TransferFormConfig["onClose"];
  readonly report: (message: string | null) => void;
}

/**
 * Valide la saisie, transfère le montant, puis ferme ou signale l'échec.
 * @param deps Saisie, actions et affichage de l'erreur.
 */
function submitTransfer(deps: SubmitDeps): void {
  const parsed = parseTransfer(deps.form.memberId, deps.form.amount);
  if (!parsed.ok) {
    deps.report(parsed.message);
    return;
  }
  if (!deps.onTransfer(deps.form.memberId, parsed.value)) {
    deps.report(REFUSED_MESSAGE);
    return;
  }
  deps.onClose();
}

/**
 * Gère la saisie du destinataire et du montant d'un transfert. Un transfert
 * refusé laisse la feuille ouverte avec son message ; un transfert réussi la
 * ferme.
 * @param config Actions de transfert et de fermeture.
 * @returns La saisie, l'erreur et les actions de la feuille.
 */
export function useTontineTransfer(config: TransferFormConfig): TransferForm {
  const { onTransfer, onClose } = config;
  const [form, setForm] = useState<TransferFormState>(INITIAL_TRANSFER_FORM);
  const [error, report] = useState<string | null>(null);
  const update = (patch: Partial<TransferFormState>) => {
    setForm((current) => ({ ...current, ...patch }));
  };
  const submit = () => submitTransfer({ form, onTransfer, onClose, report });

  return { form, error, update, submit };
}
