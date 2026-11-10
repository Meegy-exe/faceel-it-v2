---
name: seo-head-recipe
description: >
  Recette pour brancher la gestion des balises de tête (title, meta
  description, canonique, Open Graph, robots) sur une vue Vue 3, et pour
  vérifier ce comportement par un test - les balises de tête ne s'affichent
  nulle part, une relecture visuelle ne peut pas les valider. À utiliser
  quand une nouvelle vue publique est ajoutée, ou quand une vue existante a
  besoin d'un titre/description dynamique.
---

# Pourquoi ce skill existe

Les balises `<head>` sont le seul livrable d'une page qu'aucune capture
d'écran ne peut confirmer. Sans discipline, elles restent absentes ou
copiées-collées d'une autre page (titre dupliqué, canonique erronée). Ce
skill documente la recette et son piège de test le plus fréquent.

# Recette de branchement

Utiliser un composable dédié au-dessus de la librairie de gestion du
`<head>` du projet (ex. `@vueuse/head` / `unhead`) plutôt que de manipuler
`document` directement - une manipulation manuelle dans un hook de montage
ne produit aucune balise dans un HTML pré-rendu/statique, exactement
l'inverse du but recherché.

Points de vigilance qui provoquent des bugs discrets :

- **URL canonique : toujours dérivée du chemin de route seul, jamais de
  l'URL complète.** Une ancre (`#section`) ou un paramètre de tracking
  (`?utm=...`) dans la canonique déclarerait autant de « pages » canoniques
  différentes qu'il y a de liens entrants - c'est l'inverse de ce que la
  canonique est censée garantir.
- **Toute image de partage (Open Graph/Twitter) doit être absolutisée** en
  URL complète avant d'être posée en meta - les crawlers sociaux rejettent
  silencieusement une URL relative.
- **Une page qui ne doit pas être indexée** (page technique, page d'erreur,
  banc d'essai interne) doit porter un `robots: noindex, nofollow` explicite
  - l'absence de balise `robots` n'est pas un `noindex` implicite pour tous
  les crawlers.
- **Le titre complet vs. le titre + suffixe de marque** sont deux cas
  distincts : la page d'accueil porte souvent déjà la marque et n'a pas
  besoin du suffixe, une page de rubrique en a besoin pour rester
  identifiable dans un onglet ou un résultat de recherche.

# Vérifier par un test - le piège à connaître

La plupart des librairies de gestion du `<head>` (`unhead` et dérivés)
écrivent dans le DOM de façon **différée**, pas synchrone avec le prochain
tick de Vue. Un test qui vérifie `document.title` juste après un `mount()` +
`await nextTick()` échoue par un titre vide - pas parce que le code est
cassé, mais parce que l'assertion arrive trop tôt.

```ts
mount(Probe, { global: { plugins: [router, createHead()] } })

// L'écriture DOM d'unhead est différée : un seul nextTick() ne suffit pas.
await new Promise((resolve) => setTimeout(resolve, 50))
await nextTick()

expect(document.title).toBe('Titre attendu')
```

Couvrir au minimum : titre effectif (avec et sans suffixe de marque),
description, `robots` selon `indexable`, URL canonique stable face aux
ancres/paramètres, absolutisation de l'image sociale.

# Ce que ce skill ne couvre pas

Le rendu effectif de ces balises pour les crawlers qui n'exécutent pas de
JavaScript (la plupart des crawlers sociaux) dépend du pré-rendu ou du
rendu serveur de l'application - si ce mécanisme n'est pas branché, les
balises injectées côté client ne seront visibles que par les crawlers qui
exécutent du JS (typiquement les moteurs de recherche majeurs, pas les
aperçus de messagerie/réseaux sociaux). Le signaler explicitement plutôt que
laisser croire que le SEO est complet.
