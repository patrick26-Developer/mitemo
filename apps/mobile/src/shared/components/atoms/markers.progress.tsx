import { Text, View } from "react-native";

/** Nombre de marqueurs affichés au maximum ; au-delà, un compteur les résume. */
const MAX_MARKERS = 10;

/** Props de la progression en marqueurs d'une carte de pointage. */
export interface MarkerProgressProps {
  /** Marqueurs déjà validés. */
  readonly done: number;
  /** Nombre total de marqueurs de la carte. */
  readonly total: number;
  /** Pourcentage rempli du prochain marqueur, quand un versement l'entame. */
  readonly partial?: number;
}

/** Props d'un marqueur de la progression. */
interface MarkerProps {
  readonly filled: boolean;
  /** Vrai pour le premier marqueur non validé, que le versement en cours entame. */
  readonly isNext: boolean;
  /** Pourcentage rempli du prochain marqueur. */
  readonly partial: number;
}

/**
 * Remplit le marqueur en cours au prorata du versement déjà fait.
 * @param props Marqueur validé ou non, position et remplissage.
 * @returns Le marqueur, éventuellement partiellement rempli.
 */
function Marker(props: MarkerProps) {
  const { filled, isNext, partial } = props;
  const ratio = filled || !isNext ? 0 : Math.min(Math.max(partial, 0), 100);

  return (
    <View
      className={`h-3 w-3 overflow-hidden rounded-[3px] ${filled ? "bg-brand" : "bg-brand-veil"}`}
    >
      {ratio > 0 ? (
        <View className="h-full bg-brand" style={{ width: `${ratio}%` }} testID="marker-partial" />
      ) : null}
    </View>
  );
}

/**
 * Affiche la progression d'une carte sous forme de marqueurs validés, avec le
 * nombre de marqueurs non affichés quand la carte en compte plus de dix.
 * @param props Marqueurs validés, total et remplissage du marqueur en cours.
 * @returns Les marqueurs et leur compteur.
 */
export function MarkerProgress(props: MarkerProgressProps) {
  const { done, total, partial = 0 } = props;
  const visible = Math.min(Math.max(total, 0), MAX_MARKERS);
  const extra = Math.max(total - visible, 0);
  const markers = Array.from({ length: visible }, (_, index) => index < done);
  const label =
    partial > 0
      ? `${done} marqueurs validés sur ${total}, ${partial} % du suivant`
      : `${done} marqueurs validés sur ${total}`;

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: total, now: Math.min(done, total) }}
      className="flex-row flex-wrap items-center gap-1.5"
    >
      {markers.map((filled, index) => (
        <Marker key={`marker-${index}`} filled={filled} isNext={index === done} partial={partial} />
      ))}
      {extra > 0 ? <Text className="ml-1 text-[12px] text-muted">+{extra}</Text> : null}
    </View>
  );
}
