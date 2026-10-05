/**
 * URLs statiques à pré-rendre — source de vérité partagée par trois
 * consommateurs qui ne doivent jamais diverger : `vite.config.ts`
 * (`ssgOptions.includedRoutes` + génération du sitemap) et `routes.ts`
 * (documentation des routes qui n'y figurent volontairement pas, comme
 * `/styleguide`).
 *
 * Isolé de `routes.ts` plutôt qu'exporté depuis ce fichier : `routes.ts`
 * importe les vues via `() => import('@/views/*.vue')`, ce que
 * `tsconfig.node.json` (le projet TypeScript de `vite.config.ts`) ne peut
 * pas résoudre — il ne connaît pas l'alias `@` ni les fichiers `.vue`, et n'a
 * aucune raison de le connaître. En gardant cette liste dans un module sans
 * aucune dépendance Vue, `vite.config.ts` peut l'importer directement sans
 * jamais tirer `routes.ts` (et ses vues) dans la compilation Node.
 *
 * Les routes dynamiques (offres, membres) viendront de l'API au moment du
 * build, une fois les vues correspondantes construites.
 */
export const staticPrerenderRoutes = [
  '/',
  '/qui-sommes-nous/notre-histoire',
  '/qui-sommes-nous/notre-collectif',
  '/je-suis-une-entreprise',
  '/je-suis-candidat',
  '/sport-sponsoring',
  '/partenaires',
  '/politique-rse',
  '/references/boulanger',
  '/references/adeo',
  '/evenements-tech',
  '/consulter-nos-offres',
  '/candidature-spontanee',
]
