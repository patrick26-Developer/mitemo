import { Wifi, WifiOff } from "lucide-react-native";
import { Text, View } from "react-native";

import type { ConnectionStatus } from "../../model/model.connection-status";
import { PALETTE } from "../../theme/theme.palette";

/** Props de la barre de connexion. */
export interface ConnectionBarProps {
  readonly status: ConnectionStatus;
}

/** Apparence de la barre pour chaque état annoncé. */
const BAR_STYLES = {
  offline: { color: PALETTE.danger, label: "Vous n'êtes pas connecté à Internet", Icon: WifiOff },
  restored: { color: "#1F8A4C", label: "Connexion rétablie", Icon: Wifi },
} as const;

/**
 * Barre fine posée juste au-dessus des onglets : noire tant que le réseau est
 * coupé, verte quand il revient, absente le reste du temps.
 * @param props État de la connexion.
 * @returns La barre, ou rien quand l'appareil est connecté.
 */
export function ConnectionBar(props: ConnectionBarProps) {
  if (props.status === "online") return null;
  const { color, label, Icon } = BAR_STYLES[props.status];

  return (
    <View
      testID="connection-bar"
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      className="flex-row items-center justify-center gap-2 self-center rounded-full px-4 py-2"
      style={{ backgroundColor: color }}
    >
      <Icon size={14} color={PALETTE.white} strokeWidth={2.2} />
      <Text className="text-[13px] font-medium text-white">{label}</Text>
    </View>
  );
}
