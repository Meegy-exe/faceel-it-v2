<script setup lang="ts">
import TheFooter from '@/components/layout/TheFooter.vue'
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'Événements tech',
  description: 'Retrouvez les meetups, conférences et hackathons auxquels participe Faceel-IT.',
})

// TODO : brancher la liste réelle des événements (API ou CMS) — aucun événement
// n'est inventé ici, cf. CLAUDE.md « Intégrité du contenu ».
interface TechEvent {
  title: string
  date: string
  location: string
  type: string
}

const events: TechEvent[] = []
</script>

<template>
  <!-- Pas de `<main>` ici : la coquille (`App.vue`) le fournit déjà. -->
  <div
    class="h-dvh w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth bg-primary-950"
  >
    <!-- ==================================================================
         1. HERO
         ================================================================== -->
    <section
      data-theme="dark"
      class="w-full shrink-0 snap-start snap-always h-dvh flex flex-col justify-center bg-primary-950 px-6 lg:px-16 xl:px-24"
    >
      <p class="text-white/60 mb-6 font-medium">
        Accueil / <span class="text-accent-500">Événements tech</span>
      </p>
      <h1
        class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight max-w-4xl"
      >
        Agenda des événements tech
      </h1>
      <p class="mt-6 text-lg text-white/80 max-w-xl">
        Meetups, conférences, hackathons : retrouvez les rendez-vous auxquels participe Faceel-IT.
      </p>
    </section>

    <!-- ==================================================================
         2. LISTE DES ÉVÉNEMENTS
         ================================================================== -->
    <section
      data-theme="light"
      class="w-full shrink-0 snap-start snap-always min-h-dvh flex flex-col justify-center bg-white text-primary-950 px-6 lg:px-16 xl:px-24 py-24"
    >
      <h2 class="text-3xl md:text-4xl font-extrabold mb-12">Prochains événements</h2>

      <div v-if="events.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="event in events"
          :key="event.title"
          class="rounded-2xl border border-gray-200 p-6"
        >
          <p class="text-accent-700 text-sm font-bold uppercase tracking-widest mb-3">
            {{ event.type }}
          </p>
          <h3 class="text-xl font-bold mb-2">{{ event.title }}</h3>
          <p class="text-primary-950/70 text-sm">{{ event.date }} — {{ event.location }}</p>
        </article>
      </div>
      <p v-else class="text-primary-950/60 max-w-xl">
        Aucun événement programmé pour le moment. Revenez bientôt pour découvrir notre prochain
        rendez-vous.
      </p>
    </section>

    <!-- ==================================================================
         3. FOOTER
         ================================================================== -->
    <section data-theme="dark" class="w-full shrink-0 snap-start snap-always">
      <TheFooter />
    </section>
  </div>
</template>
