/** Accès à un espace de la navigation : ouvert ou non, et où aller sinon. */
export interface RouteAccess {
  readonly guard: boolean;
  readonly redirectTo: "/(tabs)" | "/(auth)/sign-in" | "/onboarding";
}

/** Accès aux trois espaces : membre, connexion et présentation. */
export interface LaunchRoutes {
  readonly member: RouteAccess;
  readonly auth: RouteAccess;
  readonly onboarding: RouteAccess;
}

/** État qui décide de l'espace ouvert. */
export interface LaunchState {
  readonly signedIn: boolean;
  /** Vrai une fois la présentation vue ou passée. */
  readonly onboarded: boolean;
}

/**
 * Décide de l'espace ouvert : la présentation au premier lancement, puis la
 * connexion, puis l'espace du membre une fois la session ouverte. Chaque
 * espace fermé renvoie vers celui qui est ouvert.
 * @param state Session et présentation.
 * @returns Le garde et la redirection de chaque espace.
 */
export function launchRoutes(state: LaunchState): LaunchRoutes {
  const { signedIn, onboarded } = state;
  const signedOut = onboarded ? "/(auth)/sign-in" : "/onboarding";
  const home = signedIn ? "/(tabs)" : signedOut;

  return {
    member: { guard: signedIn, redirectTo: signedOut },
    auth: { guard: !signedIn && onboarded, redirectTo: home },
    onboarding: {
      guard: !signedIn && !onboarded,
      redirectTo: signedIn ? "/(tabs)" : "/(auth)/sign-in",
    },
  };
}
