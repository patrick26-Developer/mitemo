import type { ReactElement } from "react";
import { FlatList } from "react-native";

import { CARD_GAP, CARD_WIDTH } from "../theme/card-layout";

/** Accrochage d'une carte à la suivante, largeur et espace compris. */
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

/** Props d'une liste horizontale de cartes. */
export interface HorizontalCardListProps<Item> {
  readonly items: readonly Item[];
  readonly keyOf: (item: Item) => string;
  readonly renderItem: (item: Item, index: number) => ReactElement;
}

/**
 * Affiche des cartes côte à côte, qui s'accrochent une à une en défilant.
 * @template Item Type des cartes listées.
 * @param props Cartes, clé et rendu de chaque carte.
 * @returns La liste horizontale de cartes.
 */
export function HorizontalCardList<Item>(props: HorizontalCardListProps<Item>) {
  const { items, keyOf, renderItem } = props;

  return (
    <FlatList
      data={items}
      keyExtractor={keyOf}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={SNAP_INTERVAL}
      decelerationRate="fast"
      contentContainerClassName="gap-3 px-4"
      renderItem={({ item, index }) => renderItem(item, index)}
    />
  );
}
