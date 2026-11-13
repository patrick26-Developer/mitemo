import { Circle, G, Path } from "react-native-svg";

import { MASCOT_COLORS as C } from "../../../shared/theme/theme.mascot";

/** Props d'un ami de Temo. */
interface FriendProps {
  readonly cx: number;
  readonly color: string;
}

/**
 * Petit ami rond, membre de la même tontine.
 * @param props Position et couleur de l'ami.
 * @returns L'ami.
 */
function Friend(props: FriendProps) {
  const { cx, color } = props;

  return (
    <G>
      <Circle cx={cx} cy={160} r={22} fill={color} />
      <Circle cx={cx - 7} cy={156} r={3.5} fill={C.ink} />
      <Circle cx={cx + 7} cy={156} r={3.5} fill={C.ink} />
      <Path
        d={`M${cx - 7} 166 Q${cx} 173 ${cx + 7} 166`}
        stroke={C.ink}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />
    </G>
  );
}

/**
 * Les amis de Temo, de part et d'autre : une tontine se fait en groupe.
 * @returns Les deux amis.
 */
export function MascotFriends() {
  return (
    <G testID="mascot-friends">
      <Friend cx={30} color={C.friendBlue} />
      <Friend cx={192} color={C.friendGreen} />
    </G>
  );
}
