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

**Décision :** en attente de l'architecte.
