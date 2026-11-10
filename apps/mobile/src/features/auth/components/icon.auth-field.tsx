import { DrawIcon } from "../../../shared/components/atoms/icon.draw";

/** Icônes affichées dans les champs d'authentification. */
export const AUTH_FIELD_ICON_KINDS = ["person", "work", "phone"] as const;

/** Type d'icône d'un champ d'authentification. */
export type AuthFieldIconKind = (typeof AUTH_FIELD_ICON_KINDS)[number];

/**
 * Traits de chaque icône, dessinés l'un après l'autre. Les tracés reprennent
 * les formes filaires de la bibliothèque Lucide pour rester cohérents avec le
 * reste de l'application.
 */
const ICON_PATHS: Readonly<Record<AuthFieldIconKind, readonly string[]>> = {
  person: ["M17 8a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z", "M20 21a8 8 0 0 0-16 0"],
  work: [
    "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",
    "M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z",
  ],
  phone: [
    "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
  ],
};

/** Props d'une icône de champ d'authentification. */
export interface AuthFieldIconProps {
  readonly kind: AuthFieldIconKind;
  readonly color: string;
  /** Délai avant le dessin, en millisecondes. */
  readonly delay?: number;
  readonly testID?: string | undefined;
}

/**
 * Dessine l'icône d'un champ trait par trait à l'ouverture de l'écran.
 * @param props Type d'icône, couleur et délai de départ.
 * @returns L'icône animée.
 */
export function AuthFieldIcon(props: AuthFieldIconProps) {
  const { kind, color, delay = 0, testID } = props;

  return (
    <DrawIcon
      testID={testID}
      paths={ICON_PATHS[kind]}
      color={color}
      size={20}
      strokeWidth={1.8}
      delay={delay}
    />
  );
}
