import { View } from "react-native";

/**
 * Remplace le sélecteur natif, absent sous Jest, par une vue inerte qui
 * transmet son `onChange` : un test simule un choix avec
 * `fireEvent(picker, "change", { type: "set" }, date)`.
 * @param {{ onChange?: (event: unknown, date?: Date) => void }} props Props du sélecteur.
 * @returns {import("react").ReactElement} La vue du sélecteur simulé.
 */
export default function DateTimePicker(props) {
  return <View testID="native-date-picker" onChange={props.onChange} />;
}

/** Dialogue natif d'Android, ouvert de façon impérative ; espionné par les tests. */
export const DateTimePickerAndroid = {
  /** Ouvre le dialogue simulé : ne fait rien hors de l'appareil. */
  open() {},
  /** Ferme le dialogue simulé : ne fait rien hors de l'appareil. */
  dismiss() {},
};
