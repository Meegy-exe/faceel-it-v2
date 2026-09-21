import type { FooterColumn } from '@/components/ui/types'

/**
 * Liens du pied de page.
 *
 * Volontairement séparés de `mainNavEntries` : un pied de page n'est pas une
 * copie du menu. Il reprend les entrées les plus demandées et ajoute celles
 * qu'on ne met jamais dans l'en-tête (recrutement, pages légales).
 *
 * CIBLES PROVISOIRES — même réserve que pour la navigation principale :
 * l'arborescence publique se limite à `/`, tout pointe donc vers des ancres
 * réelles de l'accueil. Aucun lien mort.
 *
 * « Nous rejoindre » pointait vers `#contact` (section supprimée de
 * `HomeView.vue` en V0.1.13, cf. ADR 17) : un mailto direct la remplace en
 * attendant une vraie page de recrutement, même mesure temporaire que les
 * CTA globaux de `App.vue`.
 *
 * « Interviews collaborateurs » RETIRÉ (V0.1.20, cf. ADR 24) : ciblait
 * `#interviews`, ancre disparue avec la section Interviews de `HomeView.vue`
 * (retrait intégral, demande client, pivot « scroll snapping ») — même
 * raisonnement que le retrait de l'entrée équivalente dans `mainNav.ts`.
 *
 * « Notre collectif » RETIRÉ (V0.1.22, cf. ADR 26) : ciblait `#equipe`,
 * ancre disparue avec la section Équipe de `HomeView.vue` (retrait intégral,
 * demande client explicite) — même raisonnement que le retrait
 * d'« Interviews collaborateurs » ci-dessus et de l'entrée équivalente dans
 * `mainNav.ts`.
 */
export const footerColumns: FooterColumn[] = [
  {
    title: 'Nos services',
    links: [
      { label: 'La tech au service des métiers', to: { path: '/', hash: '#services' } },
      { label: 'Nos secteurs d’activités', to: { path: '/', hash: '#secteurs' } },
      { label: 'Notre valeur ajoutée', to: { path: '/', hash: '#valeurs' } },
    ],
  },
  {
    title: 'L’agence',
    links: [
      { label: 'Politique RSE', to: { path: '/', hash: '#rse' } },
      { label: 'Nous rejoindre', href: 'mailto:contact@faceel-it.com' },
    ],
  },
]

/** Baseline affichée sous le logotype, reprise du pied de page de l'ancien site. */
export const footerDescription =
  'Cabinet de conseil expert en Data, Intelligence Artificielle et Transformation digitale. ' +
  'Au-delà du code, c’est l’engagement de notre collectif qui fait aboutir vos projets.'
