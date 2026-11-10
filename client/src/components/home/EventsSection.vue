<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
import { useSwipe } from '@vueuse/core'
import { scrollRevealClass, useScrollReveal } from '@/composables/useScrollReveal'
// PHOTOS « NOS ÉVÉNEMENTS »  déjà présentes dans `client/src/assets/images/photos/`, aucune n'est encore
// utilisée ailleurs sur le site : pas de nouveau fichier à importer, pas de
// dépendance à un hébergeur d'images tiers. `picsum.photos` était exclu
// d'office  le CSP de production (`client/security-headers.conf`) déclare
// `img-src 'self'` sans exception, une image hotlinkée y serait simplement
// bloquée par le navigateur après déploiement.
import eventAfterwork from '@/assets/images/photos/afterwork.jpg'
import eventPaintball from '@/assets/images/photos/paintball.jpg'
import eventCourseGroupe from '@/assets/images/photos/course-groupe.jpg'
import eventCourseSolo from '@/assets/images/photos/course-solo.jpg'
import eventPadelEquipe from '@/assets/images/padel-equipe.jpg'
import sportImg1 from '@/assets/images/photos/f-it-01.jpg'
import sportImg2 from '@/assets/images/photos/f-it-02.jpg'
import sportImg3 from '@/assets/images/photos/f-it-03.jpg'

/**
 * Section « Nos événements » - extraite de `HomeView.vue` (V1.0) pour être
 * réutilisée telle quelle sur `CandidateView.vue` (event accueil) : même
 * composant, pas une réécriture. Le `v-if` de profil (masqué pour le profil
 * `entreprise`) reste de la responsabilité de l'appelant, cf. `HomeView.vue`,
 * cette section n'a pas vocation à connaître `useProfileStore` elle-même.
 *
 * 2 diapositives au sein de la même section `#evenements` (pas 2 sections
 * snap distinctes) : galerie de cohésion, design sport. La diapositive
 * « événements tech » reste commentée (masquée pour la V1, cf. `EVENTS_SLIDES`
 * ci-dessous) mais son balisage est conservé tel quel plutôt que supprimé.
 */
type EventsSlide = 'events' | 'tech' | 'sport'
// masque slide event tech temporairement
const EVENTS_SLIDES: EventsSlide[] = ['events', 'sport']
const activeEventsSlide = ref<EventsSlide>('events')

const evenementsEl = useTemplateRef<HTMLElement>('evenementsEl')
const evenementsReveal = useScrollReveal(evenementsEl)

function nextEventsSlide() {
  const currentIndex = EVENTS_SLIDES.indexOf(activeEventsSlide.value)
  activeEventsSlide.value = EVENTS_SLIDES[(currentIndex + 1) % EVENTS_SLIDES.length]!
}

function prevEventsSlide() {
  const currentIndex = EVENTS_SLIDES.indexOf(activeEventsSlide.value)
  activeEventsSlide.value =
    EVENTS_SLIDES[(currentIndex - 1 + EVENTS_SLIDES.length) % EVENTS_SLIDES.length]!
}

/** Swipe tactile remplace la flèche sur mobile (masquée sous `md:`, cf.
 *  template) : ne consomme que l'axe horizontal (`direction` ignore les
 *  swipes verticaux), le scroll-snap vertical du site reste donc intact. */
useSwipe(evenementsEl, {
  threshold: 50,
  onSwipeEnd(_event, direction) {
    if (direction === 'left') {
      nextEventsSlide()
      resetSportTimer()
    } else if (direction === 'right') {
      prevEventsSlide()
      resetSportTimer()
    }
  },
})

let sportInterval: ReturnType<typeof setInterval> | undefined

/** Survol du bloc : coupe la bascule automatique sans arrêter le
 *  `setInterval` lui-même (évite de dé-synchroniser `resetSportTimer`, déjà
 *  appelé au clic manuel) même garde que `paused` dans `CoverCarousel.vue`. */
const eventsCarouselPaused = ref(false)

function clearSportInterval() {
  if (sportInterval !== undefined) {
    clearInterval(sportInterval)
    sportInterval = undefined
  }
}

/** Lance (ou relance) la boucle de 5 s. Appelé au clic manuel pour éviter un
 *  basculement automatique immédiat juste après l'action de l'utilisateur. */
function resetSportTimer() {
  clearSportInterval()
  sportInterval = setInterval(() => {
    if (!eventsCarouselPaused.value) nextEventsSlide()
  }, 5_000)
}

// clic manuel sur la fleche : avance + relance le minuteur
function handleNextEventsSlideClick() {
  nextEventsSlide()
  resetSportTimer()
}

watch(evenementsReveal, (state) => {
  if (import.meta.env.SSR) return
  if (state === 'visible') resetSportTimer()
  if (state === 'hidden') {
    clearSportInterval()
    activeEventsSlide.value = 'events'
  }
})

/* -------------------------------------------------------------------------- */
/* Nos événements galerie photo                                             */
/* -------------------------------------------------------------------------- */

interface EventPhoto {
  src: string
  alt: string
}

/** La première entrée est la tuile en vedette (cf. `v-for` du template, qui
 *  lui attribue seul `col-span-2 row-span-2`)  l'ordre du tableau porte donc
 *  une signification visuelle, ce n'est pas une liste interchangeable. */
const EVENT_PHOTOS: EventPhoto[] = [
  { src: eventAfterwork, alt: "Collègues réunis autour d'un after-work" },
  { src: eventPaintball, alt: 'Session de paintball entre collaborateurs' },
  { src: eventCourseGroupe, alt: "Course à pied en équipe lors d'un événement sportif" },
  { src: eventCourseSolo, alt: "Collaborateur à l'arrivée d'une course" },
  { src: eventPadelEquipe, alt: "Équipe réunie autour d'un terrain de padel" },
]

/** Carrousel mobile : index courant, avance toutes les 3 s. SSR-safe : le
 *  setInterval est instancié uniquement dans onMounted, jamais pendant le
 *  pré-rendu (même discipline que les autres carrousels du site). */
const mobilePhotoIndex = ref(0)
let mobilePhotoInterval: ReturnType<typeof setInterval> | undefined

function startMobilePhotoAutoplay() {
  if (import.meta.env.SSR || mobilePhotoInterval !== undefined) return
  mobilePhotoInterval = setInterval(() => {
    mobilePhotoIndex.value = (mobilePhotoIndex.value + 1) % EVENT_PHOTOS.length
  }, 3_000)
}

function stopMobilePhotoAutoplay() {
  if (mobilePhotoInterval === undefined) return
  clearInterval(mobilePhotoInterval)
  mobilePhotoInterval = undefined
}

onMounted(startMobilePhotoAutoplay)

onBeforeUnmount(() => {
  stopMobilePhotoAutoplay()
  clearSportInterval()
})
</script>

<template>
  <section
    id="evenements"
    ref="evenementsEl"
    data-theme="light"
    class="relative h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center [@media(min-height:569px)_and_(max-height:750px)]:justify-start overflow-hidden bg-white px-4 pt-24 [@media(max-height:568px)]:pt-16 pb-8 text-gray-900 sm:px-6 lg:px-8 xl:px-12"
    @mouseenter="eventsCarouselPaused = true"
    @mouseleave="eventsCarouselPaused = false"
  >
    <Transition
      enter-active-class="transition-all duration-500 ease-out motion-reduce:transition-none"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300 ease-in motion-reduce:transition-none"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
      mode="out-in"
    >
      <!-- SLIDE 1 : galerie événements équipe -->
      <div v-if="activeEventsSlide === 'events'" key="events" class="w-full min-h-0">
        <header
          class="mx-auto max-w-3xl text-center transition-all duration-700 ease-out motion-reduce:transition-none"
          :class="scrollRevealClass(evenementsReveal)"
        >
          <!-- titre en gras -->
          <h2
            class="mt-4 font-display font-bold text-3xl leading-tight text-balance text-primary-900 [@media(max-height:885px)]:text-2xl md:text-display"
          >
            Nos événements
          </h2>
          <p class="mt-4 text-sm leading-relaxed text-primary-900/60 md:text-lg">
            La cohésion ne s'arrête pas à la porte des bureaux&nbsp;: after-works, événements
            sportifs et repas partagés rythment aussi la vie de nos équipes à Wasquehal.
          </p>
        </header>

        <!-- Grille bento masquée sur mobile, visible à partir de sm: -->
        <ul
          class="mx-auto mt-12 hidden w-full max-w-6xl grid-cols-2 auto-rows-[9rem] gap-4 sm:grid sm:grid-cols-4 sm:auto-rows-[10rem] lg:auto-rows-[12rem]"
        >
          <li
            v-for="(photo, index) in EVENT_PHOTOS"
            :key="photo.src"
            class="group relative overflow-hidden rounded-card"
            :class="index === 0 ? 'col-span-2 row-span-2' : ''"
          >
            <img
              :src="photo.src"
              :alt="photo.alt"
              loading="lazy"
              decoding="async"
              class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </li>
        </ul>

        <!-- Slider automatique visible sur mobile uniquement -->
        <div
          class="relative mx-auto mt-10 [@media(max-height:568px)]:mt-2 h-72 min-h-0 [@media(max-height:568px)]:max-h-[30dvh] [@media(max-height:568px)]:min-h-[100px] w-full overflow-hidden rounded-xl sm:hidden"
          @mouseenter="stopMobilePhotoAutoplay"
          @mouseleave="startMobilePhotoAutoplay"
        >
          <TransitionGroup
            enter-active-class="transition-opacity duration-700 ease-in-out motion-reduce:transition-none"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-700 ease-in-out motion-reduce:transition-none absolute inset-0"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <img
              v-for="(photo, index) in EVENT_PHOTOS"
              v-show="index === mobilePhotoIndex"
              :key="photo.src"
              :src="photo.src"
              :alt="photo.alt"
              loading="lazy"
              decoding="async"
              class="absolute inset-0 h-full w-full object-cover"
            />
          </TransitionGroup>
          <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5" aria-hidden="true">
            <span
              v-for="(_, i) in EVENT_PHOTOS"
              :key="i"
              class="block h-1.5 rounded-full transition-all duration-300"
              :class="i === mobilePhotoIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/40'"
            />
          </div>
        </div>
      </div>

      <!-- SLIDE 2 : événements tech -->
      <div
        v-else-if="activeEventsSlide === 'tech'"
        key="tech"
        class="mx-auto flex max-w-2xl flex-col items-center text-center"
      >
        <h2
          class="font-display text-3xl leading-tight text-balance text-primary-900 [@media(max-height:885px)]:text-2xl md:text-display"
        >
          Événements tech
        </h2>
        <p class="mt-4 text-sm leading-relaxed text-primary-900/60 md:text-lg">
          Meetups, conférences, hackathons&nbsp;: retrouvez les rendez-vous tech auxquels participe
          Faceel-IT dans les Hauts-de-France.
        </p>
        <RouterLink
          :to="{ name: 'evenements-tech' }"
          class="mt-8 inline-flex items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-primary-950 transition-colors duration-200 hover:bg-accent-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary-900"
        >
          Découvrez nos événements
        </RouterLink>
      </div>

      <!-- SLIDE 3 : design sport -->
      <div
        v-else
        key="sport"
        class="mx-auto flex w-full max-w-6xl min-h-0 flex-col gap-10 [@media(min-height:569px)_and_(max-height:690px)]:gap-3 [@media(max-height:568px)]:gap-4 lg:grid lg:grid-cols-2 lg:items-center"
      >
        <!-- Colonne gauche : texte -->
        <div>
          <p
            class="mb-4 text-sm font-bold uppercase tracking-widest text-accent-500 [@media(max-height:885px)]:hidden"
          >
            Le sport, notre méthode
          </p>
          <h2
            class="mb-8 [@media(max-height:690px)]:mb-2 [@media(max-height:568px)]:mb-2 text-2xl font-extrabold leading-tight text-primary-900 [@media(max-height:690px)]:text-xl [@media(max-height:568px)]:text-lg md:text-5xl lg:text-6xl"
          >
            Le sport nous sert<br class="hidden sm:block" />
            à travailler.
          </h2>
          <p class="text-sm leading-relaxed text-gray-600 md:text-base">
            Sur un terrain, on voit tout de suite comment quelqu'un communique, encaisse la pression
            et joue avec les autres. C'est pour ça qu'une partie de padel s'invite souvent dans nos
            recrutements, et que le sport structure ensuite la vie de l'équipe&nbsp;: rendez-vous
            mensuel, séminaire annuel, clubs partenaires dans la région.
          </p>
          <div class="mt-8 flex flex-wrap gap-3 [@media(max-height:885px)]:hidden">
            <span
              v-for="badge in ['Padel', 'Vélo', 'Running', 'Séminaire annuel']"
              :key="badge"
              class="rounded-full border border-primary-900/20 px-4 py-1 text-sm text-primary-900/70"
              >{{ badge }}</span
            >
          </div>
        </div>

        <!-- Colonne droite : grille d'images -->
        <div
          class="grid shrink min-h-0 grid-cols-2 grid-rows-2 gap-3 h-[250px] [@media(min-height:691px)_and_(max-height:900px)]:max-h-[35vh] [@media(min-height:569px)_and_(max-height:690px)]:max-h-[30vh] [@media(max-height:568px)]:max-h-[25vh] md:h-[360px] lg:h-[420px]"
        >
          <div class="col-span-1 row-span-2 h-full w-full overflow-hidden rounded-xl">
            <img
              :src="sportImg1"
              alt="Équipe Faceel IT lors d'une activité sportive"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover transition-transform duration-500 hover:scale-110 motion-reduce:transition-none cursor-pointer"
            />
          </div>
          <div class="col-span-1 row-span-1 h-full w-full overflow-hidden rounded-xl">
            <img
              :src="sportImg2"
              alt="Équipe Faceel IT lors d'une activité sportive"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover transition-transform duration-500 hover:scale-110 motion-reduce:transition-none cursor-pointer"
            />
          </div>
          <div class="col-span-1 row-span-1 h-full w-full overflow-hidden rounded-xl">
            <img
              :src="sportImg3"
              alt="Équipe Faceel IT lors d'une activité sportive"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover transition-transform duration-500 hover:scale-110 motion-reduce:transition-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Flèche de navigation : fait défiler les diapositives, toujours vers l'avant.
       En flux (plus en `absolute`) : superposée au texte en `top-1/2`, elle
       tombait pile sur la fin du paragraphe de la diapositive "sport"
       placée ici sous le contenu, elle reste toujours en dessous quelle
       que soit la diapositive active. -->
    <div class="mx-auto mt-4 hidden w-full max-w-6xl justify-end md:flex">
      <button
        type="button"
        aria-label="Diapositive suivante"
        class="z-10 inline-flex size-11 items-center justify-center text-accent-500 transition-colors duration-200 hover:text-accent-600 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary-900"
        @click="handleNextEventsSlideClick"
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
  </section>
</template>
