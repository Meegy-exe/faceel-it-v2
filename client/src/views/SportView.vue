<script setup lang="ts">
import { useTemplateRef } from 'vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import { useSeo } from '@/composables/useSeo'
import { scrollRevealClass, useScrollReveal } from '@/composables/useScrollReveal'
import photoVeloEquipe from '@/assets/images/photos/velo-equipe.jpg'
import photoPadelEquipe from '@/assets/images/padel-equipe.jpg'
import photoFit01 from '@/assets/images/photos/f-it-01.jpg'
import photoFit02 from '@/assets/images/photos/f-it-02.jpg'
import photoFit03 from '@/assets/images/photos/f-it-03.jpg'

useSeo({
  title: 'Sport & sponsoring',
  description:
    'Padel, vélo, course, tennis : chez Faceel-IT, ESN à Wasquehal, le sport façonne le collectif, le recrutement et nos partenariats dans la métropole lilloise et les Hauts-de-France.',
})

// anim texte : une ref + un etat par section, meme mecanique que HistoireView.vue
const heroEl = useTemplateRef<HTMLElement>('heroEl')
const heroReveal = useScrollReveal(heroEl)
const teamEl = useTemplateRef<HTMLElement>('teamEl')
const teamReveal = useScrollReveal(teamEl)
const recruitEl = useTemplateRef<HTMLElement>('recruitEl')
const recruitReveal = useScrollReveal(recruitEl)
const partnersEl = useTemplateRef<HTMLElement>('partnersEl')
const partnersReveal = useScrollReveal(partnersEl)

// cascade sur les 3 cartes partenariats
const CARD_DELAYS = ['delay-0', 'delay-150', 'delay-300']

// fleches carrousel partenaires
const partnersCarouselEl = useTemplateRef<HTMLElement>('partnersCarouselEl')

function scrollPartnersPrev() {
  const el = partnersCarouselEl.value
  if (!el) return
  el.scrollBy({ left: -el.clientWidth, behavior: 'smooth' })
}

function scrollPartnersNext() {
  const el = partnersCarouselEl.value
  if (!el) return
  el.scrollBy({ left: el.clientWidth, behavior: 'smooth' })
}
</script>

<template>
  <!-- Pas de `<main>` ici : la coquille (`App.vue`) le fournit déjà. -->
  <div
    class="h-dvh w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth bg-primary-950"
  >
    <!-- ==================================================================
         1. HERO 50/50, texte à gauche / photo cyclistes à droite.
         ================================================================== -->
    <!-- fix responsive sport -->
    <section
      data-theme="dark"
      class="w-full shrink-0 snap-start snap-always h-dvh overflow-hidden flex flex-col lg:grid lg:grid-cols-2 bg-primary-950"
    >
      <div
        ref="heroEl"
        class="flex flex-col justify-center px-6 pt-24 lg:px-16 lg:pt-0 xl:px-24 h-[50vh] lg:h-full transition-all duration-700 ease-out motion-reduce:transition-none"
        :class="scrollRevealClass(heroReveal)"
      >
        <!-- fix contraste ariane -->
        <p class="text-white/80 mb-3 font-medium sm:mb-6">
          Accueil / <span class="text-accent-500">Sport &amp; sponsoring</span>
        </p>
        <h1 class="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
          Le sport, notre terrain d'entraînement.
        </h1>
        <p class="mt-3 text-base sm:mt-6 sm:text-lg text-white/80 max-w-lg">
          Padel, vélo, course, tennis. Chez nous le sport n'est pas un avantage sur une plaquette :
          c'est la façon dont l'équipe se connaît, dont nous recrutons, et dont nous soutenons notre
          région.
        </p>
      </div>

      <div class="relative h-[50vh] lg:h-full w-full">
        <img
          :src="photoVeloEquipe"
          alt="Cyclistes Faceel IT"
          loading="eager"
          fetchpriority="high"
          decoding="async"
          class="absolute inset-0 h-full w-full object-cover lg:rounded-l-3xl"
        />
      </div>
    </section>

    <!-- ==================================================================
         2. LA VIE D'ÉQUIPE fond bleu foncé, texte + grille d'images.
         ================================================================== -->
    <!-- fix responsive sport -->
    <section
      data-theme="light"
      class="w-full shrink-0 snap-start snap-always h-dvh overflow-hidden flex items-center bg-white text-primary-950 px-6 pt-24 lg:px-12 lg:pt-0"
    >
      <div ref="teamEl" class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
        <div
          class="transition-all duration-700 ease-out motion-reduce:transition-none"
          :class="scrollRevealClass(teamReveal, 'left')"
        >
          <!-- accent-700, pas accent-500 : sur fond blanc, accent-500 ne tient
               que 1,9:1 (décor uniquement) contre 4,9:1 pour accent-700
               (cf. main.css, tokens de couleur). -->
          <p class="text-accent-700 text-sm font-bold tracking-widest uppercase mb-2 sm:mb-4">
            La vie d'équipe
          </p>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 sm:mb-6 text-primary-900">
            Un rendez-vous par mois, un séminaire par an.
          </h2>
          <p class="text-gray-600 mb-4 sm:mb-8">
            L'activité change, padel, escalade, tennis, le principe reste : sortir du cadre du
            bureau pour que les équipes se connaissent vraiment. Deux séances hebdomadaires sont
            aussi ouvertes à distance, pour ne pas exclure celles et ceux en mission ailleurs.
          </p>
          <!-- force badges en ligne -->
          <div class="w-full flex flex-wrap items-center gap-2">
            <!-- w-fit badges -->
            <span
              v-for="badge in [
                'Afterwork mensuel',
                'Séminaire annuel (UE)',
                'Foulées Lilloises',
                'Sorties vélo',
              ]"
              :key="badge"
              class="w-fit shrink-0 inline-flex items-center border border-gray-200 rounded-full px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm text-primary-900"
            >
              {{ badge }}
            </span>
          </div>
        </div>

        <!-- bride image mobile -->
        <div
          class="grid grid-cols-2 grid-rows-2 gap-4 h-[200px] lg:h-[500px] transition-all duration-700 ease-out motion-reduce:transition-none"
          :class="scrollRevealClass(teamReveal, 'right')"
        >
          <div class="col-span-2 overflow-hidden rounded-2xl">
            <img
              :src="photoPadelEquipe"
              alt=""
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover"
            />
          </div>
          <div class="col-span-1 overflow-hidden rounded-2xl">
            <img
              :src="photoFit01"
              alt=""
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover"
            />
          </div>
          <div class="col-span-1 overflow-hidden rounded-2xl">
            <img
              :src="photoFit02"
              alt=""
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ==================================================================
         3. SPORT & RECRUTEMENT fond bleu foncé, texte + image.
         ================================================================== -->
    <!-- fix responsive sport -->
    <section
      data-theme="dark"
      class="w-full shrink-0 snap-start snap-always h-dvh overflow-hidden flex items-center bg-primary-950 text-white px-6 pt-24 lg:px-12 lg:pt-0"
    >
      <div ref="recruitEl" class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
        <div
          class="transition-all duration-700 ease-out motion-reduce:transition-none"
          :class="scrollRevealClass(recruitReveal, 'left')"
        >
          <p class="text-accent-500 text-sm font-bold uppercase tracking-widest mb-2 sm:mb-4">
            Sport &amp; recrutement
          </p>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 sm:mb-6">
            Ce qu'un terrain montre en dix minutes.
          </h2>
          <p class="text-white/70 mb-4 sm:mb-8">
            Une partie de padel s'invite souvent dans nos recrutements. Le score n'a aucune
            importance : la façon de se parler, de gérer un mauvais point et de jouer avec
            quelqu'un, si.
          </p>
          <RouterLink
            :to="{ name: 'candidat' }"
            class="inline-block bg-accent-500 text-primary-950 font-bold px-6 py-3 rounded-full hover:bg-accent-400 transition"
          >
            Voir notre process
          </RouterLink>
        </div>

        <!-- bride image mobile -->
        <div
          class="h-[200px] lg:h-[500px] overflow-hidden rounded-2xl transition-all duration-700 ease-out motion-reduce:transition-none"
          :class="scrollRevealClass(recruitReveal, 'right')"
        >
          <img
            :src="photoFit03"
            alt=""
            loading="lazy"
            decoding="async"
            class="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>

    <!-- ==================================================================
         4. NOS PARTENARIATS fond beige clair, 3 cartes.
         ================================================================== -->
    <!-- fix responsive sport -->
    <section
      data-theme="light"
      class="w-full shrink-0 snap-start snap-always min-h-dvh flex flex-col justify-center bg-gray-50 text-primary-950 px-6 pt-24 pb-12 lg:px-12 lg:pt-12"
    >
      <div
        ref="partnersEl"
        class="transition-all duration-700 ease-out motion-reduce:transition-none"
        :class="scrollRevealClass(partnersReveal)"
      >
        <p class="text-accent-600 text-sm font-bold uppercase tracking-widest mb-2 sm:mb-4">
          Nos partenariats
        </p>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 sm:mb-6">
          Ce que nous soutenons autour de nous.
        </h2>
        <p class="text-primary-950/70 mb-6 text-lg max-w-3xl sm:mb-12">
          Nous préférons financer ce qui se passe près de nous plutôt que de la publicité : des
          clubs locaux, un joueur professionnel, et les rendez-vous qui font vivre la communauté
          tech des Hauts-de-France.
        </p>
      </div>

      <!-- carrousel partenariats -->
      <div
        ref="partnersCarouselEl"
        class="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 shadow-none hide-scrollbar md:grid md:grid-cols-3 md:gap-0 md:overflow-hidden md:pb-0 md:rounded-2xl md:border md:border-gray-200 md:shadow-xl"
      >
        <!-- supprime ombre carree -->
        <article
          class="w-[85vw] shrink-0 snap-center rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-700 ease-out motion-reduce:transition-none md:w-auto md:rounded-none md:border-0 md:border-r md:p-8"
          :class="[scrollRevealClass(partnersReveal), CARD_DELAYS[0]]"
        >
          <p class="text-accent-600 text-sm font-bold uppercase tracking-widest mb-3">
            Sport professionnel
          </p>
          <h3 class="text-xl font-bold mb-3">Un joueur de padel pro</h3>
          <p class="text-primary-950/70 text-sm leading-relaxed">
            Nous accompagnons un joueur de padel professionne et il vient jouer avec les équipes.
          </p>
        </article>

        <article
          class="w-[85vw] shrink-0 snap-center rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-700 ease-out motion-reduce:transition-none md:w-auto md:rounded-none md:border-0 md:p-8"
          :class="[scrollRevealClass(partnersReveal), CARD_DELAYS[1]]"
        >
          <p class="text-accent-600 text-sm font-bold uppercase tracking-widest mb-3">
            Clubs locaux
          </p>
          <h3 class="text-xl font-bold mb-3">IRIS Tennis • Sphère Padel • École du Mouvement</h3>
          <p class="text-primary-950/70 text-sm leading-relaxed">
            Des partenariats ouverts à toute l'équipe, du tennis au volley, à côté de l'agence.
          </p>
        </article>

        <article
          class="w-[85vw] shrink-0 snap-center rounded-2xl border border-gray-200 bg-primary-950 p-6 text-white transition-all duration-700 ease-out motion-reduce:transition-none md:w-auto md:rounded-none md:border-0 md:p-8"
          :class="[scrollRevealClass(partnersReveal), CARD_DELAYS[2]]"
        >
          <p class="text-accent-500 text-sm font-bold uppercase tracking-widest mb-3">
            Écosystème tech
          </p>
          <h3 class="text-xl font-bold mb-3">DevFest • Agil'Lille • DataDays</h3>
          <p class="text-white/70 text-sm leading-relaxed">
            Nous sponsorisons les rendez-vous tech et data de la région, et nos ingénieurs y
            prennent la parole.
          </p>
        </article>
      </div>

      <!-- fleches carrousel partenaires -->
      <div class="mt-6 flex justify-center gap-4 md:hidden">
        <button
          type="button"
          aria-label="Partenaire précédent"
          class="inline-flex size-11 items-center justify-center rounded-full border border-gray-200 text-primary-900 transition-colors duration-200 hover:bg-primary-900/5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-700"
          @click="scrollPartnersPrev"
        >
          <svg class="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="m12 15-5-5 5-5"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Partenaire suivant"
          class="inline-flex size-11 items-center justify-center rounded-full border border-gray-200 text-primary-900 transition-colors duration-200 hover:bg-primary-900/5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-700"
          @click="scrollPartnersNext"
        >
          <svg class="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="m8 5 5 5-5 5"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>

    <!-- aligne footer home : repris ici (App.vue masque son footer global
         pour cette route pour eviter le doublon) -->
    <TheFooter full-page-scroll />
  </div>
</template>
