<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'Page introuvable',
  description: "Cette page n'existe pas ou a été déplacée.",
  indexable: false,
})
</script>

<template>
  <!-- fond bleu charte -->
  <section
    data-theme="dark"
    class="flex min-h-[70vh] w-full flex-col items-center justify-center bg-[#000066] px-4 text-center"
  >
    <!-- vert faceel -->
    <h1 class="text-8xl md:text-9xl font-extrabold text-accent-500 mb-4 drop-shadow-lg tracking-tight">
      404
    </h1>
    <h2 class="text-2xl md:text-3xl font-bold text-white mb-6">
      Oups ! Vous avez dévié de la trajectoire.
    </h2>
    <p class="text-lg text-white/80 mb-10 max-w-lg mx-auto">
      Il semble que cette page n'existe pas dans notre base de données.
    </p>
    <router-link
      to="/"
      class="px-8 py-3 bg-accent-500 text-[#000066] font-bold rounded-full hover:bg-accent-400 transition-colors duration-300 shadow-[0_0_15px_rgba(18,216,10,0.3)] hover:shadow-[0_0_25px_rgba(18,216,10,0.6)]"
    >
      Retour à l'accueil
    </router-link>
  </section>
</template>
