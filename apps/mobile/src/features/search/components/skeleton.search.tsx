import { View } from "react-native";

import { Skeleton } from "../../../shared/components/atoms/skeleton.block";

/** Identifiants fixes des lignes de chargement. */
const SKELETON_ROWS = ["first", "second", "third"] as const;

/**
 * Affiche des lignes de chargement pendant que la recherche se stabilise.
 * @returns Le squelette des résultats.
 */
export function SearchSkeleton() {
  return (
    <View testID="search-skeleton" className="gap-3">
      {SKELETON_ROWS.map((row) => (
        <View
          key={row}
          className="flex-row items-center gap-3 rounded-[16px] border border-card-border p-4"
        >
          <Skeleton height={36} width={36} radius={18} />
          <View className="flex-1 gap-2">
            <Skeleton height={13} width="70%" />
            <Skeleton height={10} width="45%" />
          </View>
        </View>
      ))}
    </View>
  );
}
