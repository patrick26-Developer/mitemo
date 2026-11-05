# 0003. Une seule application web pour le site public et le back-office

- Statut : accepté
- Date : 2026-11-05

## Contexte

Mitemo a deux publics sur le web : le grand public, qui découvre le produit sur le site, et le personnel, qui contrôle l'intégrité et aide les membres dans le back-office. Les membres n'ont pas d'espace web : ils agissent dans l'application mobile ou par USSD (`docs/architecture-systeme.md`, section 2.1).

Deux options :

- **Une application** `apps/web`, avec un groupe de routes par public.
- **Deux applications** : `apps/web` pour le site public, `apps/admin` pour le back-office.

Contraintes :

- l'équipe compte deux personnes ;
- en phase 0, le back-office ne fait que de la consultation (`docs/audit/07-roadmap-et-perimetre.md`) ;
- en phase 1, il pourra proposer et valider des corrections du grand livre, ce qui en fait la cible la plus sensible du système.

## Décision

Une seule application `apps/web`, organisée en deux groupes de routes :

| Groupe                         | Public           | Rendu                                                         |
| ------------------------------ | ---------------- | ------------------------------------------------------------- |
| `src/app/(marketing)/`         | Grand public     | Pages statiques, aucune donnée personnelle                    |
| `src/app/(back-office)/admin/` | Personnel Mitemo | Rendu serveur à chaque requête, jamais mis en cache, `noindex` |

La séparation entre les deux publics repose sur trois règles, toutes obligatoires :

1. Toutes les routes du groupe `(back-office)` vérifient la session du personnel côté serveur avant tout rendu.
2. Le back-office n'appelle que les endpoints `/admin/...` de l'API, qui refusent tout jeton de membre.
3. Aucune page publique ne lie le back-office.

Les composants communs aux deux groupes vivent dans `src/shared/`. Une feature propre à un seul public reste dans `src/features/`, comme pour toute feature (`AGENTS.md`, section 2.2).

## Conséquences

Plus simple :

- un seul build, un seul déploiement, une seule configuration de tests ;
- les composants de base (montants, statuts, formulaires) sont partagés sans paquet supplémentaire.

Plus difficile :

- une faille dans le site public s'exécute dans le même déploiement que le back-office ;
- le back-office ne peut pas être fermé au public au niveau du réseau tant qu'il partage le domaine du site.

À surveiller :

- un test vérifie que chaque route du groupe `(back-office)` refuse une requête sans session valide ;
- **avant la phase 1**, réexaminer cette décision, avec le choix du domaine du back-office : même domaine sous `/admin`, sous-domaine dédié ou accès par réseau privé. Si le back-office est séparé, un nouvel ADR remplace celui-ci.
