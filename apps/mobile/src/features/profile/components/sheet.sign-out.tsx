import { HeartCrack } from "lucide-react-native";
import { View } from "react-native";

import { SheetText } from "../../../shared/components/atoms/text.sheet";
import { SheetActionRow } from "../../../shared/components/macros/row.sheet-actions";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
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
 * Feuille de déconnexion : elle dit au membre qu'on est désolé de le voir
 * partir et l'invite à rester, sans lui retirer la possibilité de partir.
 * @param props Visibilité et fermeture de la feuille.
 * @returns La feuille de déconnexion.
 */
export function SignOutSheet(props: SignOutSheetProps) {
  const { visible, onClose } = props;
  const signOut = useSessionStore((state) => state.signOut);
  const message = signOutMessage(useMemberStore((state) => state.name));
  const leave = () => {
    onClose();
    signOut();
  };

  return (
    <BottomSheet
      visible={visible}
      title="Vous partez déjà ?"
      onClose={onClose}
      footer={
        <SheetActionRow
          secondary={{ label: "Me déconnecter", onPress: leave }}
          primary={{ label: "Rester connecté", onPress: onClose }}
        />
      }
    >
      <View className="items-center gap-4">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-[#FDECEA]">
          <HeartCrack size={30} color={PALETTE.danger} strokeWidth={2} />
        </View>
        <SheetText>{message}</SheetText>
      </View>
    </BottomSheet>
  );
}
