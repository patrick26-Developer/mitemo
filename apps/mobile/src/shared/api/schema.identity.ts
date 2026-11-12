import type { ActiveSession, CurrentUser, StartLoginResponse } from "@mitemo/contracts";
import { z } from "zod";

import { CURRENT_USER_SCHEMA } from "./schema.session";

/*
 * Les schémas valident la forme reçue ; la conversion vers les types du
 * contrat (identifiants nominaux) n'a lieu qu'après cette validation.
 */

/** Utilisateur connecté, typé selon le contrat. */
export const USER_SCHEMA = CURRENT_USER_SCHEMA as unknown as z.ZodType<CurrentUser>;

/** Étape 1 de la connexion : défi et OTP simulé. */
export const START_LOGIN_SCHEMA = z.object({
  challengeId: z.string().min(1),
  expiresAt: z.iso.datetime(),
  simulatedOtp: z.string().regex(/^\d{6}$/),
}) as unknown as z.ZodType<StartLoginResponse>;

/** Sessions actives du compte, sans leur jeton. */
export const ACTIVE_SESSIONS_SCHEMA = z.array(
  z.object({
    id: z.string().min(1),
    deviceLabel: z.string().nullable(),
    createdAt: z.iso.datetime(),
    expiresAt: z.iso.datetime(),
    current: z.boolean(),
  }),
) as unknown as z.ZodType<readonly ActiveSession[]>;

/** Réponse vide d'un 204. */
export const NO_CONTENT_SCHEMA = z.undefined();
