/// <reference types="vite/client" />

/**
 * Typage strict des variables d'environnement.
 * Toute nouvelle variable VITE_* doit être déclarée ici, sinon son accès
 * est une erreur de compilation — c'est volontaire.
 */
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_USE_MOCKS: 'true' | 'false'
  readonly VITE_SITE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
