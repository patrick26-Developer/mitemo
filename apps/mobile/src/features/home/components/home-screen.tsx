import { StyleSheet, Text, View } from "react-native";

/**
 * Écran d'accueil : présente Mitemo avant la connexion.
 * @returns L'écran d'accueil.
 */
export function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        Mitemo
      </Text>
      <Text style={styles.tagline}>
        L&apos;épargne solidaire connectée : vos tontines et caisses de solidarité, sécurisées et
        numériques, pour gérer votre épargne collective en toute confiance.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, gap: 12 },
  title: { fontSize: 32, fontWeight: "700" },
  tagline: { fontSize: 16, lineHeight: 24 },
});
