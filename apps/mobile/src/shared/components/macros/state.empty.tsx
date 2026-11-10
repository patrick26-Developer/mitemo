import { Text, View } from "react-native";

/** Props de l'état vide d'un écran. */
export interface EmptyStateProps {
  readonly title: string;
  readonly message: string;
}

/**
 * Affiche un message lorsqu'un élément demandé n'existe pas.
 * @param props Titre et explication de l'état vide.
 * @returns Le message d'état vide.
 */
export function EmptyState(props: EmptyStateProps) {
  const { title, message } = props;

  return (
    <View className="flex-1 justify-center gap-2 px-6">
      <Text accessibilityRole="header" className="text-[20px] font-bold text-ink">
        {title}
      </Text>
      <Text className="text-[14px] leading-6 text-muted">{message}</Text>
    </View>
  );
}
