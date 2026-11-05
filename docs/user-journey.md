# Parcours de vie (user journey)

Là où [`user-flows.md`](user-flows.md) décrit les écrans d'une tâche, ce document suit une personne sur toute sa relation avec Mitemo : de la première fois qu'elle en entend parler à la relance d'un second cycle. Il sert à repérer les moments où la confiance se gagne ou se perd.

Les personas sont **fictifs**. Ils synthétisent les profils décrits dans la vision et dans [`audit/06-go-to-market-communication.md`](audit/06-go-to-market-communication.md). Ils sont à confronter aux entretiens terrain avec trois présidentes de tontine prévus en phase 0 (`audit/07`), puis à corriger.

## 1. Personas

### Mama Nadège, présidente de tontine

- 48 ans, vend du pagne au marché depuis vingt ans. Tient une tontine de 12 commerçantes depuis trois ans, au cahier.
- Smartphone Android d'entrée de gamme, données mobiles comptées. Utilise WhatsApp tous les jours.
- **Ce qu'elle veut** : ne plus garder l'argent liquide chez elle, ne plus arbitrer seule les retards, garder son autorité sur le groupe.
- **Ce qu'elle craint** : que l'application lui retire la main, qu'on l'accuse si l'argent disparaît, d'être ridicule devant les autres si elle ne comprend pas.

### Grâce, commerçante avec smartphone

- 31 ans, vend des beignets et des boissons, revenus irréguliers selon les jours de marché.
- Cotise chaque jour dans une tontine de marché. A déjà perdu de l'argent dans un « placement » disparu.
- **Ce qu'elle veut** : savoir à tout moment où est son argent, recevoir sa cagnotte à l'heure, ne pas payer de frais à chaque petite cotisation.
- **Ce qu'elle craint** : une arnaque de plus, un frais découvert après coup.

### Papa Albert, membre avec téléphone simple

- 62 ans, tailleur, téléphone à touches, lit difficilement les longs textes.
- **Ce qu'il veut** : payer sa part sans aller chez la présidente, savoir s'il est en règle.
- **Ce qu'il craint** : se tromper de touche et perdre son argent.

### Christelle, agente du support Mitemo

- 26 ans, répond au téléphone du support et tient la table de Mitemo au marché deux jours par semaine.
- **Ce qu'elle veut** : trouver en une minute pourquoi un membre est en orange, sans voir plus de données que nécessaire.
- **Ce qu'elle craint** : ne pas pouvoir répondre à une membre en colère, être soupçonnée si un solde change.

### Monsieur Ibara, membre d'un jury ou chargé de partenariat

- Responsable dans un établissement de microfinance, ou membre du jury du concours.
- **Ce qu'il veut** : juger en quelques minutes si l'équipe maîtrise l'argent et la conformité.
- **Ce qu'il craint** : une fintech de plus qui promet sans savoir où sont les fonds.

## 2. Parcours de Mama Nadège : faire passer son groupe sur Mitemo

| Étape                 | Ce qu'elle fait                                                         | Point de contact                    | Ce qu'elle pense ou ressent                              | Risque de rupture                                     | Ce que Mitemo doit faire                                                                    |
| --------------------- | ----------------------------------------------------------------------- | ----------------------------------- | -------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Découverte            | Entend parler de Mitemo par une autre présidente ou à la radio           | Bouche-à-oreille, radio, table au marché | « Encore un système ? Qui est derrière ? »          | Soupçon d'arnaque                                     | Une personne qui répond au téléphone, une présence physique (`audit/06`, section 3)        |
| Évaluation            | Ouvre le site sur son téléphone, regarde Sécurité et Frais              | Site public                         | « Où est l'argent ? Combien ça coûte vraiment ? »        | Frais flous, vocabulaire bancaire                      | Exemple chiffré simple, ce que Mitemo ne fait pas, partenaire agréé visible                 |
| Décision              | Appelle le support, pose ses questions                                   | Téléphone du support                | « Je veux parler à quelqu'un avant d'engager le groupe » | Personne ne répond                                    | Un humain, en français ou en langue locale                                                  |
| Installation          | Télécharge l'APK partagé par une amie, s'inscrit                         | Application, parcours 3             | « Ça prend combien de données ? »                        | Application trop lourde, OTP qui n'arrive pas          | APK léger, renvoi d'OTP clair                                                               |
| Création              | Crée la tontine avec les paramètres de son cahier                        | Application, parcours 6             | « Est-ce que je reste la présidente ? »                  | Paramètres qui ne correspondent pas à sa pratique      | Fréquence en jours, semaines ou mois ; récapitulatif clair                                  |
| Invitation            | Partage les liens dans le groupe WhatsApp, aide les autres à s'inscrire | WhatsApp, application               | Fierté, mais inquiétude pour les membres moins à l'aise  | Membres sans smartphone laissés de côté                | Code USSD pour ceux qui n'ont pas de smartphone ; mode cahier en phase 1 (`audit/05`, section 4.4) |
| Quorum                | Suit qui a bloqué sa garantie, relance                                  | Écran de suivi                      | « Pourquoi Albert n'a pas encore payé ? »                | Le groupe ne se remplit pas, garanties bloquées       | Suivi lisible ; annulation et restitution automatiques au délai                             |
| Tirage                | Montre au groupe le code de contrôle, puis l'ordre                       | Écran tirage, site de vérification  | Soulagement : personne ne peut l'accuser de favoritisme  | Ordre perçu comme injuste                             | Tirage vérifiable expliqué en une phrase ; préférences de tour en phase 1 (`audit/03`, section 3.5) |
| Premier cycle         | Ne collecte plus d'argent liquide, suit les statuts                      | Accueil, notifications              | « Je dors mieux »                                        | Trop de notifications                                 | Plafond de notifications par jour (`audit/04`, section 3)                                   |
| Premier incident      | Une membre ne paie pas, la cagnotte part quand même                      | Statut rouge, notification          | Surprise positive : la bénéficiaire est payée à l'heure  | Incompréhension de la cascade                         | Expliquer en une phrase ce qui a couvert le manque et ce que la membre doit faire           |
| Fin de cycle          | Le dernier tour est distribué, les garanties sont rendues                | Notification, historique            | « On recommence ? »                                      | Restitution inexacte                                  | Garanties rendues au franc près, historique complet                                         |
| Relance               | Relance un second cycle avec le même groupe                              | Application                         | Confiance établie                                        | Ressaisie fastidieuse                                 | Relancer avec les mêmes paramètres (KPI de rétention de la vision)                         |

**Moment de vérité** : le premier incident. Si la bénéficiaire est payée à l'heure malgré un défaut, Mama Nadège devient ambassadrice. Si le groupe ne comprend pas ce qui s'est passé, elle repart au cahier.

## 3. Parcours de Grâce : un premier cycle

| Étape                  | Ce qu'elle fait                                              | Ce qu'elle ressent                         | Risque de rupture                                       | Réponse                                                                       |
| ---------------------- | ------------------------------------------------------------ | ------------------------------------------ | ------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Invitation             | Reçoit le lien de Mama Nadège sur WhatsApp                   | Confiance envers la présidente, pas envers Mitemo | Lien expiré                                          | Message clair, demander un nouveau lien                                       |
| Inscription            | Numéro, OTP, code secret                                     | Inquiète de donner son numéro              | OTP qui n'arrive pas                                    | Renvoi, délai affiché, numéro du support                                      |
| Garantie               | Met de l'argent depuis MTN, bloque 2 500 FCFA                | « Pourquoi bloquer de l'argent ? »         | Ne comprend pas la garantie, abandonne                  | Expliquer : rendue en fin de cycle, protège le groupe                         |
| Approvisionnement      | Met de l'argent les jours de bon marché                      | Rassurée si le solde apparaît vite         | Solde qui n'apparaît pas, double dépôt par inquiétude   | Statut « en attente » visible, aucun double crédit                            |
| Échéance               | Reçoit la notification, appuie sur « Payer maintenant »      | Contrôle : rien ne part sans elle          | Pas assez sur le coffre                                 | Proposition immédiate de mettre de l'argent                                   |
| Mauvais jour           | Choisit « Plus tard » une fois                               | Soulagée, pas punie                        | Ne sait pas combien de reports il lui reste             | Annulations restantes affichées                                               |
| Son tour               | Reçoit sa cagnotte dans son coffre                           | Joie, preuve que ça marche                 | Retrait impossible si l'opérateur est en panne          | Argent visible au coffre, retrait réessayé (phase 1)                         |
| Fin de cycle           | Récupère sa garantie                                         | Confiance                                  | Montant différent de ce qu'elle attendait               | Détail du calcul dans l'historique                                            |

## 4. Parcours de Papa Albert : USSD

| Étape          | Ce qu'il fait                                          | Risque                                   | Réponse                                                        |
| -------------- | ------------------------------------------------------ | ---------------------------------------- | -------------------------------------------------------------- |
| Inscription    | Aidé par la présidente ou à la table du marché         | Ne peut pas s'inscrire seul              | Inscription par USSD à prévoir, aide physique en attendant     |
| Approvisionnement | Dépose par Mobile Money                             | Ne sait pas si c'est arrivé              | SMS de confirmation, critique et non répudiable               |
| Échéance       | Compose le code court, choisit 2 puis 1, saisit son code | Session coupée au milieu               | Aucune opération partielle, il peut recommencer                |
| Vérification   | Choisit 1 pour voir son coffre                         | Écran trop chargé                        | Une information par écran, moins de 160 caractères              |

Point ouvert : l'inscription entièrement par USSD n'est décrite dans aucun document. À spécifier avant le pilote, sinon les membres sans smartphone dépendent d'une tierce personne.

## 5. Parcours de Christelle : une journée au support

| Moment            | Situation                                                       | Ce dont elle a besoin                                                     | Surface                     |
| ----------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------- | --------------------------- |
| Prise de poste    | Se connecte au back-office                                      | Connexion rapide mais forte : mot de passe et code à usage unique          | Back-office, parcours 13    |
| Contrôle du matin | Vérifie l'intégrité                                             | Écart, chaîne de hachage, suspens en un coup d'œil                        | Page Intégrité              |
| Appel             | Une membre est en orange et ne comprend pas pourquoi            | Retrouver la membre par la fin de son numéro, historique des états avec motif | Fiche membre, parcours 15 |
| Appel             | « J'ai payé hier, mon coffre est vide »                         | État de la transaction chez l'opérateur, délai restant                    | Transactions                |
| Contestation      | Un membre dit n'avoir jamais autorisé un paiement               | Canal, appareil, heure et mode d'authentification de l'opération          | Journal d'audit, litige en phase 1 |
| Fin de journée    | Rien à faire de plus en phase 0 : aucune action d'écriture      | Savoir qu'elle n'a rien modifié, et que c'est prouvable                   | Journal d'audit             |

## 6. Parcours de Monsieur Ibara : évaluer le sérieux

| Étape            | Ce qu'il regarde                                    | Ce qui le convainc                                                     |
| ---------------- | --------------------------------------------------- | ---------------------------------------------------------------------- |
| Site public      | Sécurité, Frais                                     | Où sont les fonds, frais réels, ce que Mitemo ne fait pas              |
| Démonstration    | Un tirage, puis sa vérification en direct           | Personne, pas même Mitemo, ne peut truquer l'ordre                     |
| Démonstration    | Un défaut absorbé par la cascade                    | La bénéficiaire est payée à l'heure, le grand livre boucle             |
| Back-office      | Page Intégrité                                      | « Écart : 0 FCFA, chaîne de hachage valide »                          |

C'est le parcours de démonstration de la phase 0 (`audit/07`) : un chemin heureux, un chemin d'échec, de bout en bout.

## 7. Moments de vérité

| Moment                         | Ce qui se joue                                   | Exigence                                                         |
| ------------------------------ | ------------------------------------------------ | ---------------------------------------------------------------- |
| Premier contact                | Le soupçon d'arnaque                             | Un humain joignable, un partenaire agréé visible                 |
| Premier dépôt                  | « Mon argent est-il arrivé ? »                   | Statut en attente lisible, jamais de double crédit               |
| Tirage                         | L'équité perçue                                  | Vérifiable par n'importe qui                                     |
| Premier défaut                 | La promesse de sécurité                          | Bénéficiaire payée à l'heure, explication en une phrase          |
| Panne de l'opérateur           | La responsabilité                                | Argent visible au coffre, aucune pénalité imputable à l'opérateur |
| Changement de téléphone        | La sécurité contre la commodité                  | Carence et notification, même si c'est lent                     |
| Fin de cycle                   | La relance                                       | Garanties exactes, relance en un geste                           |
