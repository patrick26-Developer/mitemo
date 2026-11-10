import { profileGroupsFor } from "./model.profile-content";

describe("profileGroupsFor", () => {
  it("place les espaces du membre en tête du profil", () => {
    const spaces = profileGroupsFor("Système", "Français")[0];

    expect(spaces?.title).toBe("Mes espaces");
    expect(spaces?.actions.map((action) => action.label)).toEqual(["Mes tontines", "Mes cartes"]);
    expect(spaces?.actions.map((action) => action.value)).toEqual(["2", "2"]);
  });

  it("reflète le thème et la langue choisis", () => {
    const groups = profileGroupsFor("Sombre", "Anglais");
    const preferences = groups.find((group) => group.title === "Préférences");

    expect(preferences?.actions.find((action) => action.id === "theme")?.value).toBe("Sombre");
    expect(preferences?.actions.find((action) => action.id === "language")?.value).toBe("Anglais");
  });
});
