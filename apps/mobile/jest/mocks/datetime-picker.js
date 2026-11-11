import { View } from "react-native";

/**
 * Remplace le sélecteur natif, absent sous Jest, par une vue inerte : le champ
 * de date se teste à travers sa feuille et son bouton de validation.
 * @returns {import("react").ReactElement} La vue du sélecteur simulé.
 */
export default function DateTimePicker() {
  return <View testID="native-date-picker" />;
}
