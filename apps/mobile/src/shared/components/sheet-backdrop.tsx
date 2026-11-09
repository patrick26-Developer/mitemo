import { Pressable, View } from "react-native";

import { GridBackground } from "./grid-background";

/** Props du voile d'une feuille modale. */
export interface SheetBackdropProps {
  /** Ferme la feuille quand le membre touche le voile. */
  readonly onPress: () => void;
}

/**
 * Affiche le voile sombre quadrillé posé derrière une feuille.
 * @param props Fermeture au toucher.
 * @returns Le voile, son quadrillage et la zone de fermeture.
 */
export function SheetBackdrop(props: SheetBackdropProps) {
  const { onPress } = props;

  return (
    <>
      <View className="absolute inset-0 bg-ink/60" />
      <GridBackground />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Fermer la feuille"
        className="absolute inset-0"
        onPress={onPress}
      />
    </>
  );
}
