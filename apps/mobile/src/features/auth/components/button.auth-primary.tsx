import { View } from "react-native";

import { FilledButtonFace } from "../../../shared/components/atoms/face.button-filled";
import { PressableScale } from "../../../shared/components/atoms/scale.pressable";
import { AUTH_COLORS } from "../model/model.auth-theme";

/** Props de l'action principale d'un écran d'authentification. */
export interface AuthPrimaryButtonProps {
  readonly label: string;
  readonly onPress: () => void;
  readonly disabled?: boolean;
}

/** Couleurs du bouton : bleu de l'authentification, bordure comprise, libellé blanc. */
const AUTH_BUTTON_COLORS = { background: AUTH_COLORS.button, foreground: AUTH_COLORS.sheet };

/**
 * Affiche l'action principale d'un écran d'authentification avec le même
 * dessin que les autres boutons pleins de l'application, atténuée quand elle
 * est désactivée.
 * @param props Libellé, action et état désactivé.
 * @returns Le bouton d'action.
 */
export function AuthPrimaryButton(props: AuthPrimaryButtonProps) {
  const { label, onPress, disabled = false } = props;

  return (
    <PressableScale accessibilityLabel={label} onPress={onPress} disabled={disabled}>
      <View style={disabled ? DISABLED_STYLE : undefined}>
        <FilledButtonFace label={label} colors={AUTH_BUTTON_COLORS} testID="auth-primary-face" />
      </View>
    </PressableScale>
  );
}

/** Atténuation du bouton désactivé. */
const DISABLED_STYLE = { opacity: 0.55 } as const;
