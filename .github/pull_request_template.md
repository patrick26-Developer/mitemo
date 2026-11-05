## Contexte

Closes #

<!-- Pourquoi ce changement ? Quel problème résout-il ? -->

## Changements

-

## Tests

<!-- Quels tests ont été écrits en premier ? Comment vérifier à la main ? -->

-

## Checklist

- [ ] Les tests ont été écrits avant le code (rouge, vert, refactor)
- [ ] `pnpm lint`, `pnpm typecheck` et `pnpm test` passent en local, sans avertissement
- [ ] `pnpm audit:deps` est vert ; nouvelle dépendance justifiée avec ses sources (si applicable)
- [ ] Audit de structure des composants fait (si l'interface change)
- [ ] JSDoc sur tout élément exporté
- [ ] Les couches et frontières de features sont respectées
- [ ] Aucun montant en flottant, écritures de solde en `SERIALIZABLE`
- [ ] Migration Prisma testée sur une branche Neon (si applicable)
- [ ] `.env.example`, README ou ADR mis à jour (si applicable)
- [ ] Commits atomiques, au format Conventional Commits, sans attribution IA

## Captures (web ou mobile)

<!-- Avant / après, si l'interface change. -->
