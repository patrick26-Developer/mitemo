# Habitudes réelles des utilisateurs et pertinence des écrans mobiles

**Statut :** recherche documentaire, faite avant les entretiens terrain. Elle ne remplace pas les entretiens avec trois présidentes de tontine prévus en phase 0 ([`audit/07-roadmap-et-perimetre.md`](audit/07-roadmap-et-perimetre.md)) : elle sert à les préparer. Aucun utilisateur n'a encore été interrogé.

**Objet :** confronter les 20 écrans des wireframes mobiles de la phase 0 à ce que l'on sait des pratiques réelles (tontine, téléphone, Mobile Money, lecture), et dire pour chaque écran s'il faut le garder, le simplifier, le tester ou le repenser.

**Wireframes concernés :** canevas « Mitemo mobile, wireframes Phase 0 » (lien dans la PR), construits à partir de [`architecture-information.md`](architecture-information.md) et [`user-flows.md`](user-flows.md).

**Règle de lecture :** chaque constat cite sa source et indique sa fiabilité. Quand deux sources se contredisent, les deux chiffres sont donnés. Aucun chiffre n'est extrapolé au-delà de ce que dit la source.

## 1. Ce que l'on sait des habitudes

### 1.1 La tontine au Congo

| N° | Constat | Source | Fiabilité |
| -- | ------- | ------ | --------- |
| H1 | À Brazzaville, la tontine sert d'épargne aux femmes du commerce informel et de lieu de sociabilité. | Banque mondiale, rapport sur l'inclusion économique des femmes et des jeunes au Congo-Brazzaville | Bonne (institutionnelle) |
| H2 | Au Congo, la tontine se développe faute d'institutions monétaires et de protection sociale accessibles. Elle évite aux petites commerçantes de dépenser tout leur bénéfice au jour le jour. | Nguié, *Tontines et prostitution à Château-Rouge*, Revue internationale des études du développement, 2020 | Bonne (revue à comité), mais terrain principal à Paris |
| H3 | Le commerce de détail des marchés domaniaux de Brazzaville est tenu à 76 % par des femmes. Les femmes représentent jusqu'à 73 % de la main-d'œuvre non salariée de la ville. | Étude sur la viande de brousse, 2020 (ResearchGate) ; *Brazzaville's Marché Total*, Cahiers d'études africaines | Moyenne (une filière, une période) |
| H4 | La gestion d'une tontine de type *likelemba* tient en un cahier : noms, sommes versées, sommes rendues. Pas de frais de gestion. | Mémoire sur les pâtissières de Butembo (RDC), memoireonline | Faible (RDC, mémoire étudiant), cohérent avec H1 |
| H5 | L'ordre de passage d'une tontine se fixe de trois façons : tirage au sort, enchères (celui qui accepte la plus forte décote reçoit d'abord), ordre fixé à la création (ancienneté, parenté, rôle de l'organisatrice). Au Vietnam, 76 % des participants du Nord négocient l'ordre à la première réunion. | Littérature économique sur les ROSCA (Klonner ; Bauchet et al., CGAP 2014 ; étude vietnamienne, ScienceDirect) | Bonne sur les trois formes ; **aucune donnée sur le Congo** |

**Ce qui manque :** aucune source trouvée sur le rôle exact de la présidente à Brazzaville, ni sur la façon dont l'ordre de passage y est fixé. Un ouvrage existe et serait à consulter : Loufoua-Lemay, *Mobilité urbaine et changements sociaux à Brazzaville, études des associations financières traditionnelles* (2016).

### 1.2 Téléphone, Internet et Mobile Money

| N° | Constat | Source | Fiabilité |
| -- | ------- | ------ | --------- |
| H6 | 6,41 millions d'habitants et 6,33 millions de connexions mobiles début 2025. | DataReportal, *Digital 2025: The Republic of the Congo* | Bonne |
| H7 | 2,50 millions d'internautes fin 2025, soit **38,4 %** de la population. 1,20 million d'identités actives sur les réseaux sociaux en octobre 2025, soit 18,4 %. | DataReportal, *Digital 2026: The Republic of the Congo* | Bonne |
| H8 | Parmi les détenteurs de téléphones simples interrogés par le Findex 2025 (454 réponses), 90,7 % disent ne pas pouvoir utiliser WhatsApp sur leur téléphone. | Banque mondiale, Global Findex 2025, catalogue de microdonnées, Congo, Rep. | Bonne, sur ce sous-échantillon |
| H9 | Part de la population ayant un compte (banque ou Mobile Money) : **39,2 %** (indicateur Banque mondiale, 2024) ou **56 %** (Findex 2025, d'après un résumé secondaire). | data.worldbank.org ; blog ezo.app | Contradictoire : à vérifier dans les données Findex 2025 |
| H10 | MTN domine le Mobile Money : environ 72,5 % du marché contre 27,5 % pour Airtel (chiffres ARPCE 2023 cités par un blog). D'autres sources donnent 65/25 ou 55/38. | Blogs commerciaux (iambeezy, simiz.io) | Faible : ordre de grandeur seulement, source primaire ARPCE à consulter |

### 1.3 Lecture, langues et sécurité

| N° | Constat | Source | Fiabilité |
| -- | ------- | ------ | --------- |
| H11 | Français langue officielle ; lingala (nord, Brazzaville) et kituba (sud) langues nationales véhiculaires. Environ 30 % de la population parlerait couramment le français. | Wikipédia ; WorldAtlas | Moyenne pour les langues, faible pour le 30 % |
| H12 | Taux d'alphabétisation de 84,7 %. | Fiche pays ADOCC | Faible (source non primaire) ; contradictoire avec H11 si l'alphabétisation est en français |
| H13 | Sur 90 utilisateurs peu lettrés (Inde, Kenya, Philippines, Afrique du Sud), les interfaces textuelles sont inutilisables pour un premier usage et source d'erreurs même pour des novices lettrés. Les interfaces graphiques et vocales font mieux. | Medhi, Thies et al., *Designing mobile interfaces for novice and low-literacy users*, ACM | Bonne (étude contrôlée, multi-pays dont deux africains) |
| H14 | Sur 460 utilisateurs ougandais de Mobile Money, 45 % des clients ont déjà partagé leur code. Au Kenya, on envoie souvent un proche faire l'opération chez l'agent. | Matovu et al., 2021 (Inderscience) ; arXiv 2412.18716 | Moyenne : un pays, petit échantillon, à ne pas généraliser |

### 1.4 Tontines numériques existantes

| N° | Constat | Source | Fiabilité |
| -- | ------- | ------ | --------- |
| H15 | Au Cameroun, Djangui (lancée en 2016) revendique environ 50 000 utilisateurs. D'autres applications ont suivi : Tontine.plus, i-djangui, Nkap, Faroty. La confiance reste le risque principal cité par les utilisateurs. | AFP, reprise par France 24, 12 mars 2024 | Moyenne : le chiffre d'utilisateurs est déclaré par le fondateur |
| H16 | Une tontine numérique testée au Pakistan (15 personnes, 3 groupes) aide sur la tenue des comptes, les retards, la collecte, la distribution et la sécurité de l'argent. Le rôle de l'organisatrice reste central. Les utilisateurs sont très sensibles aux frais. Des règles trop rigides pénalisent ceux qui sont en retard pour une raison légitime. Interface sans texte et aide audio préférées. | Mehmood et al., CSCW 2019 ; Raza et al., CHI 2018 ; MicroSave 2020 | Bonne pour le Pakistan, à transposer avec prudence |

## 2. Ce que ces constats changent

1. **L'utilisatrice avec smartphone et Internet est minoritaire** (H7 : 38,4 % d'internautes). L'application sert surtout les présidentes et les membres les plus équipées. Le menu USSD n'est pas un complément : c'est la surface principale d'une partie du groupe. Chaque écran de l'application doit avoir un équivalent USSD pour les actions d'un membre (voir [`architecture-information.md`](architecture-information.md), section 6).
2. **Le texte doit rester un appui, pas le support principal** (H11, H12, H13, H16). Chaque écran doit être compréhensible par ses pictogrammes, ses montants et un mot de statut. Les phrases d'explication des wireframes sont trop longues pour un premier usage.
3. **La présidente est le pivot** (H1, H16, et [`user-journey.md`](user-journey.md)). Elle remplace son cahier (H4) : l'écran de suivi des membres est son écran principal, pas un écran secondaire.
4. **Le tirage au sort imposé n'est peut-être pas la pratique locale** (H5). Si les groupes de Brazzaville fixent l'ordre par négociation ou par décision de la présidente, un tirage imposé enlève à la présidente une prérogative qu'elle craint justement de perdre ([`user-journey.md`](user-journey.md), « Ce qu'elle craint »). C'est la question la plus importante des entretiens.
5. **L'inscription sera souvent assistée** (H14, et le parcours de Mama Nadège qui « aide les autres à s'inscrire »). Le message « ne donnez votre code à personne » est juste mais contredit l'usage. Il faut concevoir l'inscription assistée : la présidente aide pour le numéro et le code SMS, mais le code secret est saisi par le membre seul.
6. **Les frais doivent apparaître avant l'engagement, en francs, jamais en pourcentage** (H16). La commission reste une hypothèse non validée ([`OPEN_QUESTIONS.md`](../OPEN_QUESTIONS.md), PR #69) : les wireframes l'affichent comme exemple, pas comme tarif.

## 3. Pertinence de chaque écran

Verdicts : **Garder** (l'écran répond à un besoin observé), **Simplifier** (le besoin est réel, l'écran en dit trop), **Tester** (dépend d'une hypothèse non vérifiée), **Repenser** (contredit un constat).

### 3.1 Inscription (#23)

| Écran | Besoin réel servi | Verdict | Pourquoi | À vérifier en entretien |
| ----- | ----------------- | ------- | -------- | ----------------------- |
| Bienvenue | Se rassurer avant de s'engager | Simplifier | La promesse et la mention du partenaire agréé répondent à la crainte d'arnaque (H15). Ajouter le numéro d'un humain (support), qui rassure plus qu'un texte (`user-journey.md`, étape Décision). | Qu'est-ce qui convaincrait de confier son argent : un nom de banque, une personne, une autre présidente ? |
| Mon numéro | S'identifier sans papiers | Garder | Tout le monde a un numéro (H6). Préciser MTN ou Airtel sans demander l'opérateur. | - |
| Code reçu par SMS | Prouver que le numéro est à soi | Simplifier | Lire le code automatiquement sur Android quand c'est possible, pour éviter la saisie. Garder le renvoi et le verrouillage. | Le SMS arrive-t-il vite sur MTN et Airtel ? |
| Créer mon code secret | Protéger son argent | Repenser | Le partage du code est courant (H14) et l'inscription sera souvent assistée. Prévoir que la présidente rende le téléphone au membre à cette étape, avec une consigne illustrée. | Qui tient le téléphone pendant l'inscription d'un membre peu à l'aise ? |
| Confirmer, codes différents | Éviter une faute de frappe | Garder | Message court, sans appel réseau, comme prévu. | - |

### 3.2 Accueil et coffre (#22, #27)

| Écran | Besoin réel servi | Verdict | Pourquoi | À vérifier en entretien |
| ----- | ----------------- | ------- | -------- | ----------------------- |
| Accueil, action attendue | Savoir où est son argent et ce qu'on doit faire | Garder | C'est le besoin premier de Grâce (`user-journey.md`) et le cœur de la confiance. Réduire les phrases : statut, montant, bouton. | « Mis de côté » est-il compris sans explication ? |
| Accueil, sans tontine | Démarrer | Tester | Dans une tontine dirigée par une présidente, la plupart des membres arrivent par un lien d'invitation, pas par cet écran. Il sert surtout aux présidentes. | Une membre ouvrirait-elle l'application sans y être invitée ? |
| Mettre de l'argent, montant | Alimenter son coffre | Tester | Le cœur de cible manipule du liquide ; passer par Mobile Money coûte environ 4 % ([`audit/01`](audit/01-modele-economique.md)). Le dépôt d'espèces chez un agent ou chez la présidente est peut-être la vraie pratique. En phase 0, l'opérateur est simulé. | Comment chaque membre paie-t-elle aujourd'hui : espèces à la présidente, Mobile Money, autre ? |
| En attente de l'opérateur | Ne pas croire l'argent perdu | Garder | Séparer « en attente » du disponible est la règle qui évite la panique et les doubles paiements. | - |
| Résultat (confirmé, refusé, expiré) | Savoir si c'est fait | Garder | Trois issues claires, avec le support pour le cas expiré. | - |

### 3.3 Créer et rejoindre une tontine (#24, #25)

| Écran | Besoin réel servi | Verdict | Pourquoi | À vérifier en entretien |
| ----- | ----------------- | ------- | -------- | ----------------------- |
| Créer, formulaire | Recopier les règles de son cahier | Garder | Les paramètres correspondent à ceux d'un cahier (H4). Il manque peut-être le choix de l'ordre de passage (H5). | Les règles du cahier tiennent-elles en ces quatre champs ? |
| Récapitulatif | Savoir combien on reçoit et combien ça coûte | Garder | Indispensable pour la sensibilité aux frais (H16). Frais affichés comme hypothèse tant que #69 n'est pas tranchée. | Les frais affichés sont-ils acceptables ? |
| Inviter et suivre | Remplacer le cahier de la présidente | Garder, et promouvoir | C'est l'écran principal de la présidente (section 2, point 3). Le partage par WhatsApp ne touche pas les membres à téléphone simple (H8) : prévoir l'invitation par SMS. | Comment la présidente relance-t-elle aujourd'hui un membre en retard ? |
| Invitation reçue | Savoir dans quoi on s'engage | Simplifier | Le nom de la présidente est le premier signe de confiance : le garder en tête. Raccourcir le texte du tirage. | - |
| Bloquer ma garantie | Couvrir un défaut | Repenser | `audit/01` désigne la garantie de 2 500 FCFA comme le premier frein à l'adoption et propose trois alternatives (constitution progressive, garantie choisie par le groupe, caution sociale). | Demander d'avance la moitié d'une cotisation est-il acceptable ? Quelle alternative le groupe préfère-t-il ? |

### 3.4 Tirage, échéance, incident (#26, #28, #49)

| Écran | Besoin réel servi | Verdict | Pourquoi | À vérifier en entretien |
| ----- | ----------------- | ------- | -------- | ----------------------- |
| Tirage, avant | Croire que l'ordre n'est pas truqué | Tester | Le code de contrôle est la démonstration clé de la phase 0 (`audit/07`), mais un code hexadécimal ne parle pas à l'utilisatrice (H13). Montrer la date et l'heure, et cacher le code derrière « Voir la preuve ». Dépend surtout de la pratique réelle de l'ordre de passage (H5). | Comment l'ordre est-il fixé aujourd'hui ? Un tirage serait-il vu comme plus juste ou comme une perte d'autorité ? |
| Tirage, vérifié | Connaître son tour | Garder | La liste des tours avec sa propre ligne en évidence répond à « quand est-ce mon tour ? ». La vérification peut être automatique et silencieuse, avec une alerte seulement en cas d'échec. | - |
| Échéance | Payer à l'heure, ou reporter sans être puni | Garder | « Plus tard » répond au risque de punir un retard légitime (H16). Libellés à tester. | « Payer maintenant » et « Plus tard » sont-ils compris ? |
| Échéance, bénéficiaire | Savoir que c'est son tour | Garder | Moment positif, net reçu affiché. | - |
| Régulariser un incident | Comprendre ce qui s'est passé et revenir dans le groupe | Garder | C'est le « moment de vérité » de `user-journey.md`. Le détail chiffré est juste (5 000 + 100 + 2 500 = 7 600 FCFA) ; la phrase d'explication est à raccourcir. | La membre comprend-elle pourquoi on lui demande aussi de reconstituer sa garantie ? |

### 3.5 Écrans qui manquent

| Écran | Constat qui le justifie |
| ----- | ----------------------- |
| Aide : appeler un humain, accessible depuis chaque écran | H15 (confiance), `user-journey.md` (étape Décision) |
| Vue présidente d'un membre en retard, avec relance par SMS | H1, H16 (rôle central de l'organisatrice), H8 (pas de WhatsApp sur téléphone simple) |
| Historique lisible comme un cahier : qui a payé quoi, quand | H4 (le cahier est la référence actuelle) |
| Inscription assistée par la présidente | H14 et section 2, point 5 |
| Choix de la langue et aide audio (prévu en phase 1) | H11, H13, H16 |

## 4. Guide pour les entretiens avec les présidentes

À poser en premier, parce que la réponse change des écrans :

1. Comment l'ordre de passage est-il fixé dans votre tontine aujourd'hui ? Qui décide ?
2. Comment chaque membre vous remet-elle sa part : espèces, Mobile Money, autre ? À quelle heure ?
3. Que faites-vous quand une membre est en retard ? Et quand elle ne paie pas du tout ?
4. Demandez-vous aujourd'hui une garantie ou une caution ? Laquelle ?
5. Combien de vos membres ont un smartphone ? Combien utilisent WhatsApp ?
6. Qu'est-ce qui vous ferait confier l'argent du groupe à une application ? Qu'est-ce qui vous en empêcherait ?

Puis, sur les wireframes, sans explication préalable : demander de dire à voix haute ce que montre l'écran d'accueil, ce que veulent dire « Mis de côté » et « Plus tard », et ce que fait le bouton principal de chaque écran.

## 5. Sources

- Banque mondiale, *L'inclusion économique des femmes et des jeunes au Congo-Brazzaville* : <https://documents1.worldbank.org/curated/en/099050006282227757/pdf/P173535057d9e40ac08f95009ab647bf319.pdf>
- Nguié, *Tontines et prostitution à Château-Rouge*, 2020 : <https://shs.cairn.info/revue-internationale-des-etudes-du-developpement-2020-4-page-81?lang=fr>
- IDHES-CNRS, *Les tontines africaines entre finances et vecteur de lien social* : <https://www.idhes.cnrs.fr/les-tontine-africaines-entre-finances-et-vecteur-de-lien-social/>
- *Brazzaville's Marché Total. Women's Alliances during the Civil War in Congo*, Cahiers d'études africaines : <https://journals.openedition.org/etudesafricaines/15235?lang=en>
- Commercialisation de la viande de brousse à Brazzaville, 2020 : <https://www.researchgate.net/publication/346411523_Impact_de_la_Covid-19_sur_la_Commercialisation_de_la_Viande_de_Brousse_Perception_des_Commercants_de_Brazzaville_Congo_Impact_of_Covid-19_on_the_Marketing_of_Bushmeat_Perception_of_Traders_in_Brazzaville_Congo>
- Mémoire sur les pâtissières de Butembo (likelemba) : <https://www.memoireonline.com/12/09/2924/m_Le-role-des-femmes-entrepreneurs-dans-le-developpement-local-cas-des-patissieres-en-ville-de-Butemb9.html>
- Bauchet et al., *The Power and Utility of Bidding Roscas*, 2014 : <https://www.purdue.edu/hhs/htm/directory/faculty/documents/Bauchet%20-Vander-Meer-et-al-2014.pdf>
- Klonner, *Private Information and Altruism in Bidding Roscas* : <https://www.tse-fr.eu/sites/default/files/medias/doc/conf/ea/klonner.pdf>
- *Time preferences, sophistication, and trustworthiness in ROSCA participation*, ScienceDirect : <https://www.sciencedirect.com/science/article/abs/pii/S2214804326000261>
- DataReportal, *Digital 2025: The Republic of the Congo* : <https://datareportal.com/reports/digital-2025-republic-of-the-congo>
- DataReportal, *Digital 2026: The Republic of the Congo* : <https://datareportal.com/reports/digital-2026-republic-of-the-congo>
- Banque mondiale, Global Findex 2025, Congo, Rep. (microdonnées) : <https://microdata.worldbank.org/index.php/catalog/7888>
- Banque mondiale, indicateur de détention de compte : <https://data.worldbank.org/indicator/FX.OWN.TOTL.ZS>
- Résumé secondaire du Findex 2025 : <https://www.ezo.app/blog/2025-global-findex-financial-inclusion-and-mobile-tech-in-sub-saharan-africa>
- Parts de marché Mobile Money (secondaire) : <https://blog.iambeezy.app/fr/classement-mobile-money-congo-2026/> ; <https://simiz.io/blog/api-paiement-mobile-congo-orchestrateur>
- Langues du Congo : <https://en.wikipedia.org/wiki/Languages_of_the_Republic_of_the_Congo> ; <https://worldatlas.com/articles/what-languages-are-spoken-in-the-republic-of-the-congo.html>
- Fiche pays ADOCC : <https://export.agence-adocc.com/fr/fiches-pays/congo/introduction>
- Medhi et al., *Designing mobile interfaces for novice and low-literacy users* : <https://dl.acm.org/doi/pdf/10.1145/1959022.1959024>
- Matovu et al., sécurité du Mobile Money en Ouganda : <https://www.inderscience.com/offers.php?id=119112>
- Transactions à distance par un proche, Kenya : <https://www.arxiv.org/pdf/2412.18716>
- AFP / France 24, *Au Cameroun, les ancestrales tontines se digitalisent*, 12 mars 2024 : <https://www.france24.com/fr/info-en-continu/20240312-au-cameroun-les-ancestrales-tontines-se-digitalisent>
- Mehmood et al., *Towards Digitization of Collaborative Savings Among Low-Income Groups*, CSCW 2019 : <https://aghaaliraza.com/publications/2019--CSCW--Towards_Digitization_of_Collaborative_Savings_Among_Low-Income_Groups.pdf>
- Raza et al., *Save My Money: Digitizing Informal Savings in Pakistan*, CHI 2018 : <https://aghaaliraza.com/publications/2018-CHI--Save_My_Money-Digitizing_Informal_Savings_in_Pakistan.pdf>
- MicroSave, *Digital ROSCA: the new kid on the block*, 2020 : <https://www.microsave.net/2020/04/13/digital-rosca-the-new-kid-on-the-block/>

Les études Medhi et al. et Mehmood et al. ont été lues par leur résumé et des sources qui les citent, pas en texte intégral : leurs conclusions détaillées sont à relire avant d'en tirer une règle de conception.
