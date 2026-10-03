<script setup lang="ts">
import TheFooter from '@/components/layout/TheFooter.vue'
import { useSeo } from '@/composables/useSeo'
import photoVeloEquipe from '@/assets/images/photos/velo-equipe.jpg'
import photoPadelEquipe from '@/assets/images/padel-equipe.jpg'
import photoFit01 from '@/assets/images/photos/f-it-01.jpg'
import photoFit02 from '@/assets/images/photos/f-it-02.jpg'
import photoFit03 from '@/assets/images/photos/f-it-03.jpg'

useSeo({
  title: 'Sport & sponsoring',
  description:
    'Padel, vélo, course, tennis : chez Faceel-IT, le sport façonne le collectif, le recrutement et nos partenariats avec la région.',
})
</script>

<template>
  <!-- Pas de `<main>` ici : la coquille (`App.vue`) le fournit déjà. -->
  <div class="h-dvh w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth bg-primary-950">
    <!-- ==================================================================
         1. HERO — 50/50, texte à gauche / photo cyclistes à droite.
         ================================================================== -->
    <section
      data-theme="dark"
      class="w-full shrink-0 snap-start snap-always h-dvh flex flex-col lg:grid lg:grid-cols-2 bg-primary-950"
    >
      <div class="flex flex-col justify-center px-6 lg:px-16 xl:px-24 h-[50vh] lg:h-full">
        <p class="text-white/60 mb-6 font-medium">
          Accueil / <span class="text-accent-500">Sport &amp; sponsoring</span>
        </p>
        <h1 class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
          Le sport, notre terrain d'entraînement.
        </h1>
        <p class="mt-6 text-lg text-white/80 max-w-lg">
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
         2. LA VIE D'ÉQUIPE — fond bleu foncé, texte + grille d'images.
         ================================================================== -->
    <section
      data-theme="light"
      class="w-full shrink-0 snap-start snap-always h-dvh flex items-center bg-white text-primary-950 px-6 lg:px-12"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <!-- accent-700, pas accent-500 : sur fond blanc, accent-500 ne tient
               que 1,9:1 (décor uniquement) contre 4,9:1 pour accent-700
               (cf. main.css, tokens de couleur). -->
          <p class="text-accent-700 text-sm font-bold tracking-widest uppercase mb-4">
            — La vie d'équipe
          </p>
          <h2 class="text-4xl md:text-5xl font-extrabold mb-6 text-primary-900">
            Un rendez-vous par mois, un séminaire par an.
          </h2>
          <p class="text-gray-600 mb-8">
            L'activité change — padel, escalade, tennis — le principe reste : sortir du cadre du
            bureau pour que les équipes se connaissent vraiment. Deux séances hebdomadaires sont
            aussi ouvertes à distance, pour ne pas exclure celles et ceux en mission ailleurs.
          </p>
          <div class="flex flex-wrap gap-3">
            <span
              v-for="badge in ['Afterwork mensuel', 'Séminaire annuel (UE)', 'Foulées Lilloises', 'Sorties vélo']"
              :key="badge"
              class="border border-gray-200 rounded-full px-4 py-2 text-sm text-primary-900"
            >
              {{ badge }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 grid-rows-2 gap-4 h-[500px]">
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
         3. SPORT & RECRUTEMENT — fond bleu foncé, texte + image.
         ================================================================== -->
    <section
      data-theme="dark"
      class="w-full shrink-0 snap-start snap-always h-dvh flex items-center bg-primary-950 text-white px-6 lg:px-12"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <p class="text-accent-500 text-sm font-bold uppercase tracking-widest mb-4">
            Sport &amp; recrutement
          </p>
          <h2 class="text-4xl md:text-5xl font-extrabold mb-6">
            Ce qu'un terrain montre en dix minutes.
          </h2>
          <p class="text-white/70 mb-8">
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

        <div class="h-[500px] overflow-hidden rounded-2xl">
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
         4. NOS PARTENARIATS — fond beige clair, 3 cartes.
         ================================================================== -->
    <section
      data-theme="light"
      class="w-full shrink-0 snap-start snap-always min-h-dvh flex flex-col justify-center bg-gray-50 text-primary-950 px-6 lg:px-12 py-12"
    >
      <p class="text-accent-600 text-sm font-bold uppercase tracking-widest mb-4">
        Nos partenariats
      </p>
      <h2 class="text-4xl md:text-5xl font-extrabold mb-6">
        Ce que nous soutenons autour de nous.
      </h2>
      <p class="text-primary-950/70 mb-12 text-lg max-w-3xl">
        Nous préférons financer ce qui se passe près de nous plutôt que de la publicité : des clubs
        locaux, un joueur professionnel, et les rendez-vous qui font vivre la communauté tech des
        Hauts-de-France.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 rounded-2xl border border-gray-200 overflow-hidden">
        <article class="bg-white p-8 md:border-r border-gray-200">
          <p class="text-accent-600 text-sm font-bold uppercase tracking-widest mb-3">
            Sport professionnel
          </p>
          <h3 class="text-xl font-bold mb-3">Un joueur de padel pro</h3>
          <p class="text-primary-950/70 text-sm leading-relaxed">
            Nous accompagnons un joueur de padel professionnel — et il vient jouer avec les
            équipes.
          </p>
        </article>

        <article class="bg-white p-8">
          <p class="text-accent-600 text-sm font-bold uppercase tracking-widest mb-3">
            Clubs locaux
          </p>
          <h3 class="text-xl font-bold mb-3">IRIS Tennis • Sphère Padel • École du Mouvement</h3>
          <p class="text-primary-950/70 text-sm leading-relaxed">
            Des partenariats ouverts à toute l'équipe, du tennis au volley, à côté de l'agence.
          </p>
        </article>

        <article class="bg-primary-950 text-white p-8">
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

      <p class="mt-8 text-primary-950/70 max-w-3xl">
        Nous invitons régulièrement des sportifs de haut niveau à échanger avec les équipes. Ce
        qu'ils racontent de la préparation, de l'échec et du collectif parle directement de nos
        métiers.
      </p>
    </section>

    <!-- ==================================================================
         5. FOOTER
         ================================================================== -->
    <section data-theme="dark" class="w-full shrink-0 snap-start snap-always">
      <TheFooter />
    </section>
  </div>
</template>
