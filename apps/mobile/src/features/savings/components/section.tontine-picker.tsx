import { SheetRow } from "../../../shared/components/atoms/row.sheet";
import { SheetSection } from "../../../shared/components/macros/section.sheet";
import type { Tontine } from "../../../shared/member/model.portfolio";

/** Props du choix de la tontine rattachée à une carte. */
export interface TontinePickerProps {
  readonly tontines: readonly Tontine[];
  /** Tontine sélectionnée, `null` quand la carte reste indépendante. */
  readonly selected: string | null;
  readonly onSelect: (tontineId: string | null) => void;
}

/**
 * Propose les tontines du membre et l'option « aucune », pour rattacher une
 * carte de pointage à la tontine dont elle réglera les cotisations.
 * @param props Tontines disponibles, sélection courante et choix.
 * @returns La section de sélection.
 */
export function TontinePicker(props: TontinePickerProps) {
  const { tontines, selected, onSelect } = props;

  return (
    <SheetSection title="Tontine rattachée">
      <SheetRow
        label="Aucune tontine"
        selected={selected === null}
        onPress={() => onSelect(null)}
      />
      {tontines.map((tontine) => (
        <SheetRow
          key={tontine.id}
          label={tontine.name}
          selected={selected === tontine.id}
          onPress={() => onSelect(tontine.id)}
        />
      ))}
    </SheetSection>
  );
}
