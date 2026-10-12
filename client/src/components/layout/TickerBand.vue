<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'

/**
 * Bandeau événements — vit À L'INTÉRIEUR du conteneur de scroll propre à
 * chaque vue (le `h-screen overflow-y-auto snap-y` que chaque vue rend comme
 * racine, cf. CLAUDE.md "Full Page Snap Scroll"), posé dans la section Hero
 * elle-même (voir HomeView.vue / AdeoView.vue) pour partager son contexte de
 * scroll plutôt que de défiler séparément.
 *
 * Un seul élément : le texte de l'événement, centré, qui tourne en boucle
 * (translateX + rotation du tableau `activeEvents`, voir `scrollNext`
 * ci-dessous — pas de scroll-snap natif, le "rembobinage" à 0 était visible)
 * et renvoie vers l'agenda au clic.
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

/** Rotation infinie (toutes les 6 s) sans "rembobinage" visible : le
 *  `scrollLeft` natif retournant à 0 produisait un saut arrière perceptible
 *  en fin de boucle. À la place, on anime un simple `translateX(-100%)` sur
 *  le wrapper puis, une fois l'anim terminée, on fait tourner le tableau
 *  (`shift`/`push`) et on coupe la transition le temps de revenir à
 *  `translateX(0)` à l'identique visuellement — aucun saut perçu. Pause au
 *  survol (UX) ; neutralisé sous `prefers-reduced-motion` et en SSR (cf.
 *  CLAUDE.md, même garde que les autres carrousels du site, ex.
 *  CoverCarousel.vue). */
const carouselInner = useTemplateRef<HTMLDivElement>('carouselInner')
const activeEvents = ref([...EVENTS])
let scrollInterval: ReturnType<typeof setInterval> | undefined
let rotateTimeout: ReturnType<typeof setTimeout> | undefined

function scrollNext() {
  const el = carouselInner.value
  if (!el) return

  el.style.transition = 'transform 1s cubic-bezier(0.65, 0, 0.35, 1)'
  el.style.transform = 'translateX(-100%)'

  rotateTimeout = setTimeout(() => {
    el.style.transition = 'none'

    const firstEvent = activeEvents.value.shift()
    if (firstEvent) activeEvents.value.push(firstEvent)

    el.style.transform = 'translateX(0)'
  }, 1_200)
}

function pauseCarousel() {
  clearInterval(scrollInterval)
  scrollInterval = undefined
  clearTimeout(rotateTimeout)
}

function resumeCarousel() {
  if (scrollInterval) return
  if (import.meta.env.SSR || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  scrollInterval = setInterval(scrollNext, 6_000)
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
    <div
      class="flex items-center justify-center w-full max-w-[1920px] mx-auto px-4 h-16 lg:h-20 overflow-hidden bg-gray-50"
    >
      <!-- Conteneur central : seul ce bloc défile -->
      <div
        class="flex overflow-hidden w-full"
        @mouseenter="pauseCarousel"
        @mouseleave="resumeCarousel"
      >
        <div ref="carouselInner" class="flex w-full">
          <RouterLink
            v-for="event in activeEvents"
            :key="event.title"
            :to="{ name: 'evenements-tech' }"
            class="group min-w-full shrink-0 flex flex-col items-center justify-center text-center gap-0.5 cursor-pointer"
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
      </div>
    </div>
  </div>
</template>
