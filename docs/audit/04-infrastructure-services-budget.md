# INFRASTRUCTURE, SERVICES EN LIGNE ET BUDGET

> Tous les montants sont des ordres de grandeur de marché à novembre 2026, convertis à 1 EUR ≈ 656 FCFA (parité fixe) et 1 USD ≈ 570 FCFA (variable). Les postes marqués **[DEVIS]** ne s'obtiennent que par négociation directe et peuvent faire varier le budget d'un facteur deux.

---

## 1. Hébergement

### Le dilemme

Il n'existe pas de région de fournisseur mondial en Afrique centrale. Trois familles d'options, et le choix est un compromis entre coût, latence et confort réglementaire.

| Option | Latence depuis Brazzaville | Coût mensuel indicatif (pilote) | Remarques |
|---|---|---|---|
| **Scaleway (Paris)** | ~110-150 ms | 40-80 € | Support francophone, PostgreSQL managé, bon rapport qualité/prix. **Recommandé.** |
| **OVHcloud (Paris / Gravelines)** | ~110-150 ms | 30-70 € | Équivalent, francophone, offre managée un peu moins aboutie |
| Hetzner (Allemagne / Finlande) | ~130-170 ms | 15-40 € | Le moins cher du marché, mais pas de support francophone et pas de région africaine |
| AWS `af-south-1` (Le Cap) | ~90-130 ms | 150-300 € | Le plus proche géographiquement, mais 2 à 3× le prix et une facture difficile à prévoir |
| Azure South Africa North | ~90-130 ms | 150-300 € | Idem |
| Datacenter local (Congo Télécom, Liquid, DC national de Brazzaville) | ~5-30 ms | **[DEVIS]** | Meilleur argument réglementaire, mais fiabilité électrique et réseau à auditer sur place avant tout engagement |

Le gain de latence du Cap par rapport à Paris (30 à 40 ms) est réel mais marginal pour ce produit : les appels sont peu nombreux et asynchrones, le réseau mobile local ajoute de toute façon 100 à 300 ms de gigue. **La latence n'est pas le bon critère de décision ici ; le coût et la capacité d'exploitation le sont.**

### Recommandation

1. **Principal : Scaleway Paris.** Deux petites machines (application, travailleur) plus PostgreSQL managé avec sauvegardes et restauration à un instant donné. Coût prévisible, support en français, assez d'abstraction pour une petite équipe.
2. **Copie de conformité en zone CEMAC.** Une réplique en lecture ou une sauvegarde chiffrée hébergée localement, documentée dans le registre des traitements. Cela répond à la préférence des autorités pour un hébergement en zone CEMAC sans payer le prix d'une exploitation locale complète (voir `02-conformite-reglementaire.md`).
3. **Documenter la base légale du transfert** vers l'Union européenne, qui offre un niveau de protection reconnu - c'est précisément l'argument qui rend le montage défendable.
4. **Ne pas faire de multi-région active.** À cette échelle c'est une complexité pure.

### Ce qu'il faut budgéter en plus et qu'on oublie toujours

- **Environnement de recette** séparé, obligatoire pour tester les intégrations opérateur : +50 % du coût du principal.
- **Sauvegardes hors site** en stockage objet chez un autre fournisseur. Une sauvegarde chez le même hébergeur que la production n'est pas une sauvegarde.
- **Supervision externe** : un service qui surveille depuis l'extérieur, parce que quand tout tombe, votre propre supervision tombe aussi.

---

## 2. Nom de domaine

**Le `.cg` est anormalement cher** : les registraires internationaux le facturent entre 350 et 600 USD par an (Netim ~353 USD, AtakDomain ~450 USD, 101domain ~472 USD, Instra ~499 USD, Africa Registry ~597 USD). L'extension est administrée par l'agence congolaise des technologies de l'information, en premier arrivé premier servi, sans procédure particulière.

### Stratégie recommandée

| Priorité | Domaine | Coût annuel | Rôle |
|---|---|---|---|
| 1 | `mitemo.com` | 10-15 € | Principal. À réserver immédiatement. |
| 2 | `mitemo.africa` | 20-40 € | Ancrage continental, bon en communication |
| 3 | `mitemo.app` | 15-20 € | Téléchargement de l'APK, liens profonds |
| 4 | `mitemo.cg` | **330-550 €** | Crédibilité nationale. À acquérir **après** le financement, pas avant. |

**À faire aujourd'hui, avant toute publicité liée au concours :** réserver les trois premiers domaines et les identifiants sociaux (Facebook, Instagram, TikTok, LinkedIn, X, WhatsApp Business). Une couverture presse sur un projet primé déclenche systématiquement du squatting de nom. Coût total : moins de 50 €. Ne pas le faire est une erreur qui coûte cher et qu'on ne peut plus réparer.

Et en parallèle : **déposer la marque à l'OAPI** - un seul dépôt couvre les 17 États membres dont le Congo.

---

## 3. Messagerie et canaux

C'est le poste qui décide de la rentabilité (voir P2 dans `00-synthese-et-points-critiques.md`).

### Comparatif des coûts par message

| Fournisseur | Coût par SMS vers le Congo | En FCFA |
|---|---|---|
| Twilio | ~0,0915 USD | ~52 FCFA |
| Infobip | ~0,0858 USD | ~49 FCFA |
| Sinch | ~0,0758 USD | ~43 FCFA |
| Plivo | ~0,0375 USD | ~21 FCFA |
| **Direct MTN / Airtel Congo** | **[DEVIS]** | **~8-20 FCFA attendus** |
| **Notification push (FCM)** | **0** | **0** |
| **Session USSD** | À la charge de l'utilisateur ou en partage de revenu | **~0 pour Mitemo** |

### Architecture de messagerie recommandée

```
Événement à notifier
   │
   ├─ L'utilisateur a un smartphone avec l'application ?
   │     → PUSH (gratuit). Repli SMS seulement si non lu après X heures
   │       ET si le message est critique.
   │
   ├─ L'utilisateur a un téléphone simple ?
   │     → L'action lui appartient : SESSION USSD qu'il initie
   │       (rappel par un SMS unique si vraiment nécessaire)
   │
   └─ Message critique non répudiable (confirmation d'encaissement,
      réception de cagnotte, alerte de sécurité) ?
         → SMS, toujours, quel que soit le terminal
```

Règles à inscrire au cahier des charges, en remplacement du moteur d'alertes des §2.1 et §2.3 :

1. **Plafond dur de notifications par utilisateur et par jour** - 1 SMS maximum, 3 *push* maximum.
2. **Le conseil budgétaire du §2.3 passe en *push* ou en consultation dans l'application, jamais en SMS.** C'est un service agréable, pas une information critique : il ne justifie pas 20 FCFA par envoi.
3. **Le « rappel matinal de flux continu » des cycles ultra-courts doit être un *push*.** En SMS quotidien, c'est le poste de coût qui tue le produit.
4. **Groupement des messages** : un seul SMS récapitulant trois tontines plutôt que trois SMS.
5. **Préférences utilisateur** respectées, et désabonnement possible du non-critique.

### WhatsApp Business

À considérer sérieusement. WhatsApp est massivement utilisé à Brazzaville, le canal supporte les boutons interactifs (parfait pour l'arbitrage Accepter/Annuler), la richesse visuelle et les messages vocaux. Les messages à l'initiative de l'entreprise sont facturés par modèle de message selon la catégorie, mais les fenêtres de conversation ouvertes par l'utilisateur sont gratuites ou bien moins chères qu'un SMS.

Positionnement : **canal intermédiaire** entre le *push* et le SMS, et excellent canal de support.

### Le code court USSD : à lancer maintenant

C'est **l'élément au plus long délai d'obtention de tout le projet** - comptez des mois de négociation avec MTN Congo puis Airtel Congo, séparément. Structure de coût typique : frais de mise en service, loyer mensuel du code court, et parfois un partage de revenu.

**[DEVIS]** à demander dès cette semaine. Même si le produit n'est pas prêt, la négociation doit être commencée : un code court obtenu est aussi une barrière à l'entrée, et c'est un élément très concret à montrer à un jury ou à un partenaire.

### Voix : la piste sous-estimée

Le §4.2 a l'intuition juste sur l'iconographie. Il faut aller plus loin : pour une partie du cœur de cible, **un message vocal en lingala ou en kituba est plus efficace que n'importe quel texte**. Dans l'application, c'est gratuit (fichiers audio pré-enregistrés, une vingtaine suffisent pour couvrir tous les cas), et c'est un différenciateur réel. En USSD c'est impossible, mais un appel vocal automatisé reste envisageable pour les alertes critiques.

---

## 4. Autres services

| Service | Fournisseur suggéré | Coût | Note |
|---|---|---|---|
| Notifications push | Firebase Cloud Messaging | Gratuit | Aucune alternative pertinente |
| Suivi d'erreurs | Sentry | Gratuit puis ~26 €/mois | Mobile et dorsal |
| Supervision | Grafana Cloud (offre gratuite) + UptimeRobot | 0-10 €/mois | - |
| Tableaux de bord métier | Metabase auto-hébergé | ~10 €/mois (une machine) | Moins cher que les offres SaaS |
| Emails transactionnels | Brevo ou Resend | Gratuit au départ | Usage marginal, le canal est le téléphone |
| Stockage objet (justificatifs KYC, sauvegardes) | Scaleway Object Storage | ~5 €/mois | Chiffré, accès restreint |
| Gestion des secrets | Infisical ou SOPS/age | Gratuit à ~10 €/mois | Jamais de secret dans le dépôt Git |
| Compte développeur Google Play | Google | 25 USD une fois | Prévoir la revue renforcée des applications financières |
| Compte Apple | Apple | 99 USD/an | **À reporter.** iOS non pertinent en v1. |
| Certificats TLS | Let's Encrypt | Gratuit | - |
| Dépôt de code et intégration continue | GitHub | Gratuit | Dépôt privé |
| Signalétique et support terrain | - | Variable | Ne pas oublier : numéro vert ou ligne de support, et visuels pour les agents |

---

## 5. Audit de sécurité

Non négociable avant de manipuler de l'argent réel, et absent des deux documents.

| Niveau | Quoi | Coût | Quand |
|---|---|---|---|
| 1 | Auto-évaluation OWASP **MASVS** (mobile) et **ASVS** (dorsal), avec rapport écrit | Gratuit, 2 à 3 jours de travail | Avant le pilote |
| 2 | Analyse statique et analyse des dépendances en intégration continue | Gratuit (CodeQL, Dependabot, Semgrep) | Dès le premier jour |
| 3 | Revue de code croisée par un développeur externe | 500-1 500 € | Avant le pilote |
| 4 | **Test d'intrusion externe** par un cabinet reconnu | 3 000-8 000 € | Avant l'ouverture au public |
| 5 | Audit de conformité par un auditeur financier | **[DEVIS]** | Exigé par le partenaire agréé |

Le test d'intrusion n'est pas une dépense de confort : c'est ce que le partenaire bancaire exigera, et c'est ce qui vous protège le jour où un incident survient. À inscrire au plan de financement du concours comme un poste explicite - un jury y verra un signe de sérieux rare.

Priorités de test spécifiques à ce produit : le parcours de ré-enrôlement après changement d'appareil, le rejeu des rappels opérateur, les conditions de concurrence sur les écritures du grand livre, l'élévation de privilège de membre vers administrateur de groupe, et l'injection dans les passerelles SMS et USSD.

---

## 6. Budget récapitulatif

### Phase 0 - Concours et prototype (maintenant)

| Poste | Coût |
|---|---|
| Domaines (.com, .africa, .app) | ~50 € une fois |
| Dépôt de marque OAPI | **[DEVIS]**, ordre de 300-600 € |
| Hébergement (une petite machine, recette) | ~20 €/mois |
| Compte Google Play | 25 USD une fois |
| SMS de démonstration (crédit de test) | ~20 € |
| **Total** | **~150 € + ~400 € de marque + 20 €/mois** |

### Phase 1 - Pilote réel, 1 marché, 20 groupes, ~200 utilisateurs

| Poste | Coût mensuel |
|---|---|
| Hébergement (production + recette + PostgreSQL managé) | 70-120 € |
| Sauvegardes et stockage objet | 10 € |
| SMS (budget plafonné, 200 utilisateurs × 4 SMS critiques × 20 FCFA) | ~25 € |
| Sentry, supervision, Metabase | 40 € |
| Gestion des secrets | 10 € |
| Code court USSD (loyer) | **[DEVIS]** |
| **Total récurrent** | **~160-210 € + USSD** |
| *Non récurrent :* test d'intrusion | *3 000-8 000 €* |
| *Non récurrent :* domaine `.cg` | *330-550 €/an* |

Soit de l'ordre de **110 000 à 140 000 FCFA par mois** en exploitation pour le pilote, hors USSD et hors audit. C'est modeste, et c'est volontaire : **le coût de l'infrastructure n'est pas le risque de ce projet.** Les deux vrais postes sont les frais de transaction opérateur (document `01`) et le coût humain du support terrain.

### Ce qui n'est pas dans ce budget et qui le dépassera largement

- Le **support client**. Un produit financier sur ce segment génère un volume d'appels considérable. Une personne dédiée dès le pilote.
- L'**animation terrain** : ambassadrices, visites de marché, formation des administratrices de groupe (voir `06-go-to-market-communication.md`).
- Les **frais de transaction opérateur**, qui sont proportionnels au volume et qui, en l'état actuel du modèle, croissent plus vite que les recettes.

---

**Sources**
- [.cg Domain Name - Netim](https://www.netim.com/en/domain-name/cg-domain)
- [.cg Domain Registration - 101domain](https://www.101domain.com/cg.htm)
- [CG Domain Name Registration - Africa Registry](https://www.africaregistry.com/domain-names/republic-of-the-congo/cg-domain-registration)
- [SMS Pricing in Republic of the Congo - Twilio](https://www.twilio.com/en-us/sms/pricing/cg)
- [SMS Pricing comparison - sent.dm](https://www.sent.dm/resources/categories/sms-pricing)
- [Fees & Pricing by Country - PawaPay](https://www.pawapay.io/fees)
