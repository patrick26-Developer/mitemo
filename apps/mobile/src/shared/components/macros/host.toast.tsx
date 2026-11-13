import { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { signalError } from "../../feedback/api.error-feedback";
import { useToastStore } from "../../feedback/store.toast";
import type { Toast } from "../../feedback/store.toast";
import { useMemberStore } from "../../member/store.member";
import { toastDuration, toastTitle } from "../../model/model.toast-content";
import { PALETTE } from "../../theme/theme.palette";
import { SHADOWS } from "../../theme/theme.shadow";
import { ToastLead } from "../atoms/lead.toast";
import { ToastText } from "../atoms/text.toast";

/** Départ du toast, juste au-dessus de sa place, en points. */
const TOAST_HIDDEN_OFFSET = -24;

/** Arrivée du toast : un glissement court et amorti, sans rebond. */
const TOAST_TIMING = { duration: 220, easing: Easing.out(Easing.cubic) };

/**
 * Fond de chaque nature de toast : un succès reprend le blanc des feuilles,
 * une erreur est entièrement rouge pour ne pas passer inaperçue.
 */
const KIND_CARDS = {
  success: { backgroundColor: PALETTE.white, borderColor: "#E4E7EE" },
  error: { backgroundColor: PALETTE.danger, borderColor: PALETTE.danger },
} as const;

/**
 * Affiche le toast courant en haut de l'écran, comme une notification : il
 * apparaît en fondu, sans rebond, et se retire tout seul (une seconde pour
 * une réussite, le temps de lire pour une erreur) ou au toucher. Une erreur
 * sonne et fait vibrer le téléphone.
 * @returns Le toast courant, ou rien.
 */
export function ToastHost() {
  const toast = useToastStore((state) => state.toast);
  const dismiss = useToastStore((state) => state.dismiss);

  useEffect(() => {
    if (toast === null) return undefined;
    if (toast.kind === "error") signalError();
    const timer = setTimeout(dismiss, toastDuration(toast.kind));
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
 * Carte du toast : d'abord la photo du membre (ou l'icône d'erreur), puis
 * un titre et la description.
 * @param props Toast à afficher et fermeture.
 * @returns La carte animée.
 */
function ToastCard(props: ToastCardProps) {
  const { toast, onPress } = props;
  const insets = useSafeAreaInsets();
  const title = toastTitle(
    toast.kind,
    useMemberStore((state) => state.name),
  );
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
        accessibilityLabel={`${title}. ${toast.message}`}
        accessibilityLiveRegion="polite"
        onPress={onPress}
        className="flex-row items-center gap-3 rounded-[20px] border px-3.5 py-3"
        style={[styles.card, KIND_CARDS[toast.kind]]}
      >
        <ToastLead kind={toast.kind} />
        <ToastText kind={toast.kind} title={title} message={toast.message} />
      </Pressable>
    </Animated.View>
  );
}

/** Position flottante et ombre du toast, identique sur iOS et Android. */
const styles = StyleSheet.create({
  host: { position: "absolute", left: 16, right: 16, zIndex: 1000, elevation: 20 },
  card: SHADOWS.toast,
});
