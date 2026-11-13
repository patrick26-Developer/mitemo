import { useEffect } from "react";
import { Linking } from "react-native";

import { useToastStore } from "../../../shared/feedback/store.toast";
import { supportApi } from "../api/config.support";
import { isSupportCacheFresh } from "../model/model.support-cache";
import { parseSupportContact } from "../model/model.support-contact";
import { useSupportContactStore } from "../model/store.support-contact";

/** Message affiché quand ni WhatsApp ni le téléphone ne s'ouvrent. */
const OPEN_FAILED = "Impossible d'ouvrir cette application. Écrivez-nous à support@mitemo.app.";

/**
 * Redemande le numéro au backend quand le cache est vide ou expiré. Un échec
 * garde l'ancien numéro : mieux vaut un numéro un peu ancien que rien.
 */
async function refreshSupportContact(): Promise<void> {
  const { cache, save } = useSupportContactStore.getState();
  if (isSupportCacheFresh(cache, Date.now())) return;
  try {
    save(await supportApi.contact(), Date.now());
  } catch {
    return;
  }
}

/**
 * Joint le service client par WhatsApp ou par un appel classique, avec le
 * numéro fourni par le backend et gardé en cache.
 * @returns Les moyens de contact connus et l'ouverture d'un lien.
 */
export function useSupportContact() {
  const show = useToastStore((state) => state.show);
  const phoneNumber = useSupportContactStore((state) => state.cache?.phoneNumber);
  useEffect(() => {
    void refreshSupportContact();
  }, []);

  const open = async (url: string): Promise<void> => {
    try {
      await Linking.openURL(url);
    } catch {
      show("error", OPEN_FAILED);
    }
  };

  return { contact: parseSupportContact(phoneNumber), open };
}
