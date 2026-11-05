# 0005. Pas de fonds réels sans validation juridique

- Statut : accepté
- Date : 2026-11-06

## Contexte

`packages/contracts` expose `FundWalletRequest`/`FundWalletResponse` (`transaction.ts`) : un contrat neutre, qui fonctionnera identiquement qu'il soit implémenté contre le simulateur d'opérateur (issue #14) ou contre un vrai prestataire Mobile Money. Rien dans le code ne rappelle que seule la première option est autorisée aujourd'hui.

La contrainte existe déjà, mais seulement dans la documentation d'audit :

- `docs/audit/07-roadmap-et-perimetre.md`, ligne 52 : « Pas de pilote avec de l'argent réel sans parapluie réglementaire. »
- Jalon « Phase 0 : démonstration » des issues GitHub : « […] sans argent réel (simulateur d'opérateur). »
- `docs/audit/02-conformite-reglementaire.md` : aucune posture réglementaire (prestataire technique d'un établissement agréé, agrément propre, ou orchestration sans détention de valeur) n'est encore choisie.

Une contrainte qui vit uniquement dans un document d'audit n'est pas visible par qui lit le code en premier.

## Décision

1. **Aucune implémentation de `FundWalletRequest`/`FundWalletResponse`, ni d'aucun contrat qui en dérivera, ne doit être branchée sur un prestataire de paiement réel avant que le modèle juridique (`docs/audit/02-conformite-reglementaire.md`) soit validé et qu'un partenaire agréé soit sous contrat.**
2. Jusqu'à cette validation, la seule implémentation autorisée est le simulateur d'opérateur (issue #14).
3. Cette contrainte est répétée en JSDoc directement sur les types concernés dans `packages/contracts`, pour qu'elle soit visible sans avoir à connaître cet ADR ou les documents d'audit.

## Conséquences

- Un futur développeur qui lit `transaction.ts` voit la contrainte avant d'écrire une intégration.
- La contrainte reste déclarative : un type TypeScript ne peut pas empêcher techniquement un branchement sur un vrai prestataire. La garantie reste humaine (revue de code, CODEOWNERS) jusqu'à ce qu'un garde-fou technique soit envisagé si nécessaire.
- Cette décision ne préjuge pas de la posture réglementaire finale (`docs/audit/02-conformite-reglementaire.md`, §2) : elle s'applique quelle que soit la posture retenue.
