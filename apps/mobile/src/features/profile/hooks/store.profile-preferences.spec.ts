import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  INITIAL_PROFILE_PREFERENCES,
  PREFERENCES_STORAGE_KEY,
  useProfilePreferences,
} from "./store.profile-preferences";

describe("useProfilePreferences", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useProfilePreferences.setState(INITIAL_PROFILE_PREFERENCES);
  });

  it("oublie le thème, la langue et la biométrie d'une version précédente", async () => {
    const legacy = {
      ...INITIAL_PROFILE_PREFERENCES,
      theme: "Sombre",
      language: "Anglais",
      biometrics: true,
      primaryPaymentId: "mtn",
    };
    await AsyncStorage.setItem(
      PREFERENCES_STORAGE_KEY,
      JSON.stringify({ state: legacy, version: 0 }),
    );

    await useProfilePreferences.persist.rehydrate();

    const state = useProfilePreferences.getState();
    expect(state).not.toHaveProperty("theme");
    expect(state).not.toHaveProperty("language");
    expect(state).not.toHaveProperty("biometrics");
    expect(state.primaryPaymentId).toBe("mtn");
  });

  it("active ou coupe une catégorie de notifications", () => {
    useProfilePreferences.getState().toggleNotification("announcements");

    expect(useProfilePreferences.getState().notifications.announcements).toBe(true);
  });
});
