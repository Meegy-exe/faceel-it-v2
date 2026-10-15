import type { RouteLocationRaw } from 'vue-router'

/* -------------------------------------------------------------------------- */
/* Types — chaque entrée porte ses infos de panneau gauche ET ses sous-liens. */
/* -------------------------------------------------------------------------- */

export interface NavSubItem {
  label: string
  description?: string
  to?: RouteLocationRaw
  href?: string
}

export interface NavItem {
  id: string
  label: string
  /** Titre affiché dans le panneau gauche du mega-menu au survol. */
  title: string
  /** Description affichée dans le panneau gauche au survol. */
  description: string
  ctaLabel: string
  ctaTo: RouteLocationRaw
  /**
   * Présent : l'entrée est un lien direct (mobile = navigation immédiate,
   * desktop = lien cliquable + subItems affichés dans la zone droite au survol).
   * Absent : l'entrée ouvre un drill-down sur mobile (pas de navigation directe).
   */
  to?: RouteLocationRaw
  href?: string
  /** Sous-liens affichés dans la zone droite du mega-menu au survol (desktop)
   *  et en drill-down sur mobile (si `to` est absent). */
  subItems?: NavSubItem[]
}

/* Panneau gauche par défaut — affiché quand aucun onglet n'est survolé. */
export const NAV_DEFAULT: NavItem = {
  id: '_default',
  label: '',
  title: 'Faceel-IT',
  description:
    'ESN spécialisée dans la transformation digitale. Nous accompagnons entreprises et talents dans les métiers du numérique, cloud et data.',
  ctaLabel: 'Découvrir Faceel-IT',
  ctaTo: { name: 'histoire' },
}

/**
 * Navigation principale du site.
 *
 * Elle vit dans `features/` et non dans la vue : c'est une donnée de site, pas
 * une donnée de page. Le jour où l'en-tête sera hissé dans un layout partagé
 * (dès qu'une deuxième page publique existera), seul l'import bougera.
 *
 * INTITULÉS COURTS (V0.1.12, ticket #14) — PARTIELLEMENT REVENU EN V1.0 :
 * cette entrée imposait initialement un libellé aligné sur l'identifiant de
 * section plutôt qu'une formule de phrase (« Expertises » pour « Je suis une
 * entreprise »), demande client explicite pour une navigation plus
 * scannable. Le client est revenu sur ce point précis en V1.0 : l'entrée
 * `entreprise` porte de nouveau sa formule longue d'origine.
 *
 * CIBLES PROVISOIRES — l'arborescence publique se limite pour l'instant à `/`.
 * Toutes les entrées pointent donc vers des ancres réelles de l'accueil : rien
 * ici ne mène à un 404. À l'ouverture des pages dédiées, remplacer les
 * `hash` par les `name` de route correspondants.
 *
 * ENTRÉES SANS `to` (qui-sommes-nous, references) : pas de page unique dédiée,
 * les sous-liens constituent la destination réelle. Mobile : drill-down.
 * Desktop : zone droite du mega-menu au survol.
 */
export const mainNavEntries: NavItem[] = [
  {
    id: 'entreprise',
    label: 'Je suis une entreprise',
    title: 'Je suis une entreprise',
    description:
      'Nous vous accompagnons dans vos projets data, cloud et applicatifs avec des consultants experts, sélectionnés sur mesure.',
    ctaLabel: 'Découvrir nos expertises',
    ctaTo: { name: 'entreprise' },
    to: { name: 'entreprise' },
    subItems: [
      {
        label: 'Nos expertises',
        description: 'Data, cloud, développement, conseil',
        to: { name: 'entreprise' },
      },
      {
        label: 'Nos références clients',
        description: 'Projets et secteurs accompagnés',
        to: { name: 'entreprise' },
      },
    ],
  },
  {
    id: 'candidat',
    label: 'Je suis candidat',
    title: 'Rejoignez le collectif',
    description:
      'Rejoignez un collectif où votre talent compte vraiment. CDI - construisez votre carrière avec nous.',
    ctaLabel: 'Voir nos offres',
    ctaTo: { name: 'offres' },
    to: { name: 'candidat' },
    subItems: [
      {
        label: "Nos offres d'emploi",
        description: 'Data, cloud, dev, conseil',
        to: { name: 'offres' },
      },
      {
        label: "La vie d'un consultant",
        description: 'Culture, avantages, collectif',
        to: { name: 'candidat', hash: '#collectif' },
      },
      {
        label: 'Processus de recrutement',
        description: 'Simple, humain et rapide',
        to: { name: 'candidat', hash: '#process' },
      },
    ],
  },
  {
    id: 'offres',
    label: 'Consulter nos offres',
    title: 'Nos offres',
    description:
      'Data, cloud, développement, conseil — des postes sur mesure qui correspondent à votre profil et à vos ambitions.',
    ctaLabel: 'Explorer les offres',
    ctaTo: { name: 'offres' },
    to: { name: 'offres' },
    subItems: [
      {
        label: 'Toutes nos offres',
        description: 'Filtrer par compétence ou localisation',
        to: { name: 'offres' },
      },
    ],
  },
  {
    id: 'qui-sommes-nous',
    label: 'Qui sommes-nous',
    title: 'Qui sommes-nous ?',
    description:
      "Une ESN à taille humaine fondée sur l'expertise, la proximité et l'engagement. Découvrez notre histoire et notre collectif.",
    ctaLabel: 'Notre histoire',
    ctaTo: { name: 'histoire' },
    subItems: [
      {
        label: 'Notre histoire',
        description: 'Nos origines',
        to: { name: 'histoire' },
      },
      {
        label: 'Notre vision',
        description: 'Ce qui nous porte',
        to: { name: 'notre-organisation', hash: '#vision' },
      },
      {
        label: 'Nos valeurs',
        description: 'Ce qui nous définit',
        to: { path: '/', hash: '#valeurs' },
      },
      {
        label: 'Notre organisation',
        description: "L'équipe et le collectif Faceel-IT",
        to: { name: 'notre-organisation', hash: '#organisation' },
      },
      {
        label: 'Politique RSE',
        description: 'Nos engagements responsables',
        to: { name: 'politique-rse' },
      },
    ],
  },
  {
    id: 'business-units',
    label: 'Nos BU',
    title: 'Nos BUs, Experte de vos besoins.',
    description: 'Une organisation interne adaptée au marché pour une réponse sur-mesure à nos clients.',
    ctaLabel: 'En savoir plus',
    ctaTo: { path: '/', hash: '#business-units' },
    subItems: [
      { label: 'Data & IA', to: { path: '/', hash: '#business-units' } },
      { label: 'Product', to: { path: '/', hash: '#business-units' } },
      { label: 'Digital', to: { path: '/', hash: '#business-units' } },
    ],
  },
  {
    id: 'sport',
    label: 'Sport & sponsoring',
    title: 'Sport & sponsoring',
    description:
      'Padel, vélo, course, tennis : le sport façonne notre collectif, notre recrutement et nos partenariats avec la région.',
    ctaLabel: 'Découvrir',
    ctaTo: { name: 'sport' },
    to: { name: 'sport' },
  },
  {
    id: 'partenaires',
    label: 'Partenaires',
    title: 'Partenaires',
    description:
      'Nous nous entourons des meilleurs acteurs technologiques pour construire des plateformes solides, fiables et innovantes.',
    ctaLabel: 'Découvrir',
    ctaTo: { name: 'partenaires' },
    to: { name: 'partenaires' },
  },
  {
    id: 'nos-references',
    label: 'Nos références',
    title: 'Nos références',
    description:
      'Découvrez comment nous accompagnons nos clients dans la transformation de leurs plateformes digitales.',
    ctaLabel: 'Découvrir',
    ctaTo: { name: 'reference-boulanger' },
    subItems: [
      { label: 'Boulanger', to: { name: 'reference-boulanger' } },
      { label: 'Adeo', to: { name: 'reference-adeo' } },
    ],
  },
]

/**
 * Nos 4 practices internes (cf. `BuSection.vue`, section `#business-units`
 * de l'accueil). Affichées en bande verticale dans la zone droite du
 * mega-menu quand aucun onglet n'est survolé (cf. `MegaMenu.vue`).
 */
export const BUSINESS_UNITS: { label: string; to: RouteLocationRaw }[] = [
  { label: 'Data & IA', to: { path: '/', hash: '#business-units' } },
  { label: 'Digital', to: { path: '/', hash: '#business-units' } },
  { label: 'Product', to: { path: '/', hash: '#business-units' } },
  { label: 'Cloud & DevOps', to: { path: '/', hash: '#business-units' } },
]
