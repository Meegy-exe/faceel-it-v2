<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { CardTone } from './types'

const props = withDefaults(
  defineProps<{
    count: number
    autoplayMs?: number
    label: string
    /**
     * Tonalité de la pagination (flèche + compteur) — ce composant ne connaît
     * pas la tonalité du contenu qu'il encadre (`CarouselSlideContent` la
     * reçoit séparément), mais la pagination, elle, est peinte directement
     * ici. Sans ce prop, `text-primary-950` (pensé pour un fond clair)
     * devenait invisible sur une section à fond navy (`#valeurs` en
     * `tone="dark"` depuis l'alternance stricte des sections de l'accueil) —
     * même défaut, même correctif que `CardCarousel.vue` (`COUNTER_TONE`/
     * `ARROW_TONE`), reconduit ici à l'identique plutôt que réinventé.
     */
    tone?: CardTone
    /** Sous 460px, la flèche absolue (bord droit) chevauche le texte de la
     *  diapositive faute de marge — bascule en flux normal, centrée sous la
     *  piste, uniquement pour l'instance qui l'active (pas de régression sur
     *  les autres carrousels du site). */
    arrowBelowOnMobile?: boolean
  }>(),
  { autoplayMs: 3_500, tone: 'light', arrowBelowOnMobile: false },
)

/** Ratios repris tels quels de `CardCarousel.vue` (skill `a11y-color-check`) :
 *  `text-primary-950` 18,2:1 sur `bg-light` (AAA) ; `text-white` 17,6:1 sur
 *  `bg-primary-900`/19,7:1 sur `bg-primary-950` (AAA). */
const COUNTER_TONE: Record<CardTone, string> = {
  light: 'text-primary-950',
  dark: 'text-white',
}
const counterTone = computed(() => COUNTER_TONE[props.tone])

const ARROW_TONE: Record<CardTone, string> = {
  light: 'text-primary-950 hover:text-accent-500 focus-visible:outline-primary-900',
  dark: 'text-white hover:text-accent-500 focus-visible:outline-accent-500',
}
const arrowTone = computed(() => ARROW_TONE[props.tone])

defineSlots<{
  slide(props: { index: number; active: boolean }): unknown
}>()

/** Permet à un parent de synchroniser un effet décoratif (ex. pulsation d'un
 *  halo lumineux en arrière-plan) sur le changement de diapositive, sans lui
 *  exposer l'intégralité de l'état interne du carrousel. */
const emit = defineEmits<{ 'update:activeIndex': [index: number] }>()

const activeIndex = ref(0)
const paused = ref(false)

watch(activeIndex, (index) => emit('update:activeIndex', index))

function wrap(index: number) {
  return ((index % props.count) + props.count) % props.count
}

const nextIndex = computed(() => wrap(activeIndex.value + 1))

function getSlideStyle(index: number, activeIndex: number) {
  let diff = index - activeIndex
  if (diff === props.count - 1) diff = -1
  if (diff === -(props.count - 1)) diff = 1

  // ACTIVE (Centrée parfaitement)
  if (diff === 0) {
    return 'z-30 left-1/2 -translate-x-1/2 scale-125 opacity-100 origin-center'
  }
  // PREV (Ancrée exactement sur la ligne du padding gauche)
  //
  // Masquée jusqu'à 1840px : la carte active en `scale-125` et les
  // slides adjacentes (`max-w-md`/`lg:max-w-lg` à 90%) n'ont pas assez de
  // place pour coexister sans se chevaucher en dessous de cette largeur — le
  // contenu de `CarouselSlideContent` est volontairement sans fond
  // (cf. son propre commentaire d'en-tête), un chevauchement y est donc
  // du texte fantôme illisible, pas un simple détail visuel.
  if (diff === -1) {
    return 'z-10 left-0 translate-x-0 scale-90 opacity-40 origin-left pointer-events-none max-[1840px]:opacity-0 max-[1840px]:invisible'
  }
  // NEXT (Ancrée exactement sur la ligne du padding droit) — même garde-fou.
  if (diff === 1) {
    return 'z-10 left-full -translate-x-full scale-90 opacity-40 origin-right pointer-events-none max-[1840px]:opacity-0 max-[1840px]:invisible'
  }
  // CARTES LOINTAINES GAUCHE
  if (diff < -1) {
    return 'z-0 left-0 -translate-x-full scale-50 opacity-0 pointer-events-none'
  }
  // CARTES LOINTAINES DROITE
  return 'z-0 left-full translate-x-0 scale-50 opacity-0 pointer-events-none'
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
    if (!paused.value) activeIndex.value = wrap(activeIndex.value + 1)
  }, props.autoplayMs)
}

function navigateTo(index: number) {
  activeIndex.value = wrap(index)
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

const DRAG_THRESHOLD = 50
let dragStartX = 0
let isDragging = false

function handleMouseDown(e: MouseEvent) {
  dragStartX = e.clientX
  isDragging = true
}

function handleMouseUp(e: MouseEvent) {
  if (!isDragging) return
  isDragging = false
  const delta = e.clientX - dragStartX
  if (Math.abs(delta) >= DRAG_THRESHOLD) {
    navigateTo(delta < 0 ? activeIndex.value + 1 : activeIndex.value - 1)
  }
}

function handleMouseLeave(e: MouseEvent) {
  if (isDragging) {
    const delta = e.clientX - dragStartX
    isDragging = false
    if (Math.abs(delta) >= DRAG_THRESHOLD) {
      navigateTo(delta < 0 ? activeIndex.value + 1 : activeIndex.value - 1)
    }
  }
  paused.value = false
}

onMounted(() => {
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
    class="relative flex flex-col justify-between h-full w-full cursor-grab active:cursor-grabbing select-none"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mouseenter="paused = true"
    @mouseleave="handleMouseLeave"
    @focusin="paused = true"
    @focusout="handleFocusOut"
  >
    <!-- Conteneur principal -->
    <div
      class="relative my-auto flex w-full items-center overflow-hidden"
      :class="arrowBelowOnMobile ? 'flex-col max-[459px]:gap-4 sm:flex-row' : ''"
    >
      <!-- Piste avec les MÊMES paddings que les en-têtes de HomeView -->
      <div class="relative h-[250px] w-full px-4 md:px-24 lg:px-28">
        <div class="relative h-full w-full">
          <div
            v-for="(_, index) in count"
            :key="index"
            class="absolute top-1/2 w-full max-w-md -translate-y-1/2 transition-all duration-1000 ease-in-out will-change-transform motion-reduce:transition-none lg:max-w-lg"
            :class="getSlideStyle(index, activeIndex)"
          >
            <slot name="slide" :index="index" :active="index === activeIndex" />
          </div>
        </div>
      </div>

      <!-- Flèche ancrée au bord de l'écran global, totalement hors de la zone des slides.
           Sous 460px (si arrowBelowOnMobile) : sort du flow absolu, centrée en flux normal
           sous la piste plutôt que chevauchant le texte faute de marge. -->
      <button
        type="button"
        aria-label="Diapositive suivante"
        class="z-50 inline-flex size-11 items-center justify-center transition-colors duration-200 focus-visible:outline-3 focus-visible:outline-offset-2"
        :class="[
          arrowTone,
          arrowBelowOnMobile
            ? 'mx-auto sm:absolute sm:top-1/2 sm:right-4 sm:mx-0 sm:-translate-y-1/2 md:right-8 lg:right-12'
            : 'absolute top-1/2 right-4 -translate-y-1/2 md:right-8 lg:right-12',
        ]"
        @click="navigateTo(nextIndex)"
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
    </div>

    <!-- Pagination en bas -->
    <p aria-hidden="true" class="text-center text-sm font-semibold" :class="counterTone">
      {{ activeIndex + 1 }} / {{ count }}
    </p>
  </div>
</template>
