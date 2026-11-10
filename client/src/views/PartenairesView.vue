<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import { useSeo } from '@/composables/useSeo'
import { useWaveCanvas } from '@/composables/useWaveCanvas'

useSeo({
  title: 'Nos partenaires',
  description:
    "Faceel-IT, ESN à Wasquehal, s'entoure des meilleurs acteurs technologiques pour construire des plateformes solides, fiables et innovantes pour les entreprises de la métropole lilloise et des Hauts-de-France.",
})

const waveCanvas = ref<HTMLCanvasElement | null>(null)
useWaveCanvas(waveCanvas)

// slider partenaires
interface Partner {
  name: string
  logo: string
  description: string
  url: string
  ctaLabel: string
}

/** Logos reels dans public/images/pa : tuile claire plutot qu'un filtre
 *  brightness/invert, qui casse les trous internes des svg (cf. l'historique
 *  documente dans PartnerCarousel.vue) et garde les couleurs de marque. */
const PARTNERS: Partner[] = [
  {
    name: 'Anthropic',
    logo: '/images/pa/Anthropic.svg',
    description:
      "Pionnier dans le domaine de l'intelligence artificielle générative et de la sécurité des modèles. Notre maîtrise de leur écosystème nous permet d'intégrer l'API Claude au cœur de nos workflows et de nos applications web, garantissant une automatisation intelligente, éthique et ultra-performante.",
    url: 'https://www.anthropic.com',
    ctaLabel: 'Découvrir Anthropic',
  },
  {
    name: 'Snowflake',
    logo: '/images/pa/Snowflake.svg',
    description:
      "Plateforme cloud de données qui centralise, stocke et partage l'information à grande échelle. Nous nous appuyons sur Snowflake pour structurer les données de nos clients et alimenter des projets data et IA fiables.",
    url: 'https://www.snowflake.com',
    ctaLabel: 'Découvrir Snowflake',
  },
  {
    name: 'Google Cloud Platform',
    logo: '/images/pa/google_cloud_platform.svg',
    description:
      "Suite cloud de référence pour l'hébergement, le calcul et l'intelligence artificielle. Elle nous permet de déployer des infrastructures scalables et sécurisées pour les projets digitaux de nos clients.",
    url: 'https://cloud.google.com',
    ctaLabel: 'Découvrir Google Cloud',
  },
  {
    name: 'Power BI',
    logo: '/images/pa/power_bi.svg',
    description:
      "Outil de data visualisation de Microsoft qui transforme les données brutes en tableaux de bord clairs et actionnables. Nous l'utilisons pour donner à nos clients une vision concrète de leurs indicateurs clés.",
    url: 'https://powerbi.microsoft.com',
    ctaLabel: 'Découvrir Power BI',
  },
]

const activeIndex = ref(0)
const activePartner = computed(() => PARTNERS[activeIndex.value]!)

let timer: ReturnType<typeof setInterval> | null = null

function startTimer() {
  if (import.meta.env.SSR || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  // nettoie minuteur : jamais deux setInterval en parallele
  if (timer) clearInterval(timer)
  // meme cadence que la section clients de l'accueil (ReferencesSection.vue)
  timer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % PARTNERS.length
  }, 3_000)
}

function stopTimer() {
  if (timer) clearInterval(timer)
  timer = null
}

// reset timer : coupe le minuteur en cours puis relance un cycle complet
function resetTimer() {
  if (timer) clearInterval(timer)
  startTimer()
}

function nextPartner() {
  activeIndex.value = (activeIndex.value + 1) % PARTNERS.length
  resetTimer()
}

function prevPartner() {
  activeIndex.value = (activeIndex.value - 1 + PARTNERS.length) % PARTNERS.length
  resetTimer()
}

function goToPartner(index: number) {
  activeIndex.value = index
  resetTimer()
}

onMounted(startTimer)
onUnmounted(stopTimer)
</script>

<template>
  <div
    class="h-screen w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth bg-primary-950"
  >
    <!-- Section Hero -->
    <section
      data-theme="dark"
      class="relative min-h-screen w-full snap-start snap-always flex flex-col items-start justify-center overflow-hidden px-4 py-20 text-left"
    >
      <!-- Canvas vague - fond animé, désactivé si motion-reduce (DA standard, cf. HomeView/OffersView). -->
      <canvas
        ref="waveCanvas"
        aria-hidden="true"
        class="absolute inset-0 h-full w-full pointer-events-none opacity-60 motion-reduce:hidden"
      />

      <!-- Cercle décoratif vert - touche d'accent sur fond sombre. -->
      <div
        aria-hidden="true"
        class="pointer-events-none absolute -right-40 top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-accent-500/15 blur-3xl"
      />

      <div class="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-start text-left px-4">
        <p class="text-accent-500 font-bold tracking-wider uppercase mb-4">Écosystème</p>
        <h1 class="text-5xl lg:text-7xl font-extrabold text-white leading-tight max-w-4xl">
          Nos partenaires
        </h1>
        <p class="mt-6 max-w-2xl text-xl text-white/70">
          Nous nous entourons des meilleurs acteurs technologiques pour construire des plateformes
          solides, fiables et innovantes.
        </p>
      </div>
    </section>

    <!-- Section Partenaires : carrousel -->
    <section
      data-theme="light"
      class="relative min-h-screen w-full snap-start snap-always flex items-center justify-center px-4 py-20 bg-white"
      @mouseenter="stopTimer"
      @mouseleave="startTimer"
    >
      <div class="mx-auto w-full max-w-7xl">
        <Transition
          enter-active-class="transition-all duration-500 ease-out motion-reduce:transition-none"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-300 ease-in motion-reduce:transition-none"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4"
          mode="out-in"
        >
          <!-- fix hauteur slide -->
          <div
            :key="activePartner.name"
            class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[480px] lg:min-h-[360px]"
          >
            <!-- debride taille logo -->
            <div
              class="flex items-center justify-start py-4 lg:justify-center lg:p-12 aspect-video lg:aspect-square"
            >
              <img
                :src="activePartner.logo"
                :alt="activePartner.name"
                class="w-auto max-w-[240px] h-24 lg:max-w-[300px] object-contain object-left lg:object-center"
              />
            </div>
            <!-- fix hauteur stricte -->
            <div class="flex h-[320px] lg:h-auto flex-col justify-center">
              <h3 class="text-4xl font-bold text-primary-950 mb-6">{{ activePartner.name }}</h3>
              <p class="text-lg text-primary-900/80 leading-relaxed mb-8">
                {{ activePartner.description }}
              </p>
              <a
                :href="activePartner.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-full bg-accent-500 px-6 py-3 font-bold text-primary-950 transition hover:bg-accent-400"
              >
                {{ activePartner.ctaLabel }}
                <svg
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        </Transition>

        <!-- Fleches + puces de navigation, synchronisees sur activeIndex -->
        <div class="mt-12 flex items-center justify-center gap-6">
          <button
            type="button"
            aria-label="Partenaire précédent"
            class="inline-flex size-11 items-center justify-center rounded-full bg-primary-900/5 text-primary-900 transition-colors duration-200 hover:bg-primary-900/10 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary-900"
            @click="prevPartner"
          >
            <svg class="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="m12 15-5-5 5-5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <div class="flex gap-1.5">
            <button
              v-for="(partner, index) in PARTNERS"
              :key="partner.name"
              type="button"
              :aria-label="`Aller au partenaire ${partner.name}`"
              class="size-1.5 rounded-full transition-colors duration-300"
              :class="index === activeIndex ? 'bg-accent-500' : 'bg-primary-900/20'"
              @click="goToPartner(index)"
            />
          </div>

          <button
            type="button"
            aria-label="Partenaire suivant"
            class="inline-flex size-11 items-center justify-center rounded-full bg-primary-900/5 text-primary-900 transition-colors duration-200 hover:bg-primary-900/10 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary-900"
            @click="nextPartner"
          >
            <svg class="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="m8 5 5 5-5 5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- importe footer home -->
    <TheFooter full-page-scroll />
  </div>
</template>
