# OPEN_QUESTIONS.md

Décisions non tranchées, à ne jamais deviner. Chaque question reste ici jusqu'à ce qu'une décision explicite de l'architecte la retire ou la convertisse en ADR.

## Langue des valeurs d'état dans les contrats partagés

**Soulevée par :** revue de la PR #60 (`packages/contracts`), à la demande de l'architecte.

**Constat.** Les quatre automates de `packages/contracts` mélangent déjà deux langues dans leurs valeurs techniques : `tontine.ts`, `membership.ts` et `round.ts` utilisent des littéraux français (`TIRAGE_ORDRE`, `GARANTIE_BLOQUEE`, `COUVERT_PAR_RESERVE`...), repris littéralement de `docs/audit/03-architecture-technique.md` §2 ; `transaction.ts` utilise des littéraux anglais (`INITIATED`, `CONFIRMED`...), également repris littéralement de la même source. Cette incohérence préexistait à la PR #60 — elle vient de la documentation source elle-même, pas d'un choix fait dans le code.

**Règle proposée, non appliquée :**

> Une valeur d'état exposée par `packages/contracts` est une valeur **technique**, invariante, jamais affichée telle quelle à l'utilisateur. Chaque application cliente (web, mobile) maintient sa propre table de correspondance valeur → libellé, dans la langue de l'utilisateur. Cette règle s'applique de la même façon, que la valeur technique soit en français ou en anglais : dans les deux cas, elle ne sert jamais de texte d'interface.

Cette règle résout « comment on affiche », mais pas « dans quelle langue on écrit les valeurs techniques elles-mêmes ». Deux sous-questions restent ouvertes :

1. Faut-il unifier les quatre automates sur une seule langue pour les valeurs techniques (et laquelle), ou accepter le mélange actuel tel qu'il reflète la documentation source ?
2. Si une unification est décidée, qui la fait, et à quel moment — avant ou après que des issues s'appuient sur les littéraux déjà écrits (plusieurs issues ouvertes citent déjà `ANNULEE`, `CLOTUREE_ANTICIPEE`, `GARANTIE_BLOQUEE` verbatim) ?

**Recommandation de l'architecte (2026-11-06) :** valeurs techniques stables en anglais (comme `TRANSACTION_STATES` déjà livré), libellés affichés traduits côté interface. Le mélange actuel doit être unifié **avant** la première migration de base de données, car changer un état déjà en base coûte cher. Cette recommandation est consignée ici ; elle n'a pas encore été appliquée au code existant (`tontine.ts`, `membership.ts`, `round.ts` restent en français à ce jour).

**Décision :** recommandation formulée, application au code en attente.

## Commission de distribution (1,5 %, convention B)

**Soulevée par :** l'architecte, en relisant la revue de la PR #60.

**Constat.** `round.ts` (`DistributeRoundResponse`) expose un champ `commission`, documenté comme venant de `docs/audit/03-architecture-technique.md` §3.1 (taux de 1,5 %, « convention B » : le bénéficiaire ne cotise pas à son propre tour). Ce taux et cette convention sont des **hypothèses de l'audit initial**, pas des décisions validées par le fondateur. Elles n'ont jamais été confrontées aux principes déjà énoncés par ailleurs : pas de prélèvement automatique sans règle approuvée par les membres, aucun frais caché, modèle économique fondé sur les abonnements plutôt que sur une commission par mouvement. Un champ `commission` dans un contrat partagé encode déjà, de fait, un modèle économique — avant qu'il ne soit confirmé.

**Statut explicite : hypothèse non validée par le fondateur.**

**Décision à prendre :** confirmer le taux et la convention tels quels, les modifier, ou retirer la commission du modèle de distribution au profit d'un autre mécanisme de revenu. Tant que cette décision n'est pas prise, `commission` et `netAmount` dans `round.ts` restent une hypothèse de travail, pas une règle métier figée.

**Décision :** en attente du fondateur.
