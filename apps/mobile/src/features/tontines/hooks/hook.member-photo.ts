import { SELF_MEMBER_ID } from "../../../shared/member/model.portfolio";
import { useMemberStore } from "../../../shared/member/store.member";

/**
 * Photo de profil d'un membre de tontine : celle du membre connecté quand il
 * en a choisi une. Les photos des autres membres arriveront avec l'API.
 * @param memberId Membre affiché.
 * @returns L'URI de la photo, ou `null` pour afficher l'initiale.
 */
export function useMemberPhotoUri(memberId: string): string | null {
  const photoUri = useMemberStore((state) => state.photoUri);
  return memberId === SELF_MEMBER_ID ? photoUri : null;
}
