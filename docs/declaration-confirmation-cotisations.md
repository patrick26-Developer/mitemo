# Déclaration et confirmation d'une cotisation - proposition, sans décision

**Statut :** proposition, à discuter. Ce document ne tranche rien - il présente des options et les décisions métier qu'elles exigent, pour que l'architecte choisisse en connaissance de cause avant que `packages/contracts` ne se fige sur ce point.

**Demandé par :** l'architecte, en réaction à la revue de la PR #60 (`transaction.ts` ne modélise que la confirmation par un prestataire de paiement, alors que le MVP n'a aucun prestataire).

---

## 1. Le problème exact

Deux mécanismes de confirmation coexistent dans la documentation du projet, et ne sont aujourd'hui représentés que par un seul automate :

| Mécanisme | Qui confirme quoi | Source | Représenté aujourd'hui ? |
|---|---|---|---|
| Paiement électronique | Un prestataire Mobile Money confirme un virement réel | `docs/audit/03-architecture-technique.md`, §1.4 et §2 (automate 4) | Oui - `TransactionState` (`INITIATED → … → CONFIRMED`) |
| Cotisation déclarée en espèces (« mode cahier ») | Un membre confirme qu'une cotisation déclarée par l'administratrice a bien été reçue | `docs/audit/05-scenarios-et-cas-limites.md`, §4.4 (« registre à double confirmation ») | **Non** |

Le MVP (Phase 0, sans argent réel - voir `docs/audit/07-roadmap-et-perimetre.md`) a besoin du second mécanisme, pas du premier. `TransactionState` tel qu'il existe décrit un monde qui n'est pas encore autorisé à fonctionner.

Un fait déjà présent dans `packages/contracts`, à exploiter : **`ContributionId` existe depuis le socle initial** (`identifiers.ts`, avant l'issue #5), sans jamais avoir eu de forme (état, requête, réponse) qui lui soit propre. C'est un indice que la distinction cotisation / transaction était déjà pressentie, sans avoir été construite.

## 2. Deux options, non tranchées

### Option 1 - Deux concepts séparés : `Contribution` et `Transaction`

Une **cotisation** (`Contribution`) est un engagement au niveau du groupe : déclarative, sociale, sans mouvement d'argent réel à travers Mitemo. Une **transaction** (`Transaction`, déjà dans `transaction.ts`) est un mouvement de fonds réel chez un prestataire, qui n'existe pas encore dans le MVP.

```
ContributionState : DECLARED → CONFIRMED_BY_GROUP
                             → REJECTED
TransactionState  : INITIATED → PENDING → CONFIRMED | FAILED | EXPIRED
                              → REVERSED
```

Une cotisation payée plus tard par voie électronique référencerait une transaction via un champ optionnel (`transactionId?`), sans jamais mélanger les deux automates.

| Avantages | Inconvénients |
|---|---|
| Le MVP ne touche jamais `TransactionState` - aucune confusion possible avec un flux d'argent réel | Deux concepts à maintenir, deux jeux d'écrans possibles côté web/mobile |
| La frontière juridique (§3 ci-dessous, PR B) reste nette : rien dans `Contribution` ne peut jamais être branché par erreur sur un prestataire | Le lien cotisation ↔ transaction, le jour où il existera, demande une relation explicite à concevoir |
| `ContributionId`, déjà réservé, trouve enfin un usage | - |

### Option 2 - Un automate unique, à deux chemins de confirmation

Une seule entité, avec un champ distinguant le mode de confirmation :

```
ContributionState     : DECLARED → CONFIRMED → REJECTED | DISPUTED
confirmationMethod     : "GROUP" | "PROVIDER"
```

`CONFIRMED` est atteint soit par confirmation d'un pair (espèces), soit par confirmation d'un prestataire (électronique) - `TransactionState` existant deviendrait un sous-cas de ce modèle, ou serait absorbé par lui.

| Avantages | Inconvénients |
|---|---|
| Un seul modèle mental, un seul jeu d'écrans à construire pour Espoir | Mélange deux niveaux de confiance très différents (confirmation sociale, contournable par collusion entre deux membres, contre confirmation d'un prestataire, un signal externe) sous un même mot, `CONFIRMED` |
| Pas de relation à inventer entre deux identifiants | Rend `TransactionState`, déjà livré sur `develop`, redondant ou à refondre |

## 3. Rejet et contestation

Les deux options doivent distinguer deux moments différents, aujourd'hui non traités :

1. **Rejet avant confirmation** (`REJECTED`) : la déclaration était fausse ou erronée, personne n'a encore confirmé. Correction simple.
2. **Contestation après confirmation** : une cotisation confirmée est remise en cause plus tard (fraude découverte, collusion). Ceci rejoint un trou déjà identifié dans `docs/audit/05-scenarios-et-cas-limites.md`, §4.1 : l'état « En Litige » de la tontine existe dans l'automate général sans procédure définie. **Ce document ne propose pas cette procédure** - il se limite à signaler que la contestation d'une cotisation confirmée en dépend, et ne doit pas être traitée comme un simple rejet.

## 4. Décisions métier nécessaires, par ordre de priorité

### a) Qui confirme une cotisation en espèces ? - question prioritaire

Quatre options possibles, aucune choisie :

| Option | Avantage | Risque |
|---|---|---|
| La trésorière désignée du groupe | Responsabilité claire, un seul point de contact | Point de défaillance unique ; collusion possible avec l'administratrice qui déclare |
| La présidente du groupe | Autorité déjà reconnue socialement dans une tontine | Concentre déclaration et confirmation si elle est aussi administratrice |
| Le membre concerné lui-même, en confirmant sa propre cotisation | Correspond le mieux au terme « double confirmation » (deux parties distinctes : qui a reçu, qui a payé) | Un membre de mauvaise foi pourrait confirmer une cotisation qu'il n'a pas réellement versée, pour éviter une pénalité |
| Vote collectif du groupe | Le plus résistant à la collusion à deux | Lourd pour une cotisation quotidienne, inadapté au rythme d'une tontine de marché |

### b) Autres décisions ouvertes

- Qui peut rejeter une déclaration, et dans quel délai après qu'elle a été faite ?
- Une déclaration rejetée a-t-elle une conséquence (pénalité pour fausse déclaration) ou reste-t-elle neutre (simple correction) ?
- Une cotisation peut-elle changer de mode en cours de route (déclarée en espèces puis finalement payée par Mobile Money pour le même tour), ou les deux modes sont-ils exclusifs l'un de l'autre pour un même tour ?
- `ContributionId` doit-il porter sa propre identité dans le grand livre, distincte de `TransactionId`, même une fois qu'un prestataire existera ?

## 5. Ce que ce document ne fait pas

Il ne choisit pas entre les deux options, ne définit pas la procédure de litige, et ne modifie aucun fichier de `packages/contracts`. Il attend une décision explicite avant toute implémentation.
