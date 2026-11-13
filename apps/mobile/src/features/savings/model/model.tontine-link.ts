import type {
  SheetSelectGroup,
  SheetSelectOption,
} from "../../../shared/components/macros/field.sheet-select";
import { formatAmount } from "../../../shared/format/format.amount";
import type { Tontine } from "../../../shared/member/model.portfolio";

/** Valeur de la liste pour une carte indépendante, rattachée à aucune tontine. */
export const NO_TONTINE = "none";

/**
 * Propose les tontines auxquelles rattacher une carte, après « Aucune
 * tontine » : chacune avec ses membres, sa cotisation par tour et sa couleur.
 * @param tontines Tontines du membre.
 * @returns Les groupes de la liste.
 */
export function tontineLinkGroups(
  tontines: readonly Tontine[],
): readonly SheetSelectGroup<string>[] {
  const none = {
    title: "Carte indépendante",
    options: [
      { value: NO_TONTINE, label: "Aucune tontine", description: "La carte reste indépendante." },
    ],
  };
  if (tontines.length === 0) return [none];
  const linked = tontines.map(linkOption);

  return [none, { title: "Vos tontines", options: linked }];
}

/**
 * Option d'une tontine : ses membres, sa cotisation par tour et sa couleur.
 * @param tontine Tontine proposée.
 * @returns L'option détaillée.
 */
function linkOption(tontine: Tontine): SheetSelectOption<string> {
  const members = `${tontine.members.length} membres`;

  return {
    value: tontine.id,
    label: tontine.name,
    description: `${members} · ${formatAmount(tontine.contribution)} FCFA par tour`,
    accent: tontine.headerColors[0],
  };
}

/**
 * Traduit le choix de la liste en tontine rattachée.
 * @param value Valeur choisie.
 * @returns L'identifiant de la tontine, ou `null` pour une carte indépendante.
 */
export function tontineIdOf(value: string): string | null {
  return value === NO_TONTINE ? null : value;
}

/**
 * Nom de la tontine rattachée, pour le récapitulatif.
 * @param tontines Tontines du membre.
 * @param tontineId Tontine rattachée, `null` sans tontine.
 * @returns Le nom, ou `null` pour une carte indépendante.
 */
export function linkedTontineName(
  tontines: readonly Tontine[],
  tontineId: string | null,
): string | null {
  return tontines.find((tontine) => tontine.id === tontineId)?.name ?? null;
}
