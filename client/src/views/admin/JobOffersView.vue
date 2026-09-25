<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAdminStore } from '@/stores/useAdminStore'
import type { JobOffer } from '@/types/admin'

const adminStore = useAdminStore()
const { jobOffers } = storeToRefs(adminStore)
const { addJobOffer, deleteJobOffer } = adminStore

function emptyJobOffer(): Omit<JobOffer, 'id'> {
  return { title: '', description: '', isActive: true }
}

const newJobOffer = ref<Omit<JobOffer, 'id'>>(emptyJobOffer())

function handleSubmit() {
  addJobOffer(newJobOffer.value)
  newJobOffer.value = emptyJobOffer()
}
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-bold text-white">Offres d'emploi</h1>

    <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- Formulaire d'ajout -->
      <form
        class="flex flex-col gap-4 rounded-2xl border border-white/10 bg-primary-950 p-6 lg:col-span-1"
        @submit.prevent="handleSubmit"
      >
        <h2 class="text-sm font-semibold uppercase tracking-widest text-white/60">
          Nouvelle offre
        </h2>

        <div class="flex flex-col gap-1">
          <label for="offer-title" class="text-xs text-white/60">Titre du poste</label>
          <input
            id="offer-title"
            v-model="newJobOffer.title"
            type="text"
            required
            class="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-accent-500 focus:outline-none"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="offer-description" class="text-xs text-white/60">Description</label>
          <textarea
            id="offer-description"
            v-model="newJobOffer.description"
            rows="6"
            required
            class="resize-none rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-accent-500 focus:outline-none"
          />
        </div>

        <label class="flex items-center gap-2 text-sm text-white/70">
          <input
            v-model="newJobOffer.isActive"
            type="checkbox"
            class="size-4 rounded border-white/20 bg-white/5 text-accent-500 focus:ring-accent-500"
          />
          Offre active
        </label>

        <button
          type="submit"
          class="mt-2 rounded-xl bg-accent-500 px-4 py-2 text-sm font-semibold text-primary-900 transition hover:bg-accent-400"
        >
          Ajouter l'offre
        </button>
      </form>

      <!-- Liste des offres -->
      <div class="overflow-hidden rounded-2xl border border-white/10 lg:col-span-2">
        <table class="w-full text-left text-sm">
          <thead class="bg-primary-950 text-white/60">
            <tr>
              <th class="px-4 py-3 font-medium">Titre</th>
              <th class="px-4 py-3 font-medium">Description</th>
              <th class="px-4 py-3 font-medium">Statut</th>
              <th class="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="jobOffer in jobOffers" :key="jobOffer.id">
              <td class="px-4 py-3 font-medium text-white">{{ jobOffer.title }}</td>
              <td class="max-w-xs truncate px-4 py-3 text-white/70">{{ jobOffer.description }}</td>
              <td class="px-4 py-3">
                <span
                  class="rounded-full px-2 py-1 text-xs font-semibold"
                  :class="
                    jobOffer.isActive
                      ? 'bg-accent-500/10 text-accent-500'
                      : 'bg-white/10 text-white/50'
                  "
                >
                  {{ jobOffer.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <button
                  type="button"
                  class="rounded-lg border border-red-500/30 px-3 py-1 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
                  @click="deleteJobOffer(jobOffer.id)"
                >
                  Supprimer
                </button>
              </td>
            </tr>
            <tr v-if="jobOffers.length === 0">
              <td colspan="4" class="px-4 py-6 text-center text-white/40">Aucune offre.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
