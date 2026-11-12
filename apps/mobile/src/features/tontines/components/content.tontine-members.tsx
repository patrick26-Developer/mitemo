import { useState } from "react";
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
      <DetailHeader title="Membres" />
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

/** Props de la barre de recherche et de filtres. */
interface MembersToolbarProps {
  readonly item: Tontine;
  readonly search: MemberSearchState;
}

/**
 * Nom de la tontine, champ de recherche et étiquettes de filtre.
 * @param props Tontine et état de la recherche.
 * @returns La barre au-dessus de la liste.
 */
function MembersToolbar(props: MembersToolbarProps) {
  const { item, search } = props;

  return (
    <View className="gap-3">
      <Text className="-mt-3 px-4 text-[14px] text-muted">{item.name}</Text>
      <View className="flex-row px-4">
        <SearchField
          value={search.query}
          onChangeText={search.setQuery}
          placeholder="Rechercher un membre"
          accessibilityLabel="Rechercher un membre"
          clear={{ label: "Effacer la recherche", onPress: () => search.setQuery("") }}
          autoFocus={false}
        />
      </View>
      <MemberFilterTags
        options={search.options}
        value={search.filter}
        onChange={search.setFilter}
      />
    </View>
  );
}
