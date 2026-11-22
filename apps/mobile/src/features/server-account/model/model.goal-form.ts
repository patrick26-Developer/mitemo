import type { CreateSavingsGoalRequest } from "@mitemo/contracts";
import { parseAmount, serializeAmount, toIsoDateTime } from "@mitemo/contracts";

/** Saisie d'un objectif mensuel sans mouvement financier. */
export interface GoalFormInput {
  readonly name: string;
  readonly amount: string;
  readonly installments: string;
  /** Première échéance saisie sous la forme AAAA-MM-JJ, interprétée en UTC. */
  readonly startsAt: string;
}

/** Erreur locale de saisie, distincte des erreurs réseau. */
export class InvalidGoalFormError extends Error {
  override readonly name = "InvalidGoalFormError";
}

function firstInstallment(day: string): string {
  const iso = day + "T00:00:00.000Z";
  const date = new Date(iso);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(day) ||
    !Number.isFinite(date.getTime()) ||
    date.toISOString() !== iso
  ) {
    throw new InvalidGoalFormError("Date de début invalide (AAAA-MM-JJ).");
  }
  return iso;
}

function validForm(form: GoalFormInput): boolean {
  return (
    form.name.trim().length > 0 &&
    form.name.trim().length <= 80 &&
    /^[1-9]\d{0,9}$/.test(form.amount) &&
    BigInt(form.amount) <= 1_000_000_000n &&
    /^[1-9]\d{0,2}$/.test(form.installments) &&
    Number(form.installments) <= 366
  );
}

/**
 * Prépare les conditions du programme ; les cibles et les soldes restent calculés par le serveur.
 * @param form Saisie de l'utilisateur.
 * @returns La requête typée sans statut payé ni montant crédité.
 * @throws {InvalidGoalFormError} si les conditions ne respectent pas les bornes du serveur.
 */
export function goalRequest(form: GoalFormInput): CreateSavingsGoalRequest {
  if (!validForm(form))
    throw new InvalidGoalFormError("Nom, montant entier ou nombre d'échéances invalide.");
  return {
    name: form.name.trim(),
    terms: {
      installmentAmount: { amount: serializeAmount(parseAmount(form.amount)), currency: "XAF" },
      frequency: "MONTHLY",
      installmentsPerCycle: Number(form.installments),
      cycleCount: 1,
      startsAt: toIsoDateTime(firstInstallment(form.startsAt)),
    },
  };
}
