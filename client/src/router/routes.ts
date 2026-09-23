import type { RouteRecordRaw } from 'vue-router'
import { staticPrerenderRoutes } from './staticPrerenderRoutes'

export { staticPrerenderRoutes }

/**
 * Routes publiques uniquement (arbitrage n°3 : pas de back-office en V1).
 *
 * Chaque vue est chargée en différé : le pré-rendu au build s'appuie sur
 * `staticPrerenderRoutes` (`./staticPrerenderRoutes.ts`) pour savoir quelles
 * URLs générer en statique.
 */
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    /**
     * `fullPageScroll` (V0.1.22, cf. ADR 26) : lu par `App.vue` pour décider
     * si `<main>`/`<TheFooter>` sont enveloppés dans le conteneur de
     * scroll-snap pleine page (`h-dvh overflow-y-auto snap-y
     * snap-mandatory`). Route-scopé plutôt qu'appliqué globalement : `/`
     * est la seule page conçue pour un défilement en diapositives —
     * `/styleguide` (contenu long, défilement continu) et la 404 gardent le
     * flux document normal, avec pied de page « collé en bas ».
     */
    meta: { fullPageScroll: true },
  },
  {
    /**
     * Première page publique en dehors de `/`. Pas de `meta.fullPageScroll` :
     * la page est un contenu long (hero + annuaire dont les cartes se
     * déplient), l'enclenchement en diapositives couperait une carte ouverte
     * en deux — même raisonnement que `/styleguide` et la 404.
     */
    /**
     * Les deux pages de la rubrique « Qui sommes-nous ». Le préfixe d'URL est
     * PLAT, pas une route parente avec `children` : sans layout commun à
     * partager (aucune `<RouterView>` intermédiaire, aucun sous-menu de
     * rubrique affiché sur les deux pages), une route parente n'apporterait
     * qu'un niveau d'indirection — la parenté est ici un fait d'URL et de
     * menu, pas de rendu.
     *
     * Pas de `meta.fullPageScroll` : contenu long (hero + sections, et pour
     * `/collectif` des cartes qui se déplient), l'enclenchement en
     * diapositives couperait une carte ouverte en deux — même raisonnement que
     * `/styleguide` et la 404.
     */
    path: '/qui-sommes-nous/notre-collectif',
    name: 'collectif',
    component: () => import('@/views/CollectifView.vue'),
  },
  {
    /**
     * `fullPageScroll` (V0.7) : seule des deux pages « Qui sommes-nous » à le
     * porter — `/notre-collectif` garde son flux document normal (cartes qui
     * se déplient, l'enclenchement en diapositives en couperait une ouverte
     * en deux, cf. commentaire ci-dessus). `/notre-histoire` est désormais un
     * récit en 5 diapositives `h-full snap-start`, sur le même modèle que
     * `HomeView.vue` — réutilise le mécanisme d'ADR 26/`docs/DECISIONS.md`
     * pour une deuxième route, n'y ajoute rien de nouveau.
     */
    path: '/qui-sommes-nous/notre-histoire',
    name: 'histoire',
    component: () => import('@/views/HistoireView.vue'),
    meta: { fullPageScroll: true },
  },
  {
    /**
     * `fullPageScroll` (V0.8) : même mécanisme que `/` et
     * `/qui-sommes-nous/notre-histoire` — 6 diapositives `h-full snap-start`.
     * Route dédiée déjà anticipée par `mainNav.ts` (entrée `id: 'entreprise'`,
     * cf. son commentaire « CIBLES PROVISOIRES ») : celle-ci a été repointée
     * de `{ path: '/', hash: '#services' }` vers `{ name: 'entreprise' }`
     * dans le même mouvement.
     */
    path: '/je-suis-une-entreprise',
    name: 'entreprise',
    component: () => import('@/views/EnterpriseView.vue'),
    meta: { fullPageScroll: true },
  },
  {
    /**
     * `fullPageScroll` (V0.9) : même mécanisme que `/`,
     * `/qui-sommes-nous/notre-histoire` et `/je-suis-une-entreprise` — 7
     * diapositives `h-full snap-start`. Contrairement à « entreprise »,
     * `mainNav.ts` ne porte aucune entrée « candidat » préexistante à
     * repointer — cf. le commentaire d'en-tête de `CandidateView.vue` pour
     * le détail de cet arbitrage.
     */
    path: '/je-suis-candidat',
    name: 'candidat',
    component: () => import('@/views/CandidateView.vue'),
    meta: { fullPageScroll: true },
  },
  {
    /**
     * `fullPageScroll` (V1.1) : même mécanisme que `/`,
     * `/qui-sommes-nous/notre-histoire`, `/je-suis-une-entreprise` et
     * `/je-suis-candidat` — 6 diapositives `h-full snap-start`. Entrée de
     * menu dédiée ajoutée dans `mainNav.ts` dans le même mouvement.
     */
    path: '/discutons-ia',
    name: 'ia',
    component: () => import('@/views/IaView.vue'),
    meta: { fullPageScroll: true },
  },
  {
    path: '/consulter-nos-offres',
    name: 'offres',
    component: () => import('@/views/OffersView.vue'),
    meta: { fullPageScroll: true },
  },
  {
    path: '/offres/:id',
    name: 'offre-detail',
    component: () => import('@/views/OfferDetailView.vue'),
    meta: { fullPageScroll: true },
  },
  {
    path: '/mentions-legales',
    name: 'mentions-legales',
    component: () => import('@/views/legal/MentionsLegalesView.vue'),
    meta: { classicScroll: true },
  },
  {
    path: '/politique-confidentialite',
    name: 'politique-confidentialite',
    component: () => import('@/views/legal/PrivacyPolicyView.vue'),
    meta: { classicScroll: true },
  },
  {
    path: '/politique-cookies',
    name: 'politique-cookies',
    component: () => import('@/views/legal/CookiesPolicyView.vue'),
    meta: { classicScroll: true },
  },
  {
    path: '/accessibilite',
    name: 'accessibilite',
    component: () => import('@/views/legal/AccessibilityView.vue'),
    meta: { classicScroll: true },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/ContactView.vue'),
    meta: { classicScroll: true },
  },
  {
    // JETABLE — banc d'essai du Design System, à retirer avant la mise en ligne.
    // Absente de `staticPrerenderRoutes` : jamais pré-rendue, jamais indexable.
    path: '/styleguide',
    name: 'styleguide',
    component: () => import('@/views/StyleguideView.vue'),
    meta: { throwaway: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
]
