import type { RouteRecordRaw } from 'vue-router'
import { staticPrerenderRoutes } from './staticPrerenderRoutes'

export { staticPrerenderRoutes }

/**
 * Routes publiques + back-office `/admin` (arbitrage n°3 révoqué, cf.
 * `docs/DECISIONS.md`).
 *
 * Chaque vue est chargée en différé : le pré-rendu au build s'appuie sur
 * `staticPrerenderRoutes` (`./staticPrerenderRoutes.ts`) pour savoir quelles
 * URLs générer en statique — `/admin` en est volontairement absent (contenu
 * authentifié, jamais pré-rendu ni indexé).
 *
 * Scroll : App.vue est désormais un layout fluide sans logique conditionnelle.
 * Le scroll-snap de l'accueil est autoporté par HomeView.vue. Les autres vues
 * défilent naturellement via le navigateur.
 */
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    /**
     * Les deux pages de la rubrique « Qui sommes-nous ». Le préfixe d'URL est
     * PLAT, pas une route parente avec `children` : sans layout commun à
     * partager (aucune `<RouterView>` intermédiaire, aucun sous-menu de
     * rubrique affiché sur les deux pages), une route parente n'apporterait
     * qu'un niveau d'indirection — la parenté est ici un fait d'URL et de
     * menu, pas de rendu.
     */
    path: '/qui-sommes-nous/notre-collectif',
    name: 'collectif',
    component: () => import('@/views/CollectifView.vue'),
  },
  {
    path: '/qui-sommes-nous/notre-histoire',
    name: 'histoire',
    component: () => import('@/views/HistoireView.vue'),
  },
  {
    path: '/qui-sommes-nous/notre-organisation',
    name: 'notre-organisation',
    component: () => import('@/views/NotreOrganisationView.vue'),
  },
  {
    path: '/je-suis-une-entreprise',
    name: 'entreprise',
    component: () => import('@/views/EnterpriseView.vue'),
  },
  {
    path: '/je-suis-candidat',
    name: 'candidat',
    component: () => import('@/views/CandidateView.vue'),
  },
  {
    path: '/consulter-nos-offres',
    name: 'offres',
    component: () => import('@/views/OffersView.vue'),
  },
  {
    path: '/sport-sponsoring',
    name: 'sport',
    component: () => import('@/views/SportView.vue'),
  },
  {
    path: '/partenaires',
    name: 'partenaires',
    component: () => import('@/views/PartenairesView.vue'),
  },
  {
    path: '/politique-rse',
    name: 'politique-rse',
    component: () => import('@/views/PolitiqueRseView.vue'),
  },
  {
    path: '/references/boulanger',
    name: 'reference-boulanger',
    component: () => import('@/views/references/BoulangerView.vue'),
  },
  {
    path: '/references/adeo',
    name: 'reference-adeo',
    component: () => import('@/views/references/AdeoView.vue'),
  },
  {
    path: '/evenements-tech',
    name: 'evenements-tech',
    component: () => import('@/views/TechEventsView.vue'),
  },
  {
    path: '/offres/:id',
    name: 'offre-detail',
    component: () => import('@/views/OfferDetailView.vue'),
  },
  {
    path: '/offres/:id/postuler',
    name: 'offre-postuler',
    component: () => import('@/views/ApplicationView.vue'),
  },
  {
    /**
     * Pas de `:id` : contrairement à `offre-postuler`, cette candidature n'est
     * rattachée à aucune offre existante. `ApplicationView.vue` détecte ce
     * mode via l'absence de `route.params.id`.
     */
    path: '/candidature-spontanee',
    name: 'candidature-spontanee',
    component: () => import('@/views/ApplicationView.vue'),
  },
  {
    path: '/mentions-legales',
    name: 'mentions-legales',
    component: () => import('@/views/legal/MentionsLegalesView.vue'),
  },
  {
    path: '/politique-confidentialite',
    name: 'politique-confidentialite',
    component: () => import('@/views/legal/PrivacyPolicyView.vue'),
  },
  {
    path: '/politique-cookies',
    name: 'politique-cookies',
    component: () => import('@/views/legal/CookiesPolicyView.vue'),
  },
  {
    path: '/accessibilite',
    name: 'accessibilite',
    component: () => import('@/views/legal/AccessibilityView.vue'),
  },
  {
    path: '/contact-entreprise',
    name: 'contact',
    component: () => import('@/views/ContactView.vue'),
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/ChatbotView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/RegisterView.vue'),
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('@/views/admin/LoginView.vue'),
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/DashboardView.vue'),
      },
      {
        path: 'evenements',
        name: 'admin-events',
        component: () => import('@/views/admin/EventsView.vue'),
      },
      {
        path: 'afterworks',
        name: 'admin-afterworks',
        component: () => import('@/views/admin/AfterworksView.vue'),
      },
      {
        path: 'blog',
        name: 'admin-blog',
        component: () => import('@/views/admin/BlogView.vue'),
      },
      {
        path: 'cas-usage',
        name: 'admin-cas-usage',
        component: () => import('@/views/admin/CaseStudiesView.vue'),
      },
      {
        path: 'offres',
        name: 'admin-offres',
        component: () => import('@/views/admin/JobOffersView.vue'),
      },
    ],
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
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
  },
]
