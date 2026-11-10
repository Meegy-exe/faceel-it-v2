<script setup lang="ts">
import { useTemplateRef } from 'vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import { scrollRevealClass, useScrollReveal } from '@/composables/useScrollReveal'
import { useSeo } from '@/composables/useSeo'
import photoPaintball from '@/assets/images/photos/paintball.jpg'
import photoAfterwork from '@/assets/images/photos/afterwork.jpg'
import photoLille from '@/assets/images/photos/lille.jpg'

/**
 * Page « Notre histoire » (rubrique « Qui sommes-nous ») - V0.7.
 *
 * DÉFILEMENT PLEIN ÉCRAN, COMME `HomeView.vue` : `meta.fullPageScroll` a été
 * ajouté à cette route dans `router/routes.ts` (sinon les classes `snap-*`
 * ci-dessous n'ont aucun conteneur de scroll-snap parent pour s'y accrocher,
 * cf. `App.vue`). Reprend le mécanisme d'ADR 26/`docs/DECISIONS.md`, ne
 * l'étend pas : rien de nouveau dans `App.vue` lui-même.
 *
 * INVERSE UNE DÉCISION PRÉCÉDENTE  les trois sections « Code and Play »,
 * « Explore and grow » et « Learn and progress » avaient été déplacées vers
 * `/qui-sommes-nous/notre-collectif` (qui les porte toujours, cf.
 * `CollectifView.vue`, tableau `VALUES`) au motif qu'elles décrivent le
 * collectif, pas la chronologie de la société. Cette page les réintègre à la
 * demande explicite du brief V0.7 : le contenu est donc désormais DUPLIQUÉ
 * entre les deux pages  reprise à l'identique du texte déjà validé plutôt
 * que reformulé, mais dupliqué tout de même. À arbitrer avec le client si ce
 * n'est pas l'intention (retirer le doublon de l'une des deux pages).
 *
 * IMAGES `picsum.photos` explicitement demandé par le brief, mais exclu
 * comme pour la galerie « Nos événements » de l'accueil : le CSP de
 * production (`client/security-headers.conf`) déclare `img-src 'self'` sans
 * exception, une image hotlinkée y serait bloquée par le navigateur après
 * déploiement. Cinq photos déjà présentes dans `assets/images/photos/`
 * (dépôt client) servent de substitut  décoratives (`alt=""`), le texte
 * adjacent porte déjà tout le sens.
 *
 * Tout le texte des sections 1 et 2 provient de l'ancien site, repris tel
 * que transmis (cf. règle d'intégrité du contenu, CLAUDE.md). Le texte des
 * sections 3-5 provient de `CollectifView.vue`, où il est déjà validé.
 */
useSeo({
  title: 'Notre histoire - ESN née à Lille, basée à Wasquehal',
  description:
    'Née le 8 mars 2021 à Lille et basée à Wasquehal, Faceel-IT accompagne les entreprises des Hauts-de-France dans leurs projets informatiques. Une ESN 100 % indépendante, en croissance organique.',
})

const originesEl = useTemplateRef<HTMLElement>('originesEl')
const originesReveal = useScrollReveal(originesEl)
const independanceEl = useTemplateRef<HTMLElement>('independanceEl')
const independanceReveal = useScrollReveal(independanceEl)
const codePlayEl = useTemplateRef<HTMLElement>('codePlayEl')
const codePlayReveal = useScrollReveal(codePlayEl)
const exploreGrowEl = useTemplateRef<HTMLElement>('exploreGrowEl')
const exploreGrowReveal = useScrollReveal(exploreGrowEl)
const learnProgressEl = useTemplateRef<HTMLElement>('learnProgressEl')
const learnProgressReveal = useScrollReveal(learnProgressEl)
// section rse integree
const rseEl = useTemplateRef<HTMLElement>('rseEl')
const rseReveal = useScrollReveal(rseEl)
const rseCarouselEl = useTemplateRef<HTMLElement>('rseCarouselEl')

// fleches nav : largeur carte md (320px) + gap (24px)
function scrollRsePrev() {
  rseCarouselEl.value?.scrollBy({ left: -344, behavior: 'smooth' })
}

function scrollRseNext() {
  rseCarouselEl.value?.scrollBy({ left: 344, behavior: 'smooth' })
}

// cartes rse
interface RseCard {
  title: string
  boldIntro?: string
  description: string
}

const RSE_CARDS: RseCard[] = [
  {
    title: 'Mobilité urbaine',
    boldIntro: 'Notre engagement pour une ville plus fluide et durable. ',
    description:
      "Nous soutenons activement les initiatives de mobilité urbaine visant à réduire l'empreinte carbone et à faciliter les déplacements doux.",
  },
  {
    title: 'Ecovadis',
    description:
      'Classée dans le top 15 % des entreprises évaluées par EcoVadis, notre entreprise est fière de contribuer à une économie plus responsable.',
  },
  {
    title: 'Charte de la diversité',
    description:
      "Nous mettons en œuvre une politique RH inclusive, favorisant l'égalité des chances et le respect de chacun dans toutes nos missions et recrutements.",
  },
  {
    title: 'Numeum',
    description:
      "Nous participons activement à la structuration de la filière numérique française. Ce partenariat nous permet d'être au cœur des enjeux du secteur.",
  },
]
</script>

<template>
  <!-- Pas de `<main>` ici : la coquille (`App.vue`) le fournit déjà. -->

  <!-- CONTENEUR SNAP OPT-IN : isole le scroll magnétique de cette vue sans
       dépendre de la hauteur flexée de <main> (cf. HomeView.vue) le
       `meta.fullPageScroll` évoqué plus haut n'existe nulle part ailleurs
       dans le dépôt (routes.ts / App.vue), ce conteneur local est donc le
       seul mécanisme réel de snap sur cette page. -->
  <div class="h-dvh w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory">
    <!-- ==================================================================
       1. HERO (ORIGINES) sombre, fond uni, texte centré.
       Ancienne photo (fondateurs) retirée : obsolète, en attente d'un
       nouvel asset.
       ================================================================== -->
    <!-- alternance fond bleu -->
    <section
      id="origines"
      data-theme="dark"
      class="min-h-dvh shrink-0 w-full snap-start snap-always flex flex-col items-center justify-center bg-[#000066] px-4 py-16 text-center sm:px-6 lg:px-8 xl:px-12"
    >
      <!-- `<h1>` visuellement masqué : le brief fait de « Il était une fois »
         un simple surtitre (pas de grand titre distinct pour cette
         section), mais la page a besoin d'un `<h1>` réel qui en résume le
         sujet pour l'a11y/le SEO  il reprend le titre déjà déclaré à
         `useSeo` ci-dessus, sans dupliquer visuellement du texte. -->
      <h1 class="sr-only">Notre histoire, celle d'une ESN née à Lille et basée à Wasquehal</h1>

      <div
        ref="originesEl"
        class="mx-auto max-w-3xl transition-all duration-700 ease-out motion-reduce:transition-none"
        :class="scrollRevealClass(originesReveal)"
      >
        <p class="text-eyebrow uppercase text-accent-500">Il était une fois</p>
        <p class="mt-6 text-lg leading-relaxed text-white/80 sm:text-xl">
          Notre histoire débute le 8 mars 2021 avec une ambition commune&nbsp;: accompagner les entreprises
          de la région lilloise dans la réussite de leurs projets informatiques, en garantissant un
          haut niveau d’exigence. Nous avons combiné nos expériences entrepreneuriales, techniques
          et managériales pour créer une ESN qui nous ressemble.
        </p>
      </div>
    </section>

    <!-- ==================================================================
       2. INDÉPENDANCE claire, texte centré, police géante.
       ================================================================== -->
    <!-- fond clair -->
    <section
      id="independance"
      data-theme="light"
      class="h-dvh shrink-0 w-full snap-start snap-always flex flex-col items-center justify-center bg-light px-4 py-16 text-center text-primary-900 sm:px-6 lg:px-8 xl:px-12"
    >
      <div
        ref="independanceEl"
        class="mx-auto max-w-4xl transition-all duration-700 ease-out motion-reduce:transition-none"
        :class="scrollRevealClass(independanceReveal)"
      >
        <p class="text-eyebrow uppercase text-accent-700">Nous sommes une société</p>
        <h2 class="mt-6 font-display text-mega text-balance">
          <span class="text-accent-700">100&nbsp;%</span> indépendante
          <br />
          <span class="text-accent-700">100&nbsp;%</span> de croissance organique
        </h2>
      </div>
    </section>

    <!-- ==================================================================
       3. CODE AND PLAY  sombre, texte gauche / image droite.
       ================================================================== -->
    <!-- alternance fond bleu -->
    <section
      id="code-and-play"
      data-theme="dark"
      class="min-h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center bg-[#000066] px-4 py-10 sm:px-6 sm:py-16 lg:px-8 xl:px-12"
    >
      <div
        ref="codePlayEl"
        class="mx-auto grid w-full max-w-6xl items-center gap-6 lg:grid-cols-2 lg:gap-16"
      >
        <div
          class="order-2 lg:order-1 transition-all duration-700 ease-out motion-reduce:transition-none"
          :class="scrollRevealClass(codePlayReveal, 'left')"
        >
          <h2 class="font-display text-display text-balance text-accent-500">Code and Play</h2>
          <p class="mt-3 text-lg leading-relaxed text-white/80 sm:mt-6 sm:text-xl">
            Nous plaçons les valeurs du sport au cœur de notre collectif&nbsp;: esprit d’équipe,
            dépassement de soi et respect. Elles guident nos missions IT, renforcent notre cohésion
            et nourrissent l’excellence que nous visons pour nos clients.
          </p>
        </div>

        <!-- fix hauteur mobile -->
        <div
          class="order-1 lg:order-2 transition-all duration-700 ease-out motion-reduce:transition-none"
          :class="scrollRevealClass(codePlayReveal, 'right')"
        >
          <img
            :src="photoPaintball"
            alt=""
            loading="lazy"
            decoding="async"
            class="aspect-[16/10] max-h-[200px] w-full rounded-3xl object-cover shadow-lift sm:aspect-[4/5] sm:max-h-none"
          />
        </div>
      </div>
    </section>

    <!-- ==================================================================
       4. EXPLORE AND GROW claire, image gauche / texte droite.
       ================================================================== -->
    <!-- fond clair -->
    <section
      id="explore-and-grow"
      data-theme="light"
      class="min-h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center bg-light px-4 py-10 text-primary-900 sm:px-6 sm:py-16 lg:px-8 xl:px-12"
    >
      <div
        ref="exploreGrowEl"
        class="mx-auto grid w-full max-w-6xl items-center gap-6 lg:grid-cols-2 lg:gap-16"
      >
        <!-- fix hauteur mobile -->
        <div
          class="transition-all duration-700 ease-out motion-reduce:transition-none"
          :class="scrollRevealClass(exploreGrowReveal, 'left')"
        >
          <img
            :src="photoAfterwork"
            alt=""
            loading="lazy"
            decoding="async"
            class="aspect-[16/10] max-h-[200px] w-full rounded-3xl object-cover shadow-lift sm:aspect-[4/5] sm:max-h-none"
          />
        </div>

        <div
          class="transition-all duration-700 ease-out motion-reduce:transition-none"
          :class="scrollRevealClass(exploreGrowReveal, 'right')"
        >
          <h2 class="font-display text-display text-balance text-accent-700">Explore and grow</h2>
          <p class="mt-3 text-lg leading-relaxed text-primary-900/70 sm:mt-6 sm:text-xl">
            À travers nos référencements clients et la diversité des projets que nous proposons,
            nous offrons à nos collaborateurs un véritable parcours de carrière&nbsp;: découvrir de
            nouveaux environnements, se challenger à travers des évolutions de poste et, pourquoi
            pas, envisager un changement de métier.
          </p>
        </div>
      </div>
    </section>

    <!-- ==================================================================
       5. LEARN AND PROGRESS sombre, texte gauche / image droite.
       ================================================================== -->
    <!-- alternance fond bleu -->
    <section
      id="learn-and-progress"
      data-theme="dark"
      class="min-h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center bg-[#000066] px-4 py-10 sm:px-6 sm:py-16 lg:px-8 xl:px-12"
    >
      <div
        ref="learnProgressEl"
        class="mx-auto grid w-full max-w-6xl items-center gap-6 lg:grid-cols-2 lg:gap-16"
      >
        <div
          class="order-2 lg:order-1 transition-all duration-700 ease-out motion-reduce:transition-none"
          :class="scrollRevealClass(learnProgressReveal, 'left')"
        >
          <h2 class="font-display text-display text-balance text-accent-500">Learn and progress</h2>
          <p class="mt-3 text-lg leading-relaxed text-white/80 sm:mt-6 sm:text-xl">
            La formation est un levier essentiel de progression. Curiosité, partage et évolution
            guident nos parcours professionnels. Former, c’est développer les talents, anticiper les
            transformations du monde IT et construire des équipes prêtes à relever les défis
            technologiques de demain.
          </p>
        </div>

        <!-- fix hauteur mobile -->
        <div
          class="order-1 lg:order-2 transition-all duration-700 ease-out motion-reduce:transition-none"
          :class="scrollRevealClass(learnProgressReveal, 'right')"
        >
          <img
            :src="photoLille"
            alt=""
            loading="lazy"
            decoding="async"
            class="aspect-[16/10] max-h-[200px] w-full rounded-3xl object-cover shadow-lift sm:aspect-[4/5] sm:max-h-none"
          />
        </div>
      </div>
    </section>

    <!-- ==================================================================
       6. POLITIQUE RSE - section rse integree, fusionnee depuis l'ancienne
       page dediee /politique-rse (retiree du menu et du routeur en v1).
       ================================================================== -->
    <!-- fond clair -->
    <section
      id="rse"
      data-theme="light"
      class="min-h-dvh shrink-0 w-full snap-start snap-always flex flex-col items-center justify-center bg-light px-4 py-16 text-center text-primary-900 sm:px-6 lg:px-8 xl:px-12"
    >
      <div
        ref="rseEl"
        class="mx-auto max-w-3xl transition-all duration-700 ease-out motion-reduce:transition-none"
        :class="scrollRevealClass(rseReveal)"
      >
        <p class="text-eyebrow uppercase text-accent-700">Engagement</p>
        <!-- police titre rse : plus de font-display, poppins global suffit -->
        <h2 class="mt-6 text-display text-balance text-accent-700">Politique RSE</h2>
      </div>

      <!-- fleches nav : focus clavier conserve, scroll libre bloque en plus des boutons -->
      <div
        ref="rseCarouselEl"
        tabindex="0"
        aria-label="Défilement du contenu"
        class="mt-10 flex w-full snap-x snap-mandatory gap-6 overflow-x-auto pb-8 hide-scrollbar md:justify-center focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-700 focus-visible:outline-offset-4"
      >
        <article
          v-for="card in RSE_CARDS"
          :key="card.title"
          class="flex w-[85vw] shrink-0 snap-center flex-col justify-between rounded-2xl bg-white p-8 text-left md:w-80"
        >
          <div>
            <p class="font-display text-lg font-bold text-primary-900">{{ card.title }}</p>
            <p class="mt-3 text-sm leading-relaxed text-primary-900/70">
              <strong v-if="card.boldIntro" class="font-bold text-primary-900"
                >{{ card.boldIntro }} </strong
              >{{ card.description }}
            </p>
          </div>
        </article>
      </div>

      <!-- fleches nav -->
      <div class="mt-6 flex justify-center gap-4">
        <button
          type="button"
          aria-label="Carte précédente"
          class="inline-flex size-11 items-center justify-center rounded-full text-primary-900/70 transition-colors duration-200 hover:bg-primary-900/10 hover:text-primary-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-700"
          @click="scrollRsePrev"
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
          aria-label="Carte suivante"
          class="inline-flex size-11 items-center justify-center rounded-full text-primary-900/70 transition-colors duration-200 hover:bg-primary-900/10 hover:text-primary-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-700"
          @click="scrollRseNext"
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

    <!-- structure footer home : repris ici (App.vue masque son footer
       global pour cette route pour eviter le doublon) -->
    <TheFooter full-page-scroll />
  </div>
  <!-- /conteneur snap -->
</template>
