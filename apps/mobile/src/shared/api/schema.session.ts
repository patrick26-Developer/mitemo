import type { SessionResponse } from "@mitemo/contracts";
import { USER_ROLES } from "@mitemo/contracts";
import { z } from "zod";

/** Utilisateur connecté, tel que l'API le décrit. */
export const CURRENT_USER_SCHEMA = z.object({
  userId: z.string().min(1),
  displayName: z.string(),
  maskedPhoneNumber: z.string(),
  role: z.enum(USER_ROLES),
});

/**
 * Session ouverte ou renouvelée : jeton opaque, expiration en ISO 8601 UTC et
 * utilisateur. Validée avant que le jeton ne soit conservé.
 */
export const SESSION_SCHEMA = z.object({
  accessToken: z.string().min(1),
  expiresAt: z.iso.datetime(),
  user: CURRENT_USER_SCHEMA,
}) as unknown as z.ZodType<SessionResponse>;
