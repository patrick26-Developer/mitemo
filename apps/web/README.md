# web

Application web de Mitemo : Next.js 16 (App Router) et React 19. En phase 0, elle sert de back-office **en consultation** et porte le tableau de bord de réconciliation et d'intégrité du grand livre.

Responsable : Espoir (`Espoir-Loem`). Issues : [label `app:web`](https://github.com/patrick26-Developer/mitemo/issues?q=is%3Aissue+is%3Aopen+label%3Aapp%3Aweb).

## Démarrer

Depuis la racine du dépôt, après `pnpm install` :

```bash
pnpm --filter web dev        # http://localhost:3000
```

L'API écoute aussi sur le port 3000 par défaut : pour lancer les deux ensemble, démarrer l'API avec `PORT=3001`.

## Scripts

| Commande                      | Effet                                  |
| ----------------------------- | -------------------------------------- |
| `pnpm --filter web dev`       | Serveur de développement               |
| `pnpm --filter web build`     | Build de production                    |
| `pnpm --filter web start`     | Sert le build de production            |
| `pnpm --filter web test`      | Tests (Vitest, Testing Library, jsdom) |
| `pnpm --filter web test:ci`   | Tests avec seuils de couverture        |
| `pnpm --filter web typecheck` | Vérification TypeScript                |

## Organisation

```
src/
  app/                 routes uniquement : elles assemblent des composants de features
  features/<feature>/
    components/        composants de présentation, sans appel réseau
    hooks/             état et effets
    api/               appels à l'API, typés par @mitemo/contracts
    model/             logique pure, testée sans rendu
    index.ts           seule porte d'entrée de la feature
  shared/              composants et hooks réutilisés par plusieurs features
```

## Règles propres au web

- Un composant affiche, il ne calcule pas : 40 lignes au maximum, pas de `.map()` imbriqué dans le JSX.
- Les types d'échange viennent de `@mitemo/contracts`, jamais redéclarés ici.
- Les règles Next.js, React Hooks et d'accessibilité (`jsx-a11y`) sont bloquantes au lint.
- Un montant reçu en chaîne s'affiche sans passer par `Number` (perte de précision).

Règles générales : [`AGENTS.md`](../../AGENTS.md), sections 3.6 (composants) et 3.9 (types partagés).
