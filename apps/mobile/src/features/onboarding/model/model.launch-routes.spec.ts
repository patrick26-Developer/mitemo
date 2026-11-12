import { launchRoutes } from "./model.launch-routes";

describe("launchRoutes", () => {
  it("ouvre la présentation au premier lancement", () => {
    expect(launchRoutes({ signedIn: false, onboarded: false })).toEqual({
      member: { guard: false, redirectTo: "/onboarding" },
      auth: { guard: false, redirectTo: "/onboarding" },
      onboarding: { guard: true, redirectTo: "/(auth)/sign-in" },
    });
  });

  it("ouvre la connexion une fois la présentation vue", () => {
    const routes = launchRoutes({ signedIn: false, onboarded: true });

    expect(routes.auth.guard).toBe(true);
    expect(routes.member.redirectTo).toBe("/(auth)/sign-in");
    expect(routes.onboarding).toEqual({ guard: false, redirectTo: "/(auth)/sign-in" });
  });

  it("ouvre l'espace du membre une fois la session ouverte", () => {
    const routes = launchRoutes({ signedIn: true, onboarded: true });

    expect(routes.member.guard).toBe(true);
    expect(routes.auth).toEqual({ guard: false, redirectTo: "/(tabs)" });
    expect(routes.onboarding).toEqual({ guard: false, redirectTo: "/(tabs)" });
  });
});
