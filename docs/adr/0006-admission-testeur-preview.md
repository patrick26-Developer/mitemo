# ADR 0006 — Admission temporaire des testeurs mobiles Preview

Date : 2026-11-12. Statut : proposé pour revue.

## Contexte

`DemoAccessGuard` exigeait la clé partagée Preview sur les routes publiques et
privées. Un mobile ne peut pas protéger une clé intégrée à son bundle. Les
sessions Bearer existantes sont persistées, révocables et associées à un utilisateur
de démonstration. Aucun changement ne doit ouvrir l'authentification simulée en production.

## Décision proposée

L'opérateur émet hors ligne un laissez-passer via `scripts/issue-preview-admission.mjs`.
Il est signé HMAC-SHA256 avec la clé serveur existante, avec séparation de domaine
`mitemo.preview.admission.v1.`. Les droits comprennent `aud=mitemo-preview`, `iat`
et `exp` en secondes UTC. La CLI émet une durée d'une heure ; le serveur refuse
toute durée supérieure à huit heures, toute expiration ou émission future hors
tolérance de trente secondes. Il refuse aussi les messages malformés ou trop longs.

Le mobile reçoit seulement ce laissez-passer temporaire, saisi dans « Accès
testeur » et conservé dans SecureStore. Il l'envoie dans
`x-mitemo-preview-admission` exclusivement à `/auth/register`, `/auth/login` et
`/auth/verify`, sur l'origine API configurée. La clé de signature ne quitte pas
l'environnement opérateur/serveur et ne figure dans aucune variable `EXPO_PUBLIC_*`.

Une route privée sans clé opérateur exige un Bearer réellement validé par
`SessionService`. La présence d'un en-tête ne suffit pas. Les contrôleurs conservent
leurs contrôles d'appartenance ; le laissez-passer seul n'autorise pas de lecture
du profil, du portefeuille, des mouvements ou des objectifs. Les accès opérateur
existants avec la clé partagée sont conservés.

Les conditions de `demoOnly()` et `previewEnabled()` restent obligatoires :
mode Preview, activation explicite, service dédié et cible PostgreSQL vérifiée.
Cette admission ne constitue pas une authentification de production ni un OTP SMS.

## Conséquences

Le laissez-passer est réutilisable jusqu'à son expiration ; ce n'est pas un code
à usage unique ni une session utilisateur. Sa révocation anticipée globale demande
une rotation de la clé serveur. Une telle rotation ne révoque pas les sessions
Bearer déjà émises : utiliser la révocation de session existante si nécessaire.
L'émission n'est pas exposée par une route HTTP publique.

Le PIN reste temporaire en mémoire. Un PIN accepté produit un défi ; seul l'OTP
vérifié ouvre la session. Au redémarrage, le jeton relu dans le trousseau doit être
confirmé par `/me`. Les vues connectées ne reprennent aucune donnée de démonstration locale.

## Validation

Tests de signature, d'audience, de durée, d'expiration, de falsification, de garde
Bearer et de refus du portefeuille avec admission seule. Le scénario HTTP local
utilise l'admission signée pour l'inscription et l'OTP, puis la session sans clé
partagée pour le profil, la rotation et la révocation.

Sources :

- [Node.js : HMAC et comparaison en temps constant](https://nodejs.org/api/crypto.html).
- [Expo : variables publiques et notation statique](https://docs.expo.dev/guides/environment-variables/).
- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/).
