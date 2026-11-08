import { toAmountMinor, toIsoDateTime } from "@mitemo/contracts";
import { describe, expect, it } from "vitest";

import { createJournalEntry } from "../domain/journal-entry.js";
import type { PostEntryCommand } from "../domain/ledger.repository.js";
import { fingerprint } from "./ledger-entry-fingerprint.js";

const AT = toIsoDateTime("2026-11-07T08:00:00.000Z");

function command(overrides: Partial<PostEntryCommand> = {}): PostEntryCommand {
  return {
    entry: createJournalEntry({
      id: "entry-1",
      occurredAt: AT,
      description: "Mouvement de test",
      lines: [
        { accountId: "wallet:grace", amount: toAmountMinor(500n) },
        { accountId: "clearing:mtn", amount: toAmountMinor(-500n) },
      ],
    }),
    idempotencyKey: "cle-1",
    operationRef: "test:cle-1",
    recordedBy: "int-spec",
    settlementMode: "SIMULATED",
    ...overrides,
  };
}

describe("fingerprint", () => {
  it("ignore l'identifiant de l'écriture, qui change à chaque rejeu", () => {
    const first = command();
    const replay = command({
      entry: createJournalEntry({ ...first.entry, id: "entry-2" }),
    });

    expect(fingerprint(replay)).toBe(fingerprint(first));
  });

  it("inclut l'auteur de l'enregistrement", () => {
    expect(fingerprint(command({ recordedBy: "autre-auteur" }))).not.toBe(fingerprint(command()));
  });

  it("change dès que le contenu comptable change", () => {
    const changed = command({
      entry: createJournalEntry({
        id: "entry-1",
        occurredAt: AT,
        description: "Mouvement de test",
        lines: [
          { accountId: "wallet:grace", amount: toAmountMinor(501n) },
          { accountId: "clearing:mtn", amount: toAmountMinor(-501n) },
        ],
      }),
    });

    expect(fingerprint(changed)).not.toBe(fingerprint(command()));
  });
});
