/** Couleurs de fond des avatars, toutes lisibles sous une initiale blanche. */
export const AVATAR_COLORS: readonly string[] = [
  "#1F7A5C",
  "#2B6CB0",
  "#8E44AD",
  "#C0392B",
  "#D35400",
  "#16A085",
  "#7B5E2A",
  "#B83280",
  "#2C5282",
  "#5A6B1F",
];

/**
 * Couleur de fond d'un avatar, comme sur WhatsApp : tirée du nom, elle varie
 * d'une personne à l'autre mais reste la même pour une même personne.
 * @param seed Nom ou identifiant de la personne.
 * @returns La couleur de fond.
 */
export function avatarColor(seed: string): string {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + (char.codePointAt(0) ?? 0)) % 2_147_483_647;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length] ?? "#2B6CB0";
}
