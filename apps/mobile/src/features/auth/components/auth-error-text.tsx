import { StyleSheet, Text } from "react-native";

import { AUTH_COLORS } from "../model/auth-theme";

/** Props du message d'erreur d'un formulaire d'authentification. */
export interface AuthErrorTextProps {
  readonly message: string;
}

/**
 * Affiche une erreur de saisie, annoncée aux lecteurs d'écran.
 * @param props Message à afficher ; vide, rien n'est rendu.
 * @returns Le message d'erreur, ou `null`.
 */
export function AuthErrorText(props: AuthErrorTextProps) {
  const { message } = props;

  if (message === "") return null;

  return (
    <Text accessibilityRole="alert" style={styles.error}>
      {message}
    </Text>
  );
}

/** Style du message d'erreur, aligné sur le champ précédent. */
const styles = StyleSheet.create({
  error: {
    marginTop: 2,
    marginBottom: 12,
    fontSize: 13,
    fontWeight: "500",
    color: AUTH_COLORS.ink,
  },
});
