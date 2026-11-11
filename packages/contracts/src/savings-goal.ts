import type { IsoDateTime } from "./datetime.ts";
import type { Installment, SavingsCardTerms } from "./savings-card.ts";
import type { MoneyDto } from "./money.ts";

/** Creates an individual savings plan without fees or a debit. */
export interface CreateSavingsGoalRequest {
  readonly name: string;
  readonly terms: SavingsCardTerms;
}

/** An individual savings plan owned by the current user. */
export interface SavingsGoalResponse extends CreateSavingsGoalRequest {
  readonly goalId: string;
  readonly createdAt: IsoDateTime;
  readonly target: MoneyDto;
}

/** A page of individual savings plans. */
export interface SavingsGoalsResponse {
  readonly items: readonly SavingsGoalResponse[];
  readonly nextCursor?: string;
}

/** Scheduled installments shown as a tracking card. */
export interface SavingsGoalCalendarResponse {
  readonly items: readonly Installment[];
}
