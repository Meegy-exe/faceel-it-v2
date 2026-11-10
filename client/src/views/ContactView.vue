<script setup lang="ts">
import { ref } from 'vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import { useSeo } from '@/composables/useSeo'
import contactHeroImg from '@/assets/images/photos/lille.jpg'

// seo local contact
useSeo({
  title: 'Contact',
  description:
    'Contactez Faceel-IT, ESN à Wasquehal : un projet IT, Data, IA ou développement web dans la ' +
    'métropole lilloise et les Hauts-de-France ? Échangeons.',
})

const form = ref({
  nom: '',
  prenom: '',
  societe: '',
  email: '',
  telephone: '',
  sujet: 'projet',
  message: '',
  rgpd: false,
})
const submitted = ref(false)

function handleSubmit() {
  submitted.value = true
}
</script>

<template>
  <div
    class="h-screen w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth"
  >
    <!-- ══════════════════════════════════════════════
         SECTION 1 : HERO IMMERSIF (image + overlay + grille 2 colonnes)
         ══════════════════════════════════════════════ -->
    <section
      data-theme="dark"
      class="relative min-h-screen w-full snap-start snap-always flex items-center justify-center bg-cover bg-center"
      :style="{ backgroundImage: `url(${contactHeroImg})` }"
    >
      <div
        aria-hidden="true"
        class="absolute inset-0 bg-primary-950/80 bg-gradient-to-b from-primary-950/60 to-primary-950"
      />

      <div
        class="relative z-10 mx-auto w-full max-w-7xl grid grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8"
      >
        <!-- Colonne gauche : textes -->
        <div>
          <p class="mb-2 font-bold uppercase tracking-wider text-accent-500">Contactez-nous</p>
          <h1 class="mb-6 text-5xl font-extrabold leading-tight text-white lg:text-6xl">
            Vous êtes une entreprise et vous avez un projet IT dans les Hauts-de-France ?
          </h1>
          <p class="text-xl text-white/80">
            Contactez-nous via le formulaire ci-dessous ou échangez avec notre chatBot.
          </p>
        </div>

        <!-- Colonne droite : carte Chatbot -->
        <div
          class="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-primary-900/60 p-8 text-center shadow-2xl backdrop-blur-md"
        >
          <h3 class="mb-6 text-2xl font-bold text-white">Une question ?</h3>
          <RouterLink
            to="/chat"
            class="rounded-full bg-accent-500 px-6 py-3 font-bold text-primary-950 transition hover:bg-accent-400"
          >
            Demandez à notre chatbot
          </RouterLink>
        </div>
      </div>

      <!-- Flèche scroll-down -->
      <div class="absolute inset-x-0 bottom-8 flex justify-center motion-reduce:hidden">
        <svg
          class="w-5 h-5 text-white/40 animate-bounce"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         SECTION 2 : FORMULAIRE & ENCART LINKEDIN
         fusion form desktop : un seul form standard, un seul bloc desktop.
         mobile scroll imbrique : simule la scission via un conteneur interne.
         ══════════════════════════════════════════════ -->
    <section
      data-theme="light"
      class="block h-dvh w-full p-0 overflow-hidden bg-white snap-start snap-always md:relative md:min-h-screen md:w-full md:flex md:items-center md:justify-center md:py-20"
    >
      <div
        class="h-dvh w-full overflow-y-auto snap-y snap-mandatory md:h-auto md:overflow-visible md:snap-none md:mx-auto md:max-w-6xl md:grid md:grid-cols-3 md:gap-12"
      >
        <!-- form display contents : le form s'efface sur mobile, ses
             enfants directs deviennent les cibles du snap-y parent -->
        <form
          class="contents md:block md:col-span-2"
          @submit.prevent="handleSubmit"
        >
          <!-- form split 1 -->
          <div
            class="h-dvh w-full shrink-0 snap-start flex flex-col justify-center px-4 pt-24 md:h-auto md:shrink md:snap-none md:p-0 md:block"
          >
            <h2 class="font-display text-3xl font-extrabold tracking-tight text-primary-900">
              Écrivez-nous
            </h2>
            <!-- fix contrast -->
            <p class="mt-2 text-sm text-primary-900/70">
              Notre équipe étudiera votre demande et reviendra vers vous dans les plus brefs
              délais.
            </p>

            <div
              v-if="submitted"
              class="mt-8 rounded-xl border border-green-200 bg-green-50 p-6 text-green-800"
            >
              <p class="font-semibold">Message envoyé avec succès&nbsp;!</p>
              <p class="mt-1 text-sm">Notre équipe vous contactera très prochainement.</p>
            </div>

            <div v-else class="mt-8 space-y-5">
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
                  <label for="nom" class="block text-sm font-medium text-primary-900"
                    >Nom *</label
                  >
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
            </div>
          </div>

          <!-- form split 2 -->
          <div
            v-if="!submitted"
            class="h-dvh w-full shrink-0 snap-start flex flex-col justify-center px-4 pt-24 md:h-auto md:shrink md:snap-none md:p-0 md:block md:mt-5"
          >
            <div class="space-y-5">
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
                  <option value="projet">J'ai un projet à vous proposer</option>
                  <option value="expertise">J'ai un besoin d'expertise Tech &amp; Data</option>
                  <option value="partenariat">Je souhaite discuter d'un partenariat</option>
                  <option value="autre">Autre demande professionnelle</option>
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
              <button
                type="submit"
                class="rounded-lg bg-[#000066] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#000088]"
              >
                Envoyer le message
              </button>
            </div>
          </div>
        </form>

        <!-- bloc linkedin -->
        <div
          class="h-dvh w-full shrink-0 snap-start flex flex-col justify-center pt-24 px-4 md:h-auto md:shrink md:snap-none md:pt-0 md:px-0 md:col-span-1"
        >
          <div class="rounded-xl bg-blue-50 p-8">
            <div class="flex size-12 items-center justify-center rounded-xl bg-[#0A66C2] text-white">
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
              et coulisses de l'agence - suivez-nous pour ne rien manquer.
            </p>
            <a
              href="https://www.linkedin.com/company/faceel-it/"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0A66C2] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" class="size-4">
                <path
                  d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.3-.02-3-1.83-3-1.83 0-2.1 1.43-2.1 2.9V21h-4V9Z"
                />
              </svg>
              Suivre Faceel-IT
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         SECTION 4 : CONTACT & AVIS CLIENTS (fusionnées)
         mobile snap only : une seule section, reset desktop layout
         restaure la grille d'origine a partir de md.
         ══════════════════════════════════════════════ -->
    <section
      data-theme="dark"
      class="block h-dvh w-full p-0 overflow-hidden bg-primary-950 snap-start snap-always md:relative md:min-h-screen md:w-full md:flex md:items-center md:justify-center md:px-4 md:py-20"
    >
      <!-- scroll snap imbrique sur mobile seulement : le conteneur devient
           lui meme un mini conteneur snap-y pour que les deux colonnes
           deviennent chacune un arret plein ecran, sans toucher au
           decoupage en <section> (qui casserait la grille desktop). a
           partir de md, retour au flux normal flex/grid, sans scroll ni
           snap propre a ce conteneur. -->
      <div
        class="h-dvh w-full overflow-y-auto snap-y snap-mandatory divide-y-0 md:h-auto md:overflow-visible md:mx-auto md:w-full md:max-w-7xl md:grid md:grid-cols-2 md:gap-8 md:items-center md:divide-x md:divide-y-0 md:divide-white/10"
      >
        <!-- infos contact -->
        <div
          class="h-dvh w-full shrink-0 snap-start flex flex-col items-center justify-center text-center px-4 pt-24 md:h-auto md:shrink md:snap-none md:pt-0 md:flex md:flex-col md:items-center"
        >
          <h2 class="font-display text-3xl font-bold text-white mb-10">
            Besoin d'un contact&nbsp;?
          </h2>
          <div class="grid grid-cols-1 gap-8 text-center sm:grid-cols-2">
            <!-- Email -->
            <div class="flex flex-col items-center gap-3">
              <div class="flex size-12 items-center justify-center rounded-full bg-white/10">
                <svg
                  class="size-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z"
                  />
                  <path
                    d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z"
                  />
                </svg>
              </div>
              <p class="text-xs font-semibold uppercase tracking-widest text-blue-300">Email</p>
              <a
                href="mailto:contact@faceel-it.com"
                class="text-lg font-semibold text-white transition-opacity hover:opacity-75"
              >
                contact@faceel-it.com
              </a>
            </div>
            <!-- Adresse -->
            <div class="flex flex-col items-center gap-3">
              <div class="flex size-12 items-center justify-center rounded-full bg-white/10">
                <svg
                  class="size-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 15.01 17 12.462 17 9A7 7 0 1 0 3 9c0 3.462 1.698 6.01 3.354 7.584a13.731 13.731 0 0 0 2.75 1.908l.002.001.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <p class="text-xs font-semibold uppercase tracking-widest text-blue-300">Adresse</p>
              <p class="text-lg font-semibold text-white leading-snug">
                10 allée du Château Blanc<br />59290 Wasquehal
              </p>
            </div>
          </div>
        </div>

        <!-- section avis -->
        <div
          class="h-dvh w-full shrink-0 snap-start flex flex-col items-center justify-center text-center px-4 pt-24 md:h-auto md:shrink md:snap-none md:pt-0 md:flex md:flex-col md:items-center"
        >
          <p class="text-sm font-semibold uppercase tracking-widest text-yellow-300">
            Avis clients
          </p>
          <h2
            class="mt-4 font-display text-3xl font-extrabold tracking-tight text-white md:text-4xl"
          >
            Votre avis compte pour nous
          </h2>
          <p class="mt-4 max-w-xl text-base leading-relaxed text-white/70">
            Vos retours nous aident à progresser et permettent à d'autres entreprises et candidats
            de mieux nous connaître.
          </p>

          <!-- Note Google stylisée -->
          <div class="mt-10 flex flex-col items-center gap-2">
            <p class="text-lg font-semibold">
              <span class="text-[#4285F4]">G</span><span class="text-[#EA4335]">o</span
              ><span class="text-[#FBBC05]">o</span><span class="text-[#4285F4]">g</span
              ><span class="text-[#34A853]">l</span><span class="text-[#EA4335]">e</span>
            </p>
            <!-- fix aria role : aria-label exige un role explicite sur une div -->
            <div class="flex gap-1 text-yellow-400" role="img" aria-label="5 étoiles sur 5">
              <svg v-for="i in 5" :key="i" class="size-8" viewBox="0 0 20 20" fill="currentColor">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z"
                />
              </svg>
            </div>
            <p class="text-5xl font-extrabold text-white">5 / 5</p>
          </div>

          <!-- lien google avis -->
          <a
            href="https://share.google/hgl6jClIyQcKgjxSD"
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
      </div>
    </section>

    <!-- footer home : repris ici (App.vue masque son footer global pour
         cette route pour eviter le doublon) -->
    <TheFooter full-page-scroll />
  </div>
</template>
