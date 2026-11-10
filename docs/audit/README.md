# Revue externe du projet Mitemo

Analyse des documents `docs/document_vision_strat_gie_mitemo.md` et `docs/cahier_des_charges_fonctionnel_mitemo.md`, réalisée le 4 novembre 2026.

Ces documents sont une revue critique destinée à être challengée, pas une spécification approuvée. Les documents d'origine ne sont pas modifiés.

| Document | Contenu |
|---|---|
| [`00-synthese-et-points-critiques.md`](00-synthese-et-points-critiques.md) | **À lire en premier.** Ce qui est bon et à protéger, les 2 problèmes bloquants, les 3 problèmes sérieux, les 6 actions prioritaires |
| [`01-modele-economique.md`](01-modele-economique.md) | Diagnostic de la perte de ~3×, levier de la boucle fermée, reconstruction de la grille tarifaire, métriques |
| [`02-conformite-reglementaire.md`](02-conformite-reglementaire.md) | Postures réglementaires CEMAC, KYC par paliers, LBC/FT, données personnelles, checklist pré-production |
| [`03-architecture-technique.md`](03-architecture-technique.md) | 5 principes non négociables, 4 automates d'états, correctifs aux règles métier, choix de technologies |
| [`04-infrastructure-services-budget.md`](04-infrastructure-services-budget.md) | Hébergement, nom de domaine, SMS / USSD / push, services tiers, audit de sécurité, budget chiffré |
| [`05-scenarios-et-cas-limites.md`](05-scenarios-et-cas-limites.md) | Les scénarios manquants, dont SIM swap, succession, collusion, litiges, et le « mode cahier » |
| [`06-go-to-market-communication.md`](06-go-to-market-communication.md) | Acquisition par groupe, ambassadrices, confiance, langues, marque, canaux, dossier de concours |
| [`07-roadmap-et-perimetre.md`](07-roadmap-et-perimetre.md) | Périmètre par phase, critères de passage, ce qu'il ne faut jamais faire, les 3 risques mortels |

## Les trois choses à retenir

1. **Les API marchandes mobile money ne sont pas gratuites** (3-4 % à l'encaissement, ~1 % au décaissement au Congo). La commission de 1,5 % couvre 30 % du coût de transaction. Correction par la boucle fermée, documentée dans `01`.
2. **Le SMS ne peut être ni le canal principal ni un moyen d'autorisation de paiement.** Trop cher (il dépasse à lui seul la recette) et sans authentification. La réponse est l'USSD, documentée dans `04`.
3. **Le levier le plus fort n'est pas technique.** Une lettre d'intention avec un établissement agréé COBAC vaut, devant un jury comme devant un partenaire, plus que n'importe quelle fonctionnalité - et c'est l'élément au plus long délai d'obtention.
