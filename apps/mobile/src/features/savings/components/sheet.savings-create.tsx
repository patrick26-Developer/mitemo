import { CalendarCheck, Coins, Link, Receipt, Target } from "lucide-react-native";
import { SheetDateField } from "../../../shared/components/macros/field.sheet-date";
import { SheetSelect } from "../../../shared/components/macros/field.sheet-select";
import { SheetNameField } from "../../../shared/components/macros/field.sheet-name";
import { SheetTextField } from "../../../shared/components/macros/field.sheet-text";
import { SheetStepsFooter } from "../../../shared/components/macros/footer.sheet-steps";
import { StepTransition } from "../../../shared/components/atoms/transition.step";
import type { FactItem } from "../../../shared/components/atoms/row.fact";
import { FactList } from "../../../shared/components/macros/list.facts";
import { BottomSheet } from "../../../shared/components/macros/sheet.bottom";
import { formatAmount } from "../../../shared/format/format.amount";
import type { Tontine } from "../../../shared/member/model.portfolio";
import { CARD_FEE_PERCENT } from "../../../shared/member/model.card-fee";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { tomorrowUtc } from "../../../shared/model/model.clock";
import { FREQUENCY_SELECT_GROUPS } from "../../../shared/model/model.frequency";
import { useSavingsCreate } from "../hooks/hook.savings-create";
import type {
  SavingsFormState,
  SavingsInvalidFields,
  SavingsRecap,
} from "../model/model.savings-form";
import {
  SAVINGS_FORM_STEPS,
  savingsInvalidFields,
  savingsRecap,
} from "../model/model.savings-form";
import {
  NO_TONTINE,
  linkedTontineName,
  tontineIdOf,
  tontineLinkGroups,
} from "../model/model.tontine-link";

/** Props de la feuille de création d'une carte de pointage. */
export interface SavingsCreateSheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
}

/** Props des champs de la carte en cours de saisie. */
interface SavingsCreateFieldsProps {
  readonly form: SavingsFormState;
  readonly invalid: SavingsInvalidFields;
  readonly tontines: readonly Tontine[];
  readonly onChange: (patch: Partial<SavingsFormState>) => void;
}

/**
 * Première étape : le nom, l'objectif et le montant proposé par pointage.
 * @param props Saisie courante et mise à jour des champs.
 * @returns Les champs du projet.
 */
function SavingsProjectStep(props: SavingsCreateFieldsProps) {
  const { form, invalid, onChange } = props;

  return (
    <>
      <SheetNameField
        value={form.name}
        onChangeText={(name) => onChange({ name })}
        hint="Pour reconnaître cette carte dans vos listes."
        invalid={invalid.name}
      />
      <SheetTextField
        label="Objectif (FCFA)"
        value={form.goal}
        onChangeText={(goal) => onChange({ goal })}
        keyboardType="number-pad"
        placeholder="30000"
        hint="Le montant que vous voulez réunir."
        invalid={invalid.goal}
      />
      <SheetTextField
        label="Montant par pointage (FCFA)"
        value={form.markerAmount}
        onChangeText={(markerAmount) => onChange({ markerAmount })}
        keyboardType="number-pad"
        placeholder="5000"
        hint="Ce que vous mettez de côté à chaque pointage."
        invalid={invalid.markerAmount}
      />
    </>
  );
}

/**
 * Construit les lignes du récapitulatif d'une carte en cours de saisie.
 * @param recap Valeurs calculées à partir du formulaire.
 * @param tontine Nom de la tontine rattachée, `null` sans tontine.
 * @returns Les lignes affichables, dans l'ordre choisi.
 */
function recapRows(recap: SavingsRecap, tontine: string | null): readonly FactItem[] {
  const rows = [
    tontine === null
      ? null
      : { id: "tontine", icon: Link, label: "Tontine rattachée", value: tontine },
    recap.goal === null
      ? null
      : { id: "goal", icon: Target, label: "Objectif", value: `${formatAmount(recap.goal)} FCFA` },
    recap.fee === null
      ? null
      : {
          id: "fee",
          icon: Receipt,
          label: `Frais Mitemo (${CARD_FEE_PERCENT} %)`,
          value: `${formatAmount(recap.fee)} FCFA`,
        },
    recap.markerAmount === null
      ? null
      : {
          id: "marker",
          icon: Coins,
          label: "Par pointage",
          value: `${formatAmount(recap.markerAmount)} FCFA`,
        },
    recap.markers === null
      ? null
      : {
          id: "markers",
          icon: CalendarCheck,
          label: "Pointages prévus",
          value: `${recap.markers}`,
        },
  ];

  return rows.flatMap((row) => (row === null ? [] : [row]));
}

/**
 * Deuxième étape : le rythme des pointages, l'échéance au calendrier et la
 * tontine rattachée, choisie dans une liste.
 * @param props Saisie courante, tontines disponibles et mise à jour des champs.
 * @returns Les champs du rythme.
 */
function SavingsRhythmStep(props: SavingsCreateFieldsProps) {
  const { form, invalid, tontines, onChange } = props;

  return (
    <>
      <SheetSelect
        label="Fréquence des pointages"
        groups={FREQUENCY_SELECT_GROUPS}
        value={form.cadence}
        onChange={(cadence) => onChange({ cadence })}
        hint="Le rythme auquel vous mettez de côté."
      />
      <SheetDateField
        label="Échéance"
        value={form.deadline}
        minimum={tomorrowUtc()}
        onChange={(deadline) => onChange({ deadline })}
        hint="Dernier jour pour atteindre l'objectif."
        invalid={invalid.deadline}
      />
      <SheetSelect
        label="Tontine rattachée"
        groups={tontineLinkGroups(tontines)}
        value={form.tontineId ?? NO_TONTINE}
        onChange={(value) => onChange({ tontineId: tontineIdOf(value) })}
        hint="La carte peut régler les cotisations de cette tontine."
      />
    </>
  );
}

/**
 * Dernière étape, pour valider seulement : tout ce qu'il faut savoir de la
 * carte avant de la créer.
 * @param props Saisie courante et tontines du membre.
 * @returns Le récapitulatif de la carte.
 */
function SavingsRecapStep(props: SavingsCreateFieldsProps) {
  const { form, tontines } = props;
  const tontine = linkedTontineName(tontines, form.tontineId);

  return <FactList items={recapRows(savingsRecap(form, new Date()), tontine)} />;
}

/** Contenu de chaque étape, dans l'ordre de SAVINGS_FORM_STEPS. */
const STEP_CONTENTS = [SavingsProjectStep, SavingsRhythmStep, SavingsRecapStep];

/** Props de l'étape affichée. */
interface SavingsStepProps {
  readonly index: number;
  readonly fields: SavingsCreateFieldsProps;
}

/**
 * Affiche le contenu de l'étape courante.
 * @param props Rang de l'étape et champs de la carte.
 * @returns Les champs ou le récapitulatif de l'étape.
 */
function SavingsStep(props: SavingsStepProps) {
  const Content = STEP_CONTENTS[props.index] ?? SavingsProjectStep;

  return <Content {...props.fields} />;
}

/**
 * Saisit les règles d'une nouvelle carte en deux étapes et la crée dans le
 * portefeuille, avec autant de pointages que le rythme en permet.
 * @param props Visibilité et fermeture de la feuille.
 * @returns La feuille « Nouvelle carte ».
 */
export function SavingsCreateSheet(props: SavingsCreateSheetProps) {
  const { form, error, steps, update, next, back, close } = useSavingsCreate(props.onClose);
  const tontines = usePortfolioStore((state) => state.tontines);
  const flags = savingsInvalidFields(form);
  const invalid: SavingsInvalidFields = {
    name: error !== null && flags.name,
    goal: error !== null && flags.goal,
    markerAmount: error !== null && flags.markerAmount,
    deadline: error !== null && flags.deadline,
  };

  return (
    <BottomSheet
      visible={props.visible}
      title="Nouvelle carte"
      onClose={close}
      steps={{
        index: steps.index,
        total: steps.total,
        title: SAVINGS_FORM_STEPS[steps.index] ?? "",
      }}
      footer={
        <SheetStepsFooter
          isFirst={steps.isFirst}
          isLast={steps.isLast}
          finalLabel="Créer la carte"
          onBack={back}
          onNext={next}
        />
      }
    >
      <StepTransition index={steps.index}>
        <SavingsStep index={steps.index} fields={{ form, invalid, tontines, onChange: update }} />
      </StepTransition>
    </BottomSheet>
  );
}
