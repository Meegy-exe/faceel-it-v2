<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import photoLille from '@/assets/images/photos/lille.jpg'

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

function handleSubmit() {
  // TODO: brancher l'inscription réelle
}
</script>

<template>
  <section
    data-theme="dark"
    class="h-full w-full snap-start snap-always flex flex-col lg:flex-row bg-[#000066]"
  >
    <!-- Colonne gauche — réassurance -->
    <div class="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden">
      <img
        :src="photoLille"
        alt=""
        class="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      />
      <div class="absolute inset-0 bg-[#000066]/85" />

      <div class="relative z-10 flex flex-col items-center gap-6 px-12 w-full max-w-lg">
        <!-- Carte glassmorphism -->
        <div class="w-full rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md">
          <!-- Social proof -->
          <div class="flex items-center gap-3 mb-6">
            <div class="flex -space-x-2" aria-hidden="true">
              <div class="size-8 rounded-full border-2 border-white/20 bg-[#000066]" />
              <div class="size-8 rounded-full border-2 border-white/20 bg-[#000080]" />
              <div class="size-8 rounded-full border-2 border-white/20 bg-[#0000aa]" />
            </div>
            <p class="text-sm text-white/80">Rejoignez les talents tech de la région lilloise.</p>
          </div>

          <!-- Avantages -->
          <ul class="flex flex-col gap-3">
            <li class="flex items-center gap-3">
              <span class="text-lg" aria-hidden="true">💖</span>
              <span class="text-sm text-white/80">Vos offres en favoris</span>
            </li>
            <li class="flex items-center gap-3">
              <span class="text-lg" aria-hidden="true">📩</span>
              <span class="text-sm text-white/80">Newsletter personnalisée</span>
            </li>
            <li class="flex items-center gap-3">
              <span class="text-lg" aria-hidden="true">💬</span>
              <span class="text-sm text-white/80">Messagerie directe</span>
            </li>
          </ul>
        </div>

        <!-- Mini-carte café -->
        <div
          class="w-full rounded-xl border border-[#12D80A]/30 bg-white/5 p-5 backdrop-blur-md transition-all duration-300 hover:border-[#12D80A] hover:bg-white/10"
        >
          <div class="flex items-center gap-3">
            <span class="text-2xl" aria-hidden="true">☕</span>
            <p class="text-sm text-white/70">
              Demandez à boire un café à l'agence !
              <span class="text-white/40">:)</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Colonne droite — formulaire -->
    <div
      class="flex w-full flex-col items-center justify-center px-6 py-16 lg:w-1/2 lg:px-16 pt-24 lg:pt-16 overflow-y-auto"
    >
      <div class="w-full max-w-sm">
        <div class="mb-6">
          <p class="text-xs text-white/40">Étape 1/1 : Vos informations de base</p>
          <p class="mt-3 text-xs font-bold uppercase tracking-widest text-[#12D80A]">
            Espace compte
          </p>
          <h1 class="mt-2 font-display text-3xl font-bold text-white">Créer un compte</h1>
        </div>

        <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
          <!-- Prénom + Nom sur la même ligne -->
          <div class="flex gap-3">
            <div class="flex flex-1 flex-col gap-1.5">
              <label for="register-firstname" class="text-xs font-medium text-white/80"
                >Prénom</label
              >
              <input
                id="register-firstname"
                v-model="firstName"
                type="text"
                autocomplete="given-name"
                required
                class="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-[#12D80A] transition"
                placeholder="Marie"
              />
            </div>
            <div class="flex flex-1 flex-col gap-1.5">
              <label for="register-lastname" class="text-xs font-medium text-white/80">Nom</label>
              <input
                id="register-lastname"
                v-model="lastName"
                type="text"
                autocomplete="family-name"
                required
                class="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-[#12D80A] transition"
                placeholder="Dupont"
              />
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="register-email" class="text-xs font-medium text-white/80"
              >Adresse e-mail</label
            >
            <input
              id="register-email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              class="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-[#12D80A] transition"
              placeholder="vous@exemple.fr"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="register-password" class="text-xs font-medium text-white/80"
              >Mot de passe</label
            >
            <div class="relative">
              <input
                id="register-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                required
                class="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 pr-11 text-sm text-white placeholder:text-white/30 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-[#12D80A] transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 flex items-center px-3.5 text-white/40 transition-colors hover:text-white focus-visible:outline-none"
                :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                @click="showPassword = !showPassword"
              >
                <svg
                  v-if="!showPassword"
                  viewBox="0 0 24 24"
                  fill="none"
                  class="size-4"
                  aria-hidden="true"
                >
                  <path
                    d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
                    stroke="currentColor"
                    stroke-width="1.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.75" />
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" class="size-4" aria-hidden="true">
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-6.5 0-10-8-10-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                    stroke="currentColor"
                    stroke-width="1.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <line
                    x1="1"
                    y1="1"
                    x2="23"
                    y2="23"
                    stroke="currentColor"
                    stroke-width="1.75"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="register-password-confirm" class="text-xs font-medium text-white/80">
              Confirmer le mot de passe
            </label>
            <div class="relative">
              <input
                id="register-password-confirm"
                v-model="passwordConfirm"
                :type="showConfirmPassword ? 'text' : 'password'"
                autocomplete="new-password"
                required
                class="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 pr-11 text-sm text-white placeholder:text-white/30 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-[#12D80A] transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 flex items-center px-3.5 text-white/40 transition-colors hover:text-white focus-visible:outline-none"
                :aria-label="
                  showConfirmPassword ? 'Masquer la confirmation' : 'Afficher la confirmation'
                "
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <svg
                  v-if="!showConfirmPassword"
                  viewBox="0 0 24 24"
                  fill="none"
                  class="size-4"
                  aria-hidden="true"
                >
                  <path
                    d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
                    stroke="currentColor"
                    stroke-width="1.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.75" />
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" class="size-4" aria-hidden="true">
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-6.5 0-10-8-10-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                    stroke="currentColor"
                    stroke-width="1.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <line
                    x1="1"
                    y1="1"
                    x2="23"
                    y2="23"
                    stroke="currentColor"
                    stroke-width="1.75"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <button
            type="submit"
            class="mt-1 rounded-xl bg-[#12D80A] px-4 py-3 text-sm font-bold text-[#000066] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12D80A]"
          >
            Créer mon compte
          </button>
        </form>

        <p class="mt-8 text-center text-sm text-white/60">
          Déjà un compte ?
          <RouterLink
            to="/login"
            class="font-semibold text-[#12D80A] transition hover:brightness-110"
          >
            Se connecter
          </RouterLink>
        </p>
      </div>
    </div>
  </section>
</template>
