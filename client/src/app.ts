import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import type { RouteLocationNormalized, RouterScrollBehavior } from 'vue-router'

import App from './App.vue'
import { routes } from './router/routes'
import { useAuthStore } from './stores/useAuthStore'
import './assets/styles/main.css'

/**
 * Fabrique l'application ET l'instrumente pour le pré-rendu au build
 * (arbitrage n°5, désormais réglé - cf. `ssgOptions` dans `vite.config.ts`).
 *
 * `ViteSSG` remplace le couple `createApp()` + `createRouter()` manuel que ce
 * fichier exposait avant : il construit lui-même le routeur (Historique Web
 * dans le navigateur, historique mémoire pendant le rendu statique côté
 * Node), installe `@unhead/vue` pour la gestion des balises de tête, ET monte
 * l'application dans le navigateur - `main.ts` n'appelle plus `app.mount()`
 * lui-même. C'est pour cette raison que ce fichier n'a plus besoin
 * d'`import router from './router'` : `src/router/index.ts` est retiré, ses
 * seules pièces utiles (les routes, le `scrollBehavior`) sont reprises ici.
 *
 * Ne PAS appeler `createHead()` ici : `ViteSSG` installe déjà sa propre
 * instance `@unhead/vue`. En poser une seconde créerait un contexte
 * concurrent, invisible du premier, et `useSeo()` cesserait silencieusement
 * d'atteindre les balises réellement sérialisées dans le HTML pré-rendu.
 */
export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL,
    scrollBehavior(
      to: Parameters<RouterScrollBehavior>[0],
      _from: Parameters<RouterScrollBehavior>[1],
      savedPosition: Parameters<RouterScrollBehavior>[2],
    ) {
      // Retour arrière : on rend la position exacte, jamais autre chose -
      // avant toute autre logique, même asynchrone, sous peine de perdre la
      // position au retour depuis la fiche d'une offre.
      if (savedPosition) return savedPosition

      // Ancre : le décalage compense l'en-tête collant (h-16 en mobile, h-20
      // à partir de `lg`). On prend la valeur haute, un peu d'air sous
      // l'en-tête vaut mieux qu'un titre passé dessous.
      if (to.hash) return { el: to.hash, top: 96, behavior: 'smooth' }

      return { top: 0 }
    },
  },
  ({ app, router }) => {
    app.use(createPinia())

    /**
     * MVP V1 - le backend n'est pas déployé : on bloque entièrement l'accès
     * à `/login` et `/admin` (+ sous-routes) côté client plutôt que de
     * laisser ces interfaces inachevées exposées sans API derrière.
     */
    router.beforeEach((to: RouteLocationNormalized) => {
      if (to.path === '/login' || to.path.startsWith('/admin')) {
        return { path: '/' }
      }
    })

    router.beforeEach((to: RouteLocationNormalized) => {
      if (!to.meta.requiresAuth && !to.meta.requiresAdmin) return true
      const auth = useAuthStore()

      // Non connecté : vers la page de login adaptée au contexte.
      if (!auth.isAuthenticated) {
        return to.meta.requiresAdmin ? { name: 'admin-login' } : { name: 'login' }
      }

      // Connecté mais sans les droits admin sur une route protégée admin.
      if (to.meta.requiresAdmin && !auth.isAdmin) return { name: 'home' }

      return true
    })
  },
)
