# 0001. Monorepo pnpm + Turborepo

- Statut : accepté
- Date : 2026-11-05

## Contexte

Mitemo comprend une API NestJS, un back-office et site web Next.js, et une application mobile Expo. Les trois partagent des contrats d'échange (types, validation des montants, codes d'erreur). L'équipe est petite : un à trois développeurs.

## Décision

Un seul dépôt, organisé en workspaces pnpm (`apps/*`, `packages/*`), orchestré par Turborepo pour le cache et l'exécution des tâches (`lint`, `typecheck`, `test`, `build`) uniquement sur les paquets touchés.

L'API reste un monolithe modulaire : une feature = un module NestJS, avec des frontières nettes (voir `AGENTS.md`).

## Conséquences

- Un changement de contrat se fait dans une seule PR qui met à jour l'API et les clients ensemble.
- La CI et les hooks ne testent que ce qui a changé, ce qui garde des temps courts.
- Il faut tenir la discipline des frontières : un paquet n'importe que ce qu'un autre exporte.
