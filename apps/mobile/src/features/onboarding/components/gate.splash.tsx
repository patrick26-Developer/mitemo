import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { usePersistHydrated } from "../hooks/hook.persist-hydrated";
import { useSplashVisible } from "../hooks/hook.splash-visible";
import { useOnboardingStore } from "../model/store.onboarding";
import { SplashScreen } from "./screen.splash";

/** Durée minimale de l'écran de lancement, en millisecondes. */
const SPLASH_MIN_DURATION = 1_400;

/**
 * Pose l'écran de lancement au-dessus de la navigation jusqu'à ce que la
 * présentation et le portefeuille soient relus sur l'appareil : le premier
 * écran choisi (présentation ou connexion) est ainsi le bon, sans saut.
 * @returns L'écran de lancement, ou rien une fois l'application prête.
 */
export function SplashGate() {
  const onboardingReady = usePersistHydrated(useOnboardingStore.persist);
  const portfolioReady = usePersistHydrated(usePortfolioStore.persist);
  const visible = useSplashVisible({
    ready: onboardingReady && portfolioReady,
    minDuration: SPLASH_MIN_DURATION,
  });

  return <SplashScreen visible={visible} />;
}
