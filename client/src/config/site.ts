/**
 * Constantes de site partagées entre le runtime navigateur (`useSeo.ts`) et
 * le script de build Node (`vite.config.ts`, génération du sitemap).
 *
 * Un seul et même fichier plutôt que deux copies : un domaine dupliqué finit
 * toujours par diverger le jour où l'un des deux est mis à jour sans l'autre.
 */
export const SITE_URL = 'https://www.faceel-it.com'
