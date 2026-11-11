import type { ProfileCounts } from "../../../shared/model/model.profile-actions";
import { profileGroupsFor } from "./model.profile-content";

const COUNTS: ProfileCounts = { tontines: 2, cards: 2 };

describe("profileGroupsFor", () => {
  it("place les espaces du membre en tête du profil", () => {
    const spaces = profileGroupsFor(COUNTS)[0];

    expect(spaces?.title).toBe("Mes espaces");
    expect(spaces?.actions.map((action) => action.label)).toEqual(["Mes tontines", "Mes cartes"]);
    expect(spaces?.actions.map((action) => action.value)).toEqual(["2", "2"]);
  });

  it("reflète les compteurs du portefeuille", () => {
    const spaces = profileGroupsFor({ tontines: 3, cards: 1 })[0];

    expect(spaces?.actions.map((action) => action.value)).toEqual(["3", "1"]);
  });

  it("ne propose dans les préférences que les notifications", () => {
    const preferences = profileGroupsFor(COUNTS).find((group) => group.title === "Préférences");

    expect(preferences?.actions.map((action) => action.id)).toEqual(["notifications"]);
  });
});
