<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'

/**
 * Bandeau événements — vit À L'INTÉRIEUR du conteneur de scroll propre à
 * chaque vue (le `h-screen overflow-y-auto snap-y` que chaque vue rend comme
 * racine, cf. CLAUDE.md "Full Page Snap Scroll"), posé dans la section Hero
 * elle-même (voir HomeView.vue / AdeoView.vue) pour partager son contexte de
 * scroll plutôt que de défiler séparément.
 *
 * Slider tactile/souris (drag-to-scroll) sur un vrai conteneur `overflow-x-auto`
 * à snap : chaque événement occupe toute la largeur, les points sous le texte
 * indiquent la position et permettent d'y aller directement. La rotation
 * automatique (6 s, pause au survol/au drag) réutilise `scrollToEvent` pour
 * rester synchronisée avec les points — neutralisée sous
 * `prefers-reduced-motion` et en SSR (même garde que les autres carrousels du
 * site, ex. CoverCarousel.vue).
 *
 * Descriptions : aucune des 3 n'en a (cf. CLAUDE.md « Intégrité du contenu »,
 * ne jamais inventer de date/fait métier).
 *
 * Chaque titre pointe désormais vers le post LinkedIn correspondant (lien
 * externe, nouvel onglet) plutôt que vers une page interne.
 */
interface TickerEvent {
  title: string
  description?: string
  href: string
}

const EVENTS: TickerEvent[] = [
  {
    title: 'Human Day',
    href: 'https://www.linkedin.com/posts/faceel-it_human-day-activity-7511396464183574529-DmwC?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEsIulEBAjfoGqhFm6qlV6M1Wh0h8DzEPl4',
  },
  {
    title: 'Dev Lille',
    href: 'https://www.linkedin.com/posts/faceel-it_devlille-faceelit-esn-activity-7472520923183681536--1fk?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEsIulEBAjfoGqhFm6qlV6M1Wh0h8DzEPl4',
  },
  {
    title: 'Trophée employeur',
    href: 'https://www.linkedin.com/posts/faceel-it_faceelit-trophaezesemployeurs-fidaezlisation-activity-7403754387384270848-JAnf?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEsIulEBAjfoGqhFm6qlV6M1Wh0h8DzEPl4',
  },
]

const slider = useTemplateRef<HTMLDivElement>('slider')
const activeIndex = ref(0)
const isDragging = ref(false)
let startX = 0
let scrollLeft = 0
/** Distingue un vrai drag d'un simple clic : le lien sous le doigt/la souris
 *  ne doit ouvrir LinkedIn que si la piste n'a pas bougé. */
let dragged = false

function pointerX(e: MouseEvent | TouchEvent) {
  return 'touches' in e ? (e.touches[0]?.pageX ?? 0) : e.pageX
}

function startDrag(e: MouseEvent | TouchEvent) {
  if (!slider.value) return
  isDragging.value = true
  dragged = false
  startX = pointerX(e) - slider.value.offsetLeft
  scrollLeft = slider.value.scrollLeft
}

function stopDrag() {
  isDragging.value = false
}

// sortie de piste : stoppe le drag et relance la rotation auto
function handleSliderMouseLeave() {
  stopDrag()
  resumeCarousel()
}

function onDrag(e: MouseEvent | TouchEvent) {
  if (!isDragging.value || !slider.value) return
  const x = pointerX(e) - slider.value.offsetLeft
  const walk = x - startX
  if (Math.abs(walk) > 5) dragged = true
  slider.value.scrollLeft = scrollLeft - walk
}

function onLinkClick(e: MouseEvent) {
  if (dragged) e.preventDefault()
}

function onSliderScroll() {
  if (!slider.value || !slider.value.clientWidth) return
  activeIndex.value = Math.round(slider.value.scrollLeft / slider.value.clientWidth)
}

function scrollToEvent(index: number) {
  if (!slider.value) return
  slider.value.scrollTo({ left: index * slider.value.clientWidth, behavior: 'smooth' })
}

let scrollInterval: ReturnType<typeof setInterval> | undefined

function pauseCarousel() {
  clearInterval(scrollInterval)
  scrollInterval = undefined
}

function resumeCarousel() {
  if (scrollInterval) return
  if (import.meta.env.SSR || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  scrollInterval = setInterval(() => {
    scrollToEvent((activeIndex.value + 1) % EVENTS.length)
  }, 6_000)
}

onMounted(resumeCarousel)
onBeforeUnmount(pauseCarousel)
</script>

<template>
  <!-- Posé en `absolute` à l'intérieur de la section Hero (elle-même
       `relative`), PAS en `relative` dans le flux : la section Hero est
       `flex flex-col justify-center` (Home) / `flex items-center` (Adeo),
       un enfant en flux normal serait recentré avec le reste de son contenu
       au lieu de rester collé en haut.
       top-16 lg:top-20 : compense le header MegaMenu (fixed, hors du flux,
       même hauteur h-16/lg:h-20) pour ne pas être caché derrière lui. -->
  <div
    class="absolute top-16 left-0 z-30 w-full bg-gray-50 border-b border-gray-200 h-16 lg:h-20 lg:top-20"
  >
    <!-- centre bandeau -->
    <div
      class="flex flex-col items-center justify-center w-full h-full max-w-[1920px] mx-auto px-4 bg-gray-50 text-center"
    >
      <!-- Piste draggable : un seul élément visible à la fois (snap-center). -->
      <div
        ref="slider"
        class="flex w-full items-center overflow-x-auto snap-x snap-mandatory hide-scrollbar select-none transition-transform"
        :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
        @mouseenter="pauseCarousel"
        @mouseleave="handleSliderMouseLeave"
        @mousedown="startDrag"
        @mouseup="stopDrag"
        @mousemove="onDrag"
        @touchstart="startDrag"
        @touchend="stopDrag"
        @touchmove="onDrag"
        @scroll="onSliderScroll"
      >
        <!-- liens events linkedin externes -->
        <a
          v-for="event in EVENTS"
          :key="event.title"
          :href="event.href"
          target="_blank"
          rel="noopener noreferrer"
          class="group w-full shrink-0 snap-center flex flex-col items-center justify-center text-center gap-0.5 cursor-pointer"
          @click="onLinkClick"
        >
          <p
            class="font-bold text-primary-900 text-sm lg:text-base leading-none transition-colors duration-200 group-hover:text-accent-700"
          >
            {{ event.title }}
          </p>
          <p
            v-if="event.description"
            class="text-[10px] lg:text-xs text-gray-500 leading-none hidden md:block"
          >
            {{ event.description }}
          </p>
        </a>
      </div>

      <!-- puces en flux : la marge negative des boutons (-m-3) annule leur
           propre padding dans le calcul de hauteur du flex, la rangee garde
           donc une empreinte proche de la taille du point (justify-center du
           parent absorbe le reste sans depasser h-16 lg:h-20). -->
      <div class="mt-1.5 flex w-full justify-center gap-5">
        <!-- elargit touch target : padding invisible (-m-3) autour du point -->
        <button
          v-for="(event, index) in EVENTS"
          :key="event.title"
          type="button"
          :aria-label="`Aller à l'événement ${index + 1}`"
          class="-m-3 p-3"
          @click="scrollToEvent(index)"
        >
          <span
            class="block size-3 rounded-full transition-colors duration-300"
            :class="activeIndex === index ? 'bg-accent-500' : 'bg-primary-900/20'"
          />
        </button>
      </div>
    </div>
  </div>
</template>
