# Contribuer à Mitemo

Merci de prendre le temps de contribuer. Ce guide décrit comment on travaille ensemble. Les règles de code sont dans [`AGENTS.md`](AGENTS.md) : lisez-le avant votre première pull request.

## Prérequis

- Node.js (version dans `.nvmrc`) : `nvm use`
- pnpm 12 : `npm install -g pnpm@12` (la version exacte est épinglée dans `package.json`)
- Un accès à une base PostgreSQL (branche Neon personnelle ou PostgreSQL local)

```bash
git clone https://github.com/patrick26-Developer/mitemo.git
cd mitemo
pnpm install        # installe les dépendances et active les hooks Git
```

## Cycle de travail

1. **Une issue d'abord.** Tout travail part d'une issue décrivant le besoin et les critères d'acceptation. Pour un petit correctif évident, l'issue peut être créée en même temps que la PR.
2. **Une branche par issue**, créée depuis `develop` à jour :
   ```bash
   git switch develop && git pull --rebase
   git switch -c feat/42-enregistrer-cotisation
   ```
   Préfixes : `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `ci`, `perf`.
3. **TDD.** Pour chaque comportement :
   - écrire le test qui échoue ;
   - écrire le code minimal qui le fait passer ;
   - refactorer.
4. **Commits atomiques.** Un commit = un changement cohérent qui compile et dont les tests passent. Évitez les commits fourre-tout du type « wip » ou « fix ».
5. **Pull request** vers `develop`, en remplissant le modèle. **Elle est assignée** à son auteur : le workflow `assign.yml` le fait à l'ouverture si personne ne l'est encore, et le statut `Assignation` bloque la fusion tant qu'elle n'a pas de responsable. Pour passer la main : `gh pr edit <numéro> --add-assignee <login>`. Gardez les PR petites (repère : moins de 400 lignes modifiées hors fichiers générés).
6. **Revue.** Au moins une approbation d'un autre membre. L'auteur répond à chaque commentaire et ne résout pas lui-même les fils ouverts par le relecteur.
7. **Fusion** en _rebase and merge_ une fois la CI verte, pour conserver l'historique atomique. La branche est supprimée après fusion.

## Issues

Chaque issue porte trois familles de labels, un jalon et une personne assignée.

| Famille     | Labels                                                                  |
| ----------- | ----------------------------------------------------------------------- |
| `type:`     | `fonctionnalité`, `bug`, `tâche technique`, `documentation`, `sécurité` |
| `app:`      | `api`, `web`, `mobile`, `contracts`, `infra`                            |
| `domaine:`  | `identité`, `tontine`, `grand-livre`, `paiement`, `canaux`              |
| `priorité:` | `haute` (bloque le parcours de la phase en cours), `moyenne`, `basse`   |
| `statut:`   | `à trier` (posé par les formulaires), `bloqué`                          |

**Assignation** : le backend (`app:api`, `app:contracts`, `app:infra`) est assigné à Patrick (`patrick26-Developer`), les vues (`app:web`, `app:mobile`) à Espoir (`Espoir-Loem`). Le workflow `issue-triage.yml` pose le label d'application choisi dans le formulaire et assigne automatiquement.

**Jalons** : `Phase 0 : démonstration` puis `Phase 1 : pilote réel`, qui reprennent `docs/audit/07-roadmap-et-perimetre.md`.

Une issue de fonctionnalité contient des critères d'acceptation au format « Étant donné ... quand ... alors ... » : ce sont les premiers tests à écrire. Les dépendances entre issues sont indiquées par « Dépend de #numéro ».

## Messages de commit

Format [Conventional Commits](https://www.conventionalcommits.org/fr/) :

```
<type>(<portée>): <résumé à l'impératif, en minuscules>

<corps facultatif : le pourquoi, pas le comment>

Refs: #42
```

Exemples :

```
feat(contributions): enregistrer une cotisation mensuelle
fix(ledger): refuser une écriture déséquilibrée
test(ledger): couvrir le cas d'un solde négatif
```

Portées courantes : `api`, `web`, `mobile`, `contracts`, `ledger`, `groups`, `contributions`, `auth`, `ci`, `deps`, ou le nom de la feature.

### Paternité des commits

- L'auteur d'un commit est la personne qui l'a écrit et qui en répond en revue.
- Le trailer `Co-authored-by` est réservé aux **personnes** qui ont réellement travaillé sur le changement (binôme, mob programming), avec leur adresse GitHub.
- Aucune attribution à un assistant d'IA, aucune mention « Generated with ». Le hook `commit-msg` et la CI rejettent ces messages.

Configurez votre identité avant le premier commit :

```bash
git config user.name  "Prénom Nom"
git config user.email "adresse-liee-a-github@exemple.com"
```

## Hooks Git

Installés automatiquement par `pnpm install` (Husky) :

| Hook         | Vérification                                                                        |
| ------------ | ----------------------------------------------------------------------------------- |
| `pre-commit` | ESLint et Prettier sur les fichiers indexés, typecheck et tests des paquets touchés |
| `commit-msg` | Conventional Commits, absence d'attribution IA                                      |
| `pre-push`   | lint, typecheck et tests de tout le monorepo                                        |

`git commit --no-verify` et `git push --no-verify` sont interdits. Un hook qui bloque à tort se corrige dans une PR dédiée.

## Revue de code

Le relecteur vérifie, dans cet ordre :

1. Les tests décrivent le comportement et auraient échoué sans le changement.
2. Le code respecte les couches (`domain`, `application`, `infrastructure`, `presentation`) et les frontières de features.
3. Une fonction fait un traitement, une classe porte une intention.
4. Aucun montant en flottant, aucune écriture de solde hors transaction `SERIALIZABLE`.
5. Aucun secret, aucune donnée personnelle dans les logs.
6. Structure des composants : pas de logique métier, pas de `.map()` imbriqué, pas de duplication avec `shared/` (checklist complète dans `AGENTS.md`, section 3.6).
7. Tout élément exporté a un JSDoc qui explique l'intention.
8. Toute nouvelle dépendance est justifiée dans la PR : version, maintenance, licence, avis de sécurité, avec les liens vers les sources.

Commentaires préfixés pour lever toute ambiguïté :

- `bloquant :` doit être corrigé avant fusion ;
- `suggestion :` amélioration facultative ;
- `question :` demande d'explication ;
- `détail :` cosmétique.

## Décisions d'architecture

Toute décision structurante (nouvelle dépendance majeure, changement de couche, nouveau service externe) fait l'objet d'un ADR dans `docs/adr/NNNN-titre.md`, discuté dans la PR qui l'introduit.

## Branches et protection

- `develop` : intégration, cible de toutes les pull requests de travail.
- `staging` : préproduction.
- `main` : production, alimentée uniquement depuis `staging`.

Protection à configurer sur `main`, `staging` et `develop`, dans _Settings > Branches_ sur GitHub :

- pull request obligatoire avant fusion, une approbation minimum ;
- approbation de CODEOWNERS requise ;
- statuts obligatoires : `Qualité`, `Messages de commit` et `Assignation` ;
- branche à jour avec la branche cible avant fusion ;
- historique linéaire ;
- pas de push forcé, pas de suppression.

## Signaler un problème de sécurité

Ne créez pas d'issue publique. Suivez [`SECURITY.md`](SECURITY.md).
