import { Text, View } from "react-native";

/** Props de l'en-tête d'un écran de section. */
export interface ScreenHeaderProps {
  readonly title: string;
  readonly subtitle: string;
}

/**
 * Affiche le titre et le sous-titre d'un écran de section.
 * @param props Titre et sous-titre de l'écran.
 * @returns L'en-tête de l'écran.
 */
export function ScreenHeader(props: ScreenHeaderProps) {
  const { title, subtitle } = props;

  return (
    <View className="gap-1 px-4 pb-5">
      <Text accessibilityRole="header" className="text-[28px] font-bold text-ink">
        {title}
      </Text>
      <Text className="text-[14px] text-muted">{subtitle}</Text>
    </View>
  );
}
