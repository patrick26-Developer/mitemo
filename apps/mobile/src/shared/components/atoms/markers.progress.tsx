import { Text, View } from "react-native";

/** Nombre de marqueurs affichés au maximum ; au-delà, un compteur les résume. */
const MAX_MARKERS = 10;

/** Props de la progression en marqueurs d'une carte de pointage. */
export interface MarkerProgressProps {
  /** Marqueurs déjà validés. */
  readonly done: number;
  /** Nombre total de marqueurs de la carte. */
  readonly total: number;
}

/**
 * Affiche la progression d'une carte sous forme de marqueurs validés, avec le
 * nombre de marqueurs non affichés quand la carte en compte plus de dix.
 * @param props Marqueurs validés et total.
 * @returns Les marqueurs et leur compteur.
 */
export function MarkerProgress(props: MarkerProgressProps) {
  const { done, total } = props;
  const visible = Math.min(Math.max(total, 0), MAX_MARKERS);
  const extra = Math.max(total - visible, 0);
  const markers = Array.from({ length: visible }, (_, index) => index < done);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={`${done} marqueurs validés sur ${total}`}
      accessibilityValue={{ min: 0, max: total, now: Math.min(done, total) }}
      className="flex-row flex-wrap items-center gap-1.5"
    >
      {markers.map((filled, index) => (
        <View
          key={`marker-${index}`}
          className={`h-3 w-3 rounded-[3px] ${filled ? "bg-brand" : "bg-brand-veil"}`}
        />
      ))}
      {extra > 0 ? <Text className="ml-1 text-[12px] text-muted">+{extra}</Text> : null}
    </View>
  );
}
