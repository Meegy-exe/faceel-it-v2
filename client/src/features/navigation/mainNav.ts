import type { RouteLocationRaw } from 'vue-router'
import type { MegaMenuEntry } from '@/components/ui/types'

/* -------------------------------------------------------------------------- */
/* Infos du panneau gauche du menu — dynamiques au survol de chaque entrée.   */
/* -------------------------------------------------------------------------- */

export interface MenuPanelInfo {
  title: string
  description: string
  ctaLabel: string
  ctaTo: RouteLocationRaw
}

export const MENU_DEFAULT: MenuPanelInfo = {
  title: "Bienvenue",
  description: "ESN spécialisée dans la transformation digitale. Nous accompagnons entreprises et talents dans les métiers du numérique, cloud et data.",
  ctaLabel: "Découvrir Faceel-IT",
  ctaTo: { name: 'histoire' },
}

export const MENU_PANEL_CONFIG: Record<string, MenuPanelInfo> = {
  entreprise: {
    title: "Je suis une entreprise",
    description: "Nous vous accompagnons dans vos projets data, cloud et applicatifs avec des consultants expérimentés, sélectionnés sur mesure.",
    ctaLabel: "Découvrir nos expertises",
    ctaTo: { name: 'entreprise' },
  },
  candidat: {
    title: "Je suis candidat",
    description: "Rejoignez un collectif où votre talent compte vraiment. CDI, CDD, stage — construisez votre carrière avec nous.",
    ctaLabel: "Voir nos offres",
    ctaTo: { name: 'offres' },
  },
  offres: {
    title: "Consulter nos offres",
    description: "Data, cloud, développement, conseil — des postes sur mesure qui correspondent à votre profil et à vos ambitions.",
    ctaLabel: "Explorer les offres",
    ctaTo: { name: 'offres' },
  },
  'qui-sommes-nous': {
    title: "Qui sommes-nous ?",
    description: "Une ESN à taille humaine fondée sur l'expertise, la proximité et l'engagement. Découvrez notre histoire et notre collectif.",
    ctaLabel: "Notre histoire",
    ctaTo: { name: 'histoire' },
  },
  references: {
    title: "Nos secteurs",
    description: "Retail, industrie, logistique, banque et assurance — nous intervenons là où la donnée et le digital font la différence.",
    ctaLabel: "En savoir plus",
    ctaTo: { path: '/', hash: '#secteurs' },
  },
  ia: {
    title: "Discutons IA",
    description: "L'intelligence artificielle au service de votre transformation. Cas d'usage concrets et accompagnement sur mesure.",
    ctaLabel: "Explorer nos approches IA",
    ctaTo: { name: 'ia' },
  },
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
 * `entreprise` porte de nouveau sa formule longue d'origine. Le principe
 * reste néanmoins la référence par défaut pour toute future entrée — c'est
 * pourquoi « Je suis candidat » (ajoutée en V0.9) n'a, elle, jamais eu de
 * raccourci demandé et n'en a donc jamais porté.
 *
 * Le reste de ce fichier (CTA globaux, cibles provisoires) est sans rapport
 * avec ce choix de libellé, cf. paragraphes suivants.
 *
 * CIBLES PROVISOIRES — l'arborescence publique se limite pour l'instant à `/`.
 * Toutes les entrées pointent donc vers des ancres réelles de l'accueil : rien
 * ici ne mène à un 404. À l'ouverture des pages dédiées, remplacer les
 * `hash` par les `name` de route correspondants ; la forme objet
 * `{ path, hash }` reste compatible, seul l'import change.
 *
 * ENTRÉE « TÉMOIGNAGES » RETIRÉE (V0.1.20, cf. ADR 24) : elle ciblait
 * `#interviews`, ancre qui n'existe plus depuis le retrait intégral de la
 * section Interviews de `HomeView.vue` (demande client, pivot « scroll
 * snapping »). Retirée plutôt que repointée vers une autre section : aucune
 * section existante n'offre un contenu équivalent (témoignages vidéo), la
 * repointer aurait été trompeur pour l'utilisateur.
 *
 * ENTRÉE « L'ÉQUIPE » RETIRÉE (V0.1.22, cf. ADR 26) : elle ciblait `#equipe`,
 * ancre qui n'existe plus depuis le retrait intégral de la section Équipe de
 * `HomeView.vue` (demande client explicite). Même raisonnement que le
 * retrait de « Témoignages » ci-dessus : aucune section restante n'offre un
 * contenu équivalent, repointer aurait été trompeur.
 */
export const mainNavEntries: MegaMenuEntry[] = [
  {
    id: 'entreprise',
    // Libellé restauré en toutes lettres (V1.0, demande client explicite) —
    // remplace le raccourci « Expertises » posé en V0.1.12, cf. commentaire
    // d'en-tête « INTITULÉS COURTS ». La cible ne change pas : la migration
    // de `{ path: '/', hash: '#services' }` vers `{ name: 'entreprise' }`
    // avait déjà eu lieu en V0.8, lors de l'ouverture de sa page dédiée
    // (`EnterpriseView.vue`, route `/je-suis-une-entreprise`).
    label: 'Je suis une entreprise',
    to: { name: 'entreprise' },
  },
  // Entrée ajoutée en V0.9, immédiatement après « Je suis une entreprise » :
  // les deux parcours d'entrée du site restent côte à côte, avant les
  // rubriques d'identité de la société.
  {
    id: 'candidat',
    label: 'Je suis candidat',
    to: { name: 'candidat' },
  },
  // Ajoutée en V1.2, immédiatement après « Je suis candidat » : suite naturelle
  // du parcours candidat — on parcourt l'accroche puis on consulte les offres.
  {
    id: 'offres',
    label: 'Consulter nos offres',
    to: { name: 'offres' },
  },
  /**
   * Premières entrées qui visent de VRAIES pages et non des ancres de
   * l'accueil (cf. « cibles provisoires » ci-dessus) : `{ name: ... }` plutôt
   * qu'un chemin en dur — le jour où l'URL change, la route reste l'unique
   * endroit à modifier.
   *
   * Regroupées sous « Qui sommes-nous » avec `columns` (et non deux entrées de
   * premier niveau) : c'est la forme que `App.vue` rend en section accordéon
   * du tiroir, exactement comme « Secteurs » — les deux pages parlent de la
   * même chose, l'identité de la société, et le menu doit le montrer.
   */
  {
    id: 'qui-sommes-nous',
    label: 'Qui sommes-nous',
    columns: [
      {
        title: 'Qui sommes-nous',
        links: [
          { label: 'Notre histoire', to: { name: 'histoire' } },
          { label: 'Notre collectif', to: { name: 'collectif' } },
        ],
      },
    ],
  },
  {
    id: 'references',
    label: 'Secteurs',
    columns: [
      {
        title: 'Nos secteurs',
        links: [
          { label: 'Ecommerce', to: { path: '/', hash: '#secteurs' } },
          { label: 'Industrie', to: { path: '/', hash: '#secteurs' } },
          { label: 'Logistique', to: { path: '/', hash: '#secteurs' } },
          { label: 'Banque & Assurance', to: { path: '/', hash: '#secteurs' } },
        ],
      },
    ],
  },
  /**
   * Entrée ajoutée en V1.1, en dernière position : contrairement aux deux
   * parcours d'entrée (« entreprise »/« candidat », regroupés en tête) et aux
   * rubriques d'identité de la société, « Discutons IA » met en avant une
   * offre — placée après elles plutôt qu'au milieu, dans la continuité
   * naturelle vers les deux CTA globaux du Header (« Nous contacter »/
   * « Nous rejoindre »).
   *
   * NE PAS CONFONDRE avec l'ancienne pilule « Discutons IA » retirée en
   * V0.1.12 (cf. commentaire d'en-tête « INTITULÉS COURTS ») : celle-ci était
   * un bouton d'action dans le Header (`#leading` de `MegaMenu`), pas une
   * entrée de ce menu. Le nom se recoupe, le rôle et l'emplacement sont
   * entièrement différents.
   */
  {
    id: 'ia',
    label: 'Discutons IA',
    to: { name: 'ia' },
  },
]
