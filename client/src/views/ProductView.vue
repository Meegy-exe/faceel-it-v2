<script setup lang="ts">
import TheFooter from '@/components/layout/TheFooter.vue'
import { useSeo } from '@/composables/useSeo'

/**
 * Page modèle (template) pour une Business Unit — squelette minimal en
 * attendant le contenu réel, sur le même gabarit que DataIaView.vue/
 * DigitalView.vue (Full Page Snap Scroll, cf. CLAUDE.md).
 */
useSeo({
  title: 'Product — En construction',
  description: 'Page modèle pour la Business Unit Product.',
})
</script>

<template>
  <div class="h-dvh w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory">
    <section
      id="hero"
      data-theme="dark"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden flex items-center justify-center bg-[#000066] px-4 text-center"
    >
      <h1 class="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
        BU Product - En construction
      </h1>
    </section>

    <TheFooter full-page-scroll />
  </div>
</template>
