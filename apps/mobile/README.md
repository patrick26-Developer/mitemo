# mobile

Application mobile de Mitemo : Expo SDK 58, Expo Router, React Native 0.88. C'est le canal principal des membres : inscription, tontines, approvisionnement, arbitrage des échéances.

Responsable : Espoir (`Espoir-Loem`). Issues : [label `app:mobile`](https://github.com/patrick26-Developer/mitemo/issues?q=is%3Aissue+is%3Aopen+label%3Aapp%3Amobile).

## Démarrer

Depuis la racine du dépôt, après `pnpm install` :

```bash
pnpm --filter mobile start      # puis scanner le QR code avec Expo Go
pnpm --filter mobile android    # émulateur ou appareil Android
```

## Scripts

| Commande                         | Effet                                                   |
| -------------------------------- | ------------------------------------------------------- |
| `pnpm --filter mobile start`     | Serveur de développement Expo                           |
| `pnpm --filter mobile android`   | Lance sur Android                                       |
| `pnpm --filter mobile ios`       | Lance sur iOS                                           |
| `pnpm --filter mobile test`      | Tests (Jest, `jest-expo`, React Native Testing Library) |
| `pnpm --filter mobile test:ci`   | Tests avec seuils de couverture                         |
| `pnpm --filter mobile typecheck` | Vérification TypeScript                                 |

Les profils de build EAS sont décrits dans `eas.json` (`development`, `preview`, `production`).
Avant le premier build, il reste deux décisions hors du code : lier le projet à un compte Expo
(`pnpm dlx eas-cli init`) et fixer les identifiants `ios.bundleIdentifier` et `android.package`
dans `app.json`.

Variables d'environnement : voir `.env.example`.

## Organisation

```
app/                   routes Expo Router uniquement : chaque fichier devient une route
src/
  features/<feature>/
    components/        écrans et composants de présentation
    hooks/             état et effets
    api/               appels à l'API, typés par @mitemo/contracts
    model/             logique pure, testée sans rendu
    index.ts           seule porte d'entrée de la feature
  shared/              briques transverses : components/, format/, hooks/, member/, session/, theme/, testing/
```

Features : `auth` (inscription, connexion, code PIN), `home` (accueil), `tontines`, `savings`
(cartes de pointage), `search` (recherche globale) et `profile`.

## Session et code PIN

- La session (`src/shared/session/store.session.ts`) vit en mémoire seulement : chaque ouverture de
  l'application redemande le code PIN.
- `app/_layout.tsx` protège les routes avec `Stack.Protected` : sans session, seul `(auth)` est
  accessible ; avec une session, `(auth)` ne l'est plus. Ouvrir ou fermer la session suffit à
  changer d'espace.
- En attendant la route d'authentification de l'API, le code est vérifié sur l'appareil : seule
  son empreinte SHA-256 salée est conservée, dans le trousseau chiffré du système
  (`expo-secure-store`, Keychain ou Keystore). Le port `CredentialVault` isole ce stockage pour
  qu'il soit remplacé par l'API sans toucher aux écrans.
- Un code à quatre chiffres reste devinable si l'on peut lire le trousseau : la protection repose
  sur le chiffrement du système, pas sur l'empreinte.

## Données de démonstration

Le portefeuille (solde, tontines, cartes) et les moyens de paiement sont encore des données
locales de démonstration (`src/shared/demo/`) : aucune route de l'API ne les sert pour l'instant.
Les règles de solde du client (`model.portfolio-*`) ne valident que la saisie ; quand l'API
existera, c'est elle qui fera foi.

## Tests de bout en bout (Maestro)

Les parcours critiques sont dans `.maestro/`. Ils demandent un build installé sur un émulateur
ou un appareil, et l'identifiant de l'application :

```bash
maestro test -e APP_ID=<identifiant> apps/mobile/.maestro
```

## Style (Uniwind)

Le style passe par les classes Tailwind d'Uniwind (`className`), jamais par `StyleSheet` pour
du statique. Les jetons de couleur sont déclarés une fois dans `global.css` (`@theme`), importé
par `app/_layout.tsx` : `bg-card`, `text-ink`, `text-on-dark-muted`, etc.

Trois exceptions, documentées dans le code :

- les valeurs calculées à l'exécution (largeur de carte, teinte d'une carte) restent en `style` ;
- les composants natifs tiers (`Svg`, `LinearGradient`, icônes) n'acceptent pas de `className` et
  reçoivent leurs couleurs depuis `src/shared/theme/palette.ts`, qui reprend les valeurs de
  `global.css` ;
- les `Animated.View` de Reanimated ne reçoivent pas de `className` : leur cadre statique reste
  décrit dans le fichier qui les anime.

## Règles propres au mobile

- **Jamais de test dans `app/`** : Expo Router en ferait une route. L'écran vit dans `src/features`, `app/` ne fait que le monter.
- Toute dépendance native s'ajoute avec `pnpm exec expo install`, jamais `pnpm add` : Expo choisit la version compatible avec le SDK.
- React est fixé à la version imposée par Expo SDK 58 (19.3.0).
- Accessibilité : rôles et libellés renseignés, le statut n'est jamais porté par la seule couleur.

Règles générales : [`AGENTS.md`](../../AGENTS.md), sections 3.6 (composants) et 3.9 (types partagés).
