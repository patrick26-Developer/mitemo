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

Le build natif (EAS) n'est pas encore configuré.

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
  shared/              briques transverses : components/, format/, hooks/, theme/, testing/
```

Feature existante : `home` (écran d'accueil).

## Style (Uniwind)

Le style passe par les classes Tailwind d'Uniwind (`className`), jamais par `StyleSheet` pour
du statique. Les jetons de couleur sont déclarés une fois dans `global.css` (`@theme`), importé
par `app/_layout.tsx` : `bg-card`, `text-ink`, `text-on-dark-muted`, etc.

Trois exceptions, documentées dans le code :

- les valeurs calculées à l'exécution (largeur de carte, teinte d'une caisse) restent en `style` ;
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
