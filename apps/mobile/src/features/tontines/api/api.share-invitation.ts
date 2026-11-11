import { Share } from "react-native";

import type { Tontine } from "../../../shared/member/model.portfolio";
import { invitationMessage } from "../model/model.tontine-created";
import { invitationLink } from "./api.invitation-link";

/**
 * Ouvre la feuille de partage native avec le message d'invitation : code et
 * lien qui ouvre la tontine dans Mitemo.
 * @param tontine Tontine à rejoindre.
 * @param code Code d'invitation de la tontine.
 */
export function shareInvitation(tontine: Tontine, code: string): void {
  void Share.share({ message: invitationMessage(tontine, { code, link: invitationLink(code) }) });
}
