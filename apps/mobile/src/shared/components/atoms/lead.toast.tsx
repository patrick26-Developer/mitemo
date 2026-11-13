import { CircleAlert, Check } from "lucide-react-native";
import { View } from "react-native";

import type { FeedbackKind } from "./banner.feedback";
import { MemberPhoto } from "./photo.member";
import { useMemberStore } from "../../member/store.member";
import { PALETTE } from "../../theme/theme.palette";

/** Vert de la pastille de réussite. */
const SUCCESS_GREEN = "#1F8A4C";

/** Props du visuel d'un toast. */
export interface ToastLeadProps {
  readonly kind: FeedbackKind;
}

/**
 * Visuel en tête du toast : la photo du membre, marquée d'une coche verte,
 * après une réussite ; l'icône d'alerte après une erreur.
 * @param props Nature du toast.
 * @returns Le visuel.
 */
export function ToastLead(props: ToastLeadProps) {
  const name = useMemberStore((state) => state.name);
  const initial = useMemberStore((state) => state.avatarInitial);
  const photoUri = useMemberStore((state) => state.photoUri);
  if (props.kind === "error")
    return <CircleAlert size={28} color={PALETTE.white} strokeWidth={2} />;

  return (
    <View testID="toast-avatar">
      <MemberPhoto
        photoUri={photoUri}
        initial={initial}
        seed={name}
        size={40}
        testID="toast-photo"
      />
      <View
        className="absolute -bottom-0.5 -right-0.5 h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-white"
        style={{ backgroundColor: SUCCESS_GREEN }}
      >
        <Check size={10} color={PALETTE.white} strokeWidth={3.5} />
      </View>
    </View>
  );
}
