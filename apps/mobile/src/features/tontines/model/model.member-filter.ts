import type {
  PendingInvitation,
  Tontine,
  TontineMember,
} from "../../../shared/member/model.portfolio";
import { matchesSearch } from "../../../shared/model/model.list-filter";

/** Filtres de la liste complète des membres d'une tontine. */
export const MEMBER_FILTERS = ["all", "joined", "invited", "paid", "due"] as const;

/** Filtre de la liste des membres. Voir {@link MEMBER_FILTERS}. */
export type MemberFilter = (typeof MEMBER_FILTERS)[number];

/** Ligne de la liste complète : un membre inscrit ou une invitation en attente. */
export type MemberRow =
  | { readonly kind: "member"; readonly member: TontineMember }
  | { readonly kind: "invited"; readonly invitation: PendingInvitation };

/** Étiquette de filtre, avec le nombre de lignes qu'elle retient. */
export interface MemberFilterOption {
  readonly value: MemberFilter;
  readonly label: string;
}

/** Filtre et recherche saisis sur la liste des membres. */
export interface MemberQuery {
  readonly filter: MemberFilter;
  readonly query: string;
}

/** Libellé de chaque filtre, avant son compte. */
const FILTER_LABELS: Readonly<Record<MemberFilter, string>> = {
  all: "Tous",
  joined: "Inscrits",
  invited: "Invités",
  paid: "À jour",
  due: "En attente",
};

/** Ce que retient chaque filtre. */
const FILTER_TESTS: Readonly<Record<MemberFilter, (row: MemberRow) => boolean>> = {
  all: () => true,
  joined: (row) => row.kind === "member",
  invited: (row) => row.kind === "invited",
  paid: (row) => row.kind === "member" && row.member.paidCurrentRound,
  due: (row) => row.kind === "member" && !row.member.paidCurrentRound,
};

/**
 * Toutes les lignes de la tontine : les inscrits dans l'ordre de passage,
 * puis les invitations en attente.
 * @param tontine Tontine affichée.
 * @returns Les lignes, sans filtre.
 */
function allRows(tontine: Tontine): readonly MemberRow[] {
  return [
    ...tontine.members.map((member) => ({ kind: "member", member }) as const),
    ...tontine.invitations.map((invitation) => ({ kind: "invited", invitation }) as const),
  ];
}

/**
 * Filtres utiles selon l'étape : inscrits et invités avant le départ, état de
 * la cotisation du tour pendant le cycle.
 * @param tontine Tontine affichée.
 * @returns Les filtres proposés, « Tous » en premier.
 */
function filtersOf(tontine: Tontine): readonly MemberFilter[] {
  if (tontine.state === "PENDING") return ["all", "joined", "invited"];
  if (tontine.state === "ACTIVE") return ["all", "paid", "due"];
  return ["all"];
}

/**
 * Construit les étiquettes de filtre, chacune avec son compte, pour savoir
 * d'un coup d'œil qui est à jour.
 * @param tontine Tontine affichée.
 * @returns Les étiquettes, par exemple « À jour · 6 ».
 */
export function memberFilterOptions(tontine: Tontine): readonly MemberFilterOption[] {
  const rows = allRows(tontine);
  return filtersOf(tontine).map((value) => ({
    value,
    label: `${FILTER_LABELS[value]} · ${rows.filter(FILTER_TESTS[value]).length}`,
  }));
}

/**
 * Applique le filtre et la recherche par nom à la liste des membres.
 * @param tontine Tontine affichée.
 * @param query Filtre choisi et recherche saisie.
 * @returns Les lignes retenues, dans l'ordre de passage puis les invitations.
 */
export function memberRows(tontine: Tontine, query: MemberQuery): readonly MemberRow[] {
  return allRows(tontine).filter(
    (row) => FILTER_TESTS[query.filter](row) && matchesSearch(rowName(row), query.query),
  );
}

/**
 * Nom affiché d'une ligne.
 * @param row Membre ou invitation.
 * @returns Le nom du membre ou du contact invité.
 */
function rowName(row: MemberRow): string {
  return row.kind === "member" ? row.member.name : row.invitation.name;
}

/** Contenu affiché quand le filtre et la recherche ne retiennent personne. */
export interface MembersEmptyState {
  readonly title: string;
  readonly message: string;
}

/**
 * Message de la liste des membres quand aucune ligne n'est retenue.
 * @param query Recherche saisie.
 * @returns Le titre et l'explication, qui rappellent la recherche éventuelle.
 */
export function membersEmptyState(query: string): MembersEmptyState {
  const trimmed = query.trim();
  const message =
    trimmed === ""
      ? "Aucun membre ne correspond à ce filtre."
      : `Aucun membre ne correspond à « ${trimmed} » avec ce filtre.`;
  return { title: "Aucun membre trouvé", message };
}
