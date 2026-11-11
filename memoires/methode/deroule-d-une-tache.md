# Déroulé d'une tâche

1. **Comprendre et cadrer.** Relire la demande, repérer les contraintes explicites (exemple : « ne touche pas `apps/api` ») et les respecter strictement pendant toute la tâche.
2. **Explorer avant d'écrire.** Lire les fichiers concernés et chercher l'existant dans `shared/` et les autres features avant de créer quoi que ce soit (`grep -rn` sur le nom du composant, du libellé, du hook).
3. **Issue d'abord.** Une tâche = une issue GitHub, puis une branche `type/numero-description`.
4. **TDD par petites tranches** (voir [tdd-et-verification.md](tdd-et-verification.md)) : modèle, puis hook, puis composant, puis écran.
5. **Vérifier tout le monorepo concerné** avant de committer : typecheck, tests, lint, format.
6. **Commits atomiques** (voir [commits-et-branches.md](commits-et-branches.md)).
7. **Rendre compte honnêtement** : ce qui est fait, ce qui ne l'est pas, ce qui a échoué et pourquoi, les décisions qui restent à l'utilisateur.
8. **Ne pas pousser ni ouvrir de PR sans demande explicite.**
