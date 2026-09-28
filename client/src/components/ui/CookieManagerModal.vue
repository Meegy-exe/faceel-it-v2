<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ close: [] }>()

const analyticsConsent = ref(false)
const marketingConsent = ref(false)

function saveAndClose() {
  emit('close')
}

function acceptAll() {
  analyticsConsent.value = true
  marketingConsent.value = true
  emit('close')
}

function refuseAll() {
  analyticsConsent.value = false
  marketingConsent.value = false
  emit('close')
}
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
                  Je veux choisir
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

              <p class="mb-8 text-sm leading-relaxed text-gray-600">
                Nous utilisons vos données pour améliorer votre expérience sur notre site. Vous
                pouvez accepter ou refuser selon chaque finalité ci-dessous. Certaines données sont
                nécessaires pour assurer la sécurité et le bon fonctionnement du site&nbsp;: elles
                ne peuvent pas être désactivées. Cette exception ne s'applique pas à la publicité
                ciblée.
              </p>

              <div class="space-y-4">
                <!-- Catégorie 1 : Strictement nécessaires -->
                <div class="rounded-xl border border-gray-100 bg-gray-50 p-5">
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1">
                      <p class="font-semibold text-primary-900">Strictement nécessaires</p>
                      <p class="mt-1 text-sm text-gray-500">
                        Ces cookies assurent les fonctions essentielles du site&nbsp;: sécurité,
                        gestion de session et mémorisation de vos préférences cookies. Ils ne
                        peuvent pas être désactivés.
                      </p>
                    </div>
                    <span
                      class="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                    >
                      Toujours actif
                    </span>
                  </div>
                </div>

                <!-- Catégorie 2 : Mesure d'audience -->
                <div class="rounded-xl border border-gray-100 bg-gray-50 p-5">
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1">
                      <p class="font-semibold text-primary-900">Mesure d'audience (Analytique)</p>
                      <p class="mt-1 text-sm text-gray-500">
                        Ces cookies nous permettent de mesurer la fréquentation du site (pages
                        visitées, durée de session) afin d'améliorer son contenu et ses
                        performances. Les données sont agrégées et anonymisées.
                      </p>
                    </div>
                    <!-- Toggle -->
                    <button
                      type="button"
                      role="switch"
                      :aria-checked="analyticsConsent"
                      class="relative mt-0.5 shrink-0 h-6 w-11 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#000066] focus-visible:ring-offset-2"
                      :class="analyticsConsent ? 'bg-[#000066]' : 'bg-gray-300'"
                      @click="analyticsConsent = !analyticsConsent"
                    >
                      <span
                        class="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform duration-200"
                        :class="analyticsConsent ? 'translate-x-5' : 'translate-x-0'"
                      />
                    </button>
                  </div>
                </div>

                <!-- Catégorie 3 : Publicités ciblées -->
                <div class="rounded-xl border border-gray-100 bg-gray-50 p-5">
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1">
                      <p class="font-semibold text-primary-900">Publicités ciblées</p>
                      <p class="mt-1 text-sm text-gray-500">
                        Ces cookies nous permettent de vous proposer des publicités adaptées à vos
                        centres d'intérêt, sur notre site et en dehors. Ils peuvent être déposés par
                        des partenaires tiers.
                      </p>
                    </div>
                    <!-- Toggle -->
                    <button
                      type="button"
                      role="switch"
                      :aria-checked="marketingConsent"
                      class="relative mt-0.5 shrink-0 h-6 w-11 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#000066] focus-visible:ring-offset-2"
                      :class="marketingConsent ? 'bg-[#000066]' : 'bg-gray-300'"
                      @click="marketingConsent = !marketingConsent"
                    >
                      <span
                        class="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform duration-200"
                        :class="marketingConsent ? 'translate-x-5' : 'translate-x-0'"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Boutons fixes en bas -->
            <div
              class="shrink-0 space-y-3 rounded-b-2xl border-t border-gray-100 bg-gray-50 px-6 py-5"
            >
              <button
                type="button"
                class="w-full rounded-lg bg-[#000066] py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#000088]"
                @click="saveAndClose"
              >
                Je valide mon choix
              </button>
              <button
                type="button"
                class="w-full rounded-lg border border-[#000066] py-3 text-sm font-semibold text-[#000066] transition-colors duration-200 hover:bg-[#000066]/5"
                @click="acceptAll"
              >
                Oui, j'accepte tout
              </button>
              <button
                type="button"
                class="w-full rounded-lg border border-gray-300 py-3 text-sm font-semibold text-gray-600 transition-colors duration-200 hover:bg-gray-100"
                @click="refuseAll"
              >
                Non, je préfère refuser
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
