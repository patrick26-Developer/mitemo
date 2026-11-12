import type { RegisterPushTokenResponse, WalletSummaryResponse } from "@mitemo/contracts";
import { CURRENCIES } from "@mitemo/contracts";
import { z } from "zod";

/** Montant JSON : entier canonique en chaîne, en plus petite unité de la devise. */
export const MONEY_SCHEMA = z.object({
  amount: z.string().regex(/^(0|-?[1-9]\d*)$/),
  currency: z.enum(CURRENCIES),
});

/** Soldes du portefeuille, toujours simulés tant que l'ADR 0005 l'impose. */
export const WALLET_SUMMARY_SCHEMA = z.object({
  available: MONEY_SCHEMA,
  committed: MONEY_SCHEMA,
  pending: MONEY_SCHEMA,
  blocked: MONEY_SCHEMA,
  simulated: z.literal(true),
}) as unknown as z.ZodType<WalletSummaryResponse>;

/** Enregistrement d'un jeton de notification. */
export const PUSH_TOKEN_SCHEMA = z.object({
  registeredAt: z.iso.datetime(),
}) as unknown as z.ZodType<RegisterPushTokenResponse>;
