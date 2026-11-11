import type { ProfileCounts } from "../../../shared/model/model.profile-actions";
import { profileGroupsFor } from "./model.profile-content";

const COUNTS: ProfileCounts = { tontines: 2, cards: 2 };

describe("profileGroupsFor", () => {
  it("place les espaces du membre en tête du profil", () => {
    const spaces = profileGroupsFor("Système", "Français", COUNTS)[0];

    expect(spaces?.title).toBe("Mes espaces");
    expect(spaces?.actions.map((action) => action.label)).toEqual(["Mes tontines", "Mes cartes"]);
    expect(spaces?.actions.map((action) => action.value)).toEqual(["2", "2"]);
  });

  it("reflète les compteurs du portefeuille", () => {
    const spaces = profileGroupsFor("Système", "Français", { tontines: 3, cards: 1 })[0];

    expect(spaces?.actions.map((action) => action.value)).toEqual(["3", "1"]);
  });

  it("reflète le thème et la langue choisis", () => {
    const groups = profileGroupsFor("Sombre", "Anglais", COUNTS);
    const preferences = groups.find((group) => group.title === "Préférences");

    expect(preferences?.actions.find((action) => action.id === "theme")?.value).toBe("Sombre");
    expect(preferences?.actions.find((action) => action.id === "language")?.value).toBe("Anglais");
  });
});
