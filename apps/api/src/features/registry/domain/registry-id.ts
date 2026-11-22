import { RegistryError } from "./registry.repository.js";
const UUID = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
/**
 * Valide les UUID reçus aux frontières du registre.
 * @param value Identifiant externe.
 * @returns UUID validé.
 */
export function registryId(value: unknown): string {
  if (typeof value !== "string" || !UUID.test(value))
    throw new RegistryError("Identifiant invalide");
  return value;
}
