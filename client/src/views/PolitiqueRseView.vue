<script setup lang="ts">
import { ref } from 'vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import CardCarousel from '@/components/ui/CardCarousel.vue'
import CarouselSlideContent from '@/components/ui/CarouselSlideContent.vue'
import { useSeo } from '@/composables/useSeo'
import { useWaveCanvas } from '@/composables/useWaveCanvas'

useSeo({
  title: 'Politique RSE - ESN engagée à Wasquehal',
  description:
    "Faceel-IT, ESN à Wasquehal, dans la métropole lilloise, s'engage au quotidien pour un numérique plus responsable, inclusif et respectueux de l'environnement dans les Hauts-de-France.",
})

const waveCanvas = ref<HTMLCanvasElement | null>(null)
useWaveCanvas(waveCanvas)

/* -------------------------------------------------------------------------- */
/* Politique RSE - récupéré depuis l'ancienne section de HomeView.vue        */
/* (retirée depuis, cf. historique git) : contenu repris tel quel.           */
/* -------------------------------------------------------------------------- */

interface RseCard {
  title: string
  description: string
  badge?: string
}

const RSE_CARDS: RseCard[] = [
  {
    title: 'Mobilité urbaine',
    description:
      'Notre engagement pour une ville plus fluide et durable.\n' +
      "Nous soutenons activement les initiatives de mobilité urbaine visant à réduire l'empreinte carbone et à faciliter les déplacements doux.",
  },
  {
    title: 'Ecovadis',
    description:
      'Classée dans le top 15 % des entreprises évaluées par EcoVadis, notre entreprise est fière de contribuer à une économie plus responsable.',
    badge: 'Silver',
  },
  {
    title: 'Charte de la diversité',
    description:
      "Nous mettons en œuvre une politique RH inclusive, favorisant l'égalité des chances et le respect de chacun dans toutes nos missions et recrutements.",
  },
  {
    title: 'Numeum',
    description:
      "Nous participons activement à la structuration de la filière numérique française. Ce partenariat nous permet d'être au cœur des enjeux du secteur.",
  },
  // TODO : cartes Opquast et Gifteo - titre + description réels à fournir
  // avant publication ; aucun contenu fictif sur ces engagements, cf.
  // CLAUDE.md, intégrité du contenu.
]

function activeRse(index: number): RseCard {
  return RSE_CARDS[index]!
}
</script>

<template>
  <div
    class="h-screen w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth bg-primary-950"
  >
    <!-- Section 1 : Hero -->
    <section
      data-theme="dark"
      class="relative min-h-screen w-full snap-start snap-always flex flex-col items-start justify-center overflow-hidden px-4 py-20 text-left"
    >
      <!-- Canvas vague - fond animé, désactivé si motion-reduce (DA standard). -->
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
        <p class="text-accent-500 font-bold tracking-wider uppercase mb-4">Engagement</p>
        <h1 class="text-5xl lg:text-7xl font-extrabold text-white leading-tight max-w-4xl">
          Politique RSE d'une ESN engagée dans les Hauts-de-France
        </h1>
        <p class="mt-6 max-w-2xl text-xl text-white/70">
          Nous nous engageons au quotidien pour un numérique plus responsable, inclusif et
          respectueux de notre environnement.
        </p>
      </div>
    </section>

    <!-- Section 2 : Les engagements -->
    <section
      data-theme="light"
      class="relative min-h-screen w-full snap-start snap-always flex items-center justify-center bg-white px-4 py-20"
    >
      <div class="mx-auto w-full max-w-7xl">
        <CardCarousel
          :count="RSE_CARDS.length"
          label="Politique RSE"
          tone="light"
          class="h-[420px] sm:h-[380px] w-full"
        >
          <template #slide="{ index }">
            <CarouselSlideContent
              tone="light"
              size="lg"
              :title="activeRse(index).title"
              :badge="activeRse(index).badge ?? ''"
              :heading-level="2"
              class="max-w-5xl"
            >
              {{ activeRse(index).description }}
            </CarouselSlideContent>
          </template>
        </CardCarousel>
      </div>
    </section>

    <!-- Section 3 : Footer -->
    <section data-theme="dark" class="w-full snap-start snap-always">
      <TheFooter />
    </section>
  </div>
</template>
