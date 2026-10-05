<script setup lang="ts">
import TheFooter from '@/components/layout/TheFooter.vue'
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'Adeo',
  description:
    'Découvrez comment Faceel-IT a accompagné Adeo dans la transformation de leurs plateformes digitales.',
})
</script>

<template>
  <div class="h-screen w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth bg-primary-950">
    <!-- Section Hero -->
    <section
      data-theme="dark"
      class="relative min-h-screen w-full snap-start snap-always flex items-center bg-primary-950"
    >
      <div class="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-start text-left px-4 sm:px-6 lg:px-8">
        <p class="text-accent-500 font-bold tracking-wider uppercase mb-4">Cas Client</p>
        <h1 class="text-5xl lg:text-7xl font-extrabold text-white leading-tight max-w-4xl">
          Adeo
        </h1>
        <p class="mt-6 max-w-2xl text-xl text-white/70">
          Découvrez comment nous avons accompagné Adeo dans la transformation de leurs
          plateformes digitales.
        </p>
      </div>
    </section>

    <!-- Section Contenu (Exemple) -->
    <section
      data-theme="light"
      class="relative min-h-screen w-full snap-start snap-always flex items-center justify-center bg-white px-4 py-20"
    >
      <div class="max-w-7xl mx-auto text-center">
        <h2 class="text-4xl font-bold text-primary-950 mb-6">Le Projet</h2>
        <p class="text-lg text-primary-900/80 max-w-3xl mx-auto">
          Détails du projet à venir...
        </p>
      </div>
    </section>

    <!-- Footer -->
    <section data-theme="dark" class="w-full snap-start snap-always">
      <TheFooter />
    </section>
  </div>
</template>
