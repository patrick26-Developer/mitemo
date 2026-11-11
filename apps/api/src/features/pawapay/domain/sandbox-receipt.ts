const UUID = /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
const TYPES = ["deposit", "payout", "refund"] as const;
const STATUSES = new Set(["PROCESSING", "COMPLETED", "FAILED"]);

function object(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  return value as Record<string, unknown>;
}

function transactionKind(fields: Record<string, unknown>) {
  const kinds = TYPES.filter((kind) => Object.hasOwn(fields, kind + "Id"));
  return kinds.length === 1 ? kinds[0] : undefined;
}

function isMtnCongo(fields: Record<string, unknown>, kind: (typeof TYPES)[number]): boolean {
  const party = object(fields[kind === "deposit" ? "payer" : "recipient"]);
  return (
    fields["currency"] === "XAF" &&
    fields["country"] === "COG" &&
    party?.["type"] === "MMO" &&
    object(party["accountDetails"])?.["provider"] === "MTN_MOMO_COG"
  );
}

function positiveInteger(value: unknown): bigint | undefined {
  return typeof value === "string" && /^[1-9][0-9]{0,17}$/.test(value) ? BigInt(value) : undefined;
}

/**
 * Extracts the minimal Sandbox observation without retaining customer data.
 * @param body Untrusted callback body.
 * @returns A normalized observation, or undefined for unsupported input.
 */
export function sandboxReceipt(body: unknown) {
  const fields = object(body);
  if (!fields) return undefined;
  const kind = transactionKind(fields);
  if (!kind || !isMtnCongo(fields, kind)) return undefined;
  return observation(fields, kind);
}

function observation(fields: Record<string, unknown>, kind: (typeof TYPES)[number]) {
  const id = fields[kind + "Id"];
  const status = fields["status"];
  const amount = positiveInteger(fields["amount"]);
  if (typeof id !== "string" || !UUID.test(id)) return undefined;
  if (typeof status !== "string" || !STATUSES.has(status)) return undefined;
  if (amount === undefined) return undefined;
  return { kind, id: id.toLowerCase(), status, amount };
}
