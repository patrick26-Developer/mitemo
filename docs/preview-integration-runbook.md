# Exécution du lot mobile connecté Preview

Ce document prépare les opérations ; il n'autorise ni migration distante ni déploiement.
Le lot part de `develop` à `1ba2e5e717201f40b6bafc0d309f4aa119f65c32`.
Après revue et fusion de la PR d'intégration, relever le nouveau SHA de `develop`
et reconstruire depuis ce SHA. Ne pas employer le `dist` de `.livraison-api`.

## Informations encore nécessaires

- Neon : confirmer le projet `mitemo`, la branche `br-solitary-mud-benm5t51`,
  son association au compute `ep-frosty-tree-be1lox57`, l'hôte direct complet,
  la base `neondb`, l'état actif et l'expiration éventuelle.
- Render : SHA du déploiement réellement Live de `mitemo-api-dev`, branche
  configurée, Auto-Deploy, ID du service, commandes et répertoire de travail.
- Variables : seulement hôtes, bases, TLS et présence des secrets ; ne pas copier
  leurs valeurs dans une PR ou dans une conversation. Vérifier que les URL directe
  et poolée correspondent au même compute Preview. Ne pas remplacer une configuration
  fonctionnelle sans diagnostic.

Les sept fichiers de migration sont présents ; leur application dans Neon ne peut
pas être déduite du statut de `localhost/mitemo_test`.

## Statut Prisma en lecture seule

Depuis le checkout propre du SHA retenu, dépendances figées installées, saisir l'URL
de façon masquée. Ne pas changer les `.env` locaux `localhost/mitemo_dev`.

```powershell
$previewHost = Read-Host 'Hôte direct complet vérifié dans Neon'
if ($previewHost -notmatch '^ep-frosty-tree-be1lox57\.[a-z0-9.-]+\.neon\.tech$') {
  throw 'Compute Preview inattendu'
}
$names = @('DATABASE_URL', 'MITEMO_DEPLOYMENT', 'MITEMO_PREVIEW_DB_HOST', 'MITEMO_PREVIEW_DB_NAME')
$previous = @{}
foreach ($name in $names) { $previous[$name] = [Environment]::GetEnvironmentVariable($name, 'Process') }
$secretUrl = Read-Host 'URL directe neondb avec sslmode=verify-full' -AsSecureString
$urlPtr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secretUrl)
try {
  $env:DATABASE_URL = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($urlPtr)
  $env:MITEMO_DEPLOYMENT = 'preview'
  $env:MITEMO_PREVIEW_DB_HOST = $previewHost
  $env:MITEMO_PREVIEW_DB_NAME = 'neondb'
  $target = $null
  if (-not [uri]::TryCreate($env:DATABASE_URL, [UriKind]::Absolute, [ref]$target)) { throw 'URL Preview invalide' }
  if ($target.Host -ne $previewHost -or $target.AbsolutePath -ne '/neondb') { throw 'Cible inattendue' }
  # prisma.config.ts contrôle aussi protocole, port et paramètres TLS avant connexion.
  $statusOutput = pnpm --filter api exec prisma migrate status 2>&1
  $statusCode = $LASTEXITCODE
  [regex]::Matches(($statusOutput -join "`n"), '\b\d{14}_[a-z0-9_]+\b').Value | Sort-Object -Unique
  Write-Output "Code Prisma migrate status : $statusCode"
} finally {
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($urlPtr)
  $secretUrl.Dispose()
  foreach ($name in $names) { [Environment]::SetEnvironmentVariable($name, $previous[$name], 'Process') }
}
```

Ne pas publier la sortie brute. Un code non nul peut signifier une migration
en attente ou une erreur ; il ne suffit pas à autoriser une application.
La migration attendue est `20261112100000_notification_push_tokens`.

## Après autorisation explicite de migration seulement

Compiler le SHA approuvé :

```powershell
pnpm --filter @mitemo/contracts build
pnpm --filter api build
```

Dans un processus opérateur recevant les mêmes variables Preview vérifiées,
`MITEMO_DEMO_AUTH=true` et la clé serveur injectée sans fichier ni affichage :

```powershell
node apps/api/dist/shared/database/preview-migrate.js
```

Le script refuse tout autre compute, une connexion poolée ou un TLS affaibli.
Relire ensuite le statut : sept migrations terminées, aucune échouée ou annulée.
Comparer les nombres de lignes et agrégats non identifiants des tables existantes
avant/après. La septième migration crée une table ; ne jamais employer `migrate reset`
ou `migrate dev` sur Neon.

## Après validation Neon et autorisation explicite de déploiement seulement

Dans Render : service `mitemo-api-dev`, Auto-Deploy Off, Manual Deploy → Deploy a
specific commit → SHA complet approuvé. Conserver les commandes fonctionnelles existantes.

Alternative API pour un opérateur disposant déjà d'une clé Render injectée dans son
processus, sans jamais l'afficher :

```powershell
$serviceId = Read-Host 'ID du service mitemo-api-dev vérifié'
$validatedSha = Read-Host 'SHA complet approuvé de develop'
if ($validatedSha -notmatch '^[a-f0-9]{40}$') { throw 'SHA invalide' }
$headers = @{ Authorization = 'Bearer ' + $env:RENDER_API_KEY }
$body = @{ commitId = $validatedSha; clearCache = 'do_not_clear' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "https://api.render.com/v1/services/$serviceId/deploys" -Headers $headers -ContentType 'application/json' -Body $body
```

Ce POST **déploie** : ne pas l'exécuter avant confirmation. Il ne désactive pas
Auto-Deploy. Attendre Live et vérifier le SHA effectif dans les détails du déploiement.

Source : [Render — Trigger deploy](https://api-docs.render.com/reference/create-deploy).

## Vérifications après mise en ligne

`/health`, admission refusée/expirée, inscription PIN4, OTP6 incorrect/correct,
session, profil, portefeuille, historique, objectifs, reconnexion, restauration,
déconnexion et isolation entre deux comptes. Tester le token Expo idempotent
uniquement avec un token de test autorisé et une plateforme prise en charge.
Le protocole téléphone détaillé est dans le README de `features/server-account`.
Aucun paiement réel ni crédit déclenché par le mobile n'est nécessaire.

Prévenir Espoir dans la PR avec le SHA réellement Live, les changements de contrat,
les résultats HTTPS et les limites constatées. Un export Android local réussi ne
constitue pas un test effectué sur téléphone ni une preuve de déploiement Render.
