import { View } from "react-native";

import { ONBOARDING_COLORS } from "../model/model.onboarding-theme";

/** Props de l'indicateur de page. */
export interface OnboardingPageDotsProps {
  /** Page courante, à partir de 0. */
  readonly index: number;
  readonly total: number;
}

/**
 * Points de page de la présentation : le point de la page courante s'allonge.
 * @param props Page courante et nombre de pages.
 * @returns L'indicateur, annoncé « Page X sur Y ».
 */
export function OnboardingPageDots(props: OnboardingPageDotsProps) {
  const { index, total } = props;

  return (
    <View
      accessible
      accessibilityLabel={`Page ${index + 1} sur ${total}`}
      className="flex-row items-center gap-2"
    >
      {Array.from({ length: total }, (_, dot) => (
        <View
          key={dot}
          className="h-2 rounded-full"
          style={{
            width: dot === index ? 24 : 8,
            backgroundColor: dot === index ? ONBOARDING_COLORS.dotActive : ONBOARDING_COLORS.dot,
          }}
        />
      ))}
    </View>
  );
}
