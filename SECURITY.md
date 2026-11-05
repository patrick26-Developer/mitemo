# Politique de sécurité

Mitemo manipule de l'argent et des données personnelles. Une faille se traite en privé.

## Signaler une vulnérabilité

- **Ne pas ouvrir d'issue publique.**
- Utiliser l'onglet _Security > Report a vulnerability_ du dépôt GitHub (signalement privé).
- Décrire : le composant touché (`api`, `web`, `mobile`), les étapes de reproduction, l'impact estimé.

## Délais

| Étape                          | Délai cible |
| ------------------------------ | ----------- |
| Accusé de réception            | 72 heures   |
| Première évaluation            | 7 jours     |
| Correctif pour faille critique | 14 jours    |

## Périmètre prioritaire

- Grand livre : écritures déséquilibrées, double dépense, contournement des transactions.
- Authentification et sessions.
- Webhooks des opérateurs de paiement.
- Fuite de données personnelles (téléphone, identité, historique de cotisations).
