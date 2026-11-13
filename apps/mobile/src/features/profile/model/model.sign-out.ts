import { firstNameOf } from "../../../shared/model/model.first-name";

/** Ce que le membre manquerait une fois déconnecté. */
const SIGN_OUT_REASONS =
  "Une fois déconnecté, vous ne recevrez plus les rappels de cotisation et votre groupe ne vous verra plus en ligne. Il faudra votre numéro et votre code pour revenir.";

/** Message de la feuille de déconnexion, prénom à part pour le mettre en gras. */
export interface SignOutMessage {
  /** Prénom du membre, vide sans nom. */
  readonly firstName: string;
  /** Ce qu'il manquerait en partant. */
  readonly reasons: string;
}

/**
 * Message de la feuille de déconnexion : des excuses, adressées au membre
 * par son prénom, puis ce qu'il manquerait en partant.
 * @param name Nom complet du membre.
 * @returns Le prénom et les raisons de rester.
 */
export function signOutMessage(name: string): SignOutMessage {
  return { firstName: firstNameOf(name), reasons: SIGN_OUT_REASONS };
}
