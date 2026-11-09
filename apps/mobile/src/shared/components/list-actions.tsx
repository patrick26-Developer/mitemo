import { Plus, Search } from "lucide-react-native";

import { ActionPill } from "./action-pill";

/** Props des actions rapides d'une liste. */
export interface ListActionsProps {
  readonly onSearch: () => void;
  readonly onAdd?: () => void;
}

/**
 * Affiche la recherche et la création rapide d'une liste.
 * @param props Ouverture de la recherche et de la création.
 * @returns La pastille d'actions.
 */
export function ListActions(props: ListActionsProps) {
  const { onSearch, onAdd } = props;

  return (
    <ActionPill
      actions={[
        { icon: Search, label: "Rechercher", onPress: onSearch },
        { icon: Plus, label: "Ajouter", onPress: onAdd },
      ]}
    />
  );
}
