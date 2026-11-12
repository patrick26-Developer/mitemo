import { useState } from "react";

import type { Tontine } from "../../../shared/member/model.portfolio";
import type { MemberFilter, MemberFilterOption, MemberRow } from "../model/model.member-filter";
import { memberFilterOptions, memberRows } from "../model/model.member-filter";

/** État de la recherche dans la liste complète des membres. */
export interface MemberSearchState {
  readonly filter: MemberFilter;
  readonly setFilter: (filter: MemberFilter) => void;
  readonly query: string;
  readonly setQuery: (query: string) => void;
  readonly options: readonly MemberFilterOption[];
  /** Lignes retenues par le filtre et la recherche. */
  readonly rows: readonly MemberRow[];
}

/**
 * Garde le filtre et la recherche saisis sur la liste des membres, et en
 * déduit les étiquettes et les lignes affichées.
 * @param tontine Tontine affichée.
 * @returns Le filtre, la recherche, les étiquettes et les lignes.
 */
export function useMemberSearch(tontine: Tontine): MemberSearchState {
  const [filter, setFilter] = useState<MemberFilter>("all");
  const [query, setQuery] = useState("");

  return {
    filter,
    setFilter,
    query,
    setQuery,
    options: memberFilterOptions(tontine),
    rows: memberRows(tontine, { filter, query }),
  };
}
