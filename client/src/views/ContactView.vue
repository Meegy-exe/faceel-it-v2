<script setup lang="ts">
import { ref } from 'vue'
import contactHeroImg from '@/assets/images/photos/lille.jpg'

const form = ref({
  nom: '',
  prenom: '',
  societe: '',
  email: '',
  telephone: '',
  sujet: '',
  message: '',
  rgpd: false,
})
const submitted = ref(false)
const searchQuery = ref('')

function handleSubmit() {
  submitted.value = true
}
</script>

<template>
  <div>
    <!-- ══════════════════════════════════════════════
         SECTION 1 : HERO SPLIT VERTICAL (Photo / Contenu)
         ══════════════════════════════════════════════ -->
    <section data-theme="dark" class="w-full flex flex-col">

      <!-- Moitié haute : photo nette, sans texte -->
      <div
        class="w-full min-h-[45vh] bg-cover bg-center"
        :style="{ backgroundImage: `url(${contactHeroImg})` }"
        aria-hidden="true"
      />

      <!-- Moitié basse : fond bleu + titre + FAQ -->
      <div class="w-full bg-[#000066] flex flex-col items-center justify-center gap-6 px-4 py-16 md:py-20">
        <!-- Titre -->
        <div class="text-center">
          <h1 class="font-display text-4xl font-bold text-white md:text-5xl">
            Contactez-nous
          </h1>
          <p class="mt-2 text-base text-white/70">
            Notre équipe vous répond sous 48h ouvrées.
          </p>
        </div>

        <!-- Zone FAQ -->
        <div class="w-full max-w-2xl rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6">
          <p class="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4 text-center">
            Une question rapide&nbsp;?
          </p>
          <div class="flex items-center gap-3">
            <div class="relative flex-1">
              <svg
                class="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clip-rule="evenodd" />
              </svg>
              <input
                v-model="searchQuery"
                type="search"
                placeholder="Rechercher une question…"
                class="w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-11 text-sm text-gray-900 placeholder-gray-500 outline-none transition-shadow focus:border-transparent focus:ring-2 focus:ring-white"
              />
            </div>
            <a
              href="#"
              class="shrink-0 rounded-xl bg-[#12D80A] px-5 py-3 text-sm font-semibold text-[#000066] transition-colors hover:bg-[#0fc009]"
            >
              Voir la FAQ
            </a>
          </div>
        </div>

        <!-- Flèche scroll-down -->
        <div class="motion-reduce:hidden">
          <svg class="w-5 h-5 text-white/40 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         SECTION 3 : FORMULAIRE & ENCART LINKEDIN
         ══════════════════════════════════════════════ -->
    <section class="bg-white py-16">
      <div class="mx-auto max-w-6xl px-4">
        <div class="grid grid-cols-1 gap-12 md:grid-cols-3">
          <!-- Formulaire (col-span-2) -->
          <div class="md:col-span-2">
            <h2 class="font-display text-3xl font-extrabold tracking-tight text-primary-900">
              Écrivez-nous
            </h2>
            <p class="mt-2 text-sm text-primary-900/50">Nous vous répondrons sous 48h ouvrées.</p>

            <div
              v-if="submitted"
              class="mt-8 rounded-xl border border-green-200 bg-green-50 p-6 text-green-800"
            >
              <p class="font-semibold">Message envoyé avec succès&nbsp;!</p>
              <p class="mt-1 text-sm">Notre équipe vous contactera très prochainement.</p>
            </div>

            <form v-else class="mt-8 space-y-5" @submit.prevent="handleSubmit">
              <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label for="prenom" class="block text-sm font-medium text-primary-900"
                    >Prénom *</label
                  >
                  <input
                    id="prenom"
                    v-model="form.prenom"
                    type="text"
                    required
                    autocomplete="given-name"
                    class="mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-primary-900 outline-none transition-colors focus:border-[#000066] focus:ring-1 focus:ring-[#000066]"
                  />
                </div>
                <div>
                  <label for="nom" class="block text-sm font-medium text-primary-900">Nom *</label>
                  <input
                    id="nom"
                    v-model="form.nom"
                    type="text"
                    required
                    autocomplete="family-name"
                    class="mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-primary-900 outline-none transition-colors focus:border-[#000066] focus:ring-1 focus:ring-[#000066]"
                  />
                </div>
              </div>
              <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label for="societe" class="block text-sm font-medium text-primary-900"
                    >Société *</label
                  >
                  <input
                    id="societe"
                    v-model="form.societe"
                    type="text"
                    required
                    autocomplete="organization"
                    class="mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-primary-900 outline-none transition-colors focus:border-[#000066] focus:ring-1 focus:ring-[#000066]"
                  />
                </div>
                <div>
                  <label for="telephone" class="block text-sm font-medium text-primary-900"
                    >Téléphone</label
                  >
                  <input
                    id="telephone"
                    v-model="form.telephone"
                    type="tel"
                    autocomplete="tel"
                    class="mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-primary-900 outline-none transition-colors focus:border-[#000066] focus:ring-1 focus:ring-[#000066]"
                  />
                </div>
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-primary-900"
                  >Email professionnel *</label
                >
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  autocomplete="email"
                  class="mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-primary-900 outline-none transition-colors focus:border-[#000066] focus:ring-1 focus:ring-[#000066]"
                />
              </div>
              <div>
                <label for="sujet" class="block text-sm font-medium text-primary-900"
                  >Sujet *</label
                >
                <select
                  id="sujet"
                  v-model="form.sujet"
                  required
                  class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-primary-900 outline-none transition-colors focus:border-[#000066] focus:ring-1 focus:ring-[#000066]"
                >
                  <option value="" disabled>Choisissez un sujet</option>
                  <option value="projet">Un projet Data / IA / Digital</option>
                  <option value="candidature">Une candidature</option>
                  <option value="partenariat">Un partenariat</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label for="message" class="block text-sm font-medium text-primary-900"
                  >Message *</label
                >
                <textarea
                  id="message"
                  v-model="form.message"
                  required
                  rows="5"
                  class="mt-1.5 w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-primary-900 outline-none transition-colors focus:border-[#000066] focus:ring-1 focus:ring-[#000066]"
                />
              </div>
              <div class="flex items-start gap-3">
                <input
                  id="rgpd"
                  v-model="form.rgpd"
                  type="checkbox"
                  required
                  class="mt-0.5 size-4 shrink-0 rounded border-gray-300 text-[#000066] accent-[#000066]"
                />
                <label for="rgpd" class="text-sm text-primary-900/70">
                  J'accepte que mes données soient traitées par Faceel-IT pour répondre à ma
                  demande, conformément à la
                  <RouterLink
                    to="/politique-confidentialite"
                    class="text-[#000066] underline underline-offset-2 hover:opacity-80"
                  >
                    politique de confidentialité </RouterLink
                  >.
                </label>
              </div>
              <!-- Upload CV (optionnel) -->
              <div>
                <p class="block text-sm font-medium text-primary-900 mb-1.5">CV (Optionnel)</p>
                <label
                  for="cvContact"
                  class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-6 py-6 text-center transition-colors hover:border-gray-400"
                >
                  <svg class="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <span class="text-sm text-gray-500">
                    Glissez votre CV ici ou
                    <span class="font-semibold text-[#000066]">parcourir</span>
                  </span>
                  <span class="text-xs text-gray-400">Format PDF uniquement</span>
                  <input id="cvContact" type="file" accept=".pdf" class="sr-only" />
                </label>
              </div>

              <button
                type="submit"
                class="rounded-lg bg-[#000066] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#000088]"
              >
                Envoyer le message
              </button>
            </form>
          </div>

          <!-- Encart LinkedIn (col-span-1) -->
          <div class="flex flex-col gap-6">
            <div class="rounded-xl bg-blue-50 p-8">
              <div
                class="flex size-12 items-center justify-center rounded-xl bg-[#0A66C2] text-white"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" class="size-6">
                  <path
                    d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.3-.02-3-1.83-3-1.83 0-2.1 1.43-2.1 2.9V21h-4V9Z"
                  />
                </svg>
              </div>
              <h3 class="mt-5 font-display text-xl font-bold text-primary-900">
                Retrouvez-nous sur LinkedIn
              </h3>
              <p class="mt-3 text-sm leading-relaxed text-primary-900/70">
                Notre équipe est très réactive sur LinkedIn. Offres d'emploi, actualités, événements
                et coulisses de l'agence — suivez-nous pour ne rien manquer.
              </p>
              <a
                href="https://www.linkedin.com/company/faceel-it/"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0A66C2] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" class="size-4">
                  <path
                    d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.3-.02-3-1.83-3-1.83 0-2.1 1.43-2.1 2.9V21h-4V9Z"
                  />
                </svg>
                Suivre Faceel-IT
              </a>
            </div>

            <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p class="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Réponse garantie
              </p>
              <p class="mt-2 text-3xl font-extrabold text-primary-900">48h</p>
              <p class="mt-1 text-sm text-primary-900/60">ouvrées maximum après réception</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         SECTION 4 : COORDONNÉES DE CONTACT
         ══════════════════════════════════════════════ -->
    <section data-theme="dark" class="w-full bg-[#000066] text-white py-12 md:py-20">
      <div class="mx-auto max-w-7xl px-4">
        <h2 class="text-center font-display text-3xl font-bold text-white mb-10">
          Besoin d'un contact&nbsp;?
        </h2>
        <div class="grid grid-cols-1 gap-8 text-center md:grid-cols-2 md:max-w-2xl md:mx-auto">
          <!-- Email -->
          <div class="flex flex-col items-center gap-3">
            <div class="flex size-12 items-center justify-center rounded-full bg-white/10">
              <svg class="size-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
                <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
              </svg>
            </div>
            <p class="text-xs font-semibold uppercase tracking-widest text-blue-300">Email</p>
            <a href="mailto:contact@faceel-it.com" class="text-lg font-semibold text-white transition-opacity hover:opacity-75">
              contact@faceel-it.com
            </a>
          </div>
          <!-- Adresse -->
          <div class="flex flex-col items-center gap-3">
            <div class="flex size-12 items-center justify-center rounded-full bg-white/10">
              <svg class="size-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 15.01 17 12.462 17 9A7 7 0 1 0 3 9c0 3.462 1.698 6.01 3.354 7.584a13.731 13.731 0 0 0 2.75 1.908l.002.001.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clip-rule="evenodd" />
              </svg>
            </div>
            <p class="text-xs font-semibold uppercase tracking-widest text-blue-300">Adresse</p>
            <p class="text-lg font-semibold text-white leading-snug">
              10 allée du Château Blanc<br />59290 Wasquehal
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         SECTION 5 : AVIS GOOGLE
         ══════════════════════════════════════════════ -->
    <section class="bg-[#000066] py-16 text-white">
      <div class="mx-auto flex max-w-3xl flex-col items-center px-4 text-center">
        <p class="text-sm font-semibold uppercase tracking-widest text-yellow-300">Avis clients</p>
        <h2 class="mt-4 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
          Votre avis compte pour nous
        </h2>
        <p class="mt-4 max-w-xl text-base leading-relaxed text-white/70">
          Vos retours nous aident à progresser et permettent à d'autres entreprises et candidats de
          mieux nous connaître.
        </p>

        <!-- Note Google stylisée -->
        <div class="mt-10 flex flex-col items-center gap-2">
          <p class="text-lg font-semibold">
            <span class="text-[#4285F4]">G</span><span class="text-[#EA4335]">o</span
            ><span class="text-[#FBBC05]">o</span><span class="text-[#4285F4]">g</span
            ><span class="text-[#34A853]">l</span><span class="text-[#EA4335]">e</span>
          </p>
          <div class="flex gap-1 text-yellow-400" aria-label="5 étoiles sur 5">
            <svg v-for="i in 5" :key="i" class="size-8" viewBox="0 0 20 20" fill="currentColor">
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z"
              />
            </svg>
          </div>
          <p class="text-5xl font-extrabold">5 / 5</p>
        </div>

        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-10 inline-flex items-center gap-2 rounded-xl border-2 border-white px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#000066]"
        >
          Laissez-nous un avis sur Google
          <svg class="size-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z"
              clip-rule="evenodd"
            />
          </svg>
        </a>
      </div>
    </section>
  </div>
</template>
