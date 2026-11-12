import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { CalendarDays } from "lucide-react-native";
import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";

import { formatDate } from "../../format/format.date";
import { fieldChrome } from "../../theme/theme.field";
import { PALETTE } from "../../theme/theme.palette";
import { BottomSheet } from "./sheet.bottom";

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
 * Convertit un jour ISO 8601 en date, à minuit UTC.
 * @param day Jour au format `AAAA-MM-JJ`.
 * @returns La date correspondante.
 */
function utcDate(day: string): Date {
  return new Date(`${day}T00:00:00.000Z`);
}

/**
 * Transmet le jour choisi quand le calendrier a été validé, et rien quand il a
 * été fermé sans choix.
 * @param onChange Réception du jour choisi.
 * @returns Le gestionnaire du calendrier natif.
 */
function pickHandler(onChange: (isoDate: string) => void) {
  return (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === "set" && date !== undefined) onChange(isoDay(date));
  };
}

/**
 * Affiche la date choisie dans un champ et ouvre le calendrier natif au
 * toucher, pour éviter toute saisie de date au clavier. Sur iOS, le calendrier
 * s'ouvre dans une seconde feuille, par-dessus le formulaire ; sur Android,
 * le dialogue natif s'ouvre une seule fois.
 * @param props Libellé, date, minimum, aide et changement.
 * @returns Le champ de date et son calendrier.
 */
export function SheetDateField(props: SheetDateFieldProps) {
  const { label, value, minimum, onChange, hint, invalid = false } = props;
  const [open, setOpen] = useState(false);
  const shown = utcDate(value === "" ? minimum : value);
  const pick = (isoDate: string) => {
    setOpen(false);
    onChange(isoDate);
  };
  const toggle = () => {
    if (Platform.OS !== "android") {
      setOpen(true);
      return;
    }
    DateTimePickerAndroid.open({
      value: shown,
      mode: "date",
      minimumDate: utcDate(minimum),
      onChange: pickHandler(onChange),
    });
  };

  return (
    <View className="gap-1.5">
      <Text className="text-[12px] font-semibold uppercase text-muted">{label}</Text>
      <DateTrigger label={label} value={value} open={open} invalid={invalid} onPress={toggle} />
      <BottomSheet visible={open} title={label} onClose={() => setOpen(false)}>
        <DateCalendar shown={shown} minimum={minimum} onPick={pick} />
      </BottomSheet>
      {hint === undefined ? null : <Text className="text-[12px] leading-4 text-muted">{hint}</Text>}
    </View>
  );
}

/** Props du champ qui affiche la date choisie. */
interface DateTriggerProps {
  readonly label: string;
  readonly value: string;
  readonly open: boolean;
  readonly invalid: boolean;
  readonly onPress: () => void;
}

/**
 * Affiche la date choisie dans un cadre de champ, ou l'invitation à choisir.
 * @param props Libellé, date, ouverture, erreur et toucher.
 * @returns Le champ touchable.
 */
function DateTrigger(props: DateTriggerProps) {
  const { label, value, open, invalid, onPress } = props;
  const empty = value === "";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label} : ${empty ? "aucune date" : formatDate(value)}`}
      accessibilityState={{ expanded: open }}
      testID="sheet-date-trigger"
      onPress={onPress}
      className="h-12 flex-row items-center justify-between rounded-[14px] border px-4"
      style={fieldChrome({ focused: open, invalid })}
    >
      <Text className={`text-[15px] ${empty ? "text-muted" : "text-ink"}`}>
        {empty ? "Choisir une date" : formatDate(value)}
      </Text>
      <CalendarDays size={16} color={open ? PALETTE.brand : PALETTE.muted} />
    </Pressable>
  );
}

/** Props du calendrier de la seconde feuille. */
interface DateCalendarProps {
  readonly shown: Date;
  readonly minimum: string;
  readonly onPick: (isoDate: string) => void;
}

/**
 * Calendrier natif d'iOS, dans la seconde feuille : toucher un jour le
 * retient et ferme la feuille, sans bouton de validation à part.
 * @param props Date affichée, minimum et choix.
 * @returns Le calendrier.
 */
function DateCalendar(props: DateCalendarProps) {
  const { shown, minimum, onPick } = props;

  return (
    <View
      testID="sheet-date-menu"
      className="overflow-hidden rounded-[14px] border border-card-border bg-white px-2"
    >
      <DateTimePicker
        value={shown}
        mode="date"
        display="inline"
        locale="fr-FR"
        themeVariant="light"
        accentColor={PALETTE.brand}
        minimumDate={utcDate(minimum)}
        onChange={pickHandler(onPick)}
      />
    </View>
  );
}
