import { DEMO_SAVINGS } from "../../../shared/demo/demo.savings";
import { DEMO_TONTINES } from "../../../shared/demo/demo.tontines";
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

/** Index complet de la recherche : tontines, cartes, profil et pages. */
export const SEARCH_ENTRIES: readonly SearchEntry[] = [
  ...DEMO_TONTINES.map((tontine) => ({
    id: `tontine-${tontine.id}`,
    title: tontine.name,
    subtitle: `${tontine.members} membres · ${tontine.frequency}`,
    kind: "tontine" as const,
    href: `/tontine/${tontine.id}`,
  })),
  ...DEMO_SAVINGS.map((savings) => ({
    id: `savings-${savings.id}`,
    title: savings.title,
    subtitle: `Carte de pointage · jusqu'au ${savings.until}`,
    kind: "savings" as const,
    href: `/savings-detail/${savings.id}`,
  })),
  ...PROFILE_ENTRIES,
  ...PAGE_ENTRIES,
];

/** Titres des groupes de résultats, dans l'ordre d'affichage. */
const GROUP_TITLES: Readonly<Record<SearchResultKind, string>> = {
  tontine: "Tontines",
  savings: "Cartes",
  profile: "Profil",
  page: "Pages",
};

/**
 * Filtre l'index par la recherche saisie.
 * @param query Texte recherché, casse et accents ignorés.
 * @returns Les résultats correspondants, dans l'ordre de l'index.
 */
export function searchEntries(query: string): readonly SearchEntry[] {
  if (query.trim() === "") return [];

  return SEARCH_ENTRIES.filter((entry) => matchesSearch(`${entry.title} ${entry.subtitle}`, query));
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
