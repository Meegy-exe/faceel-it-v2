<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import TickerBand from '@/components/layout/TickerBand.vue'
import CoverCarousel from '@/components/ui/CoverCarousel.vue'
import CarouselSlideContent from '@/components/ui/CarouselSlideContent.vue'
import ReferencesSection from '@/components/ui/ReferencesSection.vue'
import BuSection from '@/components/home/BuSection.vue'
import EventsSection from '@/components/home/EventsSection.vue'
import LocationMapSection from '@/components/home/LocationMapSection.vue'
import { scrollRevealClass, useScrollReveal } from '@/composables/useScrollReveal'
import { useSeo } from '@/composables/useSeo'
import { useProfileStore } from '@/stores/useProfileStore'

const profileStore = useProfileStore()

useSeo({
  title: 'Accueil',
  // maj seo local
  fullTitle: 'Faceel-IT - ESN à Wasquehal (métropole lilloise) : Data, IA et Transformation digitale',
  description:
    'ESN à Wasquehal, au coeur de la métropole lilloise, Faceel-IT accompagne les entreprises ' +
    'des Hauts-de-France : Data, Intelligence Artificielle, développement web et applications ' +
    'métier, Cloud et Cybersécurité.',
})

/* -------------------------------------------------------------------------- */
/* Animations d'apparition au défilement                                      */
/* -------------------------------------------------------------------------- */

const chiffresEl = useTemplateRef<HTMLElement>('chiffresEl')
const chiffresReveal = useScrollReveal(chiffresEl)
/** Séquencement volontairement inversé : les chiffres comptent D'ABORD, dès
 *  l'entrée dans le viewport (`chiffresReveal`) ; le bloc texte n'est révélé
 *
 *  qu'ensuite, piloté par minuterie (et non sa propre visibilité au scroll)
 *  dans le `watch(chiffresReveal, ...)` ci-dessous. `'idle'` par défaut :
 *  reste visible pour le SSR/no-JS, même garantie que `ScrollRevealState`
 *  (cf. `useScrollReveal.ts`). */
const textRevealState = ref<'idle' | 'hidden' | 'visible'>('idle')
const valeursEl = useTemplateRef<HTMLElement>('valeursEl')
const valeursReveal = useScrollReveal(valeursEl)

/* -------------------------------------------------------------------------- */
/* Chiffres clés                                                              */
/* -------------------------------------------------------------------------- */

interface KeyStat {
  value: string
  label: string
}

/** Chiffres fournis tels quels par la demande client aucune valeur
 *  inventée (cf. CLAUDE.md, intégrité du contenu). */
const KEY_STATS: KeyStat[] = [
  { value: '65', label: 'Collaborateurs' },
  { value: '170+', label: 'Projets réalisés' },
  { value: '30', label: 'Clients satisfaits' },
  { value: '2021', label: 'Indépendante depuis' },
]

interface ParsedStat {
  target: number
  suffix: string
  label: string
}

const PARSED_STATS: ParsedStat[] = KEY_STATS.map((s) => ({
  target: parseInt(s.value, 10),
  suffix: s.value.replace(/\d/g, ''),
  label: s.label,
}))

const animatedValues = ref<number[]>(PARSED_STATS.map(() => 0))
const countUpStarted = ref(false)
let countUpRaf: number | undefined
/** Durée du count-up (`runCountUp`) reprise telle quelle comme durée de la
 *  transition CSS du bloc texte (cf. template) pour que les deux animations,
 *  démarrées ensemble, se terminent au même instant. */
const COUNT_UP_DURATION_MS = 2000

function runCountUp() {
  if (countUpRaf !== undefined) cancelAnimationFrame(countUpRaf)
  const start = performance.now()
  const targets = PARSED_STATS.map((s) => s.target)
  animatedValues.value = targets.map(() => 0)

  function step(now: number) {
    const progress = Math.min((now - start) / COUNT_UP_DURATION_MS, 1)
    const eased = 1 - (1 - progress) ** 2
    animatedValues.value = targets.map((t) => Math.round(t * eased))
    if (progress < 1) countUpRaf = requestAnimationFrame(step)
  }
  countUpRaf = requestAnimationFrame(step)
}

watch(chiffresReveal, (state) => {
  if (import.meta.env.SSR) return
  if (state === 'visible') {
    // Chiffres et texte démarrent ensemble (cf. `duration-2000` du texte
    // dans le template, calée sur `COUNT_UP_DURATION_MS`, pour une fin
    // synchrone).
    countUpStarted.value = true
    runCountUp()
    textRevealState.value = 'visible'
  }
  if (state === 'hidden') {
    if (countUpRaf !== undefined) cancelAnimationFrame(countUpRaf)
    animatedValues.value = PARSED_STATS.map(() => 0)
    textRevealState.value = 'hidden'
  }
})

onBeforeUnmount(() => {
  if (countUpRaf !== undefined) cancelAnimationFrame(countUpRaf)
})

/* -------------------------------------------------------------------------- */
/* Valeur ajoutée                                                             */
/* -------------------------------------------------------------------------- */

interface ValueCard {
  title: string
  /** Segments joints par un `<br>` dans le template (cf. `#slide` plus bas)
   *  un seul élément dans la plupart des cas ; `Accompagnement` en a deux
   *  pour forcer un retour à la ligne exact après "modernes" dès 1840px,
   *  sans dépendre du calcul automatique des largeurs. */
  description: string[]
}

const VALUE_CARDS: ValueCard[] = [
  {
    title: 'Collectif',
    description: [
      'Tout ce que nous réalisons,',
      'nous le faisons ensemble,',
      'grâce et avec nos collaborateurs.',
    ],
  },
  {
    title: 'Engagement',
    description: [
      'Comme l’esprit sportif,',
      'on avance en donnant 100%',
      'de nos efforts pour atteindre l’objectif.',
    ],
  },
  {
    title: 'Accompagnement',
    description: [
      'Nous sommes toujours à l’écoute',
      'pour offrir un service sur mesure',
      'tant à nos clients qu’à nos collaborateurs.',
    ],
  },
]

function activeValue(index: number): ValueCard {
  return VALUE_CARDS[index]!
}

/** Diapositive active du carrousel "Nos valeurs" pilote la pulsation du
 *  halo lumineux (cf. template, `Transition name="halo-pulse"`). */
const valeursActiveSlide = ref(0)

/* -------------------------------------------------------------------------- */
/* Hero effet machine à écrire                                              */
/* -------------------------------------------------------------------------- */

/** Reprend tel quel le texte réel de l'ancien effet machine à écrire pour la
 *  1ère phrase aucun texte n'est inventé ici, cf. CLAUDE.md « Intégrité du
 *  contenu ». */
const heroPhrases = [
  { main: 'On ne rejoint pas une ESN.', highlight: 'On rejoint une équipe.' },
  { main: 'Faceel-it,', highlight: 'Faceelitez votre passion.' },
]
const currentPhraseIndex = ref(0)
const typedMain = ref('')
const typedHighlight = ref('')
/** Quelle ligne affiche le curseur clignotant suit la ligne réellement en
 *  cours de frappe/effacement plutôt que de rester fixé sur "highlight". */
const cursorPosition = ref<'main' | 'highlight'>('main')

/** Texte complet de la phrase active, pour la version lue aux lecteurs
 *  d'écran (span `sr-only` dans le template) l'animation caractère par
 *  caractère n'a de sens que visuellement. */
const heroFullText = computed(
  () =>
    `${heroPhrases[currentPhraseIndex.value]!.main} ${heroPhrases[currentPhraseIndex.value]!.highlight}`,
)

const HERO_TYPEWRITER_ERASE_MS = 45
const HERO_TYPEWRITER_TYPE_MS = 70
const HERO_TYPEWRITER_START_DELAY_MS = 0
const HERO_TYPEWRITER_PAUSE_MS = 3_000

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

function typeMain(onDone: () => void) {
  cursorPosition.value = 'main'
  let count = 0
  const target = heroPhrases[currentPhraseIndex.value]!.main
  function step() {
    if (count >= target.length) {
      onDone()
      return
    }
    count += 1
    typedMain.value = target.slice(0, count)
    heroTypeTimeout = setTimeout(step, HERO_TYPEWRITER_TYPE_MS)
  }
  step()
}

function typeHighlight(onDone: () => void) {
  cursorPosition.value = 'highlight'
  let count = 0
  const target = heroPhrases[currentPhraseIndex.value]!.highlight
  function step() {
    if (count >= target.length) {
      onDone()
      return
    }
    count += 1
    typedHighlight.value = target.slice(0, count)
    heroTypeTimeout = setTimeout(step, HERO_TYPEWRITER_TYPE_MS)
  }
  step()
}

function eraseHighlight(onDone: () => void) {
  cursorPosition.value = 'highlight'
  function step() {
    if (typedHighlight.value.length === 0) {
      onDone()
      return
    }
    typedHighlight.value = typedHighlight.value.slice(0, -1)
    heroEraseTimeout = setTimeout(step, HERO_TYPEWRITER_ERASE_MS)
  }
  step()
}

function eraseMain(onDone: () => void) {
  cursorPosition.value = 'main'
  function step() {
    if (typedMain.value.length === 0) {
      onDone()
      return
    }
    typedMain.value = typedMain.value.slice(0, -1)
    heroEraseTimeout = setTimeout(step, HERO_TYPEWRITER_ERASE_MS)
  }
  step()
}

function playHeroTypewriterCycle() {
  typeMain(() => {
    typeHighlight(() => {
      heroStartTimeout = setTimeout(() => {
        eraseHighlight(() => {
          eraseMain(() => {
            currentPhraseIndex.value = (currentPhraseIndex.value + 1) % heroPhrases.length
            playHeroTypewriterCycle()
          })
        })
      }, HERO_TYPEWRITER_PAUSE_MS)
    })
  })
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
    typedMain.value = heroPhrases[0]!.main
    typedHighlight.value = heroPhrases[0]!.highlight
    cursorPosition.value = 'highlight'
  } else {
    startHeroTypewriterLoop()
  }
}

onMounted(() => {
  if (import.meta.env.SSR) return

  heroReduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  heroReduceMotionQuery.addEventListener('change', handleHeroReduceMotionChange)

  if (heroReduceMotionQuery.matches) {
    typedMain.value = heroPhrases[0]!.main
    typedHighlight.value = heroPhrases[0]!.highlight
    cursorPosition.value = 'highlight'
  } else {
    startHeroTypewriterLoop()
  }
})

onBeforeUnmount(() => {
  stopHeroTypewriterLoop()
  heroReduceMotionQuery?.removeEventListener('change', handleHeroReduceMotionChange)
})

/* -------------------------------------------------------------------------- */
/* Hero vague canvas autonome                                               */
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
  <!-- Cinématique d'entrée fixed z-[100] pour se superposer à tout le site -->
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
  <div class="h-dvh w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory">
    <!-- snap-always retiré ici (seulement ici) : forçait un snap plein écran
       dès le moindre tick de molette, sans laisser au bandeau d'événements
       le temps de défiler sous la navbar fixe. snap-start conservé (section
       reste un point d'ancrage valide, cf. CLAUDE.md "Full Page Snap
       Scroll"). -->
    <section
      id="hero"
      data-theme="dark"
      class="relative isolate overflow-hidden h-dvh shrink-0 w-full snap-start flex flex-col justify-center text-white pt-24 lg:pt-28"
    >
      <!-- TickerBand DANS cette section (pas dans App.vue, ni au-dessus d'elle) :
         c'est le conteneur `h-dvh overflow-y-auto snap-y` englobant qui capte
         le scroll le bandeau doit vivre dans le MÊME bloc snap-start que le
         Hero pour apparaître à l'écran dès le chargement. -->
      <TickerBand />
      <div
        class="absolute inset-0 z-0 bg-gradient-to-b from-[#000066] via-[#000066] via-65% to-blue-800"
      >
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
          <!--        <p-->
          <!--          class="animate-fade-up motion-reduce:animate-none text-eyebrow uppercase text-accent-500 drop-shadow-md"-->
          <!--        >-->
          <!--          ESN · Data × IA × Transformation digitale-->
          <!--        </p>-->

          <div
            class="mt-6 min-h-[140px] md:min-h-[180px] lg:min-h-[220px] flex items-center max-sm:w-[320px] max-sm:overflow-hidden"
          >
            <h1
              class="flex max-w-7xl flex-col items-start gap-y-2 animate-fade-up motion-reduce:animate-none font-display text-5xl leading-[1.1] font-extrabold tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-xl max-sm:text-2xl max-sm:leading-tight"
            >
              <!-- seo local : contexte geo stable, hors phrase animee -->
              <span class="sr-only">Faceel-IT, ESN à Wasquehal, dans la métropole lilloise, Hauts-de-France.</span>
              <span class="sr-only">{{ heroFullText }}</span>
              <span class="block text-white max-sm:whitespace-nowrap" aria-hidden="true">
                {{ typedMain || '\u200B'
                }}<span
                  v-show="cursorPosition === 'main'"
                  class="ml-1 inline-block h-[0.9em] w-[4px] md:w-[6px] translate-y-[0.05em] animate-blink bg-white motion-reduce:animate-none"
                  aria-hidden="true"
                ></span>
              </span>
              <span class="text-accent-500 max-sm:whitespace-nowrap" aria-hidden="true">
                {{ typedHighlight || '\u200B'
                }}<span
                  v-show="cursorPosition === 'highlight'"
                  class="ml-1 inline-block h-[0.9em] w-[4px] md:w-[6px] translate-y-[0.05em] animate-blink bg-[#12D80A] motion-reduce:animate-none"
                  aria-hidden="true"
                ></span>
              </span>
            </h1>
          </div>
        </div>
      </div>
    </section>

    <BuSection />

    <!-- aere titre mobile -->
    <section
      id="valeurs"
      data-theme="dark"
      class="relative overflow-hidden h-dvh shrink-0 w-full snap-start snap-always flex flex-col bg-[#000066] px-4 pt-36 [@media(max-height:850px)]:pt-24 [@media(max-height:568px)]:pt-10 pb-8 [@media(max-height:568px)]:pb-4 text-white sm:px-6 lg:px-8 xl:px-12"
    >
      <div class="relative z-10 flex flex-1 flex-col w-full">
        <header
          ref="valeursEl"
          class="max-w-6xl px-4 md:px-24 lg:px-28 transition-all duration-700 ease-out motion-reduce:transition-none"
          :class="scrollRevealClass(valeursReveal)"
        >
          <h2
            class="font-display text-display text-balance text-white [@media(max-height:568px)]:text-2xl"
          >
            Nos valeurs
          </h2>
          <p
            class="mt-4 w-full text-lg leading-relaxed text-white [@media(max-height:568px)]:text-sm [@media(max-height:568px)]:leading-tight"
          >
            Faceel-it est plus qu'une ESN française et indépendante, basée à Wasquehal, dans la
            métropole lilloise, c'est une équipe qui se construit autour des valeurs du sport qui nous font
            avancer ensemble.
          </p>
        </header>

        <div class="relative flex-1 w-full mt-8 [@media(max-height:568px)]:mt-1">
          <!-- Core Glow halo lumineux centré derrière la slide active, donc
             relatif au carrousel lui-même (et non à toute la section, sous
             peine d'être décalé par le <header> au-dessus). Pulsation
             synchronisée au changement de diapositive via `@update:active-
             index` (cf. CoverCarousel.vue). -->
          <Transition name="halo-pulse" mode="out-in">
            <div
              :key="valeursActiveSlide"
              class="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-blue-600/30 rounded-full blur-[120px] z-0"
              aria-hidden="true"
            />
          </Transition>

          <CoverCarousel
            :count="VALUE_CARDS.length"
            :autoplay-ms="4000"
            label="Nos valeurs"
            tone="dark"
            arrow-below-on-mobile
            class="relative z-10 h-full w-full"
            @update:active-index="valeursActiveSlide = $event"
          >
            <template #slide="{ index }">
              <CarouselSlideContent
                tone="dark"
                :title="activeValue(index).title"
                :heading-level="3"
                body-class="text-base lg:text-lg w-full max-w-full break-words px-6 sm:max-w-[320px] sm:px-0 [@media(max-height:568px)]:text-sm [@media(max-height:568px)]:leading-tight"
                class="max-w-xl"
                center-on-mobile
              >
                <template
                  v-for="(line, lineIndex) in activeValue(index).description"
                  :key="lineIndex"
                >
                  <br v-if="lineIndex > 0" />{{ line }}
                </template>
              </CarouselSlideContent>
            </template>
          </CoverCarousel>
        </div>
      </div>
    </section>
    <section
      id="references"
      data-theme="light"
      class="h-dvh shrink-0 w-full snap-start snap-always overflow-hidden"
    >
      <ReferencesSection />
    </section>

    <section
      id="chiffres-cles"
      data-theme="dark"
      class="relative h-dvh shrink-0 w-full snap-start snap-always overflow-hidden flex flex-col justify-start md:justify-center bg-[#000066] px-4 pt-20 [@media(max-height:568px)]:pt-16 pb-12 sm:px-6 sm:pt-16 sm:pb-16 lg:px-8 xl:px-12"
    >
      <!-- Halo lumineux central décoratif. -->
      <div
        aria-hidden="true"
        class="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-blue-600/30 rounded-full blur-[120px] z-0"
      />

      <div
        ref="chiffresEl"
        class="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-1 flex-col items-center justify-evenly text-center [@media(max-height:568px)]:justify-start [@media(max-height:568px)]:scale-95 md:justify-center"
      >
        <div
          :class="
            scrollRevealClass(textRevealState, 'up', {
              offsetClass: 'translate-y-28',
              durationClass: 'duration-2000',
              scaleClass: 'scale-95',
            })
          "
        >
          <p
            class="text-lg sm:text-xl md:text-2xl font-bold tracking-wide uppercase text-white underline decoration-[#12d80a] decoration-4 underline-offset-8"
          >
            Nos chiffres clés
          </p>

          <blockquote
            class="mt-6 [@media(max-height:650px)]:mt-2 [@media(max-height:650px)]:text-base [@media(max-height:568px)]:hidden max-w-3xl font-display text-xl leading-tight font-bold tracking-tight text-balance text-white sm:text-3xl lg:text-4xl"
          >
            « Chez Faceel-it, nous ne nous contentons pas de vous délivrer une prestation&nbsp;:
            nous co-construisons des solutions durables, agiles et sur-mesure. Votre satisfaction
            est notre plus grande fête. »
          </blockquote>
        </div>

        <ul
          class="mt-8 [@media(max-height:650px)]:mt-2 sm:mt-12 grid w-full grid-cols-2 gap-4 [@media(max-height:650px)]:gap-2 md:gap-8 lg:grid-cols-4"
        >
          <li
            v-for="(stat, i) in PARSED_STATS"
            :key="stat.label"
            class="flex h-full flex-col items-center justify-center p-4 [@media(max-height:650px)]:p-2 text-center transition-transform duration-300 hover:-translate-y-1 motion-reduce:transition-none sm:p-6"
          >
            <p
              class="font-display text-4xl [@media(max-height:650px)]:text-4xl font-extrabold tracking-tight text-accent-500 sm:text-5xl lg:text-6xl"
            >
              {{ countUpStarted ? animatedValues[i] : stat.target }}{{ stat.suffix }}
            </p>
            <span class="mt-2 block h-1 w-12 rounded-full bg-[#12d80a]" aria-hidden="true"></span>
            <p class="mt-3 [@media(max-height:650px)]:mt-1 text-eyebrow leading-snug text-white">
              {{ stat.label }}
            </p>
          </li>
        </ul>
      </div>
    </section>

    <!-- event accueil : composant partage avec CandidateView.vue -->
    <EventsSection v-if="profileStore.profile !== 'entreprise'" />

    <LocationMapSection />
    <TheFooter full-page-scroll />
  </div>
  <!-- /conteneur snap -->
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .halo-pulse-enter-active,
  .halo-pulse-leave-active {
    transition: opacity 1000ms ease-in-out;
  }
  .halo-pulse-enter-from,
  .halo-pulse-leave-to {
    opacity: 0.6;
  }

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
    animation: hero-text-up 1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  }
}
</style>
