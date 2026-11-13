import { HeartCrack } from "lucide-react-native";
import { Text, View } from "react-native";

import { SheetActionRow } from "../../../shared/components/macros/row.sheet-actions";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import { withTapSound } from "../../../shared/feedback/api.tap-sound";
import { useMemberStore } from "../../../shared/member/store.member";
import { useSessionStore } from "../../../shared/session/store.session";
import { PALETTE } from "../../../shared/theme/theme.palette";
import { signOutMessage } from "../model/model.sign-out";

/** Props de la feuille de déconnexion. */
export interface SignOutSheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
}

/**
 * Feuille de déconnexion : elle dit au membre, prénom en gras, qu'on est
 * désolé de le voir partir et l'invite à rester. « Je me déconnecte » reste
 * possible, bordé de rouge comme une action grave, avec un son d'au revoir.
 * @param props Visibilité et fermeture de la feuille.
 * @returns La feuille de déconnexion.
 */
export function SignOutSheet(props: SignOutSheetProps) {
  const { visible, onClose } = props;
  const signOut = useSessionStore((state) => state.signOut);
  const leave = withTapSound("farewell", () => {
    onClose();
    signOut();
  });

  return (
    <BottomSheet
      visible={visible}
      title="Vous partez déjà ?"
      icon={{ icon: HeartCrack, tone: "danger" }}
      onClose={onClose}
      footer={
        <SheetActionRow
          secondary={{ label: "Je me déconnecte", onPress: leave, tone: "danger" }}
          primary={{ label: "Je reste", onPress: onClose }}
        />
      }
    >
      <SignOutMessageView />
    </BottomSheet>
  );
}

/**
 * Excuses adressées au membre par son prénom, sous le cœur brisé et le titre.
 * @returns Le message de la feuille.
 */
function SignOutMessageView() {
  const { firstName, reasons } = signOutMessage(useMemberStore((state) => state.name));

  return (
    <View className="pb-2">
      <Text className="text-center text-[14px] leading-5 text-muted">
        Nous sommes désolés de vous voir partir
        {firstName === "" ? null : (
          <>
            {", "}
            <Text style={BOLD}>{firstName}</Text>
          </>
        )}
        {`. ${reasons}`}
      </Text>
    </View>
  );
}

/** Prénom en gras, porté par `style` pour rester vérifiable en test. */
const BOLD = { fontWeight: "700", color: PALETTE.ink } as const;
