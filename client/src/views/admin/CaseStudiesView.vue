<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAdminStore } from '@/stores/useAdminStore'
import type { UseCase } from '@/types/admin'

const adminStore = useAdminStore()
const { useCases } = storeToRefs(adminStore)
const { addUseCase, deleteUseCase } = adminStore

function emptyUseCase(): Omit<UseCase, 'id'> {
  return { clientName: '', description: '' }
}

const newUseCase = ref<Omit<UseCase, 'id'>>(emptyUseCase())

function handleSubmit() {
  addUseCase(newUseCase.value)
  newUseCase.value = emptyUseCase()
}
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-bold text-white">Cas d'usage</h1>

    <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- Formulaire d'ajout -->
      <form
        class="flex flex-col gap-4 rounded-2xl border border-white/10 bg-primary-950 p-6 lg:col-span-1"
        @submit.prevent="handleSubmit"
      >
        <h2 class="text-sm font-semibold uppercase tracking-widest text-white/60">
          Nouveau cas d'usage
        </h2>

        <div class="flex flex-col gap-1">
          <label for="usecase-client" class="text-xs text-white/60">Nom du client</label>
          <input
            id="usecase-client"
            v-model="newUseCase.clientName"
            type="text"
            required
            class="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-accent-500 focus:outline-none"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="usecase-description" class="text-xs text-white/60">Description</label>
          <textarea
            id="usecase-description"
            v-model="newUseCase.description"
            rows="6"
            required
            class="resize-none rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-accent-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          class="mt-2 rounded-xl bg-accent-500 px-4 py-2 text-sm font-semibold text-primary-900 transition hover:bg-accent-400"
        >
          Ajouter le cas d'usage
        </button>
      </form>

      <!-- Liste des cas d'usage -->
      <div class="overflow-hidden rounded-2xl border border-white/10 lg:col-span-2">
        <table class="w-full text-left text-sm">
          <thead class="bg-primary-950 text-white/60">
            <tr>
              <th class="px-4 py-3 font-medium">Client</th>
              <th class="px-4 py-3 font-medium">Description</th>
              <th class="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="useCase in useCases" :key="useCase.id">
              <td class="px-4 py-3 font-medium text-white">{{ useCase.clientName }}</td>
              <td class="max-w-xs truncate px-4 py-3 text-white/70">{{ useCase.description }}</td>
              <td class="px-4 py-3 text-right">
                <button
                  type="button"
                  class="rounded-lg border border-red-500/30 px-3 py-1 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
                  @click="deleteUseCase(useCase.id)"
                >
                  Supprimer
                </button>
              </td>
            </tr>
            <tr v-if="useCases.length === 0">
              <td colspan="3" class="px-4 py-6 text-center text-white/40">Aucun cas d'usage.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
