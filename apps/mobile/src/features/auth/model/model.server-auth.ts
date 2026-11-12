import type { StartLoginResponse } from "@mitemo/contracts";
import type { IdentityApi } from "../../../shared/api/api.identity";
import type { AuthDraftState } from "./model.auth-draft";

/** Données strictement temporaires de l'étape PIN ; aucun code n'est persisté. */
interface ServerAuthInput {
  readonly draft: Pick<AuthDraftState, "mode" | "phone" | "name">;
  readonly pin: string;
  readonly api: Pick<IdentityApi, "register" | "startLogin">;
  /** Bascule le brouillon vers la connexion dès que le compte est créé. */
  readonly onRegistered?: () => void;
}

/**
 * Obtient un défi serveur ; l'OTP doit encore être saisi avant d'ouvrir la session.
 * @param input Brouillon, PIN temporaire et adaptateur API.
 * @returns Le défi OTP, sans ouverture de session locale.
 */
export async function startServerAuth(input: ServerAuthInput): Promise<StartLoginResponse> {
  const credentials = { phoneNumber: input.draft.phone, pin: input.pin };
  if (input.draft.mode === "sign-up") {
    await input.api.register({ ...credentials, displayName: input.draft.name });
    input.onRegistered?.();
  }
  return input.api.startLogin(credentials);
}
