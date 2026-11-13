/** Durées d'inactivité proposées avant le verrouillage, en minutes. */
export const AUTO_LOCK_CHOICES = [1, 5, 15, 30] as const;

/** Durée d'inactivité proposée. Voir {@link AUTO_LOCK_CHOICES}. */
export type AutoLockMinutes = (typeof AUTO_LOCK_CHOICES)[number];

/** Durée par défaut : 5 minutes. */
export const DEFAULT_AUTO_LOCK_MINUTES: AutoLockMinutes = 5;

/** Une minute, en millisecondes. */
const MINUTE_MS = 60_000;

/** Instants comparés pour décider du verrouillage. */
export interface IdleCheck {
  /** Dernier geste du membre, en millisecondes depuis l'époque Unix. */
  readonly lastActivity: number;
  /** Instant présent, en millisecondes depuis l'époque Unix. */
  readonly now: number;
  /** Durée d'inactivité tolérée, en minutes. */
  readonly minutes: number;
}

/**
 * Indique si le membre est resté inactif trop longtemps.
 * @param check Dernier geste, instant présent et durée tolérée.
 * @returns `true` quand la session doit se verrouiller.
 */
export function isIdleTooLong(check: IdleCheck): boolean {
  return check.now - check.lastActivity >= check.minutes * MINUTE_MS;
}

/**
 * Libellé d'une durée de verrouillage.
 * @param minutes Durée en minutes.
 * @returns Par exemple « Après 5 minutes ».
 */
export function autoLockLabel(minutes: number): string {
  return `Après ${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
}

/**
 * Durées proposées dans la liste du profil.
 * @returns Un groupe unique, une option par durée.
 */
export function autoLockGroups(): readonly {
  readonly title: string;
  readonly options: readonly { readonly value: string; readonly label: string }[];
}[] {
  return [
    {
      title: "Verrouiller après",
      options: AUTO_LOCK_CHOICES.map((minutes) => ({
        value: String(minutes),
        label: autoLockLabel(minutes),
      })),
    },
  ];
}

/**
 * Traduit le choix de la liste en durée.
 * @param value Valeur choisie.
 * @returns La durée, ou celle par défaut pour une valeur inconnue.
 */
export function autoLockMinutesOf(value: string): AutoLockMinutes {
  return (
    AUTO_LOCK_CHOICES.find((minutes) => String(minutes) === value) ?? DEFAULT_AUTO_LOCK_MINUTES
  );
}
