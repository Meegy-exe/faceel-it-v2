/// <reference types="vite/client" />

import 'vue-router'

/**
 * Typage strict des variables d'environnement.
 * Toute nouvelle variable VITE_* doit être déclarée ici, sinon son accès
 * est une erreur de compilation — c'est volontaire.
 *
 * `import 'vue-router'` en tête rend ce fichier un module TypeScript :
 * les interfaces globales doivent donc être dans `declare global {}`,
 * et `declare module 'vue-router'` est une vraie augmentation (pas une
 * redéfinition qui efface les exports du module).
 */
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string
    readonly VITE_USE_MOCKS: 'true' | 'false'
    readonly VITE_SITE_URL: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    fullPageScroll?: boolean
    classicScroll?: boolean
    throwaway?: boolean
    requiresAuth?: boolean
    requiresAdmin?: boolean
  }
}
