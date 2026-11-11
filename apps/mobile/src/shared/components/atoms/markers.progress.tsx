import { Text, View } from "react-native";

import { accentColors } from "../../model/model.accent-color";
import { PALETTE } from "../../theme/theme.palette";

/** Opacité des marqueurs pas encore validés, en suffixe hexadécimal (30 %). */
const EMPTY_ALPHA = "4D";

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
  /** Teinte de la carte : les marqueurs prennent sa nuance vive. */
  readonly accent?: string;
}

/** Props d'un marqueur de la progression. */
interface MarkerProps {
  readonly filled: boolean;
  /** Vrai pour le premier marqueur non validé, que le versement en cours entame. */
  readonly isNext: boolean;
  /** Pourcentage rempli du prochain marqueur. */
  readonly partial: number;
  /** Nuance vive de la carte, ou bleu de marque sans teinte. */
  readonly vivid: string;
}

/**
 * Remplit le marqueur en cours au prorata du versement déjà fait.
 * @param props Marqueur validé ou non, position et remplissage.
 * @returns Le marqueur, éventuellement partiellement rempli.
 */
function Marker(props: MarkerProps) {
  const { filled, isNext, partial, vivid } = props;
  const ratio = filled || !isNext ? 0 : Math.min(Math.max(partial, 0), 100);

  return (
    <View
      testID={filled ? "marker-filled" : "marker-empty"}
      className="h-3 w-3 overflow-hidden rounded-[3px]"
      style={{ backgroundColor: filled ? vivid : `${vivid}${EMPTY_ALPHA}` }}
    >
      {ratio > 0 ? (
        <View
          className="h-full"
          style={{ width: `${ratio}%`, backgroundColor: vivid }}
          testID="marker-partial"
        />
      ) : null}
    </View>
  );
}

/**
 * Affiche la progression d'une carte sous forme de marqueurs validés, avec le
 * nombre de marqueurs non affichés quand la carte en compte plus de dix.
 * @param props Marqueurs validés, total, remplissage du marqueur en cours et teinte.
 * @returns Les marqueurs et leur compteur.
 */
export function MarkerProgress(props: MarkerProgressProps) {
  const { done, total, partial = 0, accent } = props;
  const vivid = accent === undefined ? PALETTE.brand : accentColors(accent).background;
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
        <Marker
          key={`marker-${index}`}
          filled={filled}
          isNext={index === done}
          partial={partial}
          vivid={vivid}
        />
      ))}
      {extra > 0 ? <Text className="ml-1 text-[12px] text-muted">+{extra}</Text> : null}
    </View>
  );
}
