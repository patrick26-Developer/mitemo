# TDD et vérification

## Le cycle

- On écrit ou modifie d'abord le `*.spec.ts(x)` colocalisé, on le lance et on **constate l'échec** (rouge) avant d'écrire le code.
- Code minimal pour passer au vert, puis refactor tant que tout reste vert.
- Une suppression aussi commence par un test : « aucun bouton Annuler » s'écrit `expect(screen.queryByRole("button", { name: /Annuler/ })).toBeNull()` avant de retirer le bouton.
- On teste ce que voit l'utilisateur : rôles, libellés accessibles, textes. Jamais l'implémentation.

## Les commandes de vérification

Depuis `apps/mobile` :

```bash
pnpm exec tsc --noEmit -p .
pnpm exec jest                      # ou un chemin ciblé pendant le cycle
```

Depuis la **racine** du dépôt (la config ESLint est unique, à la racine) :

```bash
pnpm exec eslint apps/mobile --max-warnings=0
pnpm exec prettier --check apps/mobile
```

## Règles de rigueur

- Ne jamais annoncer un résultat qu'on n'a pas vu passer. Citer les chiffres réels (« 665 tests verts »).
- Un échec de lint ne se contourne pas par une astuce de syntaxe (opérateur virgule, tableau renvoyé par une flèche) : on découpe le code (voir [../raisonnement/decoupage-et-lint.md](../raisonnement/decoupage-et-lint.md)).
- Avant de dire « terminé », relancer la suite **complète** : un écran voisin peut dépendre d'un libellé changé (exemple : `screen.tontines.spec` attendait « Créer la tontine » à l'ouverture).
