import DateTimePicker from "@react-native-community/datetimepicker";
import { CalendarDays } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { formatDate } from "../../format/format.date";
import { fieldChrome } from "../../theme/theme.field";
import { PALETTE } from "../../theme/theme.palette";
import { SheetActionRow } from "./row.sheet-actions";

/** Props d'un champ de date de feuille. */
export interface SheetDateFieldProps {
  readonly label: string;
  /** Date choisie, en ISO 8601 UTC (`AAAA-MM-JJ`), ou chaîne vide. */
  readonly value: string;
  /** Première date proposée, en ISO 8601 UTC. */
  readonly minimum: string;
  readonly onChange: (isoDate: string) => void;
  /** Explication affichée sous le champ. */
  readonly hint?: string;
  /** Signale une saisie refusée : bordure et anneau rouges. */
  readonly invalid?: boolean;
}

/**
 * Convertit une date en jour ISO 8601 UTC.
 * @param date Date à convertir.
 * @returns Le jour, au format `AAAA-MM-JJ`.
 */
function isoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Ouvre le calendrier à la date choisie, ou à la première date permise.
 * @param value Date actuelle, éventuellement vide.
 * @param minimum Première date proposée.
 * @returns La date affichée par le calendrier.
 */
function initialDate(value: string, minimum: string): Date {
  return new Date(`${value === "" ? minimum : value}T00:00:00.000Z`);
}

/**
 * Affiche la date choisie et ouvre le calendrier natif au toucher, pour éviter
 * toute saisie de date au clavier.
 * @param props Libellé, date, minimum, aide et changement.
 * @returns Le champ de date et son calendrier.
 */
export function SheetDateField(props: SheetDateFieldProps) {
  const { label, value, minimum, onChange, hint, invalid = false } = props;
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<Date>(() => initialDate(value, minimum));
  const show = () => {
    setPending(initialDate(value, minimum));
    setOpen(true);
  };

  return (
    <View className="gap-1.5">
      <Text className="text-[12px] font-semibold uppercase text-muted">{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label} : ${value === "" ? "aucune date" : formatDate(value)}`}
        testID="sheet-date-trigger"
        onPress={show}
        className="h-12 flex-row items-center justify-between rounded-[14px] border px-4"
        style={fieldChrome({ focused: open, invalid })}
      >
        <Text className={`text-[15px] ${value === "" ? "text-muted" : "text-ink"}`}>
          {value === "" ? "Choisir une date" : formatDate(value)}
        </Text>
        <CalendarDays size={16} color={PALETTE.muted} />
      </Pressable>
      {hint === undefined ? null : <Text className="text-[12px] leading-4 text-muted">{hint}</Text>}
      <DateMenu
        label={label}
        visible={open}
        pending={pending}
        minimum={minimum}
        onPending={setPending}
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          onChange(isoDay(pending));
          setOpen(false);
        }}
      />
    </View>
  );
}

/** Props de la carte du calendrier. */
interface DateCardProps {
  readonly label: string;
  readonly pending: Date;
  readonly minimum: string;
  readonly onPending: (date: Date) => void;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
}

/**
 * Affiche le calendrier natif, la date choisie et les actions de validation.
 * @param props Libellé, date en cours, minimum et actions.
 * @returns La carte du calendrier.
 */
function DateCard(props: DateCardProps) {
  const { label, pending, minimum, onPending, onCancel, onConfirm } = props;

  return (
    <View
      testID="sheet-date-menu"
      className="gap-4 rounded-t-[26px] border border-card-border bg-white px-5 pb-6 pt-4"
    >
      <Text accessibilityRole="header" className="text-[17px] font-bold text-ink">
        {label}
      </Text>
      <DateTimePicker
        value={pending}
        mode="date"
        display="spinner"
        locale="fr-FR"
        minimumDate={new Date(`${minimum}T00:00:00.000Z`)}
        onChange={(_event, date) => {
          if (date !== undefined) onPending(date);
        }}
      />
      <SheetActionRow
        secondary={{ label: "Annuler", onPress: onCancel }}
        primary={{ label: "Valider", onPress: onConfirm }}
      />
    </View>
  );
}
/** Props du calendrier ouvert d'un champ de date. */
interface DateMenuProps {
  readonly label: string;
  readonly visible: boolean;
  readonly pending: Date;
  readonly minimum: string;
  readonly onPending: (date: Date) => void;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
}

/**
 * Affiche le calendrier natif dans une feuille montante, avec validation.
 * @param props Libellé, visibilité, date en cours et actions.
 * @returns Le calendrier ouvert.
 */
function DateMenu(props: DateMenuProps) {
  const { label, visible, pending, minimum, onPending, onCancel, onConfirm } = props;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-end">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fermer le calendrier"
          className="absolute inset-0 bg-ink/60"
          onPress={onCancel}
        />
        <DateCard
          label={label}
          pending={pending}
          minimum={minimum}
          onPending={onPending}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </View>
    </Modal>
  );
}
