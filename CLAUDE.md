# Instructions communes à tous les agents

Ce fichier s'applique à tout agent Claude Code travaillant sur ce dépôt, quel
que soit son rôle (`.claude/agents/*.md`). Ce qui est spécifique à un rôle
précis vit dans le fichier de cet agent, pas ici.

## Avant de commencer

Lire `README.md` : stack, commandes (`npm run build/lint/type-check/test`),
arborescence, et surtout la section **Conventions**, qui fait foi et n'est
pas répétée ici.

## Mémoire et Gouvernance du Projet (mode LEAN)

- **`docs/CURRENT_STATE.md` et `docs/DECISIONS.md` ne se touchent QUE pour un
  changement d'architecture majeur** (ex. base de données, framework, refonte
  structurelle d'`App.vue`/du routing). **Ne jamais** les mettre à jour pour
  une modification d'UI, de CSS, de composant visuel ou de maquette.
- `python3 scripts/generate-codemap.py` reste à lancer après l'ajout/le
  retrait d'un fichier ou d'une dépendance.
- **Réponses ultra-concises :** pour une tâche d'UI/CSS/composant, livrer le
  code modifié et un résumé de 2 phrases maximum — pas de compte-rendu long.
- **Interdiction absolue de Playwright ou de tout script de test automatisé**,
  sur ce projet, sans exception ni demande explicite.

## Règles d'architecture globales

- **Dépendances frontend à sens unique : `views/` → `features/` →
  `components/ui/`.** Jamais l'inverse.
- **Full Page Snap Scroll (CRITIQUE) :** Toutes les vues principales utilisent un défilement par section. Chaque section HTML doit posséder les classes : `h-full w-full snap-start snap-always flex flex-col justify-center`. (Exception : les zones de listes/grilles doivent avoir un `overflow-y-auto` interne pour ne pas bloquer le scroll).
- **Déterminisme obligatoire :** Pas de `Math.random()`, `Date.now()`, `new Date()`
  sans argument dans un calcul de rendu — l'écart entre le HTML pré-rendu (SSG) et
  le rendu client casse l'hydratation.
- **Aucun secret en dur :** Ni dans le code `client/src/`, ni dans les configurations versionnées.

## Design system et UX (tout agent qui produit de l'UI)

- **Alternance stricte des thèmes (CRITIQUE) :** Le layout repose sur une alternance visuelle une section sur deux :
  - *Thème Sombre :* `data-theme="dark"`, `bg-[#000066]`, texte blanc, composants enfants en `tone="dark"`.
  - *Thème Clair :* `data-theme="light"`, `bg-white` ou `bg-light`, texte sombre, composants enfants en `tone="light"`.
- **Réactivité des composants globaux :** `MegaMenu.vue` observe dynamiquement les attributs `data-theme` des sections au scroll. Les boutons utilisent une prop `surface="light"|"dark"` pour le contraste (WCAG).
- Les tokens de design sont dans `client/src/assets/styles/main.css` (Tailwind v4).
- **Couleur d'accent :** Jamais d'aplat de fond de grande surface avec l'accent saturé, uniquement en touche (icône, bordure, puce).
- **Animations :** Utilisation d'animations au scroll (`animate-fade-up`, `stagger`) mais toute animation décorative doit être neutralisée sous `motion-reduce:`.

## Intégrité du contenu et Style de code

- **Ne jamais inventer un fait produit ou métier** (chiffre, date, témoignage). Un contenu manquant se signale par un `TODO`.
- **Commenter le "pourquoi", pas le "quoi" :** Dans ce dépôt, expliquer une
  contrainte cachée, un arbitrage ou un piège évité vaut d'être écrit (en français).
- `legacy/` n'est pas versionné et sert uniquement de référence produit — jamais de code à réutiliser tel quel.