import { LockKeyhole, ShieldAlert } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { SheetText } from "../../../shared/components/atoms/text.sheet";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import { useMemberStore } from "../../../shared/member/store.member";
import { firstNameOf } from "../../../shared/model/model.first-name";
import { useSessionStore } from "../../../shared/session/store.session";
import { PALETTE } from "../../../shared/theme/theme.palette";
import { isSuspended } from "../model/model.pin-attempts";
import { usePinAttemptsStore } from "../model/store.pin-attempts";
import { PinConfirm } from "./confirm.pin";
import { SwitchAccountLink } from "./link.switch-account";

/**
 * Verrou de la session : après une inactivité ou au démarrage suivant, une
 * feuille qui ne se ferme pas demande seulement le code PIN, pas le numéro.
 * Un rideau cache l'application derrière elle. « Changer de compte » ferme
 * la session et ramène au numéro de téléphone.
 * @returns Le verrou, ou rien quand la session n'est pas verrouillée.
 */
export function PinLockSheet() {
  const visible = useSessionStore((state) => state.signedIn && state.locked);
  const unlock = useSessionStore((state) => state.unlock);
  const signOut = useSessionStore((state) => state.signOut);
  const name = useMemberStore((state) => state.name);
  const phone = useMemberStore((state) => state.phone);
  const suspended = usePinAttemptsStore((state) => isSuspended(state.failures[phone] ?? 0));
  if (!visible) return null;

  return (
    <>
      <View testID="pin-lock-curtain" style={styles.curtain} />
      <BottomSheet
        visible
        dismissible={false}
        title={suspended ? "Compte suspendu" : lockTitle(name)}
        icon={suspended ? SUSPENDED_ICON : LOCK_ICON}
        onClose={unlock}
      >
        {suspended ? null : <SheetText>Saisissez votre code PIN pour reprendre.</SheetText>}
        <PinConfirm onConfirmed={unlock} suspendedHeading={false} />
        {suspended ? null : <SwitchAccountLink onPress={signOut} />}
      </BottomSheet>
    </>
  );
}

/** Cadenas du verrou. */
const LOCK_ICON = { icon: LockKeyhole, tone: "brand" } as const;

/** Bouclier d'un compte suspendu. */
const SUSPENDED_ICON = { icon: ShieldAlert, tone: "danger" } as const;

/**
 * Titre du verrou, adressé au membre par son prénom.
 * @param name Nom complet du membre.
 * @returns Par exemple « Bon retour, Grâce ».
 */
function lockTitle(name: string): string {
  const firstName = firstNameOf(name);

  return firstName === "" ? "Bon retour" : `Bon retour, ${firstName}`;
}

const styles = StyleSheet.create({
  curtain: { ...StyleSheet.absoluteFill, backgroundColor: PALETTE.white },
});
