import { Text, View } from "react-native";

import type { ProfileActionContent, ProfileGroupContent } from "../model/profile-content";
import { ProfileRow } from "./profile-row";

/** Props d'un groupe d'actions du profil. */
export interface ProfileGroupProps {
  readonly group: ProfileGroupContent;
  readonly onSelect: (action: ProfileActionContent) => void;
}

/**
 * Affiche un groupe d'actions sous son titre.
 * @param props Groupe à afficher et ouverture d'une action.
 * @returns La carte du groupe.
 */
export function ProfileGroup(props: ProfileGroupProps) {
  const { group, onSelect } = props;
  const lastIndex = group.actions.length - 1;

  return (
    <View className="gap-2 px-4">
      <Text className="text-[13px] font-medium uppercase text-muted">{group.title}</Text>
      <View className="overflow-hidden rounded-[18px] border border-card-border bg-white">
        {group.actions.map((action, index) => (
          <ProfileRow
            key={action.id}
            action={action}
            isLast={index === lastIndex}
            onPress={() => onSelect(action)}
          />
        ))}
      </View>
    </View>
  );
}
