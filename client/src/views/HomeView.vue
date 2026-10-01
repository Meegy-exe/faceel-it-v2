<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import CardCarousel from '@/components/ui/CardCarousel.vue'
import CoverCarousel from '@/components/ui/CoverCarousel.vue'
import CarouselSlideContent from '@/components/ui/CarouselSlideContent.vue'
import ReferencesSection from '@/components/ui/ReferencesSection.vue'
import BuSection from '@/components/home/BuSection.vue'
import LocationMapSection from '@/components/home/LocationMapSection.vue'
import { scrollRevealClass, useScrollReveal } from '@/composables/useScrollReveal'
// PHOTOS « NOS ÉVÉNEMENTS » — déjà présentes dans `assets/images/` (dépôt
// client, dossier `Animate the header/assets/photos/`), aucune n'est encore
// utilisée ailleurs sur le site : pas de nouveau fichier à importer, pas de
// dépendance à un hébergeur d'images tiers. `picsum.photos` était exclu
// d'office — le CSP de production (`client/security-headers.conf`) déclare
// `img-src 'self'` sans exception, une image hotlinkée y serait simplement
// bloquée par le navigateur après déploiement.
import eventAfterwork from '@/assets/images/photos/afterwork.jpg'
import eventPaintball from '@/assets/images/photos/paintball.jpg'
import eventCourseGroupe from '@/assets/images/photos/course-groupe.jpg'
import eventCourseSolo from '@/assets/images/photos/course-solo.jpg'
import eventPadelEquipe from '@/assets/images/padel-equipe.jpg'
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'Accueil',
  fullTitle: 'Faceel-IT — ESN experte en Data, IA et Transformation digitale',
  description:
    'ESN à Wasquehal, Faceel-IT accompagne vos projets Data, Intelligence Artificielle, ' +
    'applications métier, Cloud et Cybersécurité.',
})

/* -------------------------------------------------------------------------- */
/* Animations d'apparition au défilement                                      */
/* -------------------------------------------------------------------------- */

const chiffresEl = useTemplateRef<HTMLElement>('chiffresEl')
const chiffresReveal = useScrollReveal(chiffresEl)
const evenementsEl = useTemplateRef<HTMLElement>('evenementsEl')
const evenementsReveal = useScrollReveal(evenementsEl)
const valeursEl = useTemplateRef<HTMLElement>('valeursEl')
const valeursReveal = useScrollReveal(valeursEl)

/* -------------------------------------------------------------------------- */
/* Chiffres clés                                                              */
/* -------------------------------------------------------------------------- */

interface KeyStat {
  value: string
  label: string
}

/** Chiffres fournis tels quels par la demande client — aucune valeur
 *  inventée (cf. CLAUDE.md, intégrité du contenu). */
const KEY_STATS: KeyStat[] = [
  { value: '65', label: 'Collaborateurs' },
  { value: '170+', label: 'Projets réalisés' },
  { value: '30', label: 'Clients satisfaits' },
]


/* -------------------------------------------------------------------------- */
/* Nos événements — galerie photo                                             */
/* -------------------------------------------------------------------------- */

interface EventPhoto {
  src: string
  alt: string
}

/** La première entrée est la tuile en vedette (cf. `v-for` du template, qui
 *  lui attribue seul `col-span-2 row-span-2`) — l'ordre du tableau porte donc
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

onMounted(() => {
  if (import.meta.env.SSR) return
  mobilePhotoInterval = setInterval(() => {
    mobilePhotoIndex.value = (mobilePhotoIndex.value + 1) % EVENT_PHOTOS.length
  }, 3_000)
})

onBeforeUnmount(() => {
  if (mobilePhotoInterval !== undefined) clearInterval(mobilePhotoInterval)
})


/* -------------------------------------------------------------------------- */
/* Valeur ajoutée                                                             */
/* -------------------------------------------------------------------------- */

interface ValueCard {
  title: string
  description: string
}

const VALUE_CARDS: ValueCard[] = [
  {
    title: 'Vision métier',
    description: 'Adaptation rapide aux besoins concrets de chaque secteur.',
  },
  {
    title: 'Adaptation rapide à votre contexte métier',
    description: 'Retail, industrie, ecommerce, assurance… Nos profils naviguent avec aisance.',
  },
  {
    title: 'Approche agile',
    description: 'Capacité à intervenir sur des projets courts ou de transformation profonde.',
  },
  {
    title: 'Rigueur technique',
    description: 'Une solide maîtrise des technologies modernes et des méthodologies IT.',
  },
]

function activeValue(index: number): ValueCard {
  return VALUE_CARDS[index]!
}


/* -------------------------------------------------------------------------- */
/* Hero — effet machine à écrire                                              */
/* -------------------------------------------------------------------------- */

const HERO_TYPED_TEXT = 'On rejoint une équipe.'
const typedText = ref(HERO_TYPED_TEXT)

const HERO_TYPEWRITER_ERASE_MS = 45
const HERO_TYPEWRITER_TYPE_MS = 70
const HERO_TYPEWRITER_START_DELAY_MS = 1_500

let heroEraseTimeout: ReturnType<typeof setTimeout> | undefined
let heroTypeTimeout: ReturnType<typeof setTimeout> | undefined
let heroStartTimeout: ReturnType<typeof setTimeout> | undefined
let heroReduceMotionQuery: MediaQueryList | null = null

function clearHeroTypewriterTimeouts() {
  if (heroEraseTimeout !== undefined) {
    clearTimeout(heroEraseTimeout)
    heroEraseTimeout = undefined
  }
  if (heroTypeTimeout !== undefined) {
    clearTimeout(heroTypeTimeout)
    heroTypeTimeout = undefined
  }
}

function eraseHeroText(onDone: () => void) {
  function step() {
    if (typedText.value.length === 0) {
      onDone()
      return
    }
    typedText.value = typedText.value.slice(0, -1)
    heroEraseTimeout = setTimeout(step, HERO_TYPEWRITER_ERASE_MS)
  }
  step()
}

function typeHeroText(onDone: () => void) {
  let count = 0
  function step() {
    count += 1
    typedText.value = HERO_TYPED_TEXT.slice(0, count)
    if (count >= HERO_TYPED_TEXT.length) {
      onDone()
      return
    }
    heroTypeTimeout = setTimeout(step, HERO_TYPEWRITER_TYPE_MS)
  }
  step()
}

function playHeroTypewriterCycle() {
  eraseHeroText(() => typeHeroText(() => {}))
}

function startHeroTypewriterLoop() {
  heroStartTimeout = setTimeout(() => {
    heroStartTimeout = undefined
    playHeroTypewriterCycle()
  }, HERO_TYPEWRITER_START_DELAY_MS)
}

function stopHeroTypewriterLoop() {
  clearHeroTypewriterTimeouts()
  if (heroStartTimeout !== undefined) {
    clearTimeout(heroStartTimeout)
    heroStartTimeout = undefined
  }
}

function handleHeroReduceMotionChange() {
  stopHeroTypewriterLoop()
  if (heroReduceMotionQuery?.matches) {
    typedText.value = HERO_TYPED_TEXT
  } else {
    startHeroTypewriterLoop()
  }
}

onMounted(() => {
  if (import.meta.env.SSR) return

  heroReduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  heroReduceMotionQuery.addEventListener('change', handleHeroReduceMotionChange)

  if (!heroReduceMotionQuery.matches) startHeroTypewriterLoop()
})

onBeforeUnmount(() => {
  stopHeroTypewriterLoop()
  heroReduceMotionQuery?.removeEventListener('change', handleHeroReduceMotionChange)
})

/* -------------------------------------------------------------------------- */
/* Hero — vague canvas autonome                                               */
/* -------------------------------------------------------------------------- */

// SSR-safe : sessionStorage n'existe pas côté serveur
const isFirstVisit = import.meta.env.SSR ? false : !sessionStorage.getItem('splashPlayed')
const showSplash = ref(isFirstVisit)

const waveCanvas = ref<HTMLCanvasElement | null>(null)
let waveAnimationFrameId: number | null = null
let waveTime = 0

function drawWaves() {
  const canvas = waveCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  // window.innerWidth/Height correspondent à l'échelle (scale DPR) définie dans resizeWaveCanvas
  const width = window.innerWidth
  const height = window.innerHeight
  ctx.clearRect(0, 0, width, height)

  const numLines = 25
  for (let i = 0; i < numLines; i++) {
    ctx.beginPath()
    ctx.lineWidth = 1.5
    const opacity = 0.15 + (i / numLines) * 0.7
    ctx.strokeStyle = `rgba(34, 197, 94, ${opacity})`

    for (let x = 0; x <= width; x += 5) {
      const baseWave = Math.sin(x * 0.002 + waveTime + i * 0.035) * 150
      const secondaryWave = Math.sin(x * 0.001 - waveTime * 0.8) * 60
      const yOffset = (i - numLines / 2) * 5
      const y = height / 2 + baseWave + secondaryWave + yOffset
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
}

function animateWaves() {
  waveTime += 0.0025
  drawWaves()
  waveAnimationFrameId = requestAnimationFrame(animateWaves)
}

function resizeWaveCanvas() {
  const canvas = waveCanvas.value
  if (!canvas) return
  const dpr = window.devicePixelRatio || 1
  const logicalWidth = window.innerWidth
  const logicalHeight = window.innerHeight
  canvas.width = logicalWidth * dpr
  canvas.height = logicalHeight * dpr
  const ctx = canvas.getContext('2d')
  ctx?.scale(dpr, dpr)
  drawWaves()
}

onMounted(() => {
  if (import.meta.env.SSR) return
  resizeWaveCanvas()
  window.addEventListener('resize', resizeWaveCanvas)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (isFirstVisit) {
    sessionStorage.setItem('splashPlayed', 'true')
    setTimeout(() => {
      if (!prefersReducedMotion) animateWaves()
      else drawWaves()
    }, 800)
    setTimeout(() => {
      showSplash.value = false
    }, 3200)
  } else {
    if (!prefersReducedMotion) animateWaves()
    else drawWaves()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeWaveCanvas)
  if (waveAnimationFrameId !== null) cancelAnimationFrame(waveAnimationFrameId)
})
</script>

<template>
  <!-- Cinématique d'entrée — fixed z-[100] pour se superposer à tout le site -->
  <div
    v-if="showSplash"
    class="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
  >
    <div
      class="absolute w-0 h-0 rounded-full shadow-[0_0_0_150vmax_#ffffff] animate-splash-hole"
    ></div>
    <div class="absolute w-4 h-4 bg-[#000066] rounded-full animate-splash-drop"></div>
  </div>

  <!-- CONTENEUR SNAP OPT-IN : ce div isole le scroll magnétique de la page
       d'accueil pour ne pas briser le layout d'App.vue. -->
  <div class="h-dvh w-full overflow-y-auto snap-y snap-mandatory">
  <section
    id="hero"
    data-theme="dark"
    class="relative isolate overflow-hidden h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center text-white pt-24 lg:pt-28"
  >
    <div class="absolute inset-0 z-0 bg-gradient-to-br from-[#000080] via-[#000066] to-[#000033]">
      <canvas
        ref="waveCanvas"
        class="absolute inset-0 h-full w-full pointer-events-none opacity-80"
      ></canvas>
    </div>
    <div
      class="relative z-10 w-full px-4 py-12 sm:px-6 lg:px-8 xl:px-12"
      :class="isFirstVisit ? 'animate-hero-text-delayed' : 'animate-hero-text'"
    >
      <div>
        <p
          class="animate-fade-up motion-reduce:animate-none text-eyebrow uppercase text-accent-500 drop-shadow-md"
        >
          ESN · Data × IA × Transformation digitale
        </p>

        <h1
          class="mt-6 flex max-w-7xl flex-col items-start gap-y-2 animate-fade-up motion-reduce:animate-none font-display text-5xl leading-[1.1] font-extrabold tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-8xl [animation-delay:80ms] drop-shadow-xl"
        >
          <span class="block text-white">On ne rejoint pas <br class="lg:hidden" />une ESN.</span>
          <span class="text-accent-500">
            <span class="sr-only">{{ HERO_TYPED_TEXT }}</span
            ><span aria-hidden="true"
              >{{ typedText || '\u200B'
              }}<span
                aria-hidden="true"
                class="ml-0.5 inline-block h-[0.7em] w-[0.09em] translate-y-[0.05em] animate-blink bg-accent-500 motion-reduce:animate-none"
            /></span>
          </span>
        </h1>
      </div>
    </div>
  </section>

  <BuSection />

  <section
    id="valeurs"
    data-theme="dark"
    class="h-dvh shrink-0 w-full snap-start snap-always flex flex-col bg-[#000066] px-4 pt-36 pb-8 text-white sm:px-6 lg:px-8 xl:px-12"
  >
    <header
      ref="valeursEl"
      class="max-w-5xl px-4 md:px-24 lg:px-28 transition-all duration-700 ease-out motion-reduce:transition-none"
      :class="scrollRevealClass(valeursReveal)"
    >
      <h2 class="font-display text-display text-balance text-white">Nos valeurs</h2>
      <p class="mt-4 text-lg leading-relaxed text-white/70">
        Chez Faceel, nos collaborateurs possèdent une double culture : une solide
        <span
          class="bg-linear-to-t from-accent-500/30 to-transparent bg-[length:100%_40%] bg-bottom bg-no-repeat"
        >
          expertise technique
        </span>
        et une compréhension fine des
        <span
          class="bg-linear-to-t from-accent-500/30 to-transparent bg-[length:100%_40%] bg-bottom bg-no-repeat"
        >
          réalités métier
        </span>
        . C'est cette combinaison qui fait
        <span
          class="bg-linear-to-t from-accent-500/30 to-transparent bg-[length:100%_40%] bg-bottom bg-no-repeat"
        >
          notre différence
        </span>
        .
      </p>
    </header>

    <CoverCarousel
      :count="VALUE_CARDS.length"
      label="Nos valeurs"
      tone="dark"
      class="flex-1 w-full mt-8"
    >
      <template #slide="{ index }">
        <CarouselSlideContent
          tone="dark"
          :title="activeValue(index).title"
          :heading-level="3"
          class="max-w-xl"
        >
          {{ activeValue(index).description }}
        </CarouselSlideContent>
      </template>
    </CoverCarousel>
  </section>
  <section id="references" data-theme="light" class="h-dvh shrink-0 w-full snap-start snap-always overflow-hidden">
    <ReferencesSection />
  </section>

  <section
    id="chiffres-cles"
    data-theme="dark"
    class="h-dvh shrink-0 w-full snap-start snap-always overflow-hidden flex flex-col justify-center bg-[#000066] px-4 py-16 sm:px-6 lg:px-8 xl:px-12"
  >
    <div
      ref="chiffresEl"
      class="mx-auto flex w-full max-w-5xl flex-col items-center text-center"
      :class="scrollRevealClass(chiffresReveal)"
    >
      <p class="text-eyebrow uppercase text-accent-500">Nos chiffres clés</p>

      <blockquote
        class="mt-6 max-w-3xl font-display text-2xl leading-snug font-bold tracking-tight text-balance text-white sm:text-3xl lg:text-4xl"
      >
        « Chez Faceel-it, nous ne nous contentons pas de vous délivrer une prestation&nbsp;: nous
        co-construisons des solutions durables, agiles et sur-mesure. Votre satisfaction est notre
        plus grande fête. »
      </blockquote>

      <ul class="mt-12 grid w-full grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
        <li
          v-for="stat in KEY_STATS"
          :key="stat.label"
          class="group rounded-card bg-white p-8 ring-1 ring-white/20 shadow-soft transition-all duration-300 ease-snap hover:-translate-y-2 hover:shadow-lift hover:ring-accent-500/60 motion-reduce:transition-none motion-reduce:transform-none"
        >
          <p
            class="font-display text-5xl font-extrabold tracking-tight text-primary-900 transition-colors duration-300 ease-snap group-hover:text-accent-700 sm:text-6xl"
          >
            {{ stat.value }}
          </p>
          <p class="mt-3 text-eyebrow uppercase text-primary-900/60">{{ stat.label }}</p>
        </li>
      </ul>
    </div>
  </section>

  <section
    id="evenements"
    data-theme="light"
    class="h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center bg-white px-4 py-16 text-gray-900 sm:px-6 lg:px-8 xl:px-12"
  >
    <header
      ref="evenementsEl"
      class="mx-auto max-w-3xl text-center transition-all duration-700 ease-out motion-reduce:transition-none"
      :class="scrollRevealClass(evenementsReveal)"
    >
      <p class="text-eyebrow uppercase text-accent-700">La vie d'équipe</p>
      <h2 class="mt-4 font-display text-display text-balance text-primary-900">Nos événements</h2>
      <p class="mt-4 text-lg leading-relaxed text-primary-900/60">
        La cohésion ne s'arrête pas à la porte des bureaux&nbsp;: after-works, événements sportifs
        et repas partagés rythment aussi la vie de nos équipes.
      </p>
    </header>

    <!-- Grille bento — masquée sur mobile, visible à partir de sm: -->
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

    <!-- Slider automatique — visible sur mobile uniquement -->
    <div class="relative mx-auto mt-10 h-72 w-full overflow-hidden rounded-xl sm:hidden">
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
  </section>

  <LocationMapSection />
  <section
    data-theme="dark"
    class="h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-end bg-[#000066]"
  >
    <TheFooter />
  </section>
  </div><!-- /conteneur snap -->
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  @keyframes splash-drop {
    0% {
      transform: translateY(-100vh) scaleY(1.5);
      opacity: 0;
    }
    10% {
      transform: translateY(-100vh) scaleY(1.5);
      opacity: 1;
    }
    25% {
      transform: translateY(0) scaleY(1);
      opacity: 1;
    }
    30% {
      transform: translateY(0) scale(3);
      opacity: 0;
    }
    100% {
      opacity: 0;
      visibility: hidden;
    }
  }

  @keyframes splash-hole {
    0%,
    25% {
      width: 0;
      height: 0;
      opacity: 1;
      box-shadow:
        0 0 0 150vmax #ffffff,
        inset 0 0 0px 0px rgba(0, 0, 102, 0);
    }
    30% {
      width: 0;
      height: 0;
      opacity: 1;
      box-shadow:
        0 0 0 150vmax #ffffff,
        inset 0 0 40px 10px rgba(0, 0, 102, 0.7);
    }
    99% {
      width: 300vmax;
      height: 300vmax;
      opacity: 1;
      box-shadow:
        0 0 0 150vmax #ffffff,
        inset 0 0 150px 20px rgba(0, 0, 102, 0);
    }
    100% {
      width: 300vmax;
      height: 300vmax;
      opacity: 0;
      visibility: hidden;
    }
  }

  @keyframes hero-text-up {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .animate-splash-drop {
    animation: splash-drop 3s ease-in forwards;
  }

  .animate-splash-hole {
    animation: splash-hole 3s cubic-bezier(0.7, 0, 0.1, 1) forwards;
  }

  .animate-hero-text {
    opacity: 0;
    animation: hero-text-up 1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  }

  .animate-hero-text-delayed {
    opacity: 0;
    animation: hero-text-up 1s cubic-bezier(0.25, 1, 0.5, 1) 0.8s forwards;
  }
}
</style>
