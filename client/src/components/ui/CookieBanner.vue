<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const STORAGE_KEY = 'faceel-cookie-consent'

const visible = ref(false)

onMounted(() => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    visible.value = true
  }
})

function accept() {
  localStorage.setItem(STORAGE_KEY, 'accepted')
  visible.value = false
}

function refuse() {
  localStorage.setItem(STORAGE_KEY, 'refused')
  visible.value = false
}
</script>

<template>
  <Transition
    enter-active-class="transition-transform duration-500 ease-out motion-reduce:transition-none"
    enter-from-class="translate-y-full"
    enter-to-class="translate-y-0"
    leave-active-class="transition-all duration-300 ease-in motion-reduce:transition-none"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <div
      v-if="visible"
      role="region"
      aria-label="Gestion des cookies"
      aria-live="polite"
      class="fixed bottom-0 left-0 z-40 w-full border-t border-primary-900/10 bg-white/95 px-4 py-5 shadow-2xl shadow-black/10 backdrop-blur-xl sm:px-6 lg:px-8"
    >
      <div class="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
        <p class="flex-1 text-sm leading-relaxed text-primary-900/70">
          Nous utilisons des cookies pour améliorer votre expérience. Les cookies strictement
          nécessaires assurent le bon fonctionnement du site. Les autres nécessitent votre accord.
          <RouterLink
            :to="{ name: 'politique-cookies' }"
            class="ml-1 font-medium text-primary-900 underline underline-offset-2 hover:text-[#000066] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-900"
          >
            Gérer mes préférences
          </RouterLink>
        </p>

        <div class="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            class="rounded-xl border border-primary-900/20 px-5 py-2.5 text-sm font-medium text-primary-900/70 transition-colors duration-200 hover:border-primary-900/40 hover:text-primary-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-900 motion-reduce:transition-none"
            @click="refuse"
          >
            Refuser l'essentiel
          </button>
          <button
            type="button"
            class="rounded-xl bg-[#000066] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#000080] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 motion-reduce:transition-none"
            @click="accept"
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
