import { ChevronLeft } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { PressableScale } from "../../../shared/components/pressable-scale";
import { AUTH_COLORS, AUTH_ENTRANCE_DELAY, AUTH_ENTRANCE_DURATION } from "../model/auth-theme";

/** Props de l'en-tête d'un écran d'authentification. */
export interface AuthHeadingProps {
  readonly title: string;
  readonly subtitle: string;
  /** Retour à l'étape précédente ; absent sur le premier écran. */
  readonly onBack?: () => void;
}

/**
 * Affiche le retour éventuel, le titre et le sous-titre de l'étape.
 * @param props Titre, sous-titre et retour.
 * @returns L'en-tête animé.
 */
export function AuthHeading(props: AuthHeadingProps) {
  const { title, subtitle, onBack } = props;

  return (
    <View>
      {onBack === undefined ? null : (
        <PressableScale
          accessibilityLabel="Retour"
          onPress={onBack}
          className="mb-2 h-10 w-10 rounded-full"
        >
          <View style={styles.back}>
            <ChevronLeft size={22} color={AUTH_COLORS.body} strokeWidth={2.2} />
          </View>
        </PressableScale>
      )}
      <Animated.Text
        accessibilityRole="header"
        entering={FadeInDown.delay(AUTH_ENTRANCE_DELAY.title).duration(AUTH_ENTRANCE_DURATION)}
        style={styles.title}
      >
        {title}
      </Animated.Text>
      <Animated.Text
        entering={FadeInDown.delay(AUTH_ENTRANCE_DELAY.subtitle).duration(AUTH_ENTRANCE_DURATION)}
        style={styles.subtitle}
      >
        {subtitle}
      </Animated.Text>
    </View>
  );
}

/** Styles du titre et du sous-titre de la maquette. */
const styles = StyleSheet.create({
  back: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: AUTH_COLORS.field,
  },
  title: {
    marginTop: 10,
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: -0.5,
    color: AUTH_COLORS.ink,
  },
  subtitle: {
    marginTop: 14,
    marginBottom: 30,
    fontSize: 16,
    lineHeight: 24,
    color: AUTH_COLORS.body,
  },
});
