import type { WalletMovementsResponse } from "@mitemo/contracts";
import { MOVEMENT_KINDS, PROGRAM_KINDS } from "@mitemo/contracts";
import { z } from "zod";
import { MONEY_SCHEMA } from "./schema.wallet";

/** Réponse serveur vérifiée avant d'afficher une ligne d'historique. */
export const MOVEMENTS_SCHEMA = z.object({
  items: z.array(
    z.object({
      movementId: z.string().uuid(),
      occurredAt: z.iso.datetime(),
      kind: z.enum(MOVEMENT_KINDS),
      amount: MONEY_SCHEMA,
      description: z.string(),
      simulated: z.boolean(),
      program: z.object({ kind: z.enum(PROGRAM_KINDS), id: z.string().uuid() }).optional(),
    }),
  ),
  nextCursor: z.string().optional(),
}) as unknown as z.ZodType<WalletMovementsResponse>;
