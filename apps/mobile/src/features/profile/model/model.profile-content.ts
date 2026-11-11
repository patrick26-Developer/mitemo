import type {
  ProfileActionContent,
  ProfileCounts,
  ProfileGroupContent,
} from "../../../shared/model/model.profile-actions";
import { PROFILE_GROUPS } from "../../../shared/model/model.profile-actions";

/**
 * Valeur affichée à droite d'une action, selon les compteurs courants.
 * @param action Action dont la valeur est demandée.
 * @param counts Nombres de tontines et de cartes actives.
 * @returns La valeur de la ligne, ou `undefined` si elle n'en porte pas.
 */
function valueFor(action: ProfileActionContent, counts: ProfileCounts): string | undefined {
  if (action.id === "tontines") return String(counts.tontines);
  if (action.id === "cards") return String(counts.cards);
  return action.value;
}

/**
 * Reconstruit les groupes du profil avec les compteurs réels, pour que les
 * lignes ne montrent jamais une valeur périmée.
 * @param counts Nombres de tontines et de cartes actives.
 * @returns Les groupes d'actions à afficher.
 */
export function profileGroupsFor(counts: ProfileCounts): readonly ProfileGroupContent[] {
  return PROFILE_GROUPS.map((group) => ({
    ...group,
    actions: group.actions.map((action) => withValue(action, counts)),
  }));
}

/**
 * Ajoute la valeur courante à une action, sans créer de propriété vide.
 * @param action Action d'origine.
 * @param counts Nombres de tontines et de cartes actives.
 * @returns L'action, avec sa valeur si elle en porte une.
 */
function withValue(action: ProfileActionContent, counts: ProfileCounts): ProfileActionContent {
  const value = valueFor(action, counts);

  return value === undefined ? action : { ...action, value };
}
