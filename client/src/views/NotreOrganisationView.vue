<script setup lang="ts">
import TheFooter from '@/components/layout/TheFooter.vue'
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'Notre vision & notre organisation',
  description: "Ce qui porte Faceel-IT et la façon dont le collectif s'organise au quotidien.",
})

// TODO : contenu réel à fournir (vision d'entreprise, organigramme/organisation) —
// aucun contenu fictif tant que la matière n'est pas communiquée, cf. CLAUDE.md,
// intégrité du contenu.
</script>

<template>
  <!-- Pas de `<main>` ici : la coquille (`App.vue`) le fournit déjà. -->
  <div
    class="h-dvh w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth bg-primary-950"
  >
    <section
      id="vision"
      data-theme="dark"
      class="w-full shrink-0 snap-start snap-always h-dvh flex flex-col justify-center bg-primary-950 px-6 lg:px-16 xl:px-24"
    >
      <p class="text-white/60 mb-6 font-medium">
        Accueil / Qui sommes-nous / <span class="text-accent-500">Notre vision</span>
      </p>
      <h1
        class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight max-w-4xl"
      >
        Notre vision
      </h1>
      <p class="mt-6 text-lg text-white/60 max-w-xl">Contenu à venir.</p>
    </section>

    <section
      id="organisation"
      data-theme="light"
      class="w-full shrink-0 snap-start snap-always min-h-dvh flex flex-col justify-center bg-white text-primary-950 px-6 lg:px-16 xl:px-24 py-24"
    >
      <h2 class="text-4xl md:text-5xl font-extrabold mb-6">Notre organisation</h2>
      <p class="text-primary-950/60 max-w-xl">Contenu à venir.</p>
    </section>

    <section data-theme="dark" class="w-full shrink-0 snap-start snap-always">
      <TheFooter />
    </section>
  </div>
</template>
