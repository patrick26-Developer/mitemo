import { Text, View } from "react-native";

const TAGLINE =
  "L'épargne solidaire connectée : vos tontines et caisses de solidarité, sécurisées et numériques, pour gérer votre épargne collective en toute confiance.";

/** Props de l'écran d'attente d'une section. */
export interface PlaceholderScreenProps {
  /** Titre de la section, affiché comme en-tête accessible. */
  readonly title: string;
}

/**
 * Affiche le titre d'une section dont l'écran n'est pas encore construit.
 * @param props Titre de la section.
 * @returns L'écran de la section.
 */
export function PlaceholderScreen(props: PlaceholderScreenProps) {
  const { title } = props;

  return (
    <View className="flex-1 justify-center gap-3 p-6">
      <Text accessibilityRole="header" className="text-[32px] font-bold">
        {title}
      </Text>
      <Text className="text-[16px] leading-6">{TAGLINE}</Text>
    </View>
  );
}
