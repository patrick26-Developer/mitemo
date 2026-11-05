# ARCHITECTURE TECHNIQUE — RECOMMANDATIONS

---

## 1. Les principes non négociables

Avant tout choix de technologie, ces cinq propriétés déterminent si le système est digne de confiance. Elles sont indépendantes du langage et aucune n'est optionnelle pour un produit qui manipule l'épargne de tiers.

### 1.1 Grand livre en partie double, append-only

Le §5 du cahier des charges demande l'ACID et redoute la « monnaie virtuelle orpheline ». La bonne réponse n'est pas de mettre des transactions autour des mises à jour de solde : c'est de **rendre le déséquilibre structurellement impossible**.

Aucune colonne `solde` n'est la source de vérité. Tout mouvement est une écriture de journal composée d'au moins deux imputations dont la **somme algébrique est nulle**. Le solde d'un compte est la somme de ses imputations, avec une photographie matérialisée pour la lecture rapide.

Comptes à prévoir au plan comptable interne :

| Type de compte | Rôle |
|---|---|
| `WALLET_USER` | Portefeuille principal d'un membre |
| `POT_TONTINE` | Cagnotte du tour en cours d'un groupe |
| `GUARANTEE_TONTINE` | Fonds de roulement de sécurité du groupe (§3.1) |
| `GUARANTEE_MEMBER` | Quote-part individuelle, nécessaire pour la cascade d'imputation |
| `CLEARING_MTN` / `CLEARING_AIRTEL` | Compte de passage par opérateur, pour les fonds en vol |
| `PLATFORM_REVENUE` | Commissions et pénalités encaissées |
| `PLATFORM_FEES_PSP` | Frais payés aux opérateurs — poste de coût de P1, à rendre mesurable |
| `AGENT_FLOAT` | Flottant d'un agent de dépôt en espèces (phase 2) |
| `SUSPENSE` | Écarts non expliqués. Doit tendre vers zéro, et toute écriture ici déclenche une alerte |

**Montants en entiers de FCFA (`BIGINT`), jamais en flottant.** Le franc CFA n'a pas de sous-unité en circulation : c'est une simplification rare et précieuse, il faut en profiter. Toute division (commission, solde théorique journalier du §2.3) doit avoir une règle d'arrondi explicite et un compte de destination pour le reliquat.

### 1.2 Journal infalsifiable par chaînage de hachage

Chaque écriture porte le hachage de la précédente. Toute modification rétroactive casse la chaîne. Publier périodiquement le hachage de tête — dans un dépôt public, ou envoyé au partenaire agréé — donne une **preuve d'intégrité** vérifiable par un tiers.

Coût d'implémentation : faible. Valeur devant un auditeur, un partenaire bancaire ou un jury : considérable. C'est le genre de détail qui fait la différence entre un prototype et une infrastructure.

### 1.3 Idempotence partout

Les *webhooks* des opérateurs mobile money **seront** livrés plusieurs fois, dans le désordre, et parfois après un délai de plusieurs heures. Le réseau d'un utilisateur de marché coupera au milieu d'une validation, et il appuiera deux fois.

Toute écriture — appel d'API client comme rappel opérateur — porte une clé d'idempotence stockée et contrôlée. Un même ordre rejoué ne produit jamais deux écritures. Sans cela, le double crédit n'est pas un risque, c'est une certitude.

### 1.4 Jamais de crédit sur la foi d'un code 200

Le §2.4 décrit bien la cinématique de dépôt mais s'arrête à la saisie du PIN. Il manque la partie dangereuse.

Le flux correct comporte trois états : `INITIATED` → `PENDING` → `CONFIRMED` ou `FAILED` ou `EXPIRED`. Le portefeuille n'est crédité **qu'au passage en `CONFIRMED`**, lequel ne peut venir que d'un rappel signé de l'opérateur ou d'une interrogation d'état réussie. Entre-temps les fonds vivent au compte `CLEARING_*`. Tout `PENDING` dépassant son délai est réconcilié par interrogation, jamais abandonné silencieusement.

### 1.5 Réconciliation quotidienne automatique

Totalement absente des deux documents, et c'est le contrôle opérationnel le plus important de tout le système.

Un travail quotidien compare la somme du grand livre interne au solde réel du compte de cantonnement chez le partenaire et aux relevés de chaque opérateur. **Tout écart non nul déclenche une alerte humaine.** Pas un rapport consulté une fois par semaine : une alerte.

C'est aussi le meilleur élément de démonstration possible. Un tableau de bord qui affiche « écart de réconciliation : 0 FCFA — dernière vérification il y a 4 minutes » dit à un partenaire financier que l'équipe sait ce qu'elle fait.

---

## 2. Les automates d'états : il en faut quatre, pas un

Le §1.1 décrit un seul automate à quatre états (`En Création` → `Actif` → `Clôturé` ou `En Litige`). C'est très insuffisant : il manque les états d'attente, de suspension et d'annulation, et surtout il mélange trois niveaux de granularité différents.

### Automate 1 — Tontine

```
BROUILLON
  → RECRUTEMENT            (invitations envoyées, quorum non atteint)
  → COLLECTE_GARANTIES     (quorum atteint, garanties en cours de blocage)
  → TIRAGE_ORDRE           (fenêtre de 48 h du §1.3, engagement du tirage)
  → ACTIVE                 (cycle en cours)
  → SUSPENDUE              (gel global : litige, fraude, décision collective)
  → CLOTUREE_NORMALE
  → CLOTUREE_ANTICIPEE     (dissolution votée ou imposée)
  → ANNULEE                (quorum jamais atteint, garanties restituées)
```

Deux transitions manquantes au cahier des charges et indispensables : `ANNULEE` (que fait-on des garanties déjà bloquées si le groupe ne se remplit jamais ?) et `CLOTUREE_ANTICIPEE` (comment liquide-t-on un groupe à mi-cycle ?).

### Automate 2 — Adhésion d'un membre à une tontine

```
INVITE → ACCEPTE → GARANTIE_BLOQUEE → ACTIF
ACTIF → EN_ATTENTE          (échéance T, solde insuffisant — §3.2)
ACTIF → GELE_24H            (option ANNULER du §2.2)
EN_ATTENTE → INCIDENT       (T+24 h sans régularisation)
INCIDENT → ACTIF            (régularisation + pénalité)
INCIDENT → EXCLU            (seuil de défaillance atteint)
ACTIF → SORTANT             (sortie demandée en cours de cycle)
ACTIF → SUCCESSION          (décès, incapacité)
```

### Automate 3 — Tour (round)

```
PLANIFIE → OUVERT → COLLECTE_EN_COURS → COMPLET
COMPLET → DISTRIBUE → SOLDE
COLLECTE_EN_COURS → COUVERT_PAR_RESERVE   (défaut comblé, §3.2)
DISTRIBUE → ECHEC_DISTRIBUTION            (panne opérateur, à reprendre)
```

### Automate 4 — Transaction

```
INITIATED → PENDING → CONFIRMED | FAILED | EXPIRED
CONFIRMED → REVERSED   (contre-écriture, jamais une suppression)
```

**Règle d'or : on n'annule jamais une écriture, on écrit sa contrepartie.** Un grand livre ne connaît pas le `DELETE`.

Chaque transition doit être journalisée avec son auteur, son horodatage, son motif et son déclencheur (utilisateur, planificateur, opérateur, administrateur). C'est la base du traitement des litiges : sans ce journal, aucun litige n'est arbitrable.

---

## 3. Correctifs aux règles métier sous-spécifiées

### 3.1 La convention de cagnotte (§2.5)

À trancher et à écrire noir sur blanc. Je recommande la **convention B**, la plus répandue dans les tontines congolaises et la plus simple à expliquer :

> Le bénéficiaire du tour ne cotise pas à son propre tour. La cagnotte vaut `C × (N−1)`. Sur un cycle complet de `N` tours, chaque membre verse `C × (N−1)` et reçoit `C × (N−1)`. Le jeu est à somme nulle avant commission.

Ce qui donne, net de commission à 1,5 % : chaque membre verse `C × (N−1)` et reçoit `C × (N−1) × 0,985`. Le coût réel du service pour le membre est donc `C × (N−1) × 0,015` sur tout le cycle — une phrase qu'il faut savoir dire simplement, parce qu'un membre la posera.

### 3.2 La cascade d'imputation en cas de défaut

Le §3.2 dit que la réserve comble le manque. Il ne dit pas dans quel ordre, ni ce qui arrive quand elle est vide. Sans cette cascade, le grand livre ne peut pas boucler. Ordre proposé :

```
Manque à combler = M

1. Solde disponible du portefeuille du défaillant (partiel accepté)
2. Garantie individuelle du défaillant (GUARANTEE_MEMBER) — intégralement avant de toucher autrui
3. Réserve commune (GUARANTEE_TONTINE), au prorata des quotes-parts restantes
4. Réserve épuisée : distribution partielle au bénéficiaire
   + bascule de la tontine en SUSPENDUE
   + vote du groupe : poursuivre à montant réduit, ou clôturer par anticipation
```

Règles complémentaires à inscrire :

- Le défaillant doit **reconstituer sa garantie** en plus de sa dette et de sa pénalité pour redevenir `ACTIF`. Le §3.2 ne le prévoit pas, ce qui laisse le groupe durablement sous-protégé après le premier incident.
- À la clôture, la réserve est restituée **au prorata**. La quote-part du membre exclu est affectée en priorité aux membres lésés, le solde éventuel à `PLATFORM_REVENUE`.
- La garantie du **bénéficiaire du tour 1** devrait être majorée (voir le risque du premier tour dans `01-modele-economique.md`).

### 3.3 Le plafond sur « ANNULER » (§2.2)

Tel qu'écrit, « gel 24 h sans incident de paiement » est reconductible à l'infini. À borner :

- **2 annulations maximum par membre et par cycle.** Au-delà, le choix `ANNULER` bascule directement en `EN_ATTENTE`.
- **Interdit au bénéficiaire du tour en cours** — il ne peut pas geler le tour dont il profite.
- **Interdit si le gel ferait manquer l'échéance de distribution.** Sur un cycle journalier, un gel de 24 h consomme tout le tour : le délai de grâce doit être proportionnel à la fréquence du cycle, pas fixé à 24 h en dur. Proposition : `min(24 h, 50 % de la période du cycle)`.

### 3.4 Le tirage aléatoire vérifiable (§1.3)

« Vérifiable » doit être une propriété, pas un adjectif. Protocole de **mise en gage puis révélation** (*commit-reveal*), simple et prouvable :

1. **H−48 h** : le serveur tire une graine aléatoire `S`, publie `H(S)` à tous les membres (notification, et consultable dans l'application). La graine reste secrète.
2. **H−0** : le serveur révèle `S`. L'ordre est calculé par un algorithme déterministe et public à partir de `S` et de la liste ordonnée des identifiants de membres.
3. **Vérification** : n'importe quel membre — ou un journaliste, ou un jury — recalcule `H(S)` et rejoue l'algorithme. S'il obtient le même ordre, le tirage n'a pas été manipulé.

Renforcement optionnel et élégant : chaque membre contribue sa propre graine, et `S` est la combinaison de toutes. Personne, pas même Mitemo, ne peut alors choisir le résultat. C'est un argument de confiance très fort et c'est **du marketing autant que de la technique** : « chez nous, le tirage est prouvable ».

### 3.5 Le démarrage à froid de la pondération de confiance (§1.3)

Dans un groupe neuf, personne n'a d'historique : la pondération ne discrimine rien et la règle du « dernier tiers » est indéfinie. Et surtout, dans la vraie vie **l'ordre se négocie** — celle qui a des frais de scolarité en septembre veut la place de septembre, celle qui achète du stock avant les fêtes veut décembre. Un algorithme qui ignore cela sera contourné hors de l'application.

Proposition de refonte :

1. Chaque membre déclare optionnellement une **préférence de tour** avec un motif.
2. L'administrateur propose un ordre tenant compte des préférences.
3. Le groupe **approuve par vote** (majorité ou unanimité, paramétrable).
4. **À défaut d'accord**, tirage vérifiable (§3.4).
5. La confiance n'intervient plus comme pondération mais comme **contrainte dure unique** : un profil sans historique ou sous le seuil critique **ne peut pas occuper les tours 1 et 2**. Une règle, compréhensible et défendable, au lieu d'une pondération opaque.

Cela respecte la dynamique sociale que la vision revendique comme son avantage sur les télécoms, tout en gardant la protection contre la défaillance précoce.

### 3.6 Le solde théorique journalier (§2.3)

La formule — cotisation totale divisée par le nombre de jours du cycle, multipliée par les jours écoulés — est juste mais incomplète en production :

- Elle suppose une épargne linéaire. Une commerçante de marché a des revenus très irréguliers (jour de marché contre jour creux). Un conseil qui ignore cela sera perçu comme stupide et désactivé.
- Division non entière : spécifier l'arrondi et placer le reliquat sur la dernière échéance.
- **Cadencer les notifications** : le conseil ne doit se déclencher qu'au franchissement d'un seuil, pas chaque jour où le solde est en retard — sinon c'est un message quotidien identique, c'est-à-dire du bruit, c'est-à-dire une désinstallation.

### 3.7 Le scoring : à spécifier maintenant, à livrer plus tard

Trois recommandations fortes :

1. **À base de règles, pas d'apprentissage automatique, pour la v1.** Un score explicable (« vous êtes à 82 parce que 11 versements à l'heure sur 12 ») est utilisable par un agent de crédit, contestable par l'utilisateur et défendable devant un régulateur. Un modèle statistique sur 500 utilisateurs ne vaut rien, et sera soupçonné de discriminer.
2. **Visible et contestable.** L'utilisateur doit voir son score, comprendre ce qui le fait bouger, et pouvoir signaler une erreur.
3. **Attention à la boucle de rétroaction** introduite par le §1.3 : un score faible relègue en fin de calendrier, position moins avantageuse, ce qui pénalise sans améliorer. Documenter explicitement pourquoi la mesure est proportionnée — on vous le demandera.

Point d'architecture : capturer les événements d'assiduité dès le jour 1 dans un journal immuable, même sans calculer de score. On ne peut pas reconstituer un historique qu'on n'a pas enregistré.

---

## 4. Choix de technologies

### 4.1 Application mobile : Flutter

| Option | Verdict |
|---|---|
| **Flutter / Dart** | **Recommandé.** Rendu fluide sur entrée de gamme, APK compact, excellent hors-ligne, base de code unique. |
| React Native | Acceptable si l'équipe est déjà très solide en JS. Plus lourd et plus capricieux sur Android bas de gamme. |
| Android natif (Kotlin) | Meilleure performance, mais coût doublé le jour où iOS deviendra pertinent. |
| PWA | **À éviter en canal principal.** Notifications et hors-ligne fragiles, et la découverte passe par le navigateur dans un marché où elle passe par le partage d'APK. |

Contraintes à tenir et à traiter comme des exigences, pas des souhaits :

- **Cible Android 7.0 (API 24) minimum.** Le parc est ancien.
- **APK sous 20 Mo.** La donnée mobile est chère : au-delà, les gens n'installent pas.
- **Hors-ligne d'abord.** Base locale chiffrée, file d'attente d'actions, synchronisation à la reconnexion. L'utilisateur doit pouvoir consulter son solde, son calendrier et son historique sans réseau. Seule la confirmation de paiement exige la connexion.
- **Distribution hybride.** Google Play (prévoir 2 à 4 semaines de revue pour une application financière, et des exigences documentaires) **et** APK direct partageable, parce que c'est ainsi que les applications circulent réellement à Brazzaville.
- iOS en phase 3, pas avant. Part de marché négligeable sur ce segment.

### 4.2 Dorsal : monolithe modulaire

**Ne pas faire de microservices.** Avec une équipe de un à trois développeurs, cela multiplie les pannes partielles, et une panne partielle sur un grand livre financier, c'est de l'argent perdu. Un monolithe modulaire — des modules à frontières nettes dans un seul déployable — donne les mêmes bénéfices de conception sans le coût d'exploitation, et se découpe plus tard si nécessaire.

| Option | Pour | Contre |
|---|---|---|
| **NestJS + TypeScript** | Recrutement le plus facile localement, types partagés avec le back-office web, écosystème très fourni | Manipuler de l'argent en JS exige de la discipline : entiers obligatoires, zéro flottant, règle de *lint* dédiée |
| **Go** | Le meilleur pour la justesse du grand livre et la simplicité d'exploitation, binaire unique, hébergement très économe | Vivier de recrutement plus étroit |
| Spring Boot / Kotlin | Très solide, culture bancaire | Lourd, consommation mémoire élevée donc hébergement plus cher |
| Django / Python | Développement rapide, bon back-office intégré | Moins à l'aise sur la concurrence et les travaux planifiés |

**Recommandation : NestJS + TypeScript si l'équipe est JavaScript, Go si elle peut l'être.** Les cinq principes de la section 1 comptent cent fois plus que ce choix.

### 4.3 Base de données : PostgreSQL

Rien d'autre à envisager ici.

- Montants en `BIGINT`. Jamais `float`, jamais `double`.
- Isolation `SERIALIZABLE` ou `REPEATABLE READ` avec verrouillage explicite sur les écritures de journal, et reprise sur conflit de sérialisation.
- Contraintes de base qui font le travail à la place du code applicatif : une contrainte différée vérifiant que la somme des imputations d'une écriture est nulle, un index unique sur les clés d'idempotence, des contraintes de vérification sur les transitions d'états.
- Sauvegardes : restauration à un instant donné, et **test de restauration mensuel effectivement réalisé**. Une sauvegarde jamais restaurée n'est pas une sauvegarde.
- Pas de Redis au départ. Un cache ajoute une source d'incohérence pour un gain nul à cette échelle.

### 4.4 Ordonnancement du cycle de vie

Le cycle de tontine est un processus de longue durée à minuteries multiples (J−10, toutes les 48 h, T, T+24 h). C'est le composant le plus facile à rater.

| Option | Quand |
|---|---|
| **File durable adossée à PostgreSQL** (`pg-boss`, `River`, ou une table `due_at` avec un travailleur élu) | **Recommandé en v1.** Simple, transactionnel avec le grand livre, suffisant. |
| Temporal | Techniquement le bon outil — minuteries durables, reprises, versionnement des cycles en vol. Mais c'est un service de plus à exploiter. À reconsidérer en phase 2. |
| `cron` système | **À exclure.** Pas d'idempotence, pas de reprise, pas de traçabilité. C'est ainsi qu'on envoie deux fois la même cagnotte. |

Propriété exigée : effet exactement une fois, et rejouabilité complète de l'état depuis le journal d'événements.

### 4.5 Canaux : des adaptateurs, jamais du métier

Quatre canaux pour le même noyau. Le domaine ne doit **rien** savoir du canal utilisé :

| Canal | Usage | Coût |
|---|---|---|
| Application Flutter | Canal riche, smartphones | Notifications *push* FCM gratuites |
| **USSD** | Téléphones simples : arbitrage, consultation de solde, saisie du PIN | Code court à négocier, session à la charge de l'utilisateur |
| SMS | **Confirmations non répudiables et alertes critiques uniquement** | 8 à 56 FCFA l'unité — à rationner |
| Back-office web | Exploitation, support, arbitrage des litiges | — |

Plus les rappels entrants des opérateurs, qui doivent être traités comme non fiables : signature vérifiée, idempotents, rejouables.

**Correctif de sécurité au §4.1 :** l'arbitrage hors-ligne passe par USSD avec saisie du PIN dans la session. Si une réponse par SMS doit absolument être conservée en secours, elle doit inclure le PIN (`1 1234`), être limitée en débit, verrouiller après trois échecs, et **ne jamais être le canal par défaut**.

### 4.6 Authentification et le point le plus dangereux du système

- Enrôlement : numéro + OTP, puis liaison de l'appareil.
- Usage courant : PIN à six chiffres (pas quatre), biométrie optionnelle en complément.
- Stockage du PIN : Argon2id, salé. Jamais récupérable, seulement réinitialisable.
- Limitation de débit et verrouillage progressif sur le PIN comme sur l'OTP.

**Le ré-enrôlement sur un nouvel appareil doit être le parcours le plus difficile du produit.** Le *SIM swap* est le premier vecteur de fraude du mobile money dans la région : l'attaquant obtient une SIM au nom de la victime et reçoit ses OTP. Mesures cumulatives à imposer :

1. Délai de carence de 24 à 72 h avant toute sortie de fonds depuis un nouvel appareil.
2. Notification sur l'ancien appareil et par SMS au numéro, avec possibilité de blocage immédiat.
3. Gel des transferts sortants pendant la carence, les entrées restant possibles.
4. Revue humaine obligatoire au-dessus d'un seuil de solde.
5. Vérification de l'ancienneté de la SIM auprès de l'opérateur lorsque l'API le permet — demande à inscrire à la négociation du partenariat.

C'est lent, c'est frustrant, et c'est exactement ce qu'il faut. Les utilisateurs pardonnent une lenteur ; ils ne pardonnent pas un vol.

### 4.7 Observabilité et audit technique

- Journaux structurés, avec **interdiction stricte de journaliser PIN, OTP et numéros complets**. Une règle de *lint* ou un filtre central, pas une consigne orale.
- Traçage distribué (OpenTelemetry) sur les échanges avec les opérateurs : quand MoMo ralentit, il faut le prouver.
- Sentry pour les erreurs applicatives et mobiles.
- Tableaux de bord métier (Metabase ou Grafana) : les KPI du document `01`, et la réconciliation en évidence.
- **Journal d'audit distinct des journaux techniques** : qui a fait quoi, quand, depuis quel appareil, sur quel compte. Conservation longue, en écriture seule.
- Toute intervention manuelle sur le grand livre exige une **double validation** par deux comptes administrateurs distincts, avec motif obligatoire. C'est la seule protection contre l'administrateur malhonnête — et l'administrateur, c'est aussi toi.

### 4.8 Tests : où l'effort doit aller

Priorités, par rapport valeur/effort décroissant :

1. **Tests de propriété sur le grand livre** : quelle que soit la séquence d'opérations générée aléatoirement, la somme de toutes les imputations reste nulle et aucun solde de portefeuille ne devient négatif. C'est le test le plus rentable de tout le projet.
2. **Simulation de cycle complet** : `N` membres, `k` défaillants, vérifier que la cascade d'imputation boucle et que les restitutions de garantie sont exactes.
3. **Tests d'idempotence** : rejouer chaque rappel opérateur deux fois, dans le désordre, après expiration. Aucun double effet.
4. **Simulateur d'opérateur** : un faux MoMo qui répond lentement, échoue, livre en double, renvoie des états incohérents. Indispensable, et accessoirement c'est ce qui permet de faire une démonstration sans argent réel.
5. Tests de bout en bout sur les parcours critiques seulement. Ne pas chercher la couverture totale de l'interface.

---

## 5. Diagramme de flux cible

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐
│ App Flutter  │  │  USSD *XXX#  │  │  SMS entrant │  │  Back-office  │
│ (hors-ligne) │  │  (sessions)  │  │  (secours)   │  │  (web)        │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └───────┬───────┘
       └─────────────────┴─────────────────┴──────────────────┘
                                 │
                   ┌─────────────▼─────────────┐
                   │  Couche adaptateurs       │
                   │  (clés d'idempotence)     │
                   └─────────────┬─────────────┘
                                 │
        ┌────────────────────────▼────────────────────────┐
        │              NOYAU MÉTIER                       │
        │  Identité · Tontine · Grand livre (partie       │
        │  double) · Ordonnanceur · Notifications ·       │
        │  Scoring (phase 3) · LBC-FT                     │
        └───┬──────────────────┬──────────────────┬───────┘
            │                  │                  │
   ┌────────▼────────┐  ┌──────▼───────┐  ┌───────▼────────┐
   │  PostgreSQL     │  │  File        │  │  Adaptateurs   │
   │  journal chaîné │  │  durable     │  │  de paiement   │
   │  append-only    │  │  (minuteries)│  │  (interface    │
   └─────────────────┘  └──────────────┘  │  unique)       │
            │                              └───────┬────────┘
            │                                      │
   ┌────────▼─────────────┐          ┌─────────────▼──────────────┐
   │  Réconciliation      │◄─────────┤  MTN MoMo · Airtel Money   │
   │  quotidienne         │          │  Partenaire agréé (COBAC)  │
   │  écart ≠ 0 → ALERTE  │          └────────────────────────────┘
   └──────────────────────┘
```

Le point important du schéma : **l'adaptateur de paiement est une interface unique**. Passer d'un agrégateur à un contrat direct opérateur — le levier tarifaire du document `01` — doit être un changement d'implémentation, pas une réécriture.
