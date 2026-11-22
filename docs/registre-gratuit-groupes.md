# Registre gratuit — lot groupes et invitations

Décision du 22 novembre 2026 : le pilote Registre est gratuit, déclaratif et indépendant du portefeuille simulé. Aucun taux hypothétique n'est activé.

## Contrats à relire avec Espoir

Nouveaux types dans packages/contracts/src/registry.ts. Les contrats financiers existants restent disponibles.

Toutes les routes requièrent une session Bearer. Sur la démo Preview, le garde d'accès existant s'applique également.

| Méthode | Route | Action |
| --- | --- | --- |
| POST | /registry/tontines | Créer un groupe, avec Idempotency-Key UUID |
| GET | /registry/tontines | Lister ses groupes, 100 maximum |
| GET | /registry/tontines/:id | Consulter les règles d'un groupe dont on est membre |
| PATCH | /registry/tontines/:id | Renommer le groupe, responsable uniquement |
| GET | /registry/tontines/:id/members | Consulter les adhésions |
| POST | /registry/tontines/:id/invitations | Inviter un compte existant, responsable uniquement |
| POST | /registry/invitations/:id/accept | Accepter pour soi et enregistrer la version gratuite |
| POST | /registry/invitations/:id/decline | Refuser pour soi |

Création :

```json
{"name":"Marché solidaire","contributionAmount":{"amount":"2000","currency":"XAF"},"participantCount":2,"frequency":{"unit":"semaine","interval":1}}
```

Invitation : {"userId":"<UUID du compte B>"}.
Acceptation : {"acceptedPolicyVersion":"registry-free-v1"}.

Les invitations sont nominatives, expirent après sept jours et ne peuvent être utilisées que par le destinataire authentifié. Ce délai technique est à relire avec Espoir. La création du groupe utilise l'UUID Idempotency-Key comme identifiant stable du groupe. Un rejeu au contenu différent est refusé. L'acceptation répétée conserve une seule adhésion.

Le groupe reste en RECRUTEMENT dans ce lot. Les noms sont modifiables avec audit, les règles financières sont immuables. L'activation des tours et les déclarations de cotisation arrivent dans le lot suivant.

## Persistance et contrôles

Migration additive 20261122100000_registry_groups : tontine_group, tontine_member, tontine_invitation, group_fee_policy, audit_event.

Les contraintes PostgreSQL limitent les rôles et états, les montants positifs, la capacité et les fréquences. Les versions tarifaires sont immuables et gratuites ; chaque adhésion référence une version existante. Le journal d'audit refuse UPDATE et DELETE.

Tests PostgreSQL et HTTP sur mitemo_test : création, invitation, acceptation, rejeu, isolation, politique gratuite, persistance après reconnexion du client PostgreSQL, immutabilité de l'audit. Aucune écriture ledger_entry produite par le registre.

Limites : pas encore de tour, de déclaration ou de confirmation de cotisation, de recherche de destinataires, de renvoi d'invitation expirée, de notification ou de rémunération responsable. Aucun écran mobile modifié par ce lot. La preuve sur téléphone reste à effectuer avec Espoir.
