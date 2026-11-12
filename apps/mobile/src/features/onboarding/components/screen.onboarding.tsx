import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { nextSlide, ONBOARDING_SLIDES } from "../model/model.onboarding-slides";
import { useOnboardingStore } from "../model/store.onboarding";
import { OnboardingCard } from "./card.onboarding";
import { OnboardingHero } from "./hero.onboarding";

/**
 * Présentation de Mitemo au premier lancement, avant la connexion : trois
 * pages (tontines, paiement mobile, cartes de pointage). « Passer » ou
 * « Commencer » la clôt pour de bon ; la navigation ouvre alors la connexion.
 * @returns L'écran de présentation.
 */
export function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const complete = useOnboardingStore((state) => state.complete);
  const [index, setIndex] = useState(0);
  const total = ONBOARDING_SLIDES.length;
  const slide = ONBOARDING_SLIDES[index] ?? ONBOARDING_SLIDES[0];
  if (slide === undefined) return null;

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      <OnboardingHero slideId={slide.id} topInset={insets.top} />
      <OnboardingCard
        slide={slide}
        position={{ index, total }}
        bottomInset={insets.bottom}
        onNext={() => setIndex(nextSlide(index, total))}
        onFinish={complete}
      />
    </View>
  );
}
