# Carte des écrans de l'application mobile, avec audit des éléments

**Statut :** proposition, à valider en revue puis en entretien (#82). Elle complète [`architecture-information.md`](architecture-information.md), section 5, sans la remplacer tant qu'elle n'est pas validée.

**Maquettes :** canevas « Mitemo mobile, maquettes haute fidélité », icônes Lucide, aucune fenêtre modale : toute superposition est une feuille qui monte du bas (règles Apple, page *Sheets*, mise à jour du 24 mars 2026).

**Règle de lecture.** Pour chaque élément :

- **Importance** : **P1** sans lui la page ne sert à rien ; **P2** utile à la décision ; **P3** confort, peut attendre.
- **Impact** : ce que l'élément change pour la personne, et la crainte qu'il traite.
- **Source** : le constat qui le justifie. `H*` renvoie à [`recherche-habitudes-et-pertinence-ecrans.md`](recherche-habitudes-et-pertinence-ecrans.md), `UJ` à [`user-journey.md`](user-journey.md), `AI` à `architecture-information.md`.

## 1. Décisions prises pour cette carte

| Décision | Conséquence |
| --- | --- |
| Onglet **Tontines** = liste des tontines | La liste est dessinée, mais plusieurs tontines par membre restent en **phase 1** (`audit/07`). En phase 0, la liste contient une seule tontine. |
| Onglet **Caisses** = liste des caisses | Une **caisse** est une épargne d'argent avec une **date de début et une date de fin**. C'est un produit nouveau, absent du cahier des charges : ses règles sont à écrire (section 6). |
| Aucune fenêtre modale | Confirmations, code secret, aide et erreurs d'action passent par des feuilles. |

## 2. Arbre des écrans

```
Bienvenue (non connectée)
├── Mon numéro ── Code SMS ── [Inscription assistée : rendre le téléphone] ── Code secret ── Confirmer ── Compte prêt
└── Lien d'invitation reçu ──> Invitation (après inscription)

Application, quatre onglets : Accueil · Tontines · Caisses · Profil
├── Accueil
│   ├── Carte d'action (une seule : payer, régulariser, votre tour, garantie)
│   ├── Mon argent : disponible, mis de côté, en attente
│   └── Raccourcis : tontine principale, caisse la plus proche de sa fin
├── Tontines (liste ; plusieurs tontines = phase 1)
│   ├── Détail d'une tontine
│   │   ├── Mon tour, calendrier des tours
│   │   ├── Membres et statuts (présidente : qui a payé ce tour)
│   │   ├── Tirage : à venir, en cours, ordre vérifié, preuve (feuille)
│   │   └── Fiche membre en retard (présidente) ── Relancer par SMS (feuille)
│   ├── Rejoindre par lien
│   └── Créer une tontine (plein écran, 2 étapes) ── Tontine créée : inviter (feuille)
├── Caisses (liste)
│   ├── Détail d'une caisse : objectif, dates, progression, mouvements
│   ├── Ouvrir une caisse (plein écran, plusieurs étapes)
│   ├── Mettre de l'argent (feuille, grande hauteur)
│   └── Fin de caisse : argent libéré
├── Historique (depuis Accueil ou Caisses) : un cahier, filtres Tout / Entrées / Sorties
└── Profil
    ├── Appeler une personne (feuille)
    ├── Code secret · Langue et lecture à voix haute (phase 1) · Notifications
    └── Se déconnecter (feuille)

Feuilles déclenchées
├── Échéance : Payer maintenant / Plus tard ── Code secret ── Payé · Reporté · Plus de report · Solde insuffisant · Bloqué
├── Garantie : choix ── Code secret ── Solde insuffisant
├── Mettre de l'argent : montant ── Vérifier les frais ── En attente ── Confirmé · Refusé · Expiré
└── Régulariser un incident : Code secret ── Régularisé
```

Chaque page a aussi ses états transverses : **chargement**, **vide**, **hors connexion** (avec l'heure des données) et **erreur**. Ils ne sont pas répétés dans les tableaux.

## 3. Accueil

But : en deux secondes, savoir « où est mon argent » et « ai-je quelque chose à faire ».

| Élément | Importance | Impact pour l'utilisatrice | Source |
| --- | --- | --- | --- |
| Carte d'action unique (payer, régulariser, votre tour) | P1 | Dit quoi faire tout de suite ; une seule à la fois pour ne pas noyer | AI §5.2, UJ Grâce « Échéance » |
| Statut couleur + icône + mot | P1 | Compris sans lire une phrase ; « suis-je en règle ? » (Papa Albert) | AI principe 4, H11–H13 |
| Disponible **et** mis de côté, ensemble | P1 | Évite de croire qu'on a perdu l'argent bloqué | AI principe 3 |
| « En attente » séparé du disponible | P1 | Évite la panique et le double dépôt | UJ « Premier dépôt » |
| Montant et heure limite de l'échéance | P1 | Payer à l'heure sans calcul | UJ Grâce |
| Bouton « Aide » (appeler une personne) | P1 | Une personne joignable est la première réponse au soupçon d'arnaque | H15, UJ « Premier contact » |
| Résumé de la tontine (tour X sur N, bénéficiaire) | P2 | Voir que le groupe avance | UJ Mama Nadège |
| Raccourci vers la caisse la plus proche de sa fin | P2 | Rappelle l'objectif d'épargne | Hypothèse, à tester |
| Mention « protégé » / partenaire agréé | P2 | Rassure sur la garde de l'argent | H15 |
| Date du jour, salutation | P3 | Ton humain | — |

## 4. Tontines

### 4.1 Liste des tontines

| Élément | Importance | Impact pour l'utilisatrice | Source |
| --- | --- | --- | --- |
| Tri par urgence (action d'abord) | P1 | Ce qui demande une action est vu en premier | UJ Grâce |
| Statut de chaque tontine | P1 | Savoir si l'on est en règle dans chaque groupe | AI §3.2 |
| Action attendue + montant + bouton direct | P1 | Payer sans ouvrir le détail | UJ Grâce « Échéance » |
| Nom du groupe + présidente (avatar) | P1 | La présidente est le premier signe de confiance | H1, recherche §3.3 |
| Mon tour : numéro et date, ou « reçu le » | P1 | Répond à « quand est-ce mon tour ? » | Recherche §3.4 |
| Progression « tour X sur N » | P2 | Voir où en est le cycle | UJ Mama Nadège |
| Règle du groupe (cotisation, fréquence, membres) | P2 | Se souvenir de l'engagement | H4 (le cahier) |
| Badge « Présidente » + « 7 sur 10 ont payé » | P2 | Le cahier de la présidente sans ouvrir le détail | H1, H4 |
| Filtre En cours / Terminées | P3 | Retrouver une ancienne tontine | Phase 1 |
| Rejoindre par lien / Créer | P2 | Démarrer ; la plupart des membres arrivent par lien | Recherche §3.2 |

### 4.2 Détail d'une tontine

| Élément | Importance | Impact pour l'utilisatrice | Source |
| --- | --- | --- | --- |
| Mon tour mis en évidence dans l'ordre des tours | P1 | Savoir quand on reçoit | Recherche §3.4 |
| Membres et leur statut du tour en cours | P1 (présidente) / P2 (membre) | Remplace le cahier ; la présidente garde la main | H4, UJ « Ce qu'elle craint » |
| Bénéficiaire du tour et cagnotte reçue / attendue | P1 | Transparence de la collecte | UJ Mama Nadège « Premier cycle » |
| Tirage : date et heure, « Personne ne choisit l'ordre » | P1 | Équité perçue ; protège la présidente d'une accusation | UJ « Tirage » |
| Preuve du tirage (feuille, code) | P2 | Vérifiable par qui veut, sans gêner les autres | Recherche §3.4 |
| Relancer par SMS (présidente) | P1 (présidente) | Relance sans smartphone côté membre | H8 |
| Frais affichés en francs | P1 | Pas de frais découverts après coup | H16, UJ Grâce « Ce qu'elle craint » |
| Garantie et date de restitution | P2 | Comprendre pourquoi l'argent est bloqué | UJ Grâce « Garantie » |

## 5. Caisses

Hypothèse de travail : une caisse est une épargne **personnelle**, avec un montant objectif facultatif, une date de début et une date de fin. Les règles marquées « à décider » sont listées en section 6.

### 5.1 Liste des caisses

| Élément | Importance | Impact pour l'utilisatrice | Source |
| --- | --- | --- | --- |
| Total épargné, distinct du disponible | P1 | Ne jamais confondre argent bloqué et argent libre | AI principe 3 |
| Pour chaque caisse : nom + icône de l'objectif | P1 | Reconnaître sa caisse sans lire | H11–H13 |
| Montant épargné, en grand | P1 | « Combien j'ai mis de côté ? » | UJ Grâce « Ce qu'elle veut » |
| Date de fin et jours restants | P1 | Savoir quand l'argent sera libre | Définition de la caisse |
| Progression vers l'objectif (si objectif) | P2 | Motivation, voir l'effort | Hypothèse, à tester |
| Statut : en cours, terminée, argent libéré | P1 | Comprendre ce qu'on peut faire | AI §3.2 |
| Bouton « Mettre de l'argent » par caisse | P1 | Épargner les jours de bon marché | UJ Grâce « Approvisionnement » |
| Ouvrir une caisse | P2 | Démarrer une épargne | — |
| Caisses terminées (repliées) | P3 | Historique | — |

### 5.2 Détail d'une caisse

| Élément | Importance | Impact pour l'utilisatrice | Source |
| --- | --- | --- | --- |
| Dates de début et de fin | P1 | Rappel de l'engagement | Définition |
| Épargné / objectif, barre de progression | P1 | Voir où l'on en est | Hypothèse |
| Mouvements datés (comme un cahier) | P1 | Preuve de chaque dépôt | H4 |
| Règle de retrait avant la fin, écrite en une phrase | P1 | Éviter une mauvaise surprise | H16, à décider |
| Frais éventuels en francs | P1 | Aucun frais découvert après coup | H16 |

## 6. Questions ouvertes sur les caisses

1. Peut-on retirer avant la date de fin ? Si oui, avec quelle pénalité ?
2. La caisse est-elle personnelle, ou peut-elle être tenue à plusieurs ?
3. Que devient l'argent à la date de fin : libéré dans le disponible, ou reconduit ?
4. Le statut réglementaire change-t-il ? Une épargne bloquée tenue par Mitemo est à vérifier avec [`audit/02-conformite-reglementaire.md`](audit/02-conformite-reglementaire.md).
5. Frais : aucun, ou une commission ? À trancher avec #69.

## 7. Profil

| Élément | Importance | Impact pour l'utilisatrice | Source |
| --- | --- | --- | --- |
| Appeler une personne, en premier | P1 | Aide humaine toujours à un geste | H15 |
| Changer mon code secret | P1 | Reprendre la main si le code a été partagé | H14 |
| Nom et numéro masqué | P2 | Savoir sur quel compte on est | — |
| Langue et lecture à voix haute | P2, phase 1 | Lisibilité pour qui lit difficilement | H11, H13 |
| Notifications | P3 | Éviter le trop-plein | UJ « Premier cycle » |
| Se déconnecter (feuille de confirmation) | P3 | Sécurité sur un téléphone partagé | H14 |

## 8. Ce qui a été retiré, et pourquoi

| Élément | Raison |
| --- | --- |
| Pourcentages de frais | Montant en francs seulement (H16) |
| Code de tirage visible d'emblée | Ne parle pas à l'utilisatrice ; passé dans une feuille (recherche §3.4) |
| Numéros complets des membres | Données personnelles ; numéro masqué |
| Fenêtres modales centrées | Remplacées par des feuilles du bas |
