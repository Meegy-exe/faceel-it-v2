<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()
const router = useRouter()

function handleLogin() {
  auth.login()
  router.push({ name: 'admin-dashboard' })
}
</script>

<template>
  <div data-theme="dark" class="flex min-h-dvh items-center justify-center bg-primary-900 px-4">
    <div class="w-full max-w-sm rounded-2xl border border-white/10 bg-primary-950 p-8 text-center">
      <h1 class="font-display text-2xl font-bold text-white">Connexion back-office</h1>
      <p class="mt-2 text-sm text-white/60">
        Authentification simulée - aucun backend d'auth pour l'instant.
      </p>
      <button
        type="button"
        class="mt-6 w-full rounded-xl bg-accent-500 px-4 py-3 text-sm font-semibold text-primary-900 transition hover:bg-accent-400"
        @click="handleLogin"
      >
        Se connecter (simulation)
      </button>
    </div>
  </div>
</template>
