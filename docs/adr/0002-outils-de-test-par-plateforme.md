# 0002. Un outil de test par plateforme

- Statut : accepté
- Date : 2026-11-05

## Contexte

Le TDD est obligatoire partout. Un seul outil de test pour tout le monorepo serait plus simple à apprendre, mais chaque plateforme a ses contraintes, vérifiées dans les documentations officielles au moment de la mise en place :

- NestJS 12 publie des paquets ESM uniquement ; un nouveau projet ESM utilise Vitest par défaut. Jest ne peut charger ces paquets qu'à partir de Node 24.9 (source : docs.nestjs.com/migration-guide).
- Le guide de tests de Next.js 16 documente Vitest avec jsdom (source : nextjs.org/docs/app/guides/testing/vitest).
- Expo fournit `jest-expo`, le seul preset qui simule correctement les modules natifs de React Native.

## Décision

| Cible             | Outil                                     |
| ----------------- | ----------------------------------------- |
| `apps/api`        | Vitest, avec SWC pour les métadonnées de décorateurs |
| `apps/web`        | Vitest + Testing Library + jsdom          |
| `apps/mobile`     | Jest + `jest-expo` + React Native Testing Library |
| `packages/*`      | `node:test`, sans dépendance              |

Les conventions restent communes : fichiers `*.spec.ts(x)` colocalisés, mêmes seuils de couverture, mêmes commandes `pnpm test` et `pnpm test:ci` dans chaque paquet, orchestrées par Turborepo.

## Conséquences

- Chaque plateforme suit son outillage officiel, les mises à jour suivent la documentation sans adaptation maison.
- Trois API de test proches mais pas identiques : `vi` d'un côté, `jest` de l'autre. Les relecteurs doivent y être attentifs.
- À réexaminer si Expo publie un preset Vitest officiel.
