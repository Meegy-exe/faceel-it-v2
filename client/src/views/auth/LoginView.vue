<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useWaveCanvas } from '@/composables/useWaveCanvas'

const waveCanvas = ref<HTMLCanvasElement | null>(null)
useWaveCanvas(waveCanvas)

const email = ref('')
const password = ref('')
const showPassword = ref(false)

function handleSubmit() {
  // TODO: brancher l'authentification réelle
}
</script>

<template>
  <section
    data-theme="dark"
    class="relative isolate h-full w-full snap-start snap-always overflow-hidden flex flex-col items-center justify-center px-4 pt-24 lg:pt-28"
  >
    <div class="absolute inset-0 z-0 bg-gradient-to-br from-[#000080] via-[#000066] to-[#000033]">
      <canvas
        ref="waveCanvas"
        class="absolute inset-0 h-full w-full pointer-events-none opacity-80 motion-reduce:hidden"
      />
    </div>

    <div class="relative z-10 w-full max-w-md">
      <div class="mb-8 text-center">
        <p class="text-xs font-bold uppercase tracking-widest text-accent-500">Espace compte</p>
        <h1 class="mt-2 font-display text-3xl font-bold text-white">Connexion</h1>
      </div>

      <form
        class="flex flex-col gap-4 rounded-2xl border border-white/10 bg-primary-950/80 p-8 backdrop-blur-md"
        @submit.prevent="handleSubmit"
      >
        <div class="flex flex-col gap-1">
          <label for="login-email" class="text-xs font-medium text-white">Adresse e-mail</label>
          <input
            id="login-email"
            v-model="email"
            type="email"
            autocomplete="email"
            required
            class="rounded-lg border border-white/20 bg-primary-950/50 px-3 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-accent-500 focus:ring-1 focus:ring-accent-500 focus:outline-none"
            placeholder="vous@exemple.fr"
          />
        </div>

        <div class="flex flex-col gap-1">
          <div class="flex items-center justify-between">
            <label for="login-password" class="text-xs font-medium text-white">Mot de passe</label>
            <a
              href="#"
              class="text-xs text-white/70 transition-colors hover:text-accent-500"
            >Mot de passe oublié ?</a>
          </div>
          <div class="relative">
            <input
              id="login-password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              required
              class="w-full rounded-lg border border-white/20 bg-primary-950/50 px-3 py-2.5 pr-10 text-sm text-white placeholder:text-white/50 focus:border-accent-500 focus:ring-1 focus:ring-accent-500 focus:outline-none"
              placeholder="••••••••"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 flex items-center px-3 text-white/50 transition-colors hover:text-white focus-visible:outline-none"
              :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
              @click="showPassword = !showPassword"
            >
              <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" class="size-4" aria-hidden="true">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.75" />
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" class="size-4" aria-hidden="true">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-6.5 0-10-8-10-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <button
          type="submit"
          class="mt-2 rounded-xl bg-accent-500 px-4 py-3 text-sm font-bold text-primary-900 transition hover:bg-accent-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
        >
          Se connecter
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-white">
        Pas encore inscrit ?
        <RouterLink
          to="/register"
          class="font-semibold text-accent-500 transition hover:text-accent-400"
        >
          Créer un compte
        </RouterLink>
      </p>
    </div>
  </section>
</template>
