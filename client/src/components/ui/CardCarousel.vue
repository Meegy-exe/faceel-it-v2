<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { CardTone } from './types'

/**
 * Carrousel à une seule diapositive visible à la fois — défilement manuel
 * (flèches) ou automatique — pour les cas où le client veut réduire la
 * charge cognitive d'une grille en ne montrant qu'un contenu à la fois
 * (cf. ADR 18, section Services de `HomeView`).
 *
 * PUREMENT MÉCANIQUE, AUCUNE DONNÉE MÉTIER
 * Le composant ne connaît que `count` (le nombre de diapositives) : le
 * contenu de la diapositive active vient du créneau `#slide`, invoqué une
 * seule fois par indice actif (jamais les `count` à la fois, contrairement à
 * un `v-for` sur une grille) — c'est à l'appelant de savoir ce qu'il affiche
 * à chaque indice, ce composant ne fait qu'avancer/reculer un compteur.
 *
 * MINUTEUR SSR-SAFE (cf. ADR 01, CLAUDE.md)
 * `setInterval` n'est instancié que dans `onMounted`, jamais dans le calcul
 * de rendu ni au niveau racine du script — `onMounted` ne s'exécute jamais
 * pendant le pré-rendu `vite-ssg`, ce garde documente l'hypothèse plutôt que
 * de s'y fier implicitement (même discipline que le typewriter du Hero et
 * les canvas décoratifs du Design System). Nettoyage complet dans
 * `onBeforeUnmount`.
 *
 * `prefers-reduced-motion`
 * L'autoplay ne se contente pas d'être plus lent : il ne démarre jamais sous
 * cette préférence, avec un `change` listener pour réagir à une bascule en
 * cours de session (l'utilisateur n'a pas besoin de recharger la page). La
 * navigation manuelle (flèches) reste possible dans tous les cas — seul le
 * défilement AUTOMATIQUE est concerné.
 *
 * PAUSE SUR SURVOL/FOCUS, JAMAIS ARRÊT DÉFINITIF
 * `@mouseenter`/`@focusin` mettent l'autoplay en pause, `@mouseleave` la
 * lève ; `@focusout` ne la lève que si le focus quitte réellement le
 * composant (`relatedTarget`, même garde que `MegaMenu.onFocusOut` — un clic
 * sur une zone non focusable donne un `relatedTarget` nul, il ne faut pas
 * lever la pause dans ce cas). Un utilisateur clavier qui tabule jusqu'à un
 * bouton de la diapositive doit pouvoir la lire sans qu'elle change sous
 * lui.
 *
 * PAS D'`aria-live` SUR LA RÉGION
 * Le motif « Carousel » des ARIA Authoring Practices déconseille
 * explicitement d'annoncer chaque changement automatique de diapositive : ça
 * interromprait le lecteur d'écran toutes les `autoplayMs` sans que
 * l'utilisateur l'ait demandé. La mise en pause au focus (ci-dessus) est le
 * mécanisme qui protège un utilisateur clavier/lecteur d'écran, pas un
 * `aria-live`.
 *
 * FLÈCHE UNIQUE, AUX EXTRÉMITÉS ABSOLUES DE LA SECTION (V0.1.18, « naked
 * slider », cf. ADR 22 — remplace la disposition V0.1.16/ADR 20 qui flanquait
 * la carte dès `md:`). La région (`relative`) s'étend sur toute la largeur
 * disponible ; le bouton est `absolute`, ancré au bord droit
 * (`right-4 md:right-8 lg:right-12`), à toutes les tailles d'écran. Le
 * padding horizontal de la diapositive (cf. template) laisse toujours la
 * place au bouton, quelle que soit la largeur de la carte fournie par
 * l'appelant.
 *
 * CONTRÔLE ASYMÉTRIQUE (V0.1.24, cf. `docs/DECISIONS.md`) — demande client :
 * plus de flèche « précédent » du tout, `goPrev`/la navigation manuelle en
 * arrière ont été retirés avec elle (code mort sans ce bouton). L'utilisateur
 * n'avance qu'avec la flèche « suivant » ou l'autoplay — TOUTE diapositive
 * reste atteignable (la navigation boucle, `goTo` referme le cercle), juste
 * moins directement qu'avec les deux sens. La flèche restante porte en plus
 * un traitement visuel flouté au repos (`blur-[2px] opacity-50`), net au
 * survol/focus (`hover:`/`focus-visible:blur-none opacity-100`,
 * `transition-all duration-300`) — choix de direction artistique validé sur
 * maquette, pas une régression d'accessibilité : la flèche reste focusable,
 * son `aria-label` et sa cible cliquable ne changent pas, seul son rendu
 * visuel au repos s'atténue.
 *
 * FLÈCHE « PLATE », SANS CONTOUR, COULEURS CONDITIONNELLES PAR TONE (V0.1.25,
 * cf. `docs/DECISIONS.md`) — nouvelle demande client, indépendante du flou
 * posé en V0.1.24 (le flou/l'opacité au repos restent inchangés, seule
 * l'apparence « au clair » change) :
 *   - `ring-1 ring-primary-900/10`, `shadow-soft` et la bascule de couleur au
 *     survol (`hover:bg-primary-900 hover:text-white hover:ring-accent-500/60`)
 *     sont retirés : plus aucun contour, la flèche est un simple disque de
 *     couleur pleine, au repos comme au survol (seuls le flou et l'opacité
 *     changent désormais entre ces deux états, cf. `ARROW_TONE`) ;
 *   - Couleurs pilotées par `tone` (`ARROW_TONE`, même patron que
 *     `COUNTER_TONE` ci-dessous) : `bg-white text-primary-950` sur fond clair
 *     (19,7:1, AAA, skill `a11y-color-check`), `bg-primary-900 text-white`
 *     sur fond sombre (17,6:1, AAA) ;
 *   - **Correctif de contraste incidental sur l'anneau de focus clavier.**
 *     `focus-visible:outline-primary-900` restait posé sans varier selon le
 *     fond avant ce ticket : calculé (skill `a11y-color-check`), il donnait
 *     **≈1,1:1 sur `bg-primary-950`** (fond Secteurs) et **1:1 sur
 *     `bg-primary-900`** (fond RSE, couleur strictement identique à l'anneau)
 *     — un anneau de focus quasiment invisible sur ces deux sections, jamais
 *     remarqué faute d'y avoir retouché cette ligne depuis. `ARROW_TONE`
 *     bascule l'anneau vers `outline-accent-500` sur `tone="dark"` (9,1:1 sur
 *     `bg-primary-900`, valeur déjà documentée dans `main.css` ; 10,2:1 sur
 *     `bg-primary-950`) — même convention déjà en place ailleurs sur fond
 *     sombre (`MegaMenu.vue`, encart et lien d'évitement d'`App.vue`) ;
 *     `outline-primary-900` reste inchangé sur `tone="light"` (déjà correct).
 *     Ce correctif n'était pas demandé par le brief V0.1.25, mais la classe
 *     concernée était déjà celle réécrite pour ce ticket (retrait des
 *     contours) : corriger un défaut de contraste visible dans le diff plutôt
 *     que le reconduire à l'identique suit la même discipline déjà posée en
 *     ADR 22 pour le compteur de ce même composant ;
 *   - Icône plus grasse : `stroke-width` du SVG porté de `2` à `3`.
 */
const props = withDefaults(
  defineProps<{
    /** Nombre de diapositives. */
    count: number
    /** Cadence de l'autoplay, en millisecondes. */
    autoplayMs?: number
    /** Nom de la région, annoncé par les technologies d'assistance. */
    label: string
    /**
     * Tonalité du compteur décoratif (V0.1.18) — ce composant ne connaît pas
     * la tonalité du contenu qu'il encadre (`CarouselSlideContent` la reçoit
     * séparément), mais le compteur, lui, est peint directement par ce
     * composant : sans ce prop, `text-primary-900/50` (pensé pour un fond
     * clair) devenait quasi invisible sur les sections à fond navy
     * (Secteurs, RSE — jusqu'à 1:1 sur `bg-primary-900`, calculé via le
     * skill `a11y-color-check`), un défaut de contraste préexistant corrigé
     * au passage en réécrivant cette ligne.
     */
    tone?: CardTone
  }>(),
  { autoplayMs: 3_500, tone: 'light' },
)

defineSlots<{
  /** Diapositive active, invoquée une seule fois avec son indice. */
  slide(props: { index: number }): unknown
}>()

/**
 * V0.1.25 (cf. `docs/DECISIONS.md`) — retrait de la réduction d'opacité du
 * compteur : demande client explicite, la pagination doit être à 100 %
 * d'opacité. `text-primary-950` (au lieu de l'ancien `text-primary-900`) sur
 * fond clair — 18,2:1 sur `bg-light` (AAA, skill `a11y-color-check`), cohérent
 * avec la nouvelle couleur de flèche du même fond (`ARROW_TONE.light`) ;
 * `text-white` (inchangé) sur fond sombre — 19,7:1 sur `bg-primary-950`,
 * 17,6:1 sur `bg-primary-900` (AAA). Les ratios ADR 22 (5,12:1/4,71:1, AA)
 * documentaient la version à opacité réduite : la pleine opacité ne peut que
 * les améliorer, aucune régression de contraste.
 */
const COUNTER_TONE: Record<CardTone, string> = {
  light: 'text-primary-950',
  dark: 'text-white',
}
const counterTone = computed(() => COUNTER_TONE[props.tone])

/** Flèche « suivant » nue (plus de bouton rond/fond) : couleur pilotée par
 *  `tone`, vire à l'accent au survol/focus. */
const ARROW_TONE: Record<CardTone, string> = {
  light: 'text-primary-950 hover:text-accent-500 focus-visible:outline-primary-900',
  dark: 'text-white hover:text-accent-500 focus-visible:outline-accent-500',
}
const arrowTone = computed(() => ARROW_TONE[props.tone])

const activeIndex = ref(0)
/** Pause temporaire (survol/focus) — distincte de `prefers-reduced-motion`,
 *  qui empêche l'autoplay de démarrer du tout. */
const paused = ref(false)

function goTo(index: number) {
  activeIndex.value = ((index % props.count) + props.count) % props.count
}

function goNext() {
  goTo(activeIndex.value + 1)
}

let autoplayInterval: ReturnType<typeof setInterval> | undefined
let reduceMotionQuery: MediaQueryList | null = null

function stopAutoplay() {
  if (autoplayInterval !== undefined) {
    clearInterval(autoplayInterval)
    autoplayInterval = undefined
  }
}

function startAutoplay() {
  stopAutoplay()
  autoplayInterval = setInterval(() => {
    if (!paused.value) goNext()
  }, props.autoplayMs)
}

/** Navigation manuelle (V0.1.24 : plus qu'un seul sens, cf. commentaire
 *  d'en-tête « CONTRÔLE ASYMÉTRIQUE ») : relance le minuteur pour laisser un
 *  cycle complet avant la prochaine avance automatique, plutôt que de
 *  laisser l'autoplay potentiellement retomber quelques centaines de ms
 *  après un clic. */
function handleManualNext() {
  goNext()
  if (!reduceMotionQuery?.matches) startAutoplay()
}

function handleReduceMotionChange() {
  stopAutoplay()
  if (!reduceMotionQuery?.matches) startAutoplay()
}

function handleFocusOut(event: FocusEvent) {
  const next = event.relatedTarget
  if (!(next instanceof Node)) return
  if (!(event.currentTarget instanceof HTMLElement)) return
  if (!event.currentTarget.contains(next)) paused.value = false
}

onMounted(() => {
  // `onMounted` n'est jamais appelé pendant un rendu SSR chez Vue — ce garde
  // documente l'hypothèse plutôt que de s'y fier implicitement.
  if (import.meta.env.SSR) return

  reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduceMotionQuery.addEventListener('change', handleReduceMotionChange)

  if (!reduceMotionQuery.matches) startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
  reduceMotionQuery?.removeEventListener('change', handleReduceMotionChange)
})
</script>

<template>
  <div
    role="region"
    aria-roledescription="carrousel"
    :aria-label="label"
    class="relative flex h-full w-full flex-col overflow-hidden sm:justify-between"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    @focusin="paused = true"
    @focusout="handleFocusOut"
  >
    <!-- Texte libre, sans encart (V0.1.18) : le padding horizontal laisse la
         place aux deux flèches quelle que soit la largeur de la carte fournie
         par l'appelant ; `min-h-[200px]` de `CarouselSlideContent` absorbe
         l'écart de hauteur entre un texte court et un texte long, ici c'est
         seulement l'espace latéral qui est réservé.

         ALIGNEMENT AVEC LE TITRE DE SECTION (V0.1.19, cf. ADR 23) — ce
         `px-20 md:px-24 lg:px-28` sert désormais une seconde fonction : c'est
         la valeur exacte que `HomeView.vue` applique à son `<header>` de
         section pour que le bord gauche du `<h2>` retombe sur le bord gauche
         du texte de diapositive (elle-même alignée à gauche depuis V0.1.19,
         `CarouselSlideContent`). Toute future modification de cette échelle
         doit être répercutée dans les `<header>` des 3 sections qui
         consomment ce composant (Services, Secteurs, RSE), sous peine de
         rouvrir le défaut d'alignement signalé par le client.

         BALAYAGE DROITE → GAUCHE (V0.1.25, cf. `docs/DECISIONS.md`) —
         remplace le fondu + léger décalage VERTICAL d'avant ce ticket par un
         balayage HORIZONTAL : la diapositive entrante vient de la droite
         (`translate-x-8 opacity-0` → `translate-x-0 opacity-100`), la
         sortante part vers la gauche (`translate-x-0 opacity-100` →
         `-translate-x-8 opacity-0`) — cohérent avec le sens de lecture de la
         seule flèche restante (« suivant », à droite, cf. ADR 24). `mode=
         "out-in"` conservé (déjà en place) : la sortante termine son
         balayage avant que l'entrante ne commence le sien, jamais les deux
         superposées, ce qui aurait brouillé le sens du mouvement. `duration-
         500`/`ease-out` (entrée) et `duration-500`/`ease-in` (sortie) sont
         les valeurs demandées par le brief, distinctes des jetons `--ease-
         snap`/`--ease-premium` du design system : un balayage de texte n'est
         ni une micro-interaction courte (`ease-snap`) ni un glissement de
         carte ample (`ease-premium`, `CoverCarousel`), une simple paire
         `ease-out`/`ease-in` standard Tailwind suffit sans ajouter de jeton
         dédié pour un seul usage. `translate-x-8` (2rem) plutôt que la valeur
         plus ample suggérée en exemple par le brief : assez visible pour se
         lire comme un balayage franc sans faire sortir le texte de la zone
         de padding réservée aux flèches (`px-20`+) sur les diapositives les
         plus courtes. `motion-reduce:transition-none` sur les deux classes
         actives : sous préférence réduite, le changement de diapositive
         reste instantané, jamais de balayage animé (même discipline que
         partout ailleurs dans ce composant). -->
    <!-- GRID STACKING ANTI-LAYOUT-SHIFT — la sortante et l'entrante partagent
         la même cellule (`col-start-1 row-start-1`) au lieu de sortir du flux
         en `absolute` : la piste `grid` dimensionne sa ligne sur la plus
         haute des deux, donc la hauteur de la section ne s'effondre plus
         pendant les 700ms de transition (l'ancien `absolute top-0 left-0`
         retirait la diapositive du flux, collapsant le conteneur parent). -->
    <div class="grid sm:my-auto">
      <Transition
        mode="out-in"
        enter-from-class="translate-x-full"
        enter-active-class="z-10 transition-transform duration-700 ease-in-out motion-reduce:transition-none"
        enter-to-class="translate-x-0"
        leave-from-class="opacity-100 scale-100"
        leave-active-class="z-0 transition-all duration-700 ease-in-out motion-reduce:transition-none"
        leave-to-class="opacity-0 scale-95"
      >
        <div :key="activeIndex" class="col-start-1 row-start-1 w-full px-4 md:px-24 lg:px-28">
          <slot name="slide" :index="activeIndex" />
        </div>
      </Transition>
    </div>

    <!-- Flèche unique, flèche « suivant » seule (V0.1.24, cf. commentaire
         d'en-tête « CONTRÔLE ASYMÉTRIQUE »), plate et sans contour depuis
         V0.1.25 (cf. commentaire d'en-tête « FLÈCHE “PLATE” ») : couleurs
         pilotées par `arrowTone` (fond/texte/anneau de focus, identiques au
         repos et au survol), `blur-[2px] opacity-50` au repos,
         `hover:`/`focus-visible:blur-none opacity-100` au survol/focus
         clavier — parité clavier/souris volontaire, un utilisateur qui
         tabule jusqu'au bouton doit aussi le voir redevenir net, pas
         seulement au survol souris. `transition-all` couvre `blur`/`opacity`
         (plus aucune couleur à animer depuis le retrait du contour). -->
    <button
      type="button"
      aria-label="Diapositive suivante"
      class="mt-4 flex self-end size-11 items-center justify-center transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-3 focus-visible:outline-offset-2 sm:absolute sm:top-1/2 sm:right-4 sm:z-20 sm:-translate-y-1/2 sm:mt-0 md:right-8 lg:right-12"
      :class="arrowTone"
      @click="handleManualNext()"
    >
      <svg class="size-8" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 12h16M14 6l6 6-6 6"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <!-- Compteur à pleine opacité depuis V0.1.25 (cf. commentaire d'en-tête
         de `COUNTER_TONE`) — `counterTone` ne porte plus de suffixe `/50`. -->
    <p
      aria-hidden="true"
      class="mt-auto pt-8 text-center text-sm font-semibold"
      :class="counterTone"
    >
      {{ activeIndex + 1 }} / {{ count }}
    </p>
  </div>
</template>
