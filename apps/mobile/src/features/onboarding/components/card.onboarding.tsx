import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { SheetPrimaryButton } from "../../../shared/components/atoms/button.sheet-primary";
import { SheetActionRow } from "../../../shared/components/macros/row.sheet-actions";
import type { OnboardingSlide } from "../model/model.onboarding-slides";
import { OnboardingPageDots } from "./dots.onboarding-page";

/** Props de la carte d'une page de la présentation. */
export interface OnboardingCardProps {
  readonly slide: OnboardingSlide;
  /** Page courante et nombre de pages. */
  readonly position: { readonly index: number; readonly total: number };
  /** Marge basse de la zone sûre, en points. */
  readonly bottomInset: number;
  readonly onNext: () => void;
  readonly onFinish: () => void;
}

/**
 * Carte blanche du bas : points de page, titre et texte de la page, puis
 * « Passer » et « Suivant » côte à côte, ou « Commencer » seul à la fin.
 * @param props Page, position, zone sûre, page suivante et fin.
 * @returns La carte de la page.
 */
export function OnboardingCard(props: OnboardingCardProps) {
  const { slide, position, bottomInset, onNext, onFinish } = props;
  const last = position.index >= position.total - 1;

  return (
    <View
      className="-mt-8 gap-5 rounded-t-[32px] bg-white px-6 pt-8"
      style={{ paddingBottom: bottomInset + 24 }}
    >
      <OnboardingPageDots index={position.index} total={position.total} />
      <Animated.View key={slide.id} entering={FadeIn.duration(350)} className="min-h-[132px] gap-3">
        <Text accessibilityRole="header" className="text-[28px] font-bold leading-9 text-ink">
          {slide.title}
        </Text>
        <Text className="text-[16px] leading-6 text-muted">{slide.message}</Text>
      </Animated.View>
      {last ? (
        <SheetPrimaryButton label="Commencer" onPress={onFinish} />
      ) : (
        <SheetActionRow
          secondary={{ label: "Passer", onPress: onFinish }}
          primary={{ label: "Suivant", onPress: onNext }}
        />
      )}
    </View>
  );
}
