import { formatDate } from "../../../shared/format/format.date";
import type { MemberProfile } from "../../../shared/member/store.member";

/** Informations du résumé, chacune avec son icône. */
export const MEMBER_FACT_KINDS = ["name", "phone", "occupation", "createdAt"] as const;

/** Nature d'une information du résumé du membre. */
export type MemberFactKind = (typeof MEMBER_FACT_KINDS)[number];

/** Ligne du résumé du membre : sa nature, un libellé et sa valeur. */
export interface MemberSummaryRow {
  readonly kind: MemberFactKind;
  readonly label: string;
  readonly value: string;
}

/** Champs du profil affichés dans le résumé de l'accueil. */
export type MemberSummarySource = Pick<
  MemberProfile,
  "name" | "phone" | "occupation" | "createdAt"
>;

/**
 * Valeur affichable d'un champ saisi, ou la mention d'un champ encore vide.
 * @param value Valeur saisie.
 * @returns La valeur nettoyée, ou « Non renseignée ».
 */
function filled(value: string): string {
  return value.trim() === "" ? "Non renseignée" : value.trim();
}

/**
 * Construit les lignes du résumé du membre, ouvert depuis l'avatar de
 * l'accueil : nom complet, téléphone, profession et date de création du compte.
 * @param profile Identité du membre.
 * @returns Les lignes du résumé, dans l'ordre d'affichage.
 */
export function memberSummaryRows(profile: MemberSummarySource): readonly MemberSummaryRow[] {
  return [
    { kind: "name", label: "Nom complet", value: filled(profile.name) },
    { kind: "phone", label: "Téléphone", value: filled(profile.phone) },
    { kind: "occupation", label: "Profession ou formation", value: filled(profile.occupation) },
    { kind: "createdAt", label: "Compte créé le", value: formatDate(profile.createdAt) },
  ];
}
