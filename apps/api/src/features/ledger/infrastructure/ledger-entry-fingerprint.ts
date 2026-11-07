import { createHash } from "node:crypto";

import type { PostEntryCommand } from "../domain/ledger.repository.js";

/**
 * Empreinte du contenu d'une demande, sans l'identifiant d'écriture : une
 * demande rejouée reçoit souvent un nouvel identifiant, pas un nouveau contenu.
 * L'auteur fait partie du contenu : une même clé présentée par un autre auteur
 * est un conflit, jamais un rejeu silencieux attribué au premier auteur.
 * @param command Demande d'enregistrement.
 * @returns Empreinte SHA-256 hexadécimale.
 */
export function fingerprint(command: PostEntryCommand): string {
  const { entry } = command;
  const canonical = JSON.stringify({
    operationRef: command.operationRef,
    recordedBy: command.recordedBy,
    settlementMode: command.settlementMode,
    description: entry.description,
    occurredAt: entry.occurredAt,
    reverses: entry.reverses ?? null,
    lines: entry.lines.map((line) => [line.accountId, line.amount.toString()]),
  });
  return createHash("sha256").update(canonical).digest("hex");
}
