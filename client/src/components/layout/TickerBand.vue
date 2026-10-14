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
 * Descriptions : seule HUMAIN DAY 2026 a une description, fournie par
 * l'utilisateur comme texte neutre explicitement provisoire — aucune date
 * précise n'a été communiquée pour les 3 événements (cf. CLAUDE.md
 * « Intégrité du contenu », ne jamais inventer de date/fait métier), donc
 * aucune n'est affichée ; les slides 2 et 3 restent sans description
 * (TODO : à compléter si fournie).
 */
interface TickerEvent {
  title: string
  description?: string
}

const EVENTS: TickerEvent[] = [
  {
    title: 'HUMAIN DAY 2026',
    description: "Venez nous rencontrer lors de cette journée dédiée à l'humain et la tech.",
  },
  { title: 'Faceel-it aux Trophées Employeurs' },
  { title: 'FACEEL-IT AU GRAND SOMMET "IA AVEC NOUS"' },
]

const slider = useTemplateRef<HTMLDivElement>('slider')
const activeIndex = ref(0)
const isDragging = ref(false)
let startX = 0
let scrollLeft = 0
/** Distingue un vrai drag d'un simple clic : un `RouterLink` sous le doigt/la
 *  souris ne doit naviguer que si la piste n'a pas bougé. */
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
    <div class="relative flex flex-col justify-center w-full max-w-[1920px] mx-auto px-4 h-16 lg:h-20 bg-gray-50">
      <!-- Piste draggable : un seul élément visible à la fois (snap-center).
           pb-3 : laisse la place aux points, posés en absolu plus bas, sans
           agrandir la hauteur stricte du bandeau (= hauteur de la Navbar). -->
      <div
        ref="slider"
        class="flex w-full items-center overflow-x-auto snap-x snap-mandatory hide-scrollbar select-none pb-3 transition-transform"
        :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
        @mouseenter="pauseCarousel"
        @mouseleave="stopDrag(); resumeCarousel()"
        @mousedown="startDrag"
        @mouseup="stopDrag"
        @mousemove="onDrag"
        @touchstart="startDrag"
        @touchend="stopDrag"
        @touchmove="onDrag"
        @scroll="onSliderScroll"
      >
        <RouterLink
          v-for="event in EVENTS"
          :key="event.title"
          :to="{ name: 'evenements-tech' }"
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
        </RouterLink>
      </div>

      <!-- Points de pagination — en absolu : la hauteur du bandeau reste
           verrouillée sur celle de la Navbar (h-16 lg:h-20). -->
      <div class="absolute bottom-1 w-full flex justify-center gap-1.5">
        <button
          v-for="(event, index) in EVENTS"
          :key="event.title"
          type="button"
          :aria-label="`Aller à l'événement ${index + 1}`"
          class="size-1.5 rounded-full transition-colors duration-300"
          :class="activeIndex === index ? 'bg-accent-500' : 'bg-primary-900/20'"
          @click="scrollToEvent(index)"
        />
      </div>
    </div>
  </div>
</template>
