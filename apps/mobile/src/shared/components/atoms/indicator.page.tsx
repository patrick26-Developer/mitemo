import { View } from "react-native";

/** Props de l'indicateur de page. */
export interface PageDotsProps {
  /** Nombre de cartes de la liste. */
  readonly count: number;
  /** Rang de la carte affichée, 0 pour la première. */
  readonly active: number;
  /** Couleur des points ; la carte affichée prend la couleur pleine. */
  readonly color: string;
}

/**
 * Points sous une liste qui défile : un par carte, allongé pour la carte
 * affichée. Rien n'est affiché pour une seule carte.
 * @param props Nombre de cartes, carte affichée et couleur.
 * @returns Les points, ou rien.
 */
export function PageDots(props: PageDotsProps) {
  const { count, active, color } = props;
  if (count <= 1) return null;

  return (
    <View
      accessible
      accessibilityLabel={`Carte ${active + 1} sur ${count}`}
      className="flex-row items-center justify-center gap-1.5"
    >
      {Array.from({ length: count }, (_, index) => (
        <View
          key={index}
          testID={index === active ? "page-dot-active" : `page-dot-${index}`}
          className={index === active ? "h-1.5 w-4 rounded-full" : "h-1.5 w-1.5 rounded-full"}
          style={{ backgroundColor: color, opacity: index === active ? 1 : 0.3 }}
        />
      ))}
    </View>
  );
}
