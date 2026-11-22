import type { CurrentUser } from "@mitemo/contracts";
import type { SessionTokenVault } from "../../../shared/api/model.session-token";
import { isTokenUsable } from "../../../shared/api/model.session-token";

/** Dépendances de restauration, sans accès à l'heure ou au réseau implicite. */
interface RestoreSessionInput {
  readonly vault: Pick<SessionTokenVault, "load" | "clear">;
  readonly me: () => Promise<CurrentUser>;
  readonly now: number;
}

/**
 * Rétablit seulement une session encore acceptée par le serveur.
 * @param input Coffre, lecture du profil et horloge en millisecondes UTC.
 * @returns Le profil authentifié ou l'absence de session.
 */
export async function restoreServerSession(
  input: RestoreSessionInput,
): Promise<CurrentUser | null> {
  const token = await input.vault.load();
  if (token === null) return null;
  if (!isTokenUsable(token, input.now)) {
    await input.vault.clear();
    return null;
  }
  return input.me();
}
