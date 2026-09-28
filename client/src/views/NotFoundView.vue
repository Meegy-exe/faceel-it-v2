<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'Page introuvable',
  description: "Cette page n'existe pas ou a été déplacée.",
  indexable: false,
})
</script>

<template>
  <section
    data-theme="dark"
    class="flex min-h-[70vh] w-full flex-col items-center justify-center bg-blue-950 px-4 text-center"
  >
    <h1
      class="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-4 drop-shadow-lg tracking-tight"
    >
      404
    </h1>
    <h2 class="text-2xl md:text-3xl font-bold text-white mb-6">
      Oups ! Vous avez dévié de la trajectoire.
    </h2>
    <p class="text-lg text-gray-300 mb-10 max-w-lg mx-auto">
      Il semble que cette page n'existe pas dans notre base de données.
    </p>
    <router-link
      to="/"
      class="px-8 py-3 bg-green-500 text-blue-950 font-bold rounded-full hover:bg-green-400 transition-colors duration-300 shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)]"
    >
      Retour à l'accueil
    </router-link>
  </section>
</template>
