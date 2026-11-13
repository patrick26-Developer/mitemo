import { firstNameOf } from "../../../shared/model/model.first-name";

/** Ce que le membre manquerait une fois déconnecté. */
const SIGN_OUT_REASONS =
  "Une fois déconnecté, vous ne recevrez plus les rappels de cotisation et votre groupe ne vous verra plus en ligne. Il faudra votre numéro et votre code pour revenir.";

/**
 * Message de la feuille de déconnexion : des excuses, adressées au membre
 * par son prénom, puis ce qu'il manquerait en partant.
 * @param name Nom complet du membre.
 * @returns Le message affiché.
 */
export function signOutMessage(name: string): string {
  const firstName = firstNameOf(name);
  const sorry = firstName === "" ? "" : `, ${firstName}`;

  return `Nous sommes désolés de vous voir partir${sorry}. ${SIGN_OUT_REASONS}`;
}
