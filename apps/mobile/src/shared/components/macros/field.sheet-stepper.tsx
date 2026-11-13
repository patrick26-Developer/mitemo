import { Minus, Plus } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { withTapSound } from "../../feedback/api.tap-sound";
import { fieldChrome } from "../../theme/theme.field";
import { PALETTE } from "../../theme/theme.palette";

/** Props d'un compteur de feuille. */
export interface SheetStepperProps {
  readonly label: string;
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly onChange: (value: number) => void;
  /** Explication affichée sous le champ. */
  readonly hint?: string;
  /** Signale une saisie refusée : bordure et anneau rouges. */
  readonly invalid?: boolean;
}

/** Props d'un bouton du compteur. */
interface StepButtonProps {
  readonly label: string;
  readonly icon: typeof Plus;
  readonly disabled: boolean;
  readonly onPress: () => void;
  readonly testID: string;
}

/**
 * Affiche un bouton d'incrément ou de décrément, désactivé à la borne.
 * @param props Libellé accessible, icône, état et action.
 * @returns Le bouton du compteur.
 */
function StepButton(props: StepButtonProps) {
  const { label, icon: Icon, disabled, onPress, testID } = props;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      testID={testID}
      onPress={onPress}
      className={`h-9 w-9 items-center justify-center rounded-full ${
        disabled ? "bg-field" : "bg-brand-veil"
      }`}
    >
      <Icon size={16} color={disabled ? PALETTE.muted : PALETTE.brand} strokeWidth={2.6} />
    </Pressable>
  );
}

/**
 * Affiche un nombre réglé par deux boutons, sans clavier : les bornes de la
 * règle métier restent visibles et infranchissables.
 * @param props Libellé, valeur, bornes, aide et changement.
 * @returns Le compteur de feuille.
 */
export function SheetStepper(props: SheetStepperProps) {
  const { label, value, min, max, onChange, hint, invalid = false } = props;
  const decrease = () => onChange(Math.max(value - 1, min));
  const increase = withTapSound("add", () => onChange(Math.min(value + 1, max)));

  return (
    <View className="gap-1.5">
      <Text className="text-[12px] font-semibold uppercase text-muted">{label}</Text>
      <View
        className="h-12 flex-row items-center justify-between rounded-[14px] border px-3"
        style={fieldChrome({ focused: false, invalid })}
      >
        <StepButton
          label={`Diminuer ${label}`}
          icon={Minus}
          disabled={value <= min}
          onPress={decrease}
          testID="stepper-decrease"
        />
        <Text
          accessibilityLabel={`${label} : ${value}`}
          testID="stepper-value"
          className="text-[16px] font-semibold text-ink"
        >
          {value}
        </Text>
        <StepButton
          label={`Augmenter ${label}`}
          icon={Plus}
          disabled={value >= max}
          onPress={increase}
          testID="stepper-increase"
        />
      </View>
      {hint === undefined ? null : <Text className="text-[12px] leading-4 text-muted">{hint}</Text>}
    </View>
  );
}
