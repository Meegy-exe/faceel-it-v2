/// <reference types="vite-ssg" />
// Requis pour que `ssgOptions` ci-dessous soit un champ connu de `UserConfig` :
// cette augmentation de type vit dans les déclarations de `vite-ssg`, qui ne
// sont chargées par TypeScript que si quelque chose importe `vite-ssg`
// (valeur) ou le référence explicitement (comme ici) - ce fichier ne fait
// que lire `ssgOptions`, il n'importe jamais `ViteSSG` lui-même (ça, c'est le
// rôle de `src/app.ts`).
import { existsSync, rmSync, writeFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

import { staticPrerenderRoutes } from './src/router/staticPrerenderRoutes.ts'
import { SITE_URL } from './src/config/site.ts'

/**
 * Retire le worker de mock (MSW) du build de production.
 *
 * `public/mockServiceWorker.js` doit rester en place : le serveur de
 * développement le sert directement depuis `public/`, sans passer par ce
 * plugin (`apply: 'build'` l'exclut de `vite dev`). Mais Vite copie tout
 * `publicDir` dans `dist/` sans condition - la garde d'exécution de
 * `main.ts` (`import.meta.env.DEV && VITE_USE_MOCKS === 'true'`) empêche déjà
 * le worker de s'enregistrer en production, mais le fichier lui-même
 * atterrirait quand même sur le domaine public sans cette étape, exposant un
 * détail d'outillage interne sans aucune utilité en production.
 */
function stripMockWorkerFromBuild(): Plugin {
  return {
    name: 'strip-mock-worker-from-build',
    apply: 'build',
    closeBundle() {
      const target = fileURLToPath(new URL('./dist/mockServiceWorker.js', import.meta.url))
      if (existsSync(target)) rmSync(target)
    },
  }
}

/**
 * Génère `dist/sitemap.xml` à partir de `staticPrerenderRoutes` - la même
 * liste qui pilote le pré-rendu (`ssgOptions.includedRoutes` ci-dessous) et
 * l'entrée `Sitemap:` de `public/robots.txt`. Une seule source de vérité :
 * ajouter une URL statique à prérendre l'ajoute aussi au sitemap sans second
 * endroit à mettre à jour.
 *
 * Volontairement limité aux routes statiques : les offres d'emploi et les
 * fiches membre viendront de l'API et n'ont ni vue ni route dédiées pour
 * l'instant (cf. `client/src/types/api.ts`). Les y ajouter aujourd'hui
 * produirait des URLs qui ne correspondent à aucune page réelle - un sitemap
 * qui pointe vers du vide est pire qu'un sitemap incomplet.
 */
function writeSitemap() {
  const urls = staticPrerenderRoutes
    .map((path) => `  <url>\n    <loc>${SITE_URL}${path}</loc>\n  </url>`)
    .join('\n')

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n')

  const target = fileURLToPath(new URL('./dist/sitemap.xml', import.meta.url))
  writeFileSync(target, xml, 'utf-8')
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    stripMockWorkerFromBuild(),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    port: 5173,
    // Supprime toute problématique CORS en développement : le front appelle
    // des URLs relatives (/api/v1/...), Vite relaie vers Spring Boot.
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Isole les dépendances stables du code applicatif : le cache
        // navigateur survit aux déploiements qui ne touchent que le métier.
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor'
          return undefined
        },
      },
    },
  },

  /**
   * Pré-rendu statique (arbitrage n°5, désormais réglé) - géré par la CLI
   * `vite-ssg build` (cf. package.json), qui lit ce bloc. `vite build` seul
   * l'ignore silencieusement : c'est pour ça que le script `build` du projet
   * appelle `vite-ssg build`, pas `vite build`, en production.
   */
  ssgOptions: {
    // Par défaut, le rendu SSR importe `src/main.ts` pour y chercher
    // `createApp`. Ce projet garde volontairement `main.ts` pour le seul
    // bootstrap navigateur (garde MSW, effet de bord au niveau module) et
    // `app.ts` pour la fabrique pure sans effet de bord - c'est cette
    // dernière qu'il faut pointer ici, pas le défaut.
    entry: 'src/app.ts',
    // `/foo` -> `/foo/index.html`, pas `/foo.html` : c'est ce que
    // `client/nginx.conf` attend (`try_files $uri $uri/ /index.html`).
    dirStyle: 'nested',
    // Par défaut, vite-ssg prérend toute route STATIQUE du routeur - ce qui
    // inclurait /styleguide, qui n'a ni contenu éditorial ni vocation à être
    // indexé (cf. useSeo « indexable: false » sur cette vue). On restreint
    // donc explicitement à la liste déjà tenue à jour pour le sitemap et
    // pour robots.txt, plutôt que de laisser la détection automatique
    // décider à notre place.
    includedRoutes() {
      return staticPrerenderRoutes
    },
    onFinished() {
      writeSitemap()
    },
  },
})
