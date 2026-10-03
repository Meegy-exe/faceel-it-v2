<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import TheFooter from '@/components/layout/TheFooter.vue'
import photoAfterwork from '@/assets/images/photos/afterwork.jpg'

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const phrases = [
  'Retrouvez vos offres sauvegardées.',
  "Suivez l'état de vos candidatures en temps réel.",
  'Reprenez votre conversation avec notre IA.',
]
const phraseIndex = ref(0)
const phraseVisible = ref(true)
let intervalId: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  intervalId = setInterval(() => {
    phraseVisible.value = false
    setTimeout(() => {
      phraseIndex.value = (phraseIndex.value + 1) % phrases.length
      phraseVisible.value = true
    }, 400)
  }, 4000)
})

onBeforeUnmount(() => {
  if (intervalId !== null) clearInterval(intervalId)
})

function handleSubmit() {
  // TODO: brancher l'authentification réelle
}
</script>

<template>
  <!-- CONTENEUR SNAP OPT-IN : isole le scroll magnétique de cette vue sans
       dépendre de la hauteur flexée de <main> (cf. HomeView.vue). -->
  <div class="h-dvh w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory">
  <section
    data-theme="dark"
    class="h-dvh shrink-0 w-full snap-start snap-always flex flex-col lg:flex-row bg-[#000066]"
  >
    <!-- Colonne gauche — branding -->
    <div class="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden">
      <img
        :src="photoAfterwork"
        alt=""
        class="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      />
      <div class="absolute inset-0 bg-[#000066]/85" />

      <div class="relative z-10 flex flex-col items-center gap-10 px-12">
        <!-- Carte glassmorphism -->
        <div class="w-full max-w-lg rounded-2xl border border-white/20 bg-white/10 p-10 backdrop-blur-md">
          <p class="text-xs font-bold uppercase tracking-widest text-[#12D80A]">Espace candidat</p>
          <h2 class="mt-4 font-display text-3xl font-bold text-white">
            Votre espace personnel Faceel-IT
          </h2>

          <div class="mt-6 min-h-[2rem]">
            <Transition name="fade" mode="out-in">
              <p
                :key="phraseIndex"
                class="text-base text-white/80"
              >
                {{ phrases[phraseIndex] }}
              </p>
            </Transition>
          </div>
        </div>

        <!-- Pastille statut -->
        <div class="flex items-center gap-2">
          <span class="relative flex size-2.5">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#12D80A] opacity-75 motion-reduce:animate-none" />
            <span class="relative inline-flex size-2.5 rounded-full bg-[#12D80A]" />
          </span>
          <span class="text-xs text-white/60">Système opérationnel</span>
        </div>
      </div>
    </div>

    <!-- Colonne droite — formulaire -->
    <div class="flex w-full flex-col items-center justify-center px-6 py-16 lg:w-1/2 lg:px-16 pt-24 lg:pt-16">
      <div class="w-full max-w-sm">
        <div class="mb-8">
          <p class="text-xs font-bold uppercase tracking-widest text-[#12D80A]">Espace compte</p>
          <h1 class="mt-2 font-display text-3xl font-bold text-white">Connexion</h1>
        </div>

        <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
          <div class="flex flex-col gap-1.5">
            <label for="login-email" class="text-xs font-medium text-white/80">Adresse e-mail</label>
            <input
              id="login-email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              class="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-[#12D80A] transition"
              placeholder="vous@exemple.fr"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <div class="flex items-center justify-between">
              <label for="login-password" class="text-xs font-medium text-white/80">Mot de passe</label>
              <a href="#" class="text-xs text-white/50 transition-colors hover:text-[#12D80A]">
                Mot de passe oublié ?
              </a>
            </div>
            <div class="relative">
              <input
                id="login-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
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
            class="mt-1 rounded-xl bg-[#12D80A] px-4 py-3 text-sm font-bold text-[#000066] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12D80A]"
          >
            Se connecter
          </button>
        </form>

        <p class="mt-8 text-center text-sm text-white/60">
          Pas encore inscrit ?
          <RouterLink to="/register" class="font-semibold text-[#12D80A] transition hover:brightness-110">
            Créer un compte
          </RouterLink>
        </p>
      </div>
    </div>
  </section>

  <!-- Footer repris dans le flux snap local (cf. HomeView.vue) ; App.vue
       masque son footer global pour cette route pour éviter le doublon. -->
  <section
    data-theme="dark"
    class="h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-end bg-[#000066]"
  >
    <TheFooter />
  </section>
  </div>
  <!-- /conteneur snap -->
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
