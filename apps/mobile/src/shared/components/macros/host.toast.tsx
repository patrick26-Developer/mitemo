import { CircleAlert, CircleCheck } from "lucide-react-native";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useToastStore } from "../../feedback/store.toast";
import type { Toast } from "../../feedback/store.toast";
import { PALETTE } from "../../theme/theme.palette";

/** Durée d'affichage d'un toast, en millisecondes. */
export const TOAST_DURATION_MS = 3500;

/** Départ du toast, juste au-dessus de sa place, en points. */
const TOAST_HIDDEN_OFFSET = -24;

/** Arrivée du toast : un glissement court et amorti, sans rebond. */
const TOAST_TIMING = { duration: 220, easing: Easing.out(Easing.cubic) };

/**
 * Couleurs de chaque nature de toast : un succès reprend le blanc des
 * feuilles, une erreur est entièrement rouge pour ne pas passer inaperçue.
 */
const KIND_STYLES = {
  success: {
    card: { backgroundColor: PALETTE.white, borderColor: "#E4E7EE" },
    icon: "#1F8A4C",
    text: PALETTE.ink,
    Icon: CircleCheck,
  },
  error: {
    card: { backgroundColor: PALETTE.danger, borderColor: PALETTE.danger },
    icon: PALETTE.white,
    text: PALETTE.white,
    Icon: CircleAlert,
  },
} as const;

/**
 * Affiche le toast courant en haut de l'écran, comme une notification : il
 * apparaît en fondu, sans rebond, et se retire au bout de quelques secondes ou
 * au toucher.
 * À poser à la racine et dans chaque feuille, pour passer au-dessus d'elle.
 * @returns Le toast, ou rien.
 */
export function ToastHost() {
  const toast = useToastStore((state) => state.toast);
  const dismiss = useToastStore((state) => state.dismiss);

  useEffect(() => {
    if (toast === null) return undefined;
    const timer = setTimeout(dismiss, TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast, dismiss]);

  if (toast === null) return null;
  return <ToastCard key={toast.id} toast={toast} onPress={dismiss} />;
}

/** Props de la carte d'un toast. */
interface ToastCardProps {
  readonly toast: Toast;
  readonly onPress: () => void;
}

/**
 * Carte du toast : icône, message et couleur de sa nature.
 * @param props Toast à afficher et fermeture.
 * @returns La carte animée.
 */
function ToastCard(props: ToastCardProps) {
  const { toast, onPress } = props;
  const insets = useSafeAreaInsets();
  const kind = KIND_STYLES[toast.kind];
  const offset = useSharedValue(TOAST_HIDDEN_OFFSET);
  const slide = useAnimatedStyle(() => ({
    opacity: 1 - offset.get() / TOAST_HIDDEN_OFFSET,
    transform: [{ translateY: offset.get() }],
  }));

  useEffect(() => {
    offset.set(withTiming(0, TOAST_TIMING));
  }, [offset]);

  return (
    <Animated.View pointerEvents="box-none" style={[styles.host, { top: insets.top + 8 }, slide]}>
      <Pressable
        accessibilityRole="alert"
        accessibilityLabel={toast.message}
        accessibilityLiveRegion="polite"
        onPress={onPress}
        className="flex-row items-center gap-3 rounded-[20px] border px-4 py-3.5"
        style={[styles.card, kind.card]}
      >
        <kind.Icon size={20} color={kind.icon} strokeWidth={2.2} />
        <Text className="flex-1 text-[14px] font-medium leading-5" style={{ color: kind.text }}>
          {toast.message}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

/** Position flottante et ombre du toast, que Tailwind n'exprime pas côté natif. */
const styles = StyleSheet.create({
  host: { position: "absolute", left: 16, right: 16, zIndex: 1000, elevation: 20 },
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
});
