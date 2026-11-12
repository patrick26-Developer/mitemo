import { useState } from "react";
import { Search } from "lucide-react-native";
import { FlatList, Text, View } from "react-native";

import { DetailHeader } from "../../../shared/components/macros/header.detail";
import { SearchField } from "../../../shared/components/macros/field.search";
import { EmptyState } from "../../../shared/components/macros/state.empty";
import type { Tontine, TontineMember } from "../../../shared/member/model.portfolio";
import { useTontineActions } from "../hooks/hook.tontine-actions";
import type { MemberSearchState } from "../hooks/hook.member-search";
import { useMemberSearch } from "../hooks/hook.member-search";
import { membersEmptyState } from "../model/model.member-filter";
import { MemberSearchRow } from "./row.member-search";
import { TontineMemberSheet } from "./sheet.tontine-member";
import { MemberFilterTags } from "./tags.member-filter";

/** Props du contenu de la liste complète des membres. */
export interface TontineMembersContentProps {
  readonly item: Tontine;
}

/**
 * Liste complète des membres d'une tontine, quel que soit leur nombre :
 * recherche par nom, étiquettes de filtre (à jour, en attente, invités) et
 * historique d'un membre au clic. La liste est virtualisée pour tenir des
 * centaines de membres.
 * @param props Tontine affichée.
 * @returns Le contenu de l'écran des membres.
 */
export function TontineMembersContent(props: TontineMembersContentProps) {
  const { item } = props;
  const search = useMemberSearch(item);
  const actions = useTontineActions(item);
  const [selected, setSelected] = useState<TontineMember | null>(null);

  return (
    <View className="flex-1">
      <MembersToolbar item={item} search={search} />
      <FlatList
        data={search.rows}
        keyExtractor={(row) => (row.kind === "member" ? row.member.id : row.invitation.id)}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="grow gap-2 px-4 pb-8 pt-4"
        ListEmptyComponent={<EmptyState {...membersEmptyState(search.query)} />}
        renderItem={({ item: row }) => (
          <MemberSearchRow
            item={item}
            row={row}
            onSelect={setSelected}
            onCancelInvitation={actions.cancelInvitation}
          />
        )}
      />
      <TontineMemberSheet
        visible={selected !== null}
        item={item}
        member={selected}
        onClose={() => setSelected(null)}
      />
    </View>
  );
}

/** Props de l'en-tête de la page membres. */
interface MembersToolbarProps {
  readonly item: Tontine;
  readonly search: MemberSearchState;
}

/**
 * En-tête de la page membres : la loupe de l'en-tête ouvre le champ de
 * recherche, qui laisse sa place aux étiquettes de filtre une fois refermé.
 * @param props Tontine et recherche.
 * @returns L'en-tête, la recherche et les étiquettes.
 */
function MembersToolbar(props: MembersToolbarProps) {
  const { item, search } = props;
  const [open, setOpen] = useState(false);
  const accent = item.headerColors[0];
  const close = () => {
    setOpen(false);
    search.setQuery("");
  };
  const actions = open
    ? []
    : [{ label: "Rechercher un membre", icon: Search, onPress: () => setOpen(true) }];

  return (
    <View className="gap-3">
      <DetailHeader title="Membres" accent={accent} actions={actions} />
      <Text className="-mt-2 px-4 text-[14px] text-muted">{item.name}</Text>
      {open ? <MembersSearch search={search} onClose={close} /> : null}
      <MemberFilterTags
        options={search.options}
        value={search.filter}
        onChange={search.setFilter}
        accent={accent}
      />
    </View>
  );
}

/** Props du champ de recherche des membres. */
interface MembersSearchProps {
  readonly search: MemberSearchState;
  readonly onClose: () => void;
}

/**
 * Champ de recherche ouvert depuis la loupe, avec son bouton d'annulation.
 * @param props Recherche et fermeture.
 * @returns Le champ.
 */
function MembersSearch(props: MembersSearchProps) {
  const { search, onClose } = props;

  return (
    <View className="flex-row px-4">
      <SearchField
        value={search.query}
        onChangeText={search.setQuery}
        placeholder="Rechercher un membre"
        accessibilityLabel="Rechercher un membre"
        clear={{ label: "Annuler la recherche", onPress: onClose, alwaysVisible: true }}
      />
    </View>
  );
}
