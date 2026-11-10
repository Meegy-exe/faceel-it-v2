<script setup lang="ts">
import { useTemplateRef } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import EventsSection from '@/components/home/EventsSection.vue'
import { scrollRevealClass, useScrollReveal } from '@/composables/useScrollReveal'
import { useSeo } from '@/composables/useSeo'
import photoVeloEquipe from '@/assets/images/photos/velo-equipe.jpg'
import photoCourseGroupe from '@/assets/images/photos/course-groupe.jpg'

/**
 * Page « Je suis candidat »  V0.9.
 *
 * ROUTE DÉDIÉE  `router/routes.ts`/`staticPrerenderRoutes.ts` mis à jour
 * dans le même mouvement (même mécanisme `meta.fullPageScroll` qu'ADR 26,
 * déjà réutilisé pour `/notre-histoire` et `/je-suis-une-entreprise`, rien de
 * nouveau dans `App.vue`). CONTRAIREMENT À `EnterpriseView.vue`, `mainNav.ts`
 * ne porte AUCUNE entrée « candidat » préexistante à repointer (seule
 * « entreprise » avait été anticipée comme cible provisoire) : ajouter un
 * nouveau lien de menu visible est une décision de contenu plus engageante
 * qu'un repointage discret, hors du périmètre demandé ici (« uniquement le
 * template et le script »). La page est fonctionnelle et indexable
 * (pré-rendue) mais n'apparaît pour l'instant dans aucun menu.
 *
 * IMAGES  `picsum.photos` explicitement demandé par le brief, exclu comme
 * pour les autres pages : le CSP de production
 * (`client/security-headers.conf`) déclare `img-src 'self'` sans exception.
 * Photos déjà présentes dans `assets/images/photos/` (dépôt client) servent
 * de substitut, décoratives (`alt=""`).
 *
 * CTA FINAL  « Voir nos offres » pointe vers la route `offres` (V1).
 *
 * EVENT ACCUEIL  la section « Nos événements » réutilise `EventsSection.vue`
 * (`components/home/`), le même composant que `HomeView.vue`, plutôt qu'un
 * bloc propre à cette page (V1).
 *
 * TÉMOIGNAGES  refonte V1 : carrousel plein ecran (full bleed) a defilement
 * natif, cf. la section plus bas pour le detail des classes.
 */
useSeo({
  title: 'Je suis candidat - Rejoindre une ESN à Wasquehal',
  description:
    'Rejoignez Faceel-IT, ESN à Wasquehal, dans la métropole lilloise : savoir-être, savoir-faire, formation, ' +
    'coaching et mentorat au sein d’un collectif de passionnés des Hauts-de-France. ' +
    'Découvrez notre process de recrutement et nos offres.',
})

const savoirEtreEl = useTemplateRef<HTMLElement>('savoirEtreEl')
const savoirEtreReveal = useScrollReveal(savoirEtreEl)
const savoirFaireEl = useTemplateRef<HTMLElement>('savoirFaireEl')
const savoirFaireReveal = useScrollReveal(savoirFaireEl)
const collectifEl = useTemplateRef<HTMLElement>('collectifEl')
const collectifReveal = useScrollReveal(collectifEl)
const processEl = useTemplateRef<HTMLElement>('processEl')
const processReveal = useScrollReveal(processEl)
const temoignagesEl = useTemplateRef<HTMLElement>('temoignagesEl')
const temoignagesReveal = useScrollReveal(temoignagesEl)
const carouselEl = useTemplateRef<HTMLElement>('carouselEl')
const ctaEl = useTemplateRef<HTMLElement>('ctaEl')
const ctaReveal = useScrollReveal(ctaEl)

// scroll molette horizontal : vertical hors des bords, horizontal sinon
function handleWheel(e: WheelEvent) {
  const el = carouselEl.value
  if (!el) return
  const atStart = el.scrollLeft <= 0
  const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
  if ((atStart && e.deltaY < 0) || (atEnd && e.deltaY > 0)) return
  e.preventDefault()
  el.scrollLeft += e.deltaY
}

// fleches nav : largeur carte md (340px) + gap (32px)
function scrollPrev() {
  carouselEl.value?.scrollBy({ left: -372, behavior: 'smooth' })
}

function scrollNext() {
  carouselEl.value?.scrollBy({ left: 372, behavior: 'smooth' })
}

/* -------------------------------------------------------------------------- */
/* Le Collectif  3 avantages                                                 */
/* -------------------------------------------------------------------------- */

interface Advantage {
  number: string
  title: string
  description: string
}

const ADVANTAGES: Advantage[] = [
  {
    number: '01',
    title: 'Formation',
    description: 'Rester en veille technologique permanente grâce à nos nombreuses formations.',
  },
  {
    number: '02',
    title: 'Coaching',
    description:
      'Notre programme de coaching est spécialement conçu pour vous faire atteindre vos objectifs de carrière.',
  },
  {
    number: '03',
    title: 'Mentorat',
    description: 'Notre communauté vous accompagnera dans votre montée en compétences.',
  },
]

/* -------------------------------------------------------------------------- */
/* Processus de recrutement  timeline                                       */
/* -------------------------------------------------------------------------- */

interface ProcessStep {
  number: string
  title: string
}

const PROCESS_STEPS: ProcessStep[] = [
  { number: '01', title: 'Entretien téléphonique avec notre RH' },
  {
    number: '02',
    title: 'Rencontre avec nos managers dans nos bureaux (autour d’un café et d’un thé)',
  },
  { number: '03', title: 'Proposition d’embauche' },
  { number: '04', title: 'Intégration' },
]

/* -------------------------------------------------------------------------- */
/* Paroles de collaborateurs  témoignages                                   */
/* -------------------------------------------------------------------------- */

interface Testimonial {
  quote: string
  author: string
  role: string
}

/** Témoignages fournis tels quels par le brief  aucun n'est inventé
 *  (cf. CLAUDE.md, intégrité du contenu). */
const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Arrivé depuis maintenant plus de 2 ans, la vraie force de Faceel-It est sa proximité avec ses collaborateurs. Travailler directement à l’agence favorise l’échange et la cohésion d’équipe. Les nombreux afterworks et activités sportives renforcent la convivialité et le bien-être au travail.',
    author: 'Clément',
    role: 'Dev. fullstack',
  },
  {
    quote:
      'Super ambiance, processus de recrutement efficace, de bon lien avec les managers, j’apprécie grandement cette ESN !!',
    author: 'Mohamed',
    role: 'Dev. fullstack',
  },
  {
    quote:
      'Super ambiance, une équipe au top ! L’intégration s’est très bien passée, tout le monde est souriant. Très heureux d’avoir rejoint Faceel-it !',
    author: 'Quentin',
    role: 'Dev Fullstack',
  },
  {
    quote:
      'Mon arrivée chez Faceel-it s’est bien déroulée. L’équipe m’a soutenu tout au long de mon projet et m’a aidé à bien m’intégrer. Grâce à eux, j’ai pu progresser dans un cadre de travail agréable et dynamique. De plus, j’ai un excellent relationnel avec mon manager, ce qui rend mon quotidien encore plus agréable.',
    author: 'Allan',
    role: 'Dev. fullstack',
  },
]
</script>

<template>
  <!-- Pas de `<main>` ici : la coquille (`App.vue`) le fournit déjà. -->

  <!-- CONTENEUR SNAP OPT-IN : isole le scroll magnétique de cette vue sans
       dépendre de la hauteur flexée de <main> (cf. HomeView.vue)  le
       `meta.fullPageScroll` évoqué plus haut n'existe nulle part ailleurs
       dans le dépôt (routes.ts / App.vue), ce conteneur local est donc le
       seul mécanisme réel de snap sur cette page. -->
  <div class="h-dvh w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory">
    <!-- ==================================================================
       1. SAVOIR-ÊTRE  sombre, image « mask » à gauche / texte à droite.

       « Mask » plutôt que « parallax » (le brief laisse le choix) : un
       parallaxe lié au scroll exige un écouteur JS mesuré en continu, plus
       coûteux et plus risqué à valider sans navigateur réel sous la main
       (Playwright est interdit sur ce projet, cf. CLAUDE.md) qu'un simple
       dévoilement en `clip-path`, rejoué une seule fois via le même
       `useScrollReveal` que tout le reste de la page. -->
    <section
      id="savoir-etre"
      data-theme="dark"
      class="relative min-h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center overflow-hidden px-4 py-10 text-white sm:px-6 sm:py-16 lg:px-8 xl:px-12 bg-[#000066]"
    >
      <!-- effet core glow -->
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(30,60,180,0.35)_0%,_transparent_70%)] pointer-events-none"
        aria-hidden="true"
      ></div>

      <!-- `<h1>` de la page : premier titre significatif rencontré, résume le
         sujet pour l'a11y/le SEO (même parti que `HistoireView.vue`). -->
      <div
        ref="savoirEtreEl"
        class="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-6 lg:grid-cols-2 lg:gap-16"
      >
        <!-- fix overflow mobile : image bridee en hauteur sur mobile -->
        <div
          aria-hidden="true"
          class="overflow-hidden rounded-3xl shadow-lift transition-all duration-700 ease-out motion-reduce:transition-none"
          :class="scrollRevealClass(savoirEtreReveal, 'left')"
        >
          <img
            :src="photoVeloEquipe"
            alt=""
            loading="eager"
            fetchpriority="high"
            decoding="async"
            class="aspect-[16/10] max-h-[200px] w-full object-cover transition-[clip-path] duration-1000 ease-out motion-reduce:transition-none sm:aspect-[4/5] sm:max-h-none"
            :style="{
              clipPath: savoirEtreReveal !== 'hidden' ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
            }"
          />
        </div>

        <div
          class="transition-all duration-700 ease-out motion-reduce:transition-none [animation-delay:120ms]"
          :class="scrollRevealClass(savoirEtreReveal, 'right')"
        >
          <h1 class="font-display text-display text-balance">
            D’abord un
            <!-- Effet outline demandé par le brief : bordure blanche, repli
               (`supports-[...]`)  sans support, le mot reste en plein blanc,
               jamais invisible. -->
            <span
              class="text-white supports-[-webkit-text-stroke:1px]:text-transparent supports-[-webkit-text-stroke:1px]:[-webkit-text-stroke:2px_white]"
            >
              savoir être
            </span>
            chez notre ESN à Wasquehal
          </h1>
          <p class="mt-3 text-lg leading-relaxed text-white/75 sm:mt-6 sm:text-xl">
            Chez Faceel-it nous cherchons avant tout des collaborateurs passionnés par leur métier
            et capables de s’ouvrir à de nouveaux projets.
          </p>
          <p class="mt-2 text-lg leading-relaxed text-white/75 sm:mt-4 sm:text-xl">
            Sortir de sa zone de confort et se challenger sont deux qualités essentielles si vous
            voulez nous rejoindre.
          </p>
          <p class="mt-2 text-lg leading-relaxed text-white/75 sm:mt-4 sm:text-xl">
            C’est pour cette raison que nous serons toujours à votre écoute et privilégierons vos
            souhaits d’évolution.
          </p>
        </div>
      </div>
    </section>

    <!-- ==================================================================
       2. SAVOIR-FAIRE  clair, texte à gauche / image à droite (hover scale).
       ================================================================== -->
    <section
      id="savoir-faire"
      data-theme="light"
      class="min-h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 xl:px-12 bg-light"
    >
      <div
        ref="savoirFaireEl"
        class="mx-auto grid w-full max-w-6xl items-center gap-6 lg:grid-cols-2 lg:gap-16"
      >
        <div
          class="order-2 lg:order-1 transition-all duration-700 ease-out motion-reduce:transition-none"
          :class="scrollRevealClass(savoirFaireReveal, 'left')"
        >
          <h2 class="font-display text-display text-balance">
            Ensuite un
            <span
              class="text-primary-900 supports-[-webkit-text-stroke:1px]:text-transparent supports-[-webkit-text-stroke:1px]:[-webkit-text-stroke:2px_var(--color-primary-900)]"
            >
              savoir faire
            </span>
          </h2>
          <p class="mt-3 text-lg leading-relaxed text-primary-900/80 sm:mt-6 sm:text-xl">
            Nous vous accompagnons tout au long de votre carrière au sein de Faceel-it sur le
            développement de vos compétences.
          </p>
          <p class="mt-2 text-lg leading-relaxed text-primary-900/80 sm:mt-4 sm:text-xl">
            Diversité des missions, programmes de formation, meetups sont autant de leviers qui nous
            permettrons de vous faire progresser pour atteindre vos ambitions.
          </p>
        </div>

        <!-- fix overflow mobile : image bridee en hauteur sur mobile -->
        <div
          class="group order-1 lg:order-2 overflow-hidden rounded-3xl shadow-lift transition-all duration-700 ease-out motion-reduce:transition-none [animation-delay:120ms]"
          :class="scrollRevealClass(savoirFaireReveal, 'right')"
        >
          <img
            :src="photoCourseGroupe"
            alt=""
            loading="lazy"
            decoding="async"
            class="aspect-[16/10] max-h-[200px] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 motion-reduce:transition-none sm:aspect-[4/5] sm:max-h-none"
          />
        </div>
      </div>
    </section>

    <!-- ==================================================================
       3. LE COLLECTIF  sombre, texte décoratif géant + 3 avantages.
       ================================================================== -->
    <section
      id="collectif"
      data-theme="dark"
      class="relative h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center overflow-hidden px-4 py-16 text-white sm:px-6 lg:px-8 xl:px-12 bg-[#000066]"
    >
      <!-- effet core glow -->
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(30,60,180,0.35)_0%,_transparent_70%)] pointer-events-none"
        aria-hidden="true"
      ></div>

      <div ref="collectifEl" class="relative z-10 mx-auto w-full max-w-6xl">
        <h2
          class="text-center font-display text-display text-balance transition-all duration-700 ease-out motion-reduce:transition-none"
          :class="scrollRevealClass(collectifReveal)"
        >
          Rejoindre un collectif créé par et pour des passionnés
        </h2>

        <div class="mt-12 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <!-- Texte décoratif géant, purement atmosphérique : le vrai titre de
             section est le `<h2>` ci-dessus, celui-ci n'apporte aucune
             information supplémentaire  `aria-hidden` évite le bruit pour
             un lecteur d'écran. -->
          <p
            aria-hidden="true"
            class="hidden select-none font-display text-[clamp(3rem,10vw,9rem)] leading-[0.85] text-transparent [-webkit-text-stroke:2px_white] opacity-40 lg:block"
          >
            Juste
            <br />
            pour
            <br />
            vous
          </p>

          <ul class="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-1">
            <li
              v-for="(advantage, index) in ADVANTAGES"
              :key="advantage.number"
              class="transition-all duration-700 ease-out motion-reduce:transition-none"
              :style="{ transitionDelay: `${index * 140}ms` }"
              :class="scrollRevealClass(collectifReveal, 'right')"
            >
              <p class="font-display text-3xl font-extrabold text-accent-500">
                {{ advantage.number }}
              </p>
              <p class="mt-1 font-display text-lg font-bold text-white">{{ advantage.title }}</p>
              <p class="mt-2 text-sm leading-relaxed text-white/70">{{ advantage.description }}</p>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ==================================================================
       4. PROCESSUS DE RECRUTEMENT  clair, timeline verticale.
       ================================================================== -->
    <section
      id="process"
      data-theme="light"
      class="min-h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center px-4 py-16 sm:px-6 lg:px-8 xl:px-12 bg-light"
    >
      <div ref="processEl" class="mx-auto w-full max-w-4xl">
        <h2
          class="font-display text-display text-balance text-primary-900 transition-all duration-700 ease-out motion-reduce:transition-none"
          :class="scrollRevealClass(processReveal)"
        >
          Notre process d’entrée
        </h2>

        <!-- Reprise verbatim de la section #independance de HistoireView.vue :
           même fait, pas une reformulation  cf. CLAUDE.md, intégrité du
           contenu. -->
        <p class="mt-4 font-display text-xl font-bold text-primary-900 sm:text-2xl">
          <span class="text-accent-700">100&nbsp;%</span> indépendante ·
          <span class="text-accent-700">100&nbsp;%</span> de croissance organique
        </p>

        <!-- `<ol>`, pas `<ul>` : c'est un ORDRE, une entrée n'a de sens qu'après
           la précédente  un lecteur d'écran doit l'entendre comme tel. -->
        <ol class="mt-12 space-y-8">
          <li
            v-for="(step, index) in PROCESS_STEPS"
            :key="step.number"
            class="flex items-start gap-6 border-l-2 border-primary-900/10 pl-6 transition-all duration-700 ease-out motion-reduce:transition-none sm:gap-8 sm:pl-8"
            :style="{ transitionDelay: `${index * 120}ms` }"
            :class="scrollRevealClass(processReveal, 'left')"
          >
            <span
              class="shrink-0 font-display text-5xl font-extrabold tracking-tight text-accent-500 sm:text-6xl"
            >
              {{ step.number }}
            </span>
            <p class="mt-2 text-lg leading-relaxed text-primary-900 sm:mt-3 sm:text-xl">
              {{ step.title }}
            </p>
          </li>
        </ol>
      </div>
    </section>

    <!-- event accueil : composant partage avec HomeView.vue -->
    <EventsSection />

    <!-- ==================================================================
       5. PAROLES DE COLLABORATEURS  clair, carrousel de témoignages.
       ================================================================== -->
    <!-- carrousel temoignages : defilement natif plutot qu'une grille figee -->
    <section
      id="temoignages"
      data-theme="dark"
      class="relative min-h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center overflow-hidden px-4 py-10 sm:px-6 sm:py-16 lg:px-8 xl:px-12 bg-primary-950"
    >
      <!-- effet core glow -->
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(30,60,180,0.35)_0%,_transparent_70%)] pointer-events-none"
        aria-hidden="true"
      ></div>

      <div
        ref="temoignagesEl"
        class="relative z-10 mx-auto w-full max-w-6xl transition-all duration-700 ease-out motion-reduce:transition-none"
        :class="scrollRevealClass(temoignagesReveal)"
      >
        <h2 class="text-center font-display text-display text-balance text-white">
          Paroles de collaborateurs
        </h2>
      </div>

      <!-- conteneur 3 cartes : boite max-w-6xl, plus de bleed ni de calc complexe -->
      <div class="relative z-10 mx-auto mt-8 w-full max-w-6xl sm:mt-12">
        <!-- supprime scroll interne : overflow-x reste pour le swipe du carrousel, aucun overflow-y ici -->
        <div
          ref="carouselEl"
          class="flex snap-x snap-mandatory gap-8 overflow-x-auto pb-8 hide-scrollbar transition-all duration-700 ease-out motion-reduce:transition-none"
          :class="scrollRevealClass(temoignagesReveal)"
          @wheel="handleWheel"
        >
          <blockquote
            v-for="testimonial in TESTIMONIALS"
            :key="testimonial.author"
            class="w-[85vw] shrink-0 snap-center rounded-xl border-l-4 border-accent-500 bg-primary-900 p-5 sm:p-6 md:w-[340px] lg:w-[calc(33.333%-1.5rem)]"
          >
            <p class="text-sm leading-relaxed text-white/80 sm:text-base">
              « {{ testimonial.quote }} »
            </p>
            <footer class="mt-3 text-sm sm:mt-4">
              <span class="font-bold text-accent-500">{{ testimonial.author }}</span>
              <span class="text-white/60"> - {{ testimonial.role }}</span>
            </footer>
          </blockquote>
        </div>

        <!-- fleches nav -->
        <div class="mt-6 flex justify-center gap-4">
          <button
            type="button"
            aria-label="Témoignage précédent"
            class="inline-flex size-11 items-center justify-center rounded-full text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
            @click="scrollPrev"
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
            aria-label="Témoignage suivant"
            class="inline-flex size-11 items-center justify-center rounded-full text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
            @click="scrollNext"
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
      </div>
    </section>

    <!-- ==================================================================
       6. CALL TO ACTION  clair, encart final impactant.
       ================================================================== -->
    <section
      id="cta"
      data-theme="light"
      class="h-dvh shrink-0 w-full snap-start snap-always flex flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8 xl:px-12 bg-white"
    >
      <div
        ref="ctaEl"
        class="mx-auto max-w-2xl transition-all duration-700 ease-out motion-reduce:transition-none"
        :class="scrollRevealClass(ctaReveal)"
      >
        <h2 class="font-display text-display text-balance text-primary-900">
          Prêt à écrire la suite
          <span class="text-accent-700">avec nous</span>
          ?
        </h2>
        <div class="mt-10">
          <!-- route offres -->
          <BaseButton variant="accent" size="lg" surface="light" :to="{ name: 'offres' }">
            Voir nos offres
          </BaseButton>
        </div>
      </div>
    </section>

    <!-- structure footer home : repris ici (App.vue masque son footer
       global pour cette route pour eviter le doublon) -->
    <TheFooter full-page-scroll />
  </div>
  <!-- /conteneur snap -->
</template>
