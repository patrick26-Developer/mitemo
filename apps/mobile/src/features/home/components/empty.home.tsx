import { View, Text } from "react-native";

import { SheetPrimaryButton } from "../../../shared/components/atoms/button.sheet-primary";
import { MitemoLogo } from "../../../shared/components/atoms/logo.mitemo";
import { PALETTE } from "../../../shared/theme/theme.palette";
import { TAB_ICONS } from "../../../shared/theme/theme.tab-icons";
import type { HomeCreateState } from "../hooks/hook.home-create";
import { HomeCreateOption } from "./option.home-create";

/** Props de l'accueil vide. */
export interface HomeEmptyStateProps {
  readonly create: HomeCreateState;
}

/**
 * Choix dépliés sous « Créer » : une tontine ou une carte de pointage.
 * @param props État de la création.
 * @returns Les deux choix.
 */
function HomeCreateChoices(props: HomeEmptyStateProps) {
  const { choose } = props.create;

  return (
    <View className="w-full gap-2.5">
      <HomeCreateOption
        icon={TAB_ICONS.tontines}
        label="Une tontine"
        detail="Cotisez à plusieurs, chacun reçoit la cagnotte à son tour."
        onPress={() => choose("tontine")}
      />
      <HomeCreateOption
        icon={TAB_ICONS.savings}
        label="Une carte de pointage"
        detail="Mettez de côté pas à pas, jusqu'à votre objectif."
        onPress={() => choose("card")}
      />
    </View>
  );
}

/**
 * Accueil sans tontine ni carte active : le logo, ce qu'il faut ajouter, et
 * « Créer », qui déplie les deux choix.
 * @param props État de la création.
 * @returns La carte d'accueil vide.
 */
export function HomeEmptyState(props: HomeEmptyStateProps) {
  const { choosing, toggleChoices } = props.create;

  return (
    <View className="-mt-[276px] mx-4 mb-5 items-center gap-4 rounded-[20px] bg-white p-6 shadow-sm">
      <MitemoLogo width={72} color={PALETTE.brand} />
      <View className="items-center gap-1.5">
        <Text accessibilityRole="header" className="text-center text-[18px] font-semibold text-ink">
          Rien d&apos;actif pour le moment
        </Text>
        <Text className="text-center text-[14px] leading-5 text-muted">
          Ajoutez une tontine avec vos proches ou une carte de pointage pour commencer à épargner.
        </Text>
      </View>
      <View className="w-full">
        <SheetPrimaryButton label="Créer" onPress={toggleChoices} />
      </View>
      {choosing ? <HomeCreateChoices create={props.create} /> : null}
    </View>
  );
}
