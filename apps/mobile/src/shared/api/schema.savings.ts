import type {
  SavingsGoalCalendarResponse,
  SavingsGoalResponse,
  SavingsGoalsResponse,
} from "@mitemo/contracts";
import { INSTALLMENT_STATES, SCHEDULE_FREQUENCIES } from "@mitemo/contracts";
import { z } from "zod";
import { MONEY_SCHEMA } from "./schema.wallet";

const terms = z.object({
  installmentAmount: MONEY_SCHEMA,
  frequency: z.enum(SCHEDULE_FREQUENCIES),
  installmentsPerCycle: z.number().int().positive(),
  cycleCount: z.number().int().positive(),
  startsAt: z.iso.datetime(),
});

/** Objectif vérifié à la frontière HTTP. */
export const GOAL_SCHEMA = z.object({
  goalId: z.string().uuid(),
  name: z.string(),
  terms,
  createdAt: z.iso.datetime(),
  target: MONEY_SCHEMA,
}) as unknown as z.ZodType<SavingsGoalResponse>;

/** Page d'objectifs appartenant au titulaire de la session. */
export const GOALS_SCHEMA = z.object({
  items: z.array(GOAL_SCHEMA),
  nextCursor: z.string().optional(),
}) as unknown as z.ZodType<SavingsGoalsResponse>;

/** Calendrier serveur ; aucun versement n'est inventé sur le téléphone. */
export const GOAL_CALENDAR_SCHEMA = z.object({
  items: z.array(
    z.object({
      index: z.number().int().positive(),
      dueAt: z.iso.datetime(),
      amount: MONEY_SCHEMA,
      state: z.enum(INSTALLMENT_STATES),
      paidAt: z.iso.datetime().optional(),
    }),
  ),
}) as unknown as z.ZodType<SavingsGoalCalendarResponse>;
