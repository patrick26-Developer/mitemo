import { walletPageSize } from "./wallet-page-size.js";
import { randomUUID } from "node:crypto";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { serializeAmount, toAmountMinor, toIsoDateTime } from "@mitemo/contracts";
import type {
  MoneyDto,
  MovementId,
  SimulateFundingResponse,
  TransactionId,
  WalletMovementsResponse,
  WalletSummaryResponse,
} from "@mitemo/contracts";
import {
  createJournalEntry,
  IdempotencyConflictError,
  PrismaLedgerRepository,
} from "../../ledger/index.js";
import { PrismaService } from "../../../shared/database/prisma.service.js";

interface WalletOwner {
  readonly userId: string;
  readonly accountId: string;
}

const DEMO_AMOUNT = 5000n;
const CLEARING_ACCOUNT = "clearing:wallet-demo";
const UUID = /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

function money(amount: bigint): MoneyDto {
  return { amount: serializeAmount(toAmountMinor(amount)), currency: "XAF" };
}

function fundingKey(owner: WalletOwner, key: string | undefined, body: unknown): string {
  if (!key || !UUID.test(key)) throw new BadRequestException("Clé d’idempotence UUID requise");
  const amount = (body as { amount?: { amount?: unknown; currency?: unknown } } | null)?.amount;
  if (amount?.amount !== "5000" || amount.currency !== "XAF") {
    throw new BadRequestException("Le versement simulé est de 5 000 XAF");
  }
  return "wallet-demo:" + owner.userId + ":" + key.toLowerCase();
}

function demoEntry(accountId: string) {
  return createJournalEntry({
    id: randomUUID(),
    occurredAt: toIsoDateTime(new Date().toISOString()),
    description: "Versement simulé",
    lines: [
      { accountId: CLEARING_ACCOUNT, amount: toAmountMinor(-DEMO_AMOUNT) },
      { accountId: accountId, amount: toAmountMinor(DEMO_AMOUNT) },
    ],
  });
}

function movement(row: {
  id: string;
  occurredAt: Date;
  reversesEntryId: string | null;
  lines: readonly { amount: bigint }[];
  description: string;
}) {
  return {
    movementId: row.id as MovementId,
    occurredAt: toIsoDateTime(row.occurredAt.toISOString()),
    kind: row.reversesEntryId ? ("REVERSAL" as const) : ("FUNDING" as const),
    amount: money(row.lines.reduce((total, line) => total + line.amount, 0n)),
    description: row.description,
    simulated: true,
  };
}

/** Reads and writes the demonstration wallet through the PostgreSQL ledger. */
@Injectable()
export class WalletService {
  private readonly ledger: PrismaLedgerRepository;

  /**
   * Wires the existing ledger repository.
   * @param prisma Database connection.
   */
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    this.ledger = new PrismaLedgerRepository(prisma);
  }

  /**
   * Computes the wallet balance from persisted posting lines.
   * @param owner Authenticated account ownership.
   * @returns Serialized balances in XAF.
   */
  async summary(owner: WalletOwner): Promise<WalletSummaryResponse> {
    const available = await this.ledger.balanceOf(owner.accountId);
    return {
      available: money(available),
      pending: money(0n),
      committed: money(0n),
      blocked: money(0n),
      simulated: true,
    };
  }

  /**
   * Reads one page of the caller's ledger.
   * @param owner Authenticated account ownership.
   * @param query Requested limit and cursor.
   * @returns The page of movements.
   */
  async movements(
    owner: WalletOwner,
    query: Record<string, unknown>,
  ): Promise<WalletMovementsResponse> {
    const limit = walletPageSize(query["limit"]);
    const cursor = await this.ownedCursor(owner.accountId, query["cursor"]);
    const accountId = owner.accountId;
    const rows = await this.prisma.ledgerEntry.findMany({
      where: { lines: { some: { accountId } } },
      include: { lines: { where: { accountId } } },
      orderBy: [{ occurredAt: "desc" }, { id: "desc" }],
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });
    const items = rows.slice(0, limit).map(movement);
    const nextCursor = rows.length > limit ? items.at(-1)?.movementId : undefined;
    return nextCursor ? { items, nextCursor } : { items };
  }

  private async ownedCursor(accountId: string, cursor: unknown): Promise<string | undefined> {
    if (cursor === undefined) return undefined;
    if (typeof cursor !== "string" || !UUID.test(cursor))
      throw new BadRequestException("Curseur invalide");
    const found = await this.prisma.ledgerEntry.findFirst({
      where: { id: cursor, lines: { some: { accountId } } },
    });
    if (!found) throw new BadRequestException("Curseur invalide");
    return cursor;
  }

  /**
   * Records an idempotent, balanced credit in the simulated ledger.
   * @param owner Authenticated account ownership.
   * @param key Caller idempotency key.
   * @param body Deposit request.
   * @returns The original or new confirmed credit.
   */
  async fund(
    owner: WalletOwner,
    key: string | undefined,
    body: unknown,
  ): Promise<SimulateFundingResponse> {
    const idempotencyKey = fundingKey(owner, key, body);
    const previous = await this.prisma.ledgerEntry.findUnique({ where: { idempotencyKey } });
    if (!previous) await this.postCredit(owner, idempotencyKey);
    const entry =
      previous ?? (await this.prisma.ledgerEntry.findUniqueOrThrow({ where: { idempotencyKey } }));
    return {
      transactionId: entry.id as TransactionId,
      state: "CONFIRMED",
      amount: money(DEMO_AMOUNT),
      simulated: true,
      createdAt: toIsoDateTime(entry.occurredAt.toISOString()),
    };
  }

  private async postCredit(owner: WalletOwner, idempotencyKey: string): Promise<void> {
    const entry = demoEntry(owner.accountId);
    try {
      await this.ledger.post({
        entry,
        idempotencyKey,
        operationRef: idempotencyKey,
        recordedBy: owner.userId,
        settlementMode: "SIMULATED",
      });
    } catch (error) {
      if (!(error instanceof IdempotencyConflictError)) throw error;
    }
  }
}
