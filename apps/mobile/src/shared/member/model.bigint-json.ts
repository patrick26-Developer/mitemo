/**
 * Sérialise les montants `bigint` en objets `{ __bigint }`, car `JSON.stringify`
 * refuse un `bigint` brut et que les montants ne doivent jamais passer par un
 * flottant.
 * @param _key Clé JSON, ignorée.
 * @param value Valeur à sérialiser.
 * @returns La valeur sérialisable par `JSON.stringify`.
 */
export function bigintReplacer(_key: string, value: unknown): unknown {
  return typeof value === "bigint" ? { __bigint: value.toString() } : value;
}

/**
 * Relit les montants sérialisés par {@link bigintReplacer}.
 * @param _key Clé JSON, ignorée.
 * @param value Valeur relue.
 * @returns La valeur, avec les montants rendus en `bigint`.
 */
export function bigintReviver(_key: string, value: unknown): unknown {
  const raw = (value as { readonly __bigint?: unknown } | null)?.__bigint;
  return typeof raw === "string" ? BigInt(raw) : value;
}
