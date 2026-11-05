# Parcours utilisateur (user flows)

Chaque parcours décrit les écrans, les décisions et les sorties d'erreur d'une tâche précise. Les règles métier citées viennent du cahier des charges et de [`audit/03-architecture-technique.md`](audit/03-architecture-technique.md) ; l'organisation des écrans de [`architecture-information.md`](architecture-information.md).

| N° | Parcours                                   | Surface      | Phase | Issues      |
| -- | ------------------------------------------ | ------------ | ----- | ----------- |
| 1  | Découvrir Mitemo et installer l'application | Site public  | 0     | #46         |
| 2  | Vérifier un tirage                         | Site, app    | 0     | #38, #47, #26 |
| 3  | S'inscrire                                 | Application  | 0     | #9, #23     |
| 4  | Se reconnecter                             | Application  | 0     | #9, #23     |
| 5  | Changer de téléphone                       | Application  | 1     | #40, #51    |
| 6  | Créer une tontine et inviter               | Application  | 0     | #10, #11, #24 |
| 7  | Rejoindre une tontine                      | Application  | 0     | #11, #12, #25 |
| 8  | Mettre de l'argent dans son coffre         | Application  | 0     | #15, #27    |
| 9  | Régler une échéance                        | Application  | 0     | #17, #28    |
| 10 | Régler une échéance par USSD               | USSD         | 0     | #20         |
| 11 | Défaut et cascade                          | Système      | 0     | #19         |
| 12 | Recevoir sa cagnotte                       | Application  | 0     | #18         |
| 13 | Se connecter au back-office                | Back-office  | 0     | #36, #48    |
| 14 | Contrôler l'intégrité                      | Back-office  | 0     | #21, #29    |
| 15 | Aider un membre                            | Back-office  | 0     | #30         |

## 1. Découvrir Mitemo et installer l'application

```mermaid
flowchart TD
    A[Arrivée sur le site<br/>radio, lien partagé, bouche-à-oreille] --> B[Accueil]
    B --> C{Question principale}
    C -->|Comment ça marche ?| D[Comment ça marche]
    C -->|Est-ce sûr ?| E[Sécurité]
    C -->|Combien ça coûte ?| F[Frais]
    D --> G[Télécharger]
    E --> G
    F --> G
    G --> H{Téléphone}
    H -->|Android avec Play| I[Google Play]
    H -->|Android sans Play| J[APK direct]
    H -->|Téléphone simple| K[Code USSD affiché]
    E --> L[Vérifier un tirage]
    B --> M[Contact : appeler un humain]
```

Sorties : installation, appel au support, ou code USSD noté. Aucune inscription sur le site.

## 2. Vérifier un tirage

Règle : `audit/03`, section 3.4. Le code de contrôle `H(S)` est publié 48 h avant le tirage ; la graine `S` est révélée au tirage.

```mermaid
flowchart TD
    A[Saisir le numéro du tirage<br/>ou ouvrir depuis l'application] --> B[Lire le tirage]
    B --> C{Graine révélée ?}
    C -->|Non| D[Afficher le code de contrôle<br/>et l'heure du tirage]
    C -->|Oui| E[Recalculer le code de contrôle à partir de la graine]
    E --> F{Identique au code publié ?}
    F -->|Non| G[Rouge : tirage non conforme<br/>contacter le support]
    F -->|Oui| H[Recalculer l'ordre des tours]
    H --> I{Identique à l'ordre publié ?}
    I -->|Oui| J[Vert : tirage vérifié]
    I -->|Non| G
```

Le calcul de vérification se fait côté client (navigateur ou téléphone), à partir de données publiques : il ne demande pas de faire confiance au serveur de Mitemo. Les membres sont identifiés par un identifiant opaque, jamais par leur numéro.

## 3. S'inscrire

```mermaid
flowchart TD
    A[Bienvenue] --> B[Saisir mon numéro]
    B --> C{Numéro congolais valide ?}
    C -->|Non| B1[Message : numéro invalide] --> B
    C -->|Oui| D[Envoi de l'OTP par SMS]
    D --> E[Saisir le code reçu]
    E --> F{Code correct et non expiré ?}
    F -->|Non, essais restants| E1[Message : code incorrect] --> E
    F -->|Expiré| E2[Renvoyer un code<br/>avec délai croissant] --> E
    F -->|Trop d'essais| E3[Verrouillage temporaire<br/>numéro du support]
    F -->|Oui| G[Créer mon code secret à 6 chiffres]
    G --> H[Confirmer le code secret]
    H --> I{Identiques ?}
    I -->|Non| G1[Message local, sans appel réseau] --> G
    I -->|Oui| J[Appareil lié, session ouverte]
    J --> K{Arrivé par une invitation ?}
    K -->|Oui| L[Parcours 7 : rejoindre]
    K -->|Non| M[Accueil : créer ou rejoindre une tontine]
```

Règles : le code secret refuse les suites évidentes (`123456`, `000000`) ; il est haché en Argon2id et n'est jamais récupérable.

## 4. Se reconnecter

```mermaid
flowchart TD
    A[Ouverture de l'application] --> B{Session valide sur cet appareil ?}
    B -->|Oui| C[Saisir le code secret]
    B -->|Non| D[Parcours 3 depuis l'OTP]
    C --> E{Code correct ?}
    E -->|Oui| F[Accueil]
    E -->|Non| G{Échecs consécutifs}
    G -->|Moins de 3| C
    G -->|3 ou plus| H[Verrouillage progressif<br/>délai affiché]
    H --> I[Code secret oublié ?]
    I --> J[OTP puis nouveau code secret<br/>sorties de fonds gelées pendant la carence en phase 1]
```

## 5. Changer de téléphone (phase 1)

Le parcours le plus difficile du produit, volontairement (`audit/03`, section 4.6).

```mermaid
flowchart TD
    A[Nouvel appareil : saisir mon numéro] --> B[OTP]
    B --> C[Code secret existant]
    C --> D{Code correct ?}
    D -->|Non| X[Verrouillage progressif]
    D -->|Oui| E[Notification à l'ancien appareil<br/>et SMS au numéro]
    E --> F[Carence de 24 à 72 h<br/>entrées possibles, sorties gelées]
    F --> G{Blocage demandé<br/>depuis l'ancien appareil ?}
    G -->|Oui| H[Compte gelé, revue par le support]
    G -->|Non| I{Solde au-dessus du seuil ?}
    I -->|Oui| J[Revue humaine obligatoire]
    I -->|Non| K[Fin de carence, accès complet]
    J --> K
```

## 6. Créer une tontine et inviter

```mermaid
flowchart TD
    A[Créer une tontine] --> B[Montant par tour, en FCFA entiers]
    B --> C[Nombre de membres]
    C --> D[Fréquence : jours, semaines ou mois<br/>et intervalle]
    D --> E[Récapitulatif<br/>cagnotte par tour, frais Mitemo, garantie]
    E --> F{Confirmer ?}
    F -->|Modifier| B
    F -->|Oui| G[Tontine en RECRUTEMENT]
    G --> H[Inviter : lien à usage unique par membre]
    H --> I[Partage par WhatsApp, SMS, copie]
    I --> J[Suivi : invités, acceptés, garanties bloquées]
    J --> K{Tous les membres ont bloqué leur garantie ?}
    K -->|Non, délai non écoulé| J
    K -->|Délai écoulé| L[Tontine ANNULEE<br/>garanties restituées]
    K -->|Oui| M[TIRAGE_ORDRE : code de contrôle publié<br/>tirage dans 48 h]
```

Exemple affiché au récapitulatif : 10 membres, 5 000 FCFA par tour, cagnotte de 45 000 FCFA, frais de 675 FCFA, la bénéficiaire reçoit 44 325 FCFA, garantie de 2 500 FCFA par membre.

Phase 1 : la présidente doit être au palier KYC 1 et désigner une co-administratrice (`audit/05`, section 2.1). Les cagnottes des groupes sans historique sont plafonnées (`audit/05`, section 2.5).

## 7. Rejoindre une tontine

```mermaid
flowchart TD
    A[Ouvrir le lien d'invitation] --> B{Application installée ?}
    B -->|Non| C[Page de téléchargement] --> D[Installation]
    D --> E
    B -->|Oui| E{Connecté ?}
    E -->|Non| F[Parcours 3 : s'inscrire] --> G
    E -->|Oui| G{Invitation valide ?}
    G -->|Expirée ou déjà utilisée| G1[Message : demander un nouveau lien à la présidente]
    G -->|Tontine complète| G2[Message : tontine complète]
    G -->|Oui| H[Paramètres de la tontine<br/>montant, fréquence, membres, frais]
    H --> I{Accepter ?}
    I -->|Non| Z[Fin]
    I -->|Oui| J[Adhésion ACCEPTE]
    J --> K[Bloquer ma garantie]
    K --> L{Disponible suffisant ?}
    L -->|Non| M[Parcours 8 : mettre de l'argent] --> K
    L -->|Oui| N[Code secret, puis garantie bloquée]
    N --> O[Attente du quorum<br/>membres prêts : 7 sur 10]
```

## 8. Mettre de l'argent dans son coffre

Règle : le coffre n'est crédité qu'à la confirmation de l'opérateur (`audit/03`, section 1.4).

```mermaid
flowchart TD
    A[Mettre de l'argent] --> B[Montant]
    B --> C[Opérateur : MTN ou Airtel]
    C --> D[Récapitulatif avec frais éventuels]
    D --> E[Recherche de votre compte Mobile Money en cours...]
    E --> F{Réponse de l'opérateur}
    F -->|Refus| F1[Rouge : échec, rien n'a été débité]
    F -->|Accepté| G[Fenêtre de l'opérateur :<br/>saisir son code Mobile Money]
    G --> H[Orange : en attente de confirmation<br/>montant affiché à part du disponible]
    H --> I{Confirmation}
    I -->|Confirmé| J[Vert : coffre crédité, notification]
    I -->|Échec| F1
    I -->|Sans réponse| K[Interrogation automatique de l'opérateur]
    K --> I
    K -->|Délai maximal dépassé| L[EXPIRED : message, support]
```

Une double saisie ou un double appui ne crédite jamais deux fois : chaque demande porte une clé d'idempotence générée par l'application.

## 9. Régler une échéance

```mermaid
flowchart TD
    A[Notification : échéance de votre tontine] --> B[Écran échéance<br/>montant, heure limite, annulations restantes]
    B --> C{Bénéficiaire de ce tour ?}
    C -->|Oui| C1[Rien à payer ce tour-ci]
    C -->|Non| D{Choix}
    D -->|Payer maintenant| E{Disponible suffisant ?}
    E -->|Oui| F[Code secret] --> G[Vert : payé]
    E -->|Non| H[Mettre de l'argent, parcours 8] --> E
    D -->|Plus tard| I{Annulations restantes ce cycle ?}
    I -->|Oui| J[Orange : gel de min 24 h ou 50 % de la période<br/>rappel avant la fin du gel]
    I -->|Non| K[Orange : en attente<br/>parcours 11 si rien à T + 24 h]
    J --> B
```

Le bouton « Plus tard » n'est pas proposé à la bénéficiaire du tour. Sur un cycle journalier, le gel dure 12 heures (`audit/03`, section 3.3).

## 10. Régler une échéance par USSD

```mermaid
flowchart TD
    A[Composer le code court] --> B[Menu : 1 Coffre, 2 Échéance, 3 Tontine, 0 Aide]
    B -->|2| C[Montant et heure limite<br/>1 Payer maintenant, 2 Plus tard]
    C -->|1| D[Code secret]
    D --> E{Correct ?}
    E -->|Oui| F[Payé. Statut : À jour]
    E -->|Non, 3 échecs| G[Verrouillé, appeler le support]
    E -->|Non| D
    C -->|2| H{Annulations restantes ?}
    H -->|Oui| I[Report jusqu'à l'heure affichée]
    H -->|Non| J[En attente]
    B -->|session coupée| K[Aucune opération partielle<br/>recommencer]
```

Un SMS de confirmation est envoyé après chaque paiement : c'est un message critique et non répudiable (`audit/04`, section 3).

## 11. Défaut et cascade (système)

Règle : `audit/03`, section 3.2. Manque à combler `M`.

```mermaid
flowchart TD
    A[Échéance T, cotisation non payée] --> B[Adhésion EN_ATTENTE, notification orange]
    B --> C{Payé avant T + 24 h ?}
    C -->|Oui| D[ACTIF, vert]
    C -->|Non| E[INCIDENT, rouge]
    E --> F[Étape 1 : Disponible du membre, partiel accepté]
    F --> G{M couvert ?}
    G -->|Non| H[Étape 2 : Garantie du membre, en totalité]
    H --> I{M couvert ?}
    I -->|Non| J[Étape 3 : Réserve commune, au prorata]
    J --> K{M couvert ?}
    K -->|Non| L[Étape 4 : Distribution partielle<br/>tontine SUSPENDUE, vote du groupe]
    G -->|Oui| M[Bénéficiaire payé en totalité, à l'heure]
    I -->|Oui| M
    K -->|Oui| M
    M --> N[Pour redevenir ACTIF : payer la dette,<br/>2 % de pénalité et reconstituer la garantie]
```

Exemple : cotisation de 5 000 FCFA, pénalité de 100 FCFA. Un membre ne doit jamais être pénalisé pour une lenteur de l'opérateur (`audit/05`, section 3.2).

## 12. Recevoir sa cagnotte

```mermaid
flowchart TD
    A[Tour COMPLET ou couvert par la réserve] --> B[Calcul : cagnotte, frais Mitemo, net]
    B --> C[Crédit du coffre de la bénéficiaire<br/>opération interne, ne peut pas échouer]
    C --> D[Notification et SMS de réception]
    D --> E{Retirer vers Mobile Money ?}
    E -->|Plus tard| F[L'argent reste disponible dans le coffre]
    E -->|Oui, phase 1| G[Demande de retrait, code secret]
    G --> H{Opérateur disponible ?}
    H -->|Oui| I[Retrait confirmé]
    H -->|Non| J[Nouvelle tentative automatique<br/>état visible dans l'historique]
```

Le versement externe est une demande séparée et réessayable : une panne de l'opérateur ne bloque jamais la distribution (`audit/05`, section 3.1).

## 13. Se connecter au back-office

```mermaid
flowchart TD
    A["/admin/connexion"] --> B[Adresse et mot de passe]
    B --> C{Corrects ?}
    C -->|Non| C1[Message générique<br/>verrouillage après plusieurs échecs] --> B
    C -->|Oui| D[Code à usage unique de l'application d'authentification]
    D --> E{Correct ?}
    E -->|Non| C1
    E -->|Oui| F[Session ouverte, connexion journalisée]
    F --> G[Page Intégrité]
    G --> H{Inactivité prolongée}
    H --> I[Session expirée, retour à la connexion]
```

Le message d'échec ne dit jamais si c'est l'adresse ou le mot de passe qui est faux. Les comptes sont créés par un administrateur, il n'existe pas de page d'inscription.

## 14. Contrôler l'intégrité

```mermaid
flowchart TD
    A[Page Intégrité] --> B{Écart de réconciliation}
    B -->|0 FCFA| C{Chaîne de hachage}
    B -->|Non nul| D[Alerte rouge en tête de page]
    C -->|Valide| E{Solde SUSPENSE}
    C -->|Rompue| F[Première écriture invalide affichée]
    E -->|0 FCFA| G[Tout est vert]
    E -->|Non nul| H[Liste des écritures en attente d'explication]
    D --> I[Détail par opérateur et par jour]
    F --> J[Escalade : gel des distributions, phase 1]
    I --> K[Ouvrir une correction, phase 1, double validation]
    H --> K
```

## 15. Aider un membre

```mermaid
flowchart TD
    A[Appel d'un membre] --> B[Recherche par les 4 derniers chiffres du numéro]
    B --> C[Choix parmi les résultats masqués]
    C --> D[Fiche : adhésions, statuts, coffre, dernières transactions]
    D --> E{Besoin}
    E -->|Comprendre un statut| F[Historique des états avec motif et déclencheur]
    E -->|Transaction en attente| G[État chez l'opérateur, délai restant]
    E -->|Numéro complet nécessaire| H[Afficher, motif obligatoire, accès journalisé]
    E -->|Contestation| I[Ouvrir un litige, phase 1]
```

En phase 0, le back-office ne permet aucune action d'écriture.
