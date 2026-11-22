import type {
  CreateSavingsGoalRequest,
  SavingsGoalCalendarResponse,
  SavingsGoalResponse,
  SavingsGoalsResponse,
} from "@mitemo/contracts";
import type { ApiClient } from "./client.http";
import { GOAL_CALENDAR_SCHEMA, GOAL_SCHEMA, GOALS_SCHEMA } from "./schema.savings";

/** Objectifs sans mouvement financier implicite. */
export interface SavingsApi {
  /** Lit les objectifs paginés du membre. */
  list(cursor?: string): Promise<SavingsGoalsResponse>;
  /** Crée un objectif sans débiter le portefeuille. */
  create(request: CreateSavingsGoalRequest): Promise<SavingsGoalResponse>;
  /** Relit le calendrier calculé côté serveur. */
  calendar(id: string): Promise<SavingsGoalCalendarResponse>;
}

function listGoals(client: ApiClient, cursor?: string): Promise<SavingsGoalsResponse> {
  return client.request({
    method: "GET",
    path: "/savings/goals" + (cursor ? "?cursor=" + encodeURIComponent(cursor) : ""),
    auth: true,
    schema: GOALS_SCHEMA,
  });
}

/**
 * Réutilise le client sécurisé pour les objectifs individuels.
 * @param client Client HTTP authentifié.
 * @returns Les appels d'épargne.
 */
export function createSavingsApi(client: ApiClient): SavingsApi {
  return {
    list: (cursor) => listGoals(client, cursor),
    create: (body) =>
      client.request({
        method: "POST",
        path: "/savings/goals",
        auth: true,
        body,
        schema: GOAL_SCHEMA,
      }),
    calendar: (id) =>
      client.request({
        method: "GET",
        path: `/savings/goals/${encodeURIComponent(id)}/calendar`,
        auth: true,
        schema: GOAL_CALENDAR_SCHEMA,
      }),
  };
}
