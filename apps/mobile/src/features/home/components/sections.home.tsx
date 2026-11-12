import { View } from "react-native";

import { HatchPattern } from "../../../shared/components/atoms/pattern.hatch";
import { usePortfolioStore } from "../../../shared/member/store.portfolio";
import { SavingsCreateSheet } from "../../savings";
import { TontineCreateSheet } from "../../tontines";
import { useHomeCreate } from "../hooks/hook.home-create";
import { homeSections } from "../model/model.home-sections";
import { HomeEmptyState } from "./empty.home";
import { SavingsSection } from "./section.savings";
import { TontinesSection } from "./section.tontines";

/**
 * Accueil vide : invitation à créer, puis le formulaire choisi.
 * @returns La carte d'accueil vide et ses formulaires.
 */
function HomeStart() {
  const create = useHomeCreate();

  return (
    <>
      <HomeEmptyState create={create} />
      <TontineCreateSheet visible={create.form === "tontine"} onClose={create.closeForm} />
      <SavingsCreateSheet visible={create.form === "card"} onClose={create.closeForm} />
    </>
  );
}

/**
 * Sections de l'accueil, chacune masquée quand elle n'a rien d'actif ; sans
 * aucune des deux, l'accueil invite à créer.
 * @returns Les sections de l'accueil.
 */
export function HomeSections() {
  const tontines = usePortfolioStore((state) => state.tontines);
  const cards = usePortfolioStore((state) => state.cards);
  const sections = homeSections(tontines, cards);
  if (sections.empty) return <HomeStart />;
  const hasTontines = sections.tontines.length > 0;

  return (
    <>
      {hasTontines ? (
        <TontinesSection items={sections.tontines} count={sections.tontineCount} />
      ) : null}
      {hasTontines ? <HatchPattern /> : null}
      {sections.cards.length > 0 ? (
        <SavingsSection items={sections.cards} lead={!hasTontines} count={sections.cardCount} />
      ) : null}
      <View className="mt-5">
        <HatchPattern />
      </View>
    </>
  );
}
