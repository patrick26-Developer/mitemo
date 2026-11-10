/** Couleurs du parcours d'authentification, reprises de la maquette. */
export const AUTH_COLORS = {
  background: "#1136B3",
  button: "#0A3BE0",
  sheet: "#FFFFFF",
  ink: "#0D0D12",
  body: "#1A1A22",
  muted: "#6B6F7B",
  field: "#F6F7FB",
  border: "#C8CCDD",
  key: "#EAEDF1",
  keyIcon: "#5B5F6B",
  placeholder: "#9AA0B2",
  dash: "#B8BCCB",
  decor: "rgba(255,255,255,0.35)",
  sheetBorder: "rgba(0,0,0,0.1)",
  handle: "#8E9099",
  shadow: "#0A3BE0",
  gridLine: "rgba(255, 255, 255, 0.10)",
} as const;

/** Délais d'apparition des blocs d'un écran, en millisecondes. */
export const AUTH_ENTRANCE_DELAY = {
  title: 250,
  subtitle: 330,
  body: 410,
  action: 490,
  footer: 570,
} as const;

/** Durée d'une apparition, en millisecondes. */
export const AUTH_ENTRANCE_DURATION = 450;

/** Délai avant le dessin de la première icône de champ, en millisecondes. */
export const AUTH_ICON_DELAY = 500;

/** Écart entre le dessin de deux icônes de champ, en millisecondes. */
export const AUTH_ICON_STEP = 80;
