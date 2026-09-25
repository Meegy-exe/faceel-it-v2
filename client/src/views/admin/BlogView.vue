<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAdminStore } from '@/stores/useAdminStore'
import type { Article } from '@/types/admin'

const adminStore = useAdminStore()
const { articles } = storeToRefs(adminStore)
const { addArticle, deleteArticle } = adminStore

function emptyArticle(): Omit<Article, 'id'> {
  return { title: '', content: '', date: '' }
}

const newArticle = ref<Omit<Article, 'id'>>(emptyArticle())

function handleSubmit() {
  addArticle(newArticle.value)
  newArticle.value = emptyArticle()
}
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-bold text-white">Blog</h1>

    <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- Formulaire d'ajout -->
      <form
        class="flex flex-col gap-4 rounded-2xl border border-white/10 bg-primary-950 p-6 lg:col-span-1"
        @submit.prevent="handleSubmit"
      >
        <h2 class="text-sm font-semibold uppercase tracking-widest text-white/60">
          Nouvel article
        </h2>

        <div class="flex flex-col gap-1">
          <label for="article-title" class="text-xs text-white/60">Titre</label>
          <input
            id="article-title"
            v-model="newArticle.title"
            type="text"
            required
            class="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-accent-500 focus:outline-none"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="article-date" class="text-xs text-white/60">Date</label>
          <input
            id="article-date"
            v-model="newArticle.date"
            type="date"
            required
            class="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-accent-500 focus:outline-none"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="article-content" class="text-xs text-white/60">Contenu</label>
          <textarea
            id="article-content"
            v-model="newArticle.content"
            rows="6"
            required
            class="resize-none rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-accent-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          class="mt-2 rounded-xl bg-accent-500 px-4 py-2 text-sm font-semibold text-primary-900 transition hover:bg-accent-400"
        >
          Ajouter l'article
        </button>
      </form>

      <!-- Liste des articles -->
      <div class="overflow-hidden rounded-2xl border border-white/10 lg:col-span-2">
        <table class="w-full text-left text-sm">
          <thead class="bg-primary-950 text-white/60">
            <tr>
              <th class="px-4 py-3 font-medium">Titre</th>
              <th class="px-4 py-3 font-medium">Date</th>
              <th class="px-4 py-3 font-medium">Contenu</th>
              <th class="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="article in articles" :key="article.id">
              <td class="px-4 py-3 font-medium text-white">{{ article.title }}</td>
              <td class="px-4 py-3 text-white/70">{{ article.date }}</td>
              <td class="max-w-xs truncate px-4 py-3 text-white/70">{{ article.content }}</td>
              <td class="px-4 py-3 text-right">
                <button
                  type="button"
                  class="rounded-lg border border-red-500/30 px-3 py-1 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
                  @click="deleteArticle(article.id)"
                >
                  Supprimer
                </button>
              </td>
            </tr>
            <tr v-if="articles.length === 0">
              <td colspan="4" class="px-4 py-6 text-center text-white/40">Aucun article.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
