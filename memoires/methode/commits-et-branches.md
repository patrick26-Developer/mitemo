# Commits, branches et PR

## Commits

- Conventional Commits en français, sujet ≤ 100 caractères, corps qui explique **pourquoi**, lignes ≤ 100 caractères.
- `Refs: #n` vers l'issue quand elle existe.
- Un commit = un changement cohérent : correction de libellé, briques partagées, une feature, puis la suivante. On indexe fichier par fichier, jamais `git add -A` à l'aveugle.
- Aucune attribution à un outil d'IA. Jamais `--no-verify`.

## Après chaque série de commits : contrôler

```bash
git log --oneline --stat -n <k>
git status --short
```

Le hook `pre-commit` peut échouer sans que le script ne s'arrête : les fichiers restent indexés et partent dans le commit suivant. C'est arrivé (Jest « Segmentation fault », code 139, sans aucun test en échec). Remède quand les commits sont encore **locaux** : `git reset <base>` puis refaire les commits un par un, en relançant un commit si le hook a seulement planté (pas de `FAIL` dans la sortie).

Autre piège vu : lint-staged peut réindexer un fichier supprimé ou obsolète. Le retirer avec `git rm --cached` puis `git commit --amend` tant que ce n'est pas poussé.

## Branches et PR

- Branche `type/numero-description` depuis `develop` à jour (`git pull --rebase`).
- PR vers `develop` avec `gh pr create`, assignée à l'auteur, description en français qui liste les changements, les vérifications faites et les décisions à valider.
- Si une action GitHub est refusée (permissions), le dire à l'utilisateur et lui laisser la main ; ne pas inventer de numéro d'issue.
