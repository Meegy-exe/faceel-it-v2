---
name: verify-frontend-change
description: >
  Pipeline de vérification à exécuter après toute modification dans
  client/src/ — type-check, build, lint, format, tests, vérification que
  Tailwind a bien généré les classes utilitaires dynamiques ou exotiques
  utilisées, et fumée sur le serveur de développement. À utiliser avant de
  déclarer un changement frontend terminé, jamais en se basant sur une
  relecture de code seule.
---

# Pourquoi ce skill existe

Un changement dans `client/src/` peut sembler correct à la lecture et échouer
pour trois raisons invisibles sans exécution :

1. Une erreur de type que seul `vue-tsc` détecte (notamment avec
   `exactOptionalPropertyTypes` actif : passer `undefined` explicitement à un
   prop optionnel est une erreur, pas un no-op).
2. Une classe Tailwind qui n'apparaît jamais dans le CSS généré parce que
   Tailwind v4 scanne le **texte source** des fichiers pour décider quoi
   générer — une classe assemblée par concaténation de chaînes
   (`` `bg-${color}-500` ``) ou une valeur arbitraire mal formée ne sera
   jamais produite, silencieusement.
3. Un module qui type-check mais ne se charge pas réellement dans le
   navigateur (import circulaire, chemin d'alias erroné) — le build peut
   réussir tout en cachant ce genre de souci selon la config.

# Séquence

Adapter les noms de scripts au `package.json` réel du projet si besoin ; les
commandes ci-dessous sont celles observées dans ce dépôt (`client/`).

```bash
# 1. Type-check + build de production — détecte les erreurs de types et
#    de compilation. Toujours en premier : le moins cher à faire échouer.
npm --prefix client run build

# 2. Lint + format — corrige automatiquement le style, révèle les imports
#    orphelins ou les variables inutilisées après une édition.
npm --prefix client run lint
npm --prefix client run format

# 3. Tests unitaires — en particulier tout ce qui touche un comportement
#    non visuel (cf. skill seo-head-recipe).
npx --prefix client vitest run
```

## Vérifier que les classes Tailwind dynamiques ont été générées

Si le changement introduit des classes utilitaires non triviales (valeurs
arbitraires `[...]`, classes construites dynamiquement à partir de données,
nouvelles animations `animate-*` déclarées dans les tokens), grep le CSS de
build pour confirmer leur présence plutôt que de supposer :

```bash
cd client/dist/assets
for c in 'ma-classe-suspecte' 'grid-cols-\[' 'animate-ma-nouvelle-anim'; do
  printf '%-30s %s\n' "$c" "$(grep -c -- "$c" index-*.css)"
done
```

Un compteur à `0` pour une classe utilisée dans un template signifie qu'elle
ne sera jamais appliquée en production — corriger la classe ou sa source
avant de continuer, pas après.

## Fumée sur serveur de développement

Pour confirmer qu'un module se charge réellement (pas seulement qu'il
compile) :

```bash
cd client && timeout 20 npx vite --port <port-libre> > /tmp/vite-smoke.log 2>&1 &
sleep 8
curl -s -o /dev/null -w "HTTP %{http_code}\n" "http://localhost:<port>/src/chemin/du/fichier.vue"
cat /tmp/vite-smoke.log
```

Un code 200 et l'absence d'erreur dans le log valident le chargement. Tuer le
processus de fond une fois la vérification faite si le harness ne le fait pas
automatiquement.

# Quand s'arrêter

Ce pipeline ne remplace pas une vérification visuelle dans un navigateur pour
un changement d'UI/UX significatif (mise en page, animation, interaction) —
il élimine les régressions mécaniques (types, build, style, classes
manquantes) avant que la vérification visuelle ait un sens.
