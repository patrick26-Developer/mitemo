import { formatDate } from "../../../shared/format/format.date";
import type { SavingsCard, Tontine } from "../../../shared/member/model.portfolio";
import { formatFrequency } from "../../../shared/member/model.portfolio";
import { matchesSearch } from "../../../shared/model/model.list-filter";
import { PROFILE_GROUPS } from "../../../shared/model/model.profile-actions";

/** Types de résultat proposés par la recherche globale. */
export const SEARCH_RESULT_KINDS = ["tontine", "savings", "profile", "page"] as const;

/** Type d'un résultat. Voir {@link SEARCH_RESULT_KINDS}. */
export type SearchResultKind = (typeof SEARCH_RESULT_KINDS)[number];

/** Résultat de la recherche globale. */
export interface SearchEntry {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly kind: SearchResultKind;
  /** Route ouverte quand le résultat est touché. */
  readonly href: string;
}

/** Groupe de résultats sous un même titre. */
export interface SearchGroup {
  readonly title: string;
  readonly results: readonly SearchEntry[];
}

/** Suggestions affichées avant la première saisie. */
export const SEARCH_SUGGESTIONS = ["Tontine", "Loyer", "Sécurité"] as const;

/** Raccourcis vers les grandes pages de l'application. */
const PAGE_ENTRIES: readonly SearchEntry[] = [
  { id: "page-home", title: "Accueil", subtitle: "Solde et activités", kind: "page", href: "/" },
  {
    id: "page-tontines",
    title: "Tontines",
    subtitle: "Tous mes groupes",
    kind: "page",
    href: "/tontines",
  },
  {
    id: "page-savings",
    title: "Cartes de pointage",
    subtitle: "Mes objectifs",
    kind: "page",
    href: "/savings",
  },
  {
    id: "page-profile",
    title: "Profil",
    subtitle: "Compte et préférences",
    kind: "page",
    href: "/profile",
  },
];

/** Entrées de profil, dérivées des groupes affichés par le profil. */
const PROFILE_ENTRIES: readonly SearchEntry[] = PROFILE_GROUPS.flatMap((group) =>
  group.actions.map((action) => ({
    id: `profile-${action.id}`,
    title: action.label,
    subtitle: `Profil · ${group.title}`,
    kind: "profile" as const,
    href: "/profile",
  })),
);

/**
 * Construit les résultats des tontines du membre.
 * @param tontines Tontines du membre.
 * @returns Une entrée par tontine.
 */
function tontineEntries(tontines: readonly Tontine[]): readonly SearchEntry[] {
  return tontines.map((tontine) => ({
    id: `tontine-${tontine.id}`,
    title: tontine.name,
    subtitle: `${tontine.members.length} membres · ${formatFrequency(tontine.frequency)}`,
    kind: "tontine" as const,
    href: `/tontine/${tontine.id}`,
  }));
}

/**
 * Construit les résultats des cartes de pointage du membre.
 * @param cards Cartes du membre.
 * @returns Une entrée par carte.
 */
function cardEntries(cards: readonly SavingsCard[]): readonly SearchEntry[] {
  return cards.map((card) => ({
    id: `savings-${card.id}`,
    title: card.name,
    subtitle: `Carte de pointage · jusqu'au ${formatDate(card.deadline)}`,
    kind: "savings" as const,
    href: `/savings-detail/${card.id}`,
  }));
}

/**
 * Construit l'index de recherche à partir du portefeuille du membre.
 * @param tontines Tontines du membre.
 * @param cards Cartes de pointage du membre.
 * @returns L'index complet : tontines, cartes, profil et pages.
 */
function buildSearchEntries(
  tontines: readonly Tontine[],
  cards: readonly SavingsCard[],
): readonly SearchEntry[] {
  return [...tontineEntries(tontines), ...cardEntries(cards), ...PROFILE_ENTRIES, ...PAGE_ENTRIES];
}

/** Titres des groupes de résultats, dans l'ordre d'affichage. */
const GROUP_TITLES: Readonly<Record<SearchResultKind, string>> = {
  tontine: "Tontines",
  savings: "Cartes",
  profile: "Profil",
  page: "Pages",
};

/**
 * Indique si la saisie attend encore sa version stabilisée.
 * @param query Saisie courante.
 * @param debouncedQuery Saisie stabilisée.
 * @returns `true` quand l'écran doit afficher le squelette de chargement.
 */
export function isSearchPending(query: string, debouncedQuery: string): boolean {
  return query.trim() !== debouncedQuery.trim() && query.trim() !== "";
}

/**
 * Filtre l'index par la recherche saisie.
 * @param query Texte recherché, casse et accents ignorés.
 * @param tontines Tontines du membre.
 * @param cards Cartes de pointage du membre.
 * @returns Les résultats correspondants, dans l'ordre de l'index.
 */
export function searchEntries(
  query: string,
  tontines: readonly Tontine[],
  cards: readonly SavingsCard[],
): readonly SearchEntry[] {
  if (query.trim() === "") return [];

  return buildSearchEntries(tontines, cards).filter((entry) =>
    matchesSearch(`${entry.title} ${entry.subtitle}`, query),
  );
}

/**
 * Regroupe les résultats par type, en conservant l'ordre de l'index.
 * @param entries Résultats à regrouper.
 * @returns Les groupes non vides, prêts à afficher.
 */
export function groupSearchResults(entries: readonly SearchEntry[]): readonly SearchGroup[] {
  return SEARCH_RESULT_KINDS.map((kind) => ({
    title: GROUP_TITLES[kind],
    results: entries.filter((entry) => entry.kind === kind),
  })).filter((group) => group.results.length > 0);
}
