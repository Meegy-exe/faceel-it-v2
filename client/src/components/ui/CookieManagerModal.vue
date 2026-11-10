<script setup lang="ts">
import { onUnmounted, watch } from 'vue'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ close: [] }>()

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      // bloque scroll
      document.body.classList.add('overflow-hidden')
    } else {
      // libere scroll
      document.body.classList.remove('overflow-hidden')
    }
  },
)

onUnmounted(() => {
  // libere scroll
  document.body.classList.remove('overflow-hidden')
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        @click.self="emit('close')"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          appear
        >
          <div class="flex w-full max-w-2xl max-h-[90vh] flex-col rounded-2xl bg-white shadow-2xl">
            <!-- Corps scrollable -->
            <div class="flex-1 overflow-y-auto px-6 pt-8 pb-4">
              <div class="mb-6 flex items-start justify-between gap-4">
                <h2 class="font-display text-2xl font-extrabold text-primary-900">
                  Informations sur les cookies
                </h2>
                <button
                  type="button"
                  class="shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Fermer"
                  @click="emit('close')"
                >
                  <svg class="size-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
                    />
                  </svg>
                </button>
              </div>

              <!-- cookies techniques uniquement -->
              <p class="mb-8 text-sm leading-relaxed text-gray-600">
                Dans une démarche de respect de votre vie privée, Faceel-IT n'utilise aucun traceur
                publicitaire ou analytique. Seuls les cookies techniques indispensables au
                fonctionnement du site (choix du profil candidat/entreprise, gestion de
                l'animation, mémorisation de ce message) sont déposés. Ils ne peuvent pas être
                désactivés.
              </p>

              <div class="space-y-4">
                <!-- Catégorie 1 : Strictement nécessaires -->
                <div class="rounded-xl border border-gray-100 bg-gray-50 p-5">
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1">
                      <p class="font-semibold text-primary-900">Strictement nécessaires</p>
                      <p class="mt-1 text-sm text-gray-500">
                        Ces cookies assurent les fonctions essentielles du site (choix de votre
                        profil de navigation Candidat/Entreprise, gestion de l'animation d'accueil
                        et mémorisation de ce message). Ils ne peuvent pas être désactivés.
                      </p>
                    </div>
                    <span
                      class="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                    >
                      Toujours actif
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bouton fixe en bas -->
            <div
              class="shrink-0 rounded-b-2xl border-t border-gray-100 bg-gray-50 px-6 py-5"
            >
              <button
                type="button"
                class="w-full rounded-lg bg-[#000066] py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#000088]"
                @click="emit('close')"
              >
                Fermer
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
