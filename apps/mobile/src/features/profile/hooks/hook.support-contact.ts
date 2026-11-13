import { Linking } from "react-native";

import { useToastStore } from "../../../shared/feedback/store.toast";
import { SUPPORT_CONTACT } from "../model/config.support-contact";

/** Message affiché quand ni WhatsApp ni le téléphone ne s'ouvrent. */
const OPEN_FAILED = "Impossible d'ouvrir cette application. Écrivez-nous à support@mitemo.app.";

/**
 * Joint le service client par WhatsApp ou par un appel classique.
 * @returns Les moyens de contact configurés et l'ouverture d'un lien.
 */
export function useSupportContact() {
  const show = useToastStore((state) => state.show);

  const open = async (url: string): Promise<void> => {
    try {
      await Linking.openURL(url);
    } catch {
      show("error", OPEN_FAILED);
    }
  };

  return { contact: SUPPORT_CONTACT, open };
}
