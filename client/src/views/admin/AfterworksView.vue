<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAdminStore } from '@/stores/useAdminStore'
import type { Afterwork } from '@/types/admin'

const adminStore = useAdminStore()
const { afterworks } = storeToRefs(adminStore)
const { addAfterwork, deleteAfterwork } = adminStore

function emptyAfterwork(): Omit<Afterwork, 'id' | 'images'> {
  return { title: '', date: '' }
}

const newAfterwork = ref(emptyAfterwork())
const fileInput = ref<HTMLInputElement | null>(null)
const previews = ref<{ file: File; url: string }[]>([])

function addFiles(fileList: FileList | null) {
  if (!fileList) return
  for (const file of Array.from(fileList)) {
    previews.value.push({ file, url: URL.createObjectURL(file) })
  }
}

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  addFiles(input.files)
  input.value = ''
}

function handleDrop(event: DragEvent) {
  addFiles(event.dataTransfer?.files ?? null)
}

function removePreview(index: number) {
  const [removed] = previews.value.splice(index, 1)
  if (removed) URL.revokeObjectURL(removed.url)
}

function handleSubmit() {
  addAfterwork({
    title: newAfterwork.value.title,
    date: newAfterwork.value.date,
    // Simulation : pas de backend d'upload pour l'instant, on stocke les
    // URLs `blob:` locales générées par `URL.createObjectURL`.
    images: previews.value.map((preview) => preview.url),
  })
  newAfterwork.value = emptyAfterwork()
  previews.value = []
}
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-bold text-white">Afterworks</h1>

    <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- Formulaire d'ajout -->
      <form
        class="flex flex-col gap-4 rounded-2xl border border-white/10 bg-primary-950 p-6 lg:col-span-1"
        @submit.prevent="handleSubmit"
      >
        <h2 class="text-sm font-semibold uppercase tracking-widest text-white/60">
          Nouvel afterwork
        </h2>

        <div class="flex flex-col gap-1">
          <label for="afterwork-title" class="text-xs text-white/60">Titre</label>
          <input
            id="afterwork-title"
            v-model="newAfterwork.title"
            type="text"
            required
            class="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-accent-500 focus:outline-none"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="afterwork-date" class="text-xs text-white/60">Date</label>
          <input
            id="afterwork-date"
            v-model="newAfterwork.date"
            type="date"
            required
            class="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-accent-500 focus:outline-none"
          />
        </div>

        <div class="flex flex-col gap-1">
          <span class="text-xs text-white/60">Photos</span>

          <div
            class="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-white/20 px-4 py-8 text-center transition hover:border-accent-500"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
            <svg class="size-6 text-white/40" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M10 13V4m0 0 3.5 3.5M10 4 6.5 7.5M4 14v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <p class="text-xs text-white/60">
              Glissez vos photos ici, ou
              <span class="cursor-pointer text-accent-500 underline" @click="fileInput?.click()"
                >parcourez</span
              >
            </p>
            <input
              ref="fileInput"
              type="file"
              multiple
              accept="image/*"
              class="hidden"
              @change="handleFileUpload"
            />
          </div>

          <div v-if="previews.length > 0" class="mt-2 grid grid-cols-4 gap-2">
            <div
              v-for="(preview, index) in previews"
              :key="preview.url"
              class="relative aspect-square overflow-hidden rounded-lg"
            >
              <img :src="preview.url" alt="" class="h-full w-full object-cover" />
              <button
                type="button"
                class="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-xs text-white transition hover:bg-red-500"
                aria-label="Retirer la photo"
                @click="removePreview(index)"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          class="mt-2 rounded-xl bg-accent-500 px-4 py-2 text-sm font-semibold text-primary-900 transition hover:bg-accent-400"
        >
          Ajouter l'afterwork
        </button>
      </form>

      <!-- Liste des afterworks -->
      <div class="overflow-hidden rounded-2xl border border-white/10 lg:col-span-2">
        <table class="w-full text-left text-sm">
          <thead class="bg-primary-950 text-white/60">
            <tr>
              <th class="px-4 py-3 font-medium">Titre</th>
              <th class="px-4 py-3 font-medium">Date</th>
              <th class="px-4 py-3 font-medium">Images</th>
              <th class="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="afterwork in afterworks" :key="afterwork.id">
              <td class="px-4 py-3 font-medium text-white">{{ afterwork.title }}</td>
              <td class="px-4 py-3 text-white/70">{{ afterwork.date }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div class="flex -space-x-2">
                    <img
                      v-for="image in afterwork.images.slice(0, 3)"
                      :key="image"
                      :src="image"
                      alt=""
                      class="size-8 rounded-full border-2 border-primary-900 object-cover"
                    />
                  </div>
                  <span class="text-xs text-white/60">{{ afterwork.images.length }} photo(s)</span>
                </div>
              </td>
              <td class="px-4 py-3 text-right">
                <button
                  type="button"
                  class="rounded-lg border border-red-500/30 px-3 py-1 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
                  @click="deleteAfterwork(afterwork.id)"
                >
                  Supprimer
                </button>
              </td>
            </tr>
            <tr v-if="afterworks.length === 0">
              <td colspan="4" class="px-4 py-6 text-center text-white/40">Aucun afterwork.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
