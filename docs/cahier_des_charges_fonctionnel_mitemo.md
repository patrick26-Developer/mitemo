# CAHIER DES CHARGES FONCTIONNEL (FRD)

**Projet :** Mitemo  
**Concepteur :** Espoir LOEMBA  
**Architecture cible :** Système d'Épargne Distribué, Flexible et Résilient  

---

## 1. MOTEUR DE GESTION DES CYCLES ET ALGORITHMES MÉTIER

### 1.1 Configuration de la Fréquence et Variables du Cycle

Le cœur du système repose sur un automate fini qui régit la création, la vie et la clôture d'un groupe d'épargne. Les états se succèdent de manière logique selon le schéma suivant : **En Création** $\rightarrow$ **Actif** $\rightarrow$ **Clôturé** ou **En Litige**.

Lors de l'initialisation de la tontine, l'Administrateur soumet le formulaire technique comprenant les variables structurelles fondamentales du cycle.

```text
Formulaire_Initialisation_Tontine
Structure ParametresTontine:
    MontantCotisation : Valeur financière fixe (Exemple: 5 000 FCFA)
    NombreParticipants : Nombre entier de membres validés pour la rotation
    FrequenceEcheance : Choix du type de cycle selon le commerce local
        • Cycle court  : Nombre défini de jours (Chaque jour, tous les 2 jours, tous les 3 jours, etc.)
        • Cycle moyen  : Nombre défini de semaines (Chaque semaine, toutes les 2 semaines, etc.)
        • Cycle long   : Nombre défini de mois (Chaque mois, tous les 2 mois)
```

### 1.2 Sécurisation des Accès et Identification Allégée (Zéro CNI)

Le système rejette toute intégration spontanée. L'accès à une tontine nécessite un jeton d'invitation cryptographique unique. La fourniture d'une pièce d'identité officielle n'est pas requise à l'inscription pour ne pas exclure les utilisateurs informels ou mineurs.

L'authentification repose exclusivement sur la liaison et la validation du numéro de téléphone. Le système s'appuie sur la vérification d'identité déjà effectuée au préalable par l'opérateur télécom lors de l'achat de la carte SIM.

### 1.3 Algorithme d'Attribution de l'Ordre de Passage

Afin de prémunir le groupe contre le risque de défaillance précoce, l'ordre de distribution de la cagnotte s'appuie sur une pondération de confiance calculée à partir de l'ancienneté sur la plateforme et du taux d'assiduité historique.

Les profils dont l'indice de confiance se situe sous un seuil critique de sécurité sont automatiquement déplacés vers le dernier tiers du calendrier des versements. L'ordre des tours intermédiaires est généré de manière transparente par un algorithme aléatoire vérifiable, exécuté 48 heures avant le lancement officiel du premier versement.

---

## 2. ARCHITECTURE DES PORTEFEUILLES ET MOTEUR DE COMPENSATION

Afin d'éviter les frais appliqués par les opérateurs télécoms sur les micro-versements réguliers, le système implémente un modèle de grand livre à compensation interne adossé aux API marchandes gratuites.

### 2.1 Système d'Approvisionnement et Moteur d'Alertes Préventives

Le système abandonne toute logique de prélèvement forcé et s'appuie sur la transparence et le contrôle de l'utilisateur. L'argent n'est jamais transféré en tâche de fond sans une action humaine explicite. Le moteur calcule le temps restant avant la date exacte du versement du membre et ajuste ses alertes.

```text
Moteur_Execution_Alertes
SI le cycle de la tontine est long ET que le temps restant avant l'échéance est égal à 10 jours:
    Déclencher la notification: "Rappel préventif de l'échéance à 10 jours."
SINON SI le solde interne est inférieur au montant attendu ET que le temps restant est inférieur à 10 jours ET qu'il s'est écoulé un intervalle de 2 jours:
    Déclencher la notification: "Relance d'alimentation progressive du compte."
SINON SI le cycle est ultra-court:
    Déclencher la notification: "Rappel matinal de flux continu adapté au marché."
```

### 2.2 Protocole d'Arbitrage Applicatif (Accepter / Annuler)

Au moment précis où le transfert doit s'effectuer vers la tontine cible, le système pousse une demande d'autorisation obligatoire.

```text
Arbitrage_Validation_Utilisateur
Selon le choix exprimé par l'utilisateur :
    Option "ACCEPTER":
        Exécuter le transfert immédiat des fonds depuis le portefeuille principal vers le portefeuille de la tontine.
        // Cette opération interne s'exécute à 0 FCFA de frais de service.
    Option "ANNULER":
        Geler temporairement la transaction pour une durée de 24 heures.
        Basculer le statut sur "En attente sans incident de paiement".
```

### 2.3 Algorithme de Conseil Budgétaire et Planification Journalière Conditionnelle

Afin d'accompagner l'utilisateur dans son effort d'épargne quotidien sans imposer de contraintes inutiles, le système intègre un moteur de calcul prédictif et des alertes basées sur le solde réel.

Le solde théorique idéal à atteindre chaque jour est calculé en divisant le montant total de la cotisation par le nombre de jours totaux du cycle, puis en multipliant ce résultat par le nombre de jours déjà écoulés depuis le début du cycle.

```text
Verification_Conditionnelle_Conseil
SI le solde actuel du portefeuille est inférieur au solde théorique calculé :
    Envoyer le SMS de conseil personnalisé :
    "Mitemo Conseil : Pour atteindre votre objectif sans effort brutal, nous vous conseillons de mettre de côté le montant journalier recommandé dès aujourd'hui."
SINON:
    Rester silencieux pour éviter toute surcharge de notifications.
```

### 2.4 Cinématique du Dépôt par API Marchande (UI & Backend)

Pour recharger le portefeuille interne, l'application utilise les passerelles de paiement commerce (MoMo Pay et Airtel Pay) qui garantissent un service gratuit pour l'utilisateur.

```text
Workflow_Approvisionnement_Compte
Étape 1 (Visuelle) : Afficher le message d'attente à l'écran :
                   "Recherche de votre compte Mobile Money en cours..."
Étape 2 (Système)  : Envoyer la requête de collecte à l'opérateur télécom.
Étape 3 (Validation): SI l'opérateur confirme l'initialisation:
                       Déclencher automatiquement le pop-up réseau sécurisé de l'opérateur (MTN ou Airtel) sur l'écran du téléphone.
                       Attendre la saisie directe du code PIN secret de l'utilisateur sur sa carte SIM pour valider le dépôt.
```

### 2.5 Flux de Clôture de Tour et Redistribution (Cash-Out)

À l'échéance exacte, le système calcule le montant de la cagnotte brute à distribuer au bénéficiaire du tour. Ce montant est égal au montant de la cotisation unitaire multiplié par le nombre total de participants moins un.

```text
Cloture_Echeance_Distribution
Étape 1 : Calculer la commission de service de la plateforme fixée à 1,5% de la cagnotte brute.
          Déduire cette commission pour obtenir le montant net à distribuer.
Étape 2 : Transférer instantanément le montant net du portefeuille de la tontine vers le portefeuille numérique du bénéficiaire.
Étape 3 : Déclencher l'ordre de virement automatique vers le compte Mobile Money externe de l'utilisateur concerné.
```

### 2.6 Moteur de Transfert de Gré à Gré (P2P Intra-Wallet)

Le système permet un transfert immédiat, sécurisé et gratuit entre les portefeuilles internes de deux utilisateurs inscrits sur la plateforme.

```text
Transfert_Direct_Gre_A_Gre
SI le numéro de téléphone du destinataire n'est pas répertorié dans la base de données :
    Bloquer la transaction et afficher l'erreur "Ce numéro ne possède pas de compte Mitemo."
SINON SI l'utilisateur émetteur valide son code PIN secret de sécurité :
    Exécuter le transfert instantané de solde à solde à 0 FCFA de frais de service.
    Envoyer une notification de confirmation immédiate au destinataire indiquant le montant reçu.
```

---

## 3. GESTION DES INCIDENTS DE PAIEMENT ET LITIGES

### 3.1 Mécanisme du Fonds de Roulement de Sécurité

Lors de l'activation d'un groupe, chaque participant doit obligatoirement bloquer une mise de garantie équivalente à la moitié d'une cotisation unitaire. Ces fonds sont isolés du circuit de distribution standard et constituent une réserve de liquidité tampon commune.

### 3.2 Processus Automatique d'Escalade Financière

* **Échéance $T$ :** Si le portefeuille interne d'un membre ne présente pas le solde nécessaire pour honorer la cotisation après la demande de validation, le système bascule son état en **En Attente**.
* **Échéance $T+24$ heures :** Sans régularisation, le profil passe en statut **Incident Opérationnel**. Le moteur financier effectue alors un prélèvement automatique sur la réserve de sécurité du groupe pour combler le manque. Cette action permet de verser la totalité de la somme due au bénéficiaire du tour à l'heure exacte, sans bloquer la vie de la tontine.
* **Pénalités et Réactivation :** Le compte de l'utilisateur défaillant est suspendu. Pour recouvrer ses droits et rétablir son statut, il doit recharger son compte du montant de sa dette initiale, assorti d'une pénalité forfaitaire de $2\%$ de la cotisation. Cette pénalité est conservée par la plateforme pour couvrir la gestion des risques.

---

## 4. PASSERELLE OMNICANALE ET SPÉCIFICATIONS D'ACCESSIBILITÉ

### 4.1 Moteur d'Interprétation SMS (Hors-ligne)

Pour les membres sans smartphone, la validation par bouton est transposée sur la passerelle SMS via un système de session interactive.

```text
Flux_Session_Interactive_SMS
Étape 1 : Le système envoie un message texte : 
          "MITEMO: Demande de transfert pour votre tontine. Répondez 1 pour ACCEPTER ou 2 pour ANNULER."
Étape 2 : SI la réponse reçue est égale à "1":
              Valider et exécuter immédiatement la transaction d'épargne.
              Renvoyer le SMS de confirmation: "MITEMO: Votre versement est enregistré. Statut actuel VERT"
          SINON SI la réponse reçue est égale à "2":
              Appliquer le gel de 24 heures et mettre la transaction en attente sans incident bloquant.
```

### 4.2 Représentation et Ergonomie Abstraite

Toute la complexité des calculs et des règles financières s'efface dans l'interface finale au profit d'une iconographie épurée basée sur des repères culturels clairs (le coffre ou la calebasse d'épargne). Les données chiffrées lourdes ou les formulations bancaires complexes sont remplacées par un code visuel à trois niveaux (**Vert** pour la conformité, **Orange** pour l'alerte, **Rouge** pour l'incident), assurant une compréhension immédiate pour tous les profils d'utilisateurs.

---

## 5. INFRASTRUCTURE ET FIABILITÉ DES DONNÉES

* **Intégrité Strictement Transactionnelle :** Les écritures sur le grand livre des portefeuilles doivent impérativement respecter les propriétés ACID. Aucune mise à jour de solde ou transfert de valeur ne peut être validé partiellement, éliminant tout risque de création de monnaie virtuelle orpheline.
* **Sécurisation des Informations :** Les données d'identification et d'état civil des utilisateurs sont chiffrées au repos via un protocole AES-256. Les connexions avec les passerelles de paiement des opérateurs télécoms s'effectuent à travers des canaux chiffrés de bout en bout (TLS 1.3).