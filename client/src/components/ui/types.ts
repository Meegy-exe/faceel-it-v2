import type { RouteLocationRaw } from 'vue-router'

/**
 * Contrats de types du Design System.
 *
 * Ils vivent dans un module à part parce que `<script setup>` ne peut rien
 * exporter : sans ce fichier, une vue qui construit un tableau d'entrées de
 * menu n'aurait aucun type à importer et perdrait la vérification.
 *
 * Règle de dépendance (cf. README) : `components/ui/` n'importe jamais de
 * `features/` ni de `views/`. Aucun type métier ici, uniquement du visuel.
 */

/* -------------------------------------------------------------------------- */
/* BaseButton                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * `accent` est un aplat de vert plein - ce qui semble contredire la règle de
 * `CardTone` (l'accent jamais en surface). Ce n'est pas une contradiction :
 * la règle de `CardTone` protège contre le cas où plusieurs surfaces
 * colorées doivent se distinguer les unes des autres (une grille de cartes),
 * où la seule teinte ne suffit pas en daltonisme. Un bouton isolé n'a rien à
 * distinguer d'un autre bouton adjacent de même forme : c'est un texte navy
 * en gras sur un aplat, 9,1:1, parfaitement lisible. Réservé aux appels à
 * l'action de plus haute intention (ex. « Consulter nos offres ») - un excès
 * l'affaiblirait comme n'importe quelle couleur de forte intensité.
 */
export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'accent'

export type ButtonSize = 'sm' | 'md' | 'lg'

/* -------------------------------------------------------------------------- */
/* Cible de navigation                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Destination d'un élément cliquable. `to` produit un `<RouterLink>`, `href`
 * un `<a>`, l'absence des deux un `<button>`. Les deux restent optionnels pour
 * que le composant reste utilisable en pur affichage.
 */
export interface Navigable {
  to?: RouteLocationRaw
  href?: string
}

/* -------------------------------------------------------------------------- */
/* MegaMenu                                                                   */
/* -------------------------------------------------------------------------- */

/** Lien terminal d'un panneau de méga-menu. */
export interface MegaMenuLink extends Navigable {
  label: string
  /** Texte court affiché sous le libellé (desktop uniquement). */
  description?: string
  /** Pastille de hiérarchisation, ex. « Nouveau ». */
  badge?: string
}

/** Colonne d'un panneau. Le titre sert d'en-tête de groupe accessible. */
export interface MegaMenuColumn {
  title: string
  links: MegaMenuLink[]
}

/**
 * Colonne de liens du pied de page. Structurellement identique à une colonne
 * de méga-menu - même titre de groupe, même forme de liens - donc aliasée
 * plutôt que dupliquée. Si les deux divergent un jour, séparer les deux types.
 */
export type FooterColumn = MegaMenuColumn

/**
 * Entrée de premier niveau. Avec `columns` elle devient une section
 * accordéon du tiroir (Sidebar, cf. `MegaMenu.vue`) ; sans, un simple lien.
 *
 * `MegaMenuFeature`/`feature` (encart mis en avant à droite d'un panneau
 * déroulant desktop) a été retiré en V0.1.24 avec le pivot vers un menu
 * latéral (cf. `docs/DECISIONS.md`) : sans consommateur (`mainNav.ts` n'a
 * jamais posé ce champ) et sans plus aucun panneau desktop pour l'accueillir
 * - même principe que le retrait d'un composant entièrement orphelin
 * (`DataCore`/`WaveRibbon`…), appliqué ici à un champ de type plutôt qu'à un
 * composant entier.
 */
export interface MegaMenuEntry extends Navigable {
  /** Identifiant stable : sert d'ancre à `aria-controls`. Doit être unique. */
  id: string
  label: string
  columns?: MegaMenuColumn[]
}

/* -------------------------------------------------------------------------- */
/* HighlightCard                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Palette de la carte au repos. Le survol inverse toujours vers le sombre.
 *
 * L'accent (#12D80A) est volontairement ABSENT de cette liste : en aplat de
 * fond il ne laisse aucune couleur de texte confortable (navy 9,1:1 mais
 * vibration forte, blanc 1,9:1 - inutilisable), et il devient indiscernable
 * d'un fond clair en deutéranopie/protanopie. Le vert reste une couleur de
 * TOUCHE - pictogramme, filigrane, puce, trait, bordure au survol - jamais de
 * surface. Ne pas réintroduire `'accent'` ici.
 */
export type CardTone = 'light' | 'dark'

/**
 * Gabarit de la carte (V0.1.15) : `md` pour une grille (plusieurs cartes
 * visibles à la fois, marges et titre calibrés pour partager l'espace),
 * `lg` pour une carte seule occupant toute l'attention - marges et
 * typographie de titre plus généreuses, rien d'autre ne change (tonalité,
 * survol, trait d'accent restent identiques quelle que soit la taille).
 *
 * Réutilisé par `CarouselSlideContent` (V0.1.18) pour la même échelle de
 * typographie (`title`/`body`), sans les marges - un texte libre n'a pas de
 * padding de carte à faire varier. Jusqu'en V0.1.17, `lg` habillait la
 * carte unique de `CardCarousel` (Services/Secteurs/RSE) via `HighlightCard`
 * ; depuis V0.1.18 (« naked slider », cf. ADR 22), ces trois sections
 * passent par `CarouselSlideContent`, `HighlightCard` n'a donc plus de
 * consommateur en production (reste démontré dans `StyleguideView`) - ce
 * type sert désormais les deux composants, pas uniquement `HighlightCard`.
 */
export type CardSize = 'md' | 'lg'

/* -------------------------------------------------------------------------- */
/* AnimatedBackground                                                         */
/* -------------------------------------------------------------------------- */

export type BackgroundVariant = 'pixels' | 'grid' | 'aurora'

export type BackgroundTone = 'dark' | 'light'
