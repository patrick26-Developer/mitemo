import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { ADMISSION_STORAGE_KEY } from "../../../shared/api/fetch.preview-admission";

/**
 * Conserve seulement le laissez-passer fourni par le testeur dans le trousseau.
 * @returns La saisie et son état d'enregistrement, sans clé serveur.
 */
export function usePreviewAdmission() {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const save = () => {
    if (!value.trim()) return;
    SecureStore.setItemAsync(ADMISSION_STORAGE_KEY, value.trim(), {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    }).then(
      () => {
        setValue("");
        setMessage("Admission enregistrée sur cet appareil.");
      },
      () => setMessage("Admission non enregistrée. Réessayez."),
    );
  };
  return { value, setValue, message, save };
}
