/**
 * URLs statiques à pré-rendre - source de vérité partagée par trois
 * consommateurs qui ne doivent jamais diverger : `vite.config.ts`
 * (`ssgOptions.includedRoutes` + génération du sitemap) et `routes.ts`
 * (documentation des routes qui n'y figurent volontairement pas, comme
 * `/styleguide`).
 *
 * Isolé de `routes.ts` plutôt qu'exporté depuis ce fichier : `routes.ts`
 * importe les vues via `() => import('@/views/*.vue')`, ce que
 * `tsconfig.node.json` (le projet TypeScript de `vite.config.ts`) ne peut
 * pas résoudre - il ne connaît pas l'alias `@` ni les fichiers `.vue`, et n'a
 * aucune raison de le connaître. En gardant cette liste dans un module sans
 * aucune dépendance Vue, `vite.config.ts` peut l'importer directement sans
 * jamais tirer `routes.ts` (et ses vues) dans la compilation Node.
 *
 * Les routes dynamiques (offres, membres) viendront de l'API au moment du
 * build, une fois les vues correspondantes construites.
 */
// desactive pour la v1 : organisation et rse retirees du prerender avec leurs routes
export const staticPrerenderRoutes = [
  '/',
  '/qui-sommes-nous/notre-histoire',
  '/qui-sommes-nous/notre-collectif',
  // maj route entreprise
  '/client-chez-faceel-it',
  // maj route consultant
  '/consultant-chez-faceel-it',
  '/sport-sponsoring',
  '/partenaires',
  '/references/boulanger',
  '/references/adeo',
  '/nos-bus/data-ia',
  '/nos-bus/digital',
  '/nos-bus/product',
  '/evenements-tech',
  '/consulter-nos-offres',
  '/candidature-spontanee',
]
