<script setup lang="ts">
import { ref } from 'vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import { useSeo } from '@/composables/useSeo'
import { useWaveCanvas } from '@/composables/useWaveCanvas'

useSeo({
  title: 'Nos partenaires',
  description:
    "Faceel-IT s'entoure des meilleurs acteurs technologiques pour construire des plateformes solides, fiables et innovantes.",
})

const waveCanvas = ref<HTMLCanvasElement | null>(null)
useWaveCanvas(waveCanvas)
</script>

<template>
  <div class="h-screen w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth bg-primary-950">
    <!-- Section Hero -->
    <section
      data-theme="dark"
      class="relative min-h-screen w-full snap-start snap-always flex flex-col items-start justify-center overflow-hidden px-4 py-20 text-left"
    >
      <!-- Canvas vague — fond animé, désactivé si motion-reduce (DA standard, cf. HomeView/OffersView). -->
      <canvas
        ref="waveCanvas"
        aria-hidden="true"
        class="absolute inset-0 h-full w-full pointer-events-none opacity-60 motion-reduce:hidden"
      />

      <!-- Cercle décoratif vert — touche d'accent sur fond sombre. -->
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

    <!-- Section Partenaire : Anthropic -->
    <section
      data-theme="light"
      class="relative min-h-screen w-full snap-start snap-always flex items-center justify-center px-4 py-20 bg-white"
    >
      <div class="mx-auto w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Visuel / Logo -->
        <div
          class="flex items-center justify-center p-12 bg-primary-950 rounded-3xl border border-white/5 shadow-2xl aspect-video lg:aspect-square"
        >
          <h2 class="text-5xl font-display font-black text-white tracking-widest">ANTHROPIC</h2>
        </div>
        <!-- Contenu textuel -->
        <div>
          <h3 class="text-4xl font-bold text-primary-950 mb-6">Anthropic</h3>
          <p class="text-lg text-primary-900/80 leading-relaxed mb-8">
            Pionnier dans le domaine de l'intelligence artificielle générative et de la sécurité
            des modèles. Notre maîtrise de leur écosystème nous permet d'intégrer l'API Claude au
            cœur de nos workflows et de nos applications web, garantissant une automatisation
            intelligente, éthique et ultra-performante.
          </p>
          <a
            href="https://www.anthropic.com"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-full bg-accent-500 px-6 py-3 font-bold text-primary-950 transition hover:bg-accent-400"
          >
            Découvrir Anthropic
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <section data-theme="dark" class="w-full snap-start snap-always">
      <TheFooter />
    </section>
  </div>
</template>
