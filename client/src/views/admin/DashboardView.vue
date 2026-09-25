<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAdminStore } from '@/stores/useAdminStore'

const adminStore = useAdminStore()
const { events, afterworks, articles, useCases, jobOffers } = storeToRefs(adminStore)

const activeJobOffersCount = computed(
  () => jobOffers.value.filter((jobOffer) => jobOffer.isActive).length,
)

const stats = computed(() => [
  { label: 'Événements à venir', value: events.value.length, icon: 'calendar' },
  { label: 'Afterworks', value: afterworks.value.length, icon: 'camera' },
  { label: 'Articles publiés', value: articles.value.length, icon: 'document' },
  { label: "Cas d'usage", value: useCases.value.length, icon: 'folder' },
  { label: 'Offres actives', value: activeJobOffersCount.value, icon: 'briefcase' },
])

const quickActions = [
  { label: 'Créer un événement', to: { name: 'admin-events' }, icon: 'calendar' },
  { label: "Ajouter des photos d'Afterwork", to: { name: 'admin-afterworks' }, icon: 'camera' },
  { label: 'Rédiger un article', to: { name: 'admin-blog' }, icon: 'document' },
  { label: "Nouvelle offre d'emploi", to: { name: 'admin-offres' }, icon: 'briefcase' },
]
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-bold text-white">Dashboard</h1>

    <!-- Vue d'ensemble -->
    <section class="mt-8">
      <h2 class="text-sm font-semibold uppercase tracking-widest text-white/60">
        Vue d'ensemble
      </h2>

      <div class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="rounded-2xl border border-white/10 bg-primary-950 p-6"
        >
          <svg class="size-5 text-accent-500" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              v-if="stat.icon === 'calendar'"
              d="M4 8h12M6 3v2m8-2v2M5 5h10a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              v-else-if="stat.icon === 'camera'"
              d="M4 7h2l1-2h6l1 2h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Zm6 2.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              v-else-if="stat.icon === 'document'"
              d="M6 3h5l3 3v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm5 0v3h3M7 11h6m-6 3h6"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              v-else-if="stat.icon === 'folder'"
              d="M3 6a1 1 0 0 1 1-1h4l2 2h6a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              v-else
              d="M6 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-11 0h14a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <p class="mt-3 font-display text-4xl font-bold text-white">{{ stat.value }}</p>
          <p class="mt-1 text-sm text-white/60">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- Actions rapides -->
    <section class="mt-10">
      <h2 class="text-sm font-semibold uppercase tracking-widest text-white/60">
        Actions rapides
      </h2>

      <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <RouterLink
          v-for="action in quickActions"
          :key="action.label"
          :to="action.to"
          class="flex items-center gap-3 rounded-2xl border border-white/10 bg-primary-800/40 p-5 text-sm font-semibold text-white transition hover:border-accent-500 hover:bg-primary-800/60"
        >
          <svg class="size-5 shrink-0 text-accent-500" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              v-if="action.icon === 'calendar'"
              d="M4 8h12M6 3v2m8-2v2M5 5h10a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              v-else-if="action.icon === 'camera'"
              d="M4 7h2l1-2h6l1 2h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Zm6 2.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              v-else-if="action.icon === 'document'"
              d="M6 3h5l3 3v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm5 0v3h3M7 11h6m-6 3h6"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              v-else
              d="M6 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-11 0h14a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {{ action.label }}
        </RouterLink>
      </div>
    </section>
  </div>
</template>
