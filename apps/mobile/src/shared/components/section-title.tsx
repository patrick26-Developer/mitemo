import { ChevronRight } from "lucide-react-native";
import { Pressable, Text } from "react-native";

import { PALETTE } from "../../shared/theme/palette";

/** Teinte du titre, choisie selon le fond sur lequel il est posé. */
export type SectionTitleTone = "light" | "dark";

/** Props du titre de section. */
export interface SectionTitleProps {
  readonly label: string;
  /** `light` sur fond sombre, `dark` sur fond clair. */
  readonly tone?: SectionTitleTone;
  readonly onPress?: () => void;
}

/** Classes et couleur d'icône de chaque teinte. */
const TONES: Readonly<Record<SectionTitleTone, { classes: string; color: string }>> = {
  light: { classes: "text-white", color: PALETTE.white },
  dark: { classes: "text-ink", color: PALETTE.ink },
};

/** Décalage du chevron, aligné optiquement sur la ligne de base du libellé. */
const CHEVRON_STYLE = { marginTop: 2 };

/**
 * Affiche le titre d'une section, suivi d'un chevron.
 * @param props Libellé, teinte et action de la section.
 * @returns Le titre cliquable.
 */
export function SectionTitle(props: SectionTitleProps) {
  const { label, tone = "dark", onPress } = props;
  const { classes, color } = TONES[tone];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={8}
      className="mb-2.5 flex-row items-center gap-0.5 self-start px-4"
    >
      <Text className={`text-[16px] font-medium ${classes}`}>{label}</Text>
      <ChevronRight size={16} color={color} strokeWidth={3} style={CHEVRON_STYLE} />
    </Pressable>
  );
}
