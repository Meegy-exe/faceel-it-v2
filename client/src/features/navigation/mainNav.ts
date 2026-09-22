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
  title: "Faceel-IT",
  description: "ESN spécialisée dans la transformation digitale. Nous accompagnons entreprises et talents dans les métiers du numérique, cloud et data.",
  ctaLabel: "Découvrir Faceel-IT",
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
    description: "Nous vous accompagnons dans vos projets data, cloud et applicatifs avec des consultants experts, sélectionnés sur mesure.",
    ctaLabel: "Découvrir nos expertises",
    ctaTo: { name: 'entreprise' },
    to: { name: 'entreprise' },
    subItems: [
      { label: "Nos expertises", description: "Data, cloud, développement, conseil", to: { name: 'entreprise' } },
      { label: "Nos références clients", description: "Projets et secteurs accompagnés", to: { name: 'entreprise' } },
    ],
  },
  {
    id: 'candidat',
    label: 'Je suis candidat',
    title: 'Rejoignez le collectif',
    description: "Rejoignez un collectif où votre talent compte vraiment. CDI, CDD, stage — construisez votre carrière avec nous.",
    ctaLabel: "Voir nos offres",
    ctaTo: { name: 'offres' },
    to: { name: 'candidat' },
    subItems: [
      { label: "Nos offres d'emploi", description: "Data, cloud, dev, conseil", to: { name: 'offres' } },
      { label: "Processus de recrutement", description: "Simple, humain et rapide", to: { name: 'candidat' } },
      { label: "La vie chez Faceel-IT", description: "Culture, avantages, collectif", to: { name: 'candidat' } },
    ],
  },
  {
    id: 'offres',
    label: 'Consulter nos offres',
    title: 'Nos offres',
    description: "Data, cloud, développement, conseil — des postes sur mesure qui correspondent à votre profil et à vos ambitions.",
    ctaLabel: "Explorer les offres",
    ctaTo: { name: 'offres' },
    to: { name: 'offres' },
    subItems: [
      { label: "Toutes nos offres", description: "Filtrer par compétence ou localisation", to: { name: 'offres' } },
    ],
  },
  {
    id: 'qui-sommes-nous',
    label: 'Qui sommes-nous',
    title: "Qui sommes-nous ?",
    description: "Une ESN à taille humaine fondée sur l'expertise, la proximité et l'engagement. Découvrez notre histoire et notre collectif.",
    ctaLabel: "Notre histoire",
    ctaTo: { name: 'histoire' },
    subItems: [
      { label: "Notre histoire", description: "Nos origines et notre vision", to: { name: 'histoire' } },
      { label: "Notre collectif", description: "L'équipe et les valeurs Faceel-IT", to: { name: 'collectif' } },
    ],
  },
  {
    id: 'references',
    label: 'Secteurs',
    title: 'Nos secteurs',
    description: "Retail, industrie, logistique, banque et assurance — nous intervenons là où la donnée et le digital font la différence.",
    ctaLabel: "En savoir plus",
    ctaTo: { path: '/', hash: '#secteurs' },
    subItems: [
      { label: "Ecommerce", to: { path: '/', hash: '#secteurs' } },
      { label: "Industrie", to: { path: '/', hash: '#secteurs' } },
      { label: "Logistique", to: { path: '/', hash: '#secteurs' } },
      { label: "Banque & Assurance", to: { path: '/', hash: '#secteurs' } },
    ],
  },
  {
    id: 'ia',
    label: 'Discutons IA',
    title: 'Discutons IA',
    description: "L'intelligence artificielle au service de votre transformation. Cas d'usage concrets et accompagnement sur mesure.",
    ctaLabel: "Explorer nos approches IA",
    ctaTo: { name: 'ia' },
    to: { name: 'ia' },
    subItems: [
      { label: "Nos approches IA", description: "Cas d'usage et accompagnement sur mesure", to: { name: 'ia' } },
    ],
  },
]
