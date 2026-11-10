<script setup lang="ts">
import { computed, ref, watch, type Ref } from 'vue'
import { useTemplateRef } from 'vue'
import { useSwipe } from '@vueuse/core'
import ReferencesSection from '@/components/ui/ReferencesSection.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import { scrollRevealClass, useScrollReveal } from '@/composables/useScrollReveal'
import { useSeo } from '@/composables/useSeo'

/**
 * Page « Je suis une entreprise »  V0.8.
 *
 * ROUTE DÉDIÉE, PAS UNE ANCRE DE `/` : `mainNav.ts` (entrée `id: 'entreprise'`)
 * documentait déjà cette page comme la destination finale prévue (« CIBLES
 * PROVISOIRES […] À l'ouverture des pages dédiées, remplacer les `hash` par
 * les `name` de route correspondants »)  `router/routes.ts` et `mainNav.ts`
 * ont été mis à jour dans le même mouvement, cf. leurs commentaires respectifs.
 *
 * DÉFILEMENT PLEIN ÉCRAN : `meta.fullPageScroll` posé sur cette route (même
 * mécanisme qu'`ADR 26`/`docs/DECISIONS.md`, déjà réutilisé pour
 * `/qui-sommes-nous/notre-histoire`  aucune troisième variante inventée ici).
 *
 * REFERENCES CLIENTS - section ref home (V1) : reprend `ReferencesSection.vue`
 * telle qu'utilisée par `HomeView.vue`, plutot que le bandeau de logos ecrit
 * en dur ici auparavant. Memes logos, meme comportement, un seul endroit a
 * maintenir.
 */
useSeo({
  title: 'Je suis une entreprise - ESN à Wasquehal, dans la métropole lilloise',
  description:
    'Faceel-IT, ESN à Wasquehal, accompagne les entreprises de la métropole lilloise et des Hauts-de-France dans ' +
    'leurs projets stratégiques : régie de proximité, centre de services, 65 collaborateurs, ' +
    'plus de 170 projets réalisés.',
})

/* -------------------------------------------------------------------------- */
/* Animations d'apparition au défilement                                      */
/* -------------------------------------------------------------------------- */

const introEl = useTemplateRef<HTMLElement>('introEl')
const introReveal = useScrollReveal(introEl)
const offresEl = useTemplateRef<HTMLElement>('offresEl')
const offresReveal = useScrollReveal(offresEl)
const statsEl = useTemplateRef<HTMLElement>('statsEl')
const statsReveal = useScrollReveal(statsEl)
const valeursEl = useTemplateRef<HTMLElement>('valeursEl')
const valeursReveal = useScrollReveal(valeursEl)
const recoEl = useTemplateRef<HTMLElement>('recoEl')
const recoReveal = useScrollReveal(recoEl)

/* -------------------------------------------------------------------------- */
/* Section reco clients  carrousel de temoignages                            */
/* -------------------------------------------------------------------------- */

interface ClientTestimonial {
  quote: string
  author: string
  role: string
}

/** Témoignages fournis tels quels par le brief  aucun n'est invente
 *  (cf. CLAUDE.md, integrite du contenu). */
const CLIENT_TESTIMONIALS: ClientTestimonial[] = [
  {
    quote:
      'La relation commerciale avec Faceel-IT est fluide, constructive et marquée par une grande réactivité. Les échanges sont de qualité, le suivi RH et commercial est rigoureux, et la prestation répond pleinement à nos attentes.',
    author: 'Jérémy KACZMAREK',
    role: 'HR Digital Product Manager',
  },
  {
    quote:
      "Nous collaborons à la logistique magasin avec Faceel'IT depuis un peu moins d'un an, dans le cadre de prestations en développement d'ACL en java principalement et une petite partie d'expertise technique. Leur équipe s'est toujours montrée professionnelle, réactive et à l'écoute de nos besoins et ne propose pas un profil juste pour la proposition mais parce qu'il aura sûrement quelque chose à nous apporter.",
    author: 'Julien Manceau',
    role: 'Product Owner',
  },
  {
    quote:
      "Notre collaboration avec Faceel-IT a été très positive. Le suivi RH et commercial est régulier et professionnel, avec une grande réactivité de l'équipe. La qualité des prestations est au rendez-vous, les échanges sont fluides et constructifs, et nous apprécions particulièrement la disponibilité et l'écoute de l'équipe de gestion, qui assure un accompagnement de proximité.",
    author: 'G.',
    role: 'Digital Product leader',
  },
]

const clientTestimonialIndex = ref(0)

function prevClientTestimonial() {
  clientTestimonialIndex.value =
    (clientTestimonialIndex.value - 1 + CLIENT_TESTIMONIALS.length) % CLIENT_TESTIMONIALS.length
}

function nextClientTestimonial() {
  clientTestimonialIndex.value = (clientTestimonialIndex.value + 1) % CLIENT_TESTIMONIALS.length
}

const clientTestimonialEl = useTemplateRef<HTMLElement>('clientTestimonialEl')
// carrousel temoignages : balayage tactile en plus des fleches
useSwipe(clientTestimonialEl, {
  threshold: 50,
  onSwipeEnd(_event, direction) {
    if (direction === 'left') nextClientTestimonial()
    else if (direction === 'right') prevClientTestimonial()
  },
})

/* -------------------------------------------------------------------------- */
/* Compteurs animés chiffres clés                                             */
/* -------------------------------------------------------------------------- */

/**
 * Valeurs fournies telles quelles par le brief  aucune valeur inventée
 * (cf. CLAUDE.md, intégrité du contenu).
 */
const STAT_COLLABORATEURS = 65
const STAT_PROJETS = 170
const STAT_CLIENTS = 30

/**
 * `ref` initialisée DIRECTEMENT à sa valeur finale, jamais à 0 : le
 * pré-rendu `vite-ssg` et le tout premier rendu client doivent afficher le
 * même chiffre (même discipline que `typedText` du typewriter de `HomeView`
 * cf. son commentaire d'en-tête). Le compte à rebours vers 0 puis la
 * remontée animée n'ont lieu QUE sur la transition `hidden` → `visible` de
 * `useScrollReveal` (cf. `animateCount` plus bas) : jamais au montage, jamais
 * si la section est déjà à l'écran au chargement (pas de faux « saut à 0 »
 * visible), et jamais sous `prefers-reduced-motion` (cette transition ne se
 * produit alors tout simplement pas, l'état reste `idle` pour toujours  cf.
 * `useScrollReveal.ts`).
 */
const statCollaborateurs = ref(STAT_COLLABORATEURS)
const statProjets = ref(STAT_PROJETS)
const statClients = ref(STAT_CLIENTS)

/**
 * `performance.now()`, pas `Date.now()` : seule différence pertinente ici,
 * les deux sont non déterministes, mais cette fonction n'est JAMAIS appelée
 * pendant un rendu (SSR ou premier rendu client) uniquement en réaction à
 * un `watch` déclenché après montage, cf. commentaire des refs ci-dessus.
 * Le garde `noopener` habituel (`import.meta.env.SSR`) est inutile ici :
 * l'appelant (le `watch`) ne peut lui-même s'exécuter que côté client.
 */
function animateCount(target: Ref<number>, endValue: number, durationMs = 1400) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) {
    target.value = endValue
    return
  }
  target.value = 0
  const startTime = performance.now()
  function step(now: number) {
    const progress = Math.min((now - startTime) / durationMs, 1)
    target.value = Math.round(endValue * progress)
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

watch(statsReveal, (state, previous) => {
  if (state === 'hidden') {
    statCollaborateurs.value = 0
    statProjets.value = 0
    statClients.value = 0
    return
  }
  if (state !== 'visible' || previous !== 'hidden') return
  animateCount(statCollaborateurs, STAT_COLLABORATEURS)
  animateCount(statProjets, STAT_PROJETS)
  animateCount(statClients, STAT_CLIENTS)
})

/* -------------------------------------------------------------------------- */
/* Valeurs & croissance                                                       */
/* -------------------------------------------------------------------------- */

interface ValueBlock {
  title: string
  description: string
}

const VALUE_BLOCKS: ValueBlock[] = [
  {
    title: 'Relation',
    description: 'Une relation de confiance basée sur l’écoute, la transparence et l’engagement.',
  },
  {
    title: 'Passion',
    description: 'Des projets menés avec passion par des équipes investies et réactives.',
  },
  {
    title: 'Résultat',
    description: 'Des résultats concrets qui parlent d’eux-mêmes.',
  },
  {
    title: 'Proximité',
    description:
      'Ici, nous construisons des partenariats durables, fondés sur la proximité, l’écoute et le sens du service.',
  },
]

/**
 * Courbe de croissance - vraies donnees ca, 2021 a 2027 (realise jusqu'en
 * 2025, prevision 2026, objectif 2027). Le trace relie chaque point par un
 * segment droit (pas de courbe lissee) : la pente de chaque segment reste
 * donc mathematiquement fidele a l'ecart reel entre deux annees, plutot que
 * d'etre « trichee » visuellement par une interpolation.
 */
interface CaPoint {
  year: number
  /** En millions d'euros. */
  value: number
  status: 'realise' | 'prevision' | 'objectif'
}

const CA_POINTS: CaPoint[] = [
  { year: 2021, value: 0.65, status: 'realise' },
  { year: 2022, value: 2.5, status: 'realise' },
  { year: 2023, value: 5.5, status: 'realise' },
  { year: 2024, value: 5.8, status: 'realise' },
  { year: 2025, value: 6.5, status: 'realise' },
  { year: 2026, value: 7.2, status: 'prevision' },
  { year: 2027, value: 8.5, status: 'objectif' },
]

/** Echelle 0 a 8.5 M€ : un vrai zero en bas (pas 0.65) pour que la hauteur
 *  de chaque point reste honnete par rapport a la grille de lecture affichee
 *  a gauche (8, 6, 4, 2, 0 M€), plutot que d'exagerer visuellement la pente
 *  en calant le minimum du graphique sur la plus petite valeur reelle. */
const CHART_SCALE_MIN = 0
const CHART_SCALE_MAX = 8.5
const CHART_X_MIN = 20
const CHART_X_MAX = 380
const CHART_Y_TOP = 30
const CHART_Y_BOTTOM = 190

function chartX(index: number) {
  return CHART_X_MIN + (index / (CA_POINTS.length - 1)) * (CHART_X_MAX - CHART_X_MIN)
}

// axe vertical ca : meme fonction que les points, les paliers restent alignes
function chartY(value: number) {
  const ratio = (value - CHART_SCALE_MIN) / (CHART_SCALE_MAX - CHART_SCALE_MIN)
  return CHART_Y_BOTTOM - ratio * (CHART_Y_BOTTOM - CHART_Y_TOP)
}

/** Paliers de l'axe vertical, de haut en bas (cf. template, `justify-between`
 *  reproduit cet ordre dans la colonne de labels). */
const Y_AXIS_TICKS = [8, 6, 4, 2, 0]

const CHART_POINTS = computed(() =>
  CA_POINTS.map((point, index) => ({
    ...point,
    x: chartX(index),
    y: chartY(point.value),
  })),
)

/** Genere le `d` du trace a partir des points reels, un segment droit par
 *  paire de points consecutifs plutot qu'une courbe de Bezier en dur. */
const CHART_PATH = computed(() =>
  CHART_POINTS.value
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`)
    .join(' '),
)

/** Longueur de tracé volontairement large (la vraie longueur du chemin SVG
 *  est d'environ 420 unités) : un `stroke-dasharray` supérieur au tracé réel
 *  reste correct (le trait « en trop » ne se voit jamais), pas besoin de
 *  mesurer la longueur exacte au pixel près. */
const GROWTH_DASH_LENGTH = 500

// vraies donnees ca : encarts sous le graphique
interface CaHighlight {
  title: string
  description: string
}

const CA_HIGHLIGHTS: CaHighlight[] = [
  {
    title: 'x 10 de CA en cinq ans',
    description: 'De 650 k€ en 2021 à 6,5 M€ en 2025 - une croissance purement organique.',
  },
  {
    title: '+ 70 collaborateurs',
    description: '50 collaborateurs en CDI et 23 freelances, tous en mission.',
  },
  {
    title: '≈ 70 % de CDI',
    description:
      'Un choix assumé depuis le début : des équipes stables plutôt qu’une variable d’ajustement.',
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
       1. INTRODUCTION  sombre, titre à gauche / texte à droite.
       ================================================================== -->
    <section
      id="introduction"
      data-theme="dark"
      class="h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center px-4 py-16 text-white sm:px-6 lg:px-8 xl:px-12 bg-[#000066]"
    >
      <div
        ref="introEl"
        class="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20"
      >
        <h1
          class="font-display text-display text-balance transition-all duration-700 ease-out motion-reduce:transition-none [animation-delay:80ms]"
          :class="scrollRevealClass(introReveal, 'left')"
        >
          Notre histoire au
          <!-- Effet contour demandé par le brief : `-webkit-text-stroke` avec
             repli (`supports-[...]`)  sur un navigateur qui ne le supporte
             pas, le mot reste simplement en plein blanc, jamais invisible. -->
          <span
            class="text-white supports-[-webkit-text-stroke:1px]:text-transparent supports-[-webkit-text-stroke:1px]:[-webkit-text-stroke:2px_white]"
          >
            service
          </span>
          de nos clients des Hauts-de-France
        </h1>

        <div
          class="transition-all duration-700 ease-out motion-reduce:transition-none [animation-delay:160ms]"
          :class="scrollRevealClass(introReveal, 'right')"
        >
          <p class="text-lg leading-relaxed text-white sm:text-xl">
            Depuis notre création en 2021, de nombreuses entreprises nous confient leurs projets les
            plus stratégiques&nbsp;: grandes enseignes, PME innovantes ou startups ambitieuses.
            Toutes partagent une même exigence de qualité, de proximité et de performance.
          </p>
          <p class="mt-6 text-lg leading-relaxed text-white sm:text-xl">
            Chez Faceel-IT, nous allons au-delà de la simple prestation&nbsp;: nous co-construisons
            des solutions durables, agiles et sur-mesure. La satisfaction de nos clients est notre
            plus grande fierté.
          </p>
        </div>
      </div>
    </section>

    <!-- ==================================================================
       2. NOS OFFRES DE SERVICES  clair, deux cartes plein écran.

       Cartes en SURFACE SOMBRE (`bg-primary-900`) À L'INTÉRIEUR d'une
       section `data-theme="light"` : c'est ce qui permet au titre de
       respecter la couleur demandée par le brief, `text-accent-500` (9,1:1
       sur `bg-primary-900`)  sur l'aplat clair de la section elle-même, ce
       même vert ne tient que 1,9:1 (cf. l'en-tête de `main.css`). Motif
       décoratif en dégradé plutôt qu'une photo : le brief autorise
       explicitement « images de fond OU d'illustration », et aucune photo
       distincte du reste du site n'était disponible sans dépasser plusieurs
       Mo (cf. `HistoireView.vue`, même arbitrage). -->
    <section
      id="offres"
      data-theme="light"
      class="h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center px-4 pt-24 pb-16 md:pt-16 sm:px-6 lg:px-8 xl:px-12 bg-light"
    >
      <div ref="offresEl" class="mx-auto grid w-full max-w-6xl gap-8 sm:grid-cols-2">
        <article
          class="group relative isolate min-h-[22rem] overflow-hidden rounded-3xl bg-primary-900 p-8 shadow-lift transition-all duration-700 ease-out motion-reduce:transition-none sm:p-10"
          :class="scrollRevealClass(offresReveal, 'left')"
        >
          <div
            aria-hidden="true"
            class="absolute inset-0 -z-10 bg-gradient-to-br from-primary-700/50 via-primary-900 to-primary-950 transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
          />
          <p class="text-eyebrow uppercase text-accent-500">Régie</p>
          <h2 class="mt-4 font-display text-title text-balance text-white">Régie</h2>
          <p class="mt-4 max-w-sm text-base leading-relaxed text-white/75">
            Accompagnement sur mesure et de proximité auprès de nos clients parisiens et lillois.
            Une équipe RH et commerce qui travaille à vous proposer les meilleurs talents.
          </p>
        </article>

        <article
          class="group relative isolate min-h-[22rem] overflow-hidden rounded-3xl bg-primary-900 p-8 shadow-lift transition-all duration-700 ease-out motion-reduce:transition-none sm:p-10 [animation-delay:120ms]"
          :class="scrollRevealClass(offresReveal, 'right')"
        >
          <div
            aria-hidden="true"
            class="absolute inset-0 -z-10 bg-gradient-to-bl from-accent-900/40 via-primary-900 to-primary-950 transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
          />
          <p class="text-eyebrow uppercase text-accent-500">Centre de service</p>
          <h2 class="mt-4 font-display text-title text-balance text-white">Centre de service</h2>
          <p class="mt-4 max-w-sm text-base leading-relaxed text-white/75">
            En 2023 nous créons notre centre de services basé au cœur de la métropole lilloise, qui
            nous permet d’accompagner nos clients pour des projets au forfait ou en régie groupée à
            distance.
          </p>
        </article>
      </div>
    </section>

    <!-- ==================================================================
       3. PHILOSOPHIE & CHIFFRES CLÉS  sombre, accroche géante + compteurs.
       ================================================================== -->
    <section
      id="philosophie"
      data-theme="dark"
      class="h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center px-4 py-16 text-center text-white sm:px-6 lg:px-8 xl:px-12 bg-[#000066]"
    >
      <div ref="statsEl" class="mx-auto w-full max-w-5xl" :class="scrollRevealClass(statsReveal)">
        <blockquote
          class="mx-auto max-w-4xl font-display text-3xl leading-snug text-balance sm:text-4xl lg:text-5xl"
        >
          Chez Faceel-it, nous ne nous contentons pas de vous délivrer une prestation&nbsp;: nous
          co-construisons des solutions durables, agiles et sur-mesure.
          <span class="text-accent-500">Votre satisfaction est notre plus grande fierté.</span>
        </blockquote>

        <!-- Trois compteurs, décalés en cascade (« stagger ») via
           `[animation-delay]` croissant sur la même transition d'apparition
           que le bloc parent  l'effet « waouh » demandé sans réinventer de
           mécanique d'animation à part. -->
        <dl class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div class="[animation-delay:80ms]">
            <dd
              class="font-display text-6xl font-extrabold tracking-tight text-accent-500 sm:text-7xl"
            >
              {{ statCollaborateurs }}
            </dd>
            <dt class="mt-2 text-eyebrow uppercase text-white">Collaborateurs</dt>
          </div>
          <div class="[animation-delay:200ms]">
            <dd
              class="font-display text-6xl font-extrabold tracking-tight text-accent-500 sm:text-7xl"
            >
              {{ statProjets }}+
            </dd>
            <dt class="mt-2 text-eyebrow uppercase text-white">Projets réalisés</dt>
          </div>
          <div class="[animation-delay:320ms]">
            <dd
              class="font-display text-6xl font-extrabold tracking-tight text-accent-500 sm:text-7xl"
            >
              {{ statClients }}
            </dd>
            <dt class="mt-2 text-eyebrow uppercase text-white">Clients satisfaits</dt>
          </div>
        </dl>
      </div>
    </section>

    <!-- ==================================================================
       4. VALEURS & CROISSANCE clair, bento (4 blocs + courbe SVG).
       ================================================================== -->
    <section
      id="valeurs"
      data-theme="light"
      class="min-h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center px-4 py-16 sm:px-6 lg:px-8 xl:px-12 bg-light"
    >
      <div ref="valeursEl" class="mx-auto w-full max-w-6xl">
        <h2
          class="font-display text-display text-balance text-primary-900 transition-all duration-700 ease-out motion-reduce:transition-none"
          :class="scrollRevealClass(valeursReveal)"
        >
          Nos chiffres parlent d’eux-mêmes
        </h2>

        <div class="mt-10 grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-10">
          <!-- Bento des 4 valeurs : chaque tuile décale son entrée d'un cran
             (« stagger », `[animation-delay]` croissant par index) via une
             classe utilitaire calculée déterministe (dérivée de `index`,
             jamais de `Math.random()`, cf. CLAUDE.md). -->
          <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <li
              v-for="(value, index) in VALUE_BLOCKS"
              :key="value.title"
              class="rounded-card bg-white p-6 ring-1 ring-primary-900/8 shadow-soft transition-all duration-700 ease-out motion-reduce:transition-none"
              :style="{ transitionDelay: `${index * 120}ms` }"
              :class="scrollRevealClass(valeursReveal)"
            >
              <span aria-hidden="true" class="block h-1 w-8 rounded-full bg-accent-500" />
              <p class="mt-4 font-display text-lg font-bold text-primary-900">{{ value.title }}</p>
              <p class="mt-2 text-sm leading-relaxed text-primary-900/70">
                {{ value.description }}
              </p>
            </li>
          </ul>

          <!-- Courbe de croissance : le tracé se dessine au scroll via
             `stroke-dashoffset`. `chartDrawn` (et non `=== 'visible'`
             directement) : sous `prefers-reduced-motion`, l'état reste
             `idle` pour toujours (cf. `useScrollReveal.ts`)  un test strict
             sur `'visible'` aurait laissé le graphique éternellement
             masqué pour ces visiteurs, pire qu'une absence d'animation. -->
          <div
            class="flex flex-col justify-center rounded-card bg-white p-6 ring-1 ring-primary-900/8 shadow-soft sm:p-8"
          >
            <!-- fix contraste texte -->
            <p class="text-eyebrow uppercase text-primary-700">Croissance</p>

            <!-- grille de lecture : colonne d'axe a gauche, svg + axe annees a droite -->
            <div class="mt-4 grid grid-cols-[3rem_1fr] gap-2">
              <!-- axe vertical ca : couleurs solides wcag -->
              <div class="flex flex-col justify-between py-1 text-right">
                <span v-for="tick in Y_AXIS_TICKS" :key="tick" class="text-xs text-primary-700">
                  {{ tick === 0 ? '0' : `${tick} M€` }}
                </span>
              </div>

              <div>
                <svg viewBox="0 0 400 220" class="h-auto w-full" aria-hidden="true">
                  <!-- une ligne de grille par palier, alignee sur chartY -->
                  <line
                    v-for="tick in Y_AXIS_TICKS"
                    :key="`grid-${tick}`"
                    x1="20"
                    x2="380"
                    :y1="chartY(tick)"
                    :y2="chartY(tick)"
                    stroke="currentColor"
                    class="text-gray-200"
                    stroke-width="1"
                  />
                  <!-- une graduation par annee, generee depuis les vraies donnees -->
                  <path
                    v-for="point in CHART_POINTS"
                    :key="`tick-${point.year}`"
                    :d="`M${point.x},180 L${point.x},190`"
                    stroke="currentColor"
                    class="text-primary-900/15"
                    stroke-width="2"
                  />
                  <path
                    :d="CHART_PATH"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-accent-500 transition-[stroke-dashoffset] duration-[1800ms] ease-out motion-reduce:transition-none"
                    :stroke-dasharray="GROWTH_DASH_LENGTH"
                    :stroke-dashoffset="valeursReveal !== 'hidden' ? 0 : GROWTH_DASH_LENGTH"
                  />
                  <!-- realise : rond plein vert. prevision/objectif : fond sombre, bord vert -->
                  <circle
                    v-for="point in CHART_POINTS"
                    :key="point.year"
                    :cx="point.x"
                    :cy="point.y"
                    r="5"
                    :class="
                      point.status === 'realise'
                        ? 'fill-accent-500'
                        : 'fill-primary-950 stroke-accent-500 stroke-2'
                    "
                  />
                </svg>

                <!-- axe horizontal annees : meme repartition que chartX, couleurs solides wcag -->
                <div class="mt-1 flex justify-between px-[5%] text-xs text-primary-700">
                  <span v-for="point in CHART_POINTS" :key="point.year">{{ point.year }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3 encarts sous le graphique -->
        <div class="mt-6 grid gap-4 sm:grid-cols-3">
          <div
            v-for="highlight in CA_HIGHLIGHTS"
            :key="highlight.title"
            class="rounded-card bg-white p-6 ring-1 ring-primary-900/8 shadow-soft"
          >
            <p class="font-display text-lg font-bold text-primary-900">{{ highlight.title }}</p>
            <p class="mt-2 text-sm leading-relaxed text-primary-900/70">
              {{ highlight.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================================================================
       5. RECOMMANDATION  sombre, stat 89% + carrousel temoignages clients.
       ================================================================== -->
    <!-- section reco clients -->
    <section
      id="recommandation"
      data-theme="dark"
      class="h-dvh shrink-0 w-full snap-start snap-always flex flex-col items-center justify-center bg-[#000066] px-4 py-16 text-center text-white sm:px-6 lg:px-8 xl:px-12"
    >
      <div
        ref="recoEl"
        class="mx-auto w-full max-w-4xl transition-all duration-700 ease-out motion-reduce:transition-none"
        :class="scrollRevealClass(recoReveal)"
      >
        <p class="font-display text-7xl font-extrabold tracking-tight text-accent-500 sm:text-8xl">
          89&nbsp;%
        </p>
        <p class="mt-2 text-lg font-semibold text-white sm:text-xl">
          de taux de recommandation parmi nos clients.
        </p>

        <!-- carrousel temoignages -->
        <div class="mt-12 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Témoignage précédent"
            class="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
            @click="prevClientTestimonial"
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

          <div ref="clientTestimonialEl" class="w-full max-w-2xl">
            <Transition
              enter-active-class="transition-all duration-500 ease-out motion-reduce:transition-none"
              enter-from-class="opacity-0 translate-y-4"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-300 ease-in motion-reduce:transition-none"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-4"
              mode="out-in"
            >
              <blockquote :key="clientTestimonialIndex" class="border-t border-white/10 pt-8">
                <p class="text-lg leading-relaxed text-balance text-white sm:text-xl">
                  « {{ CLIENT_TESTIMONIALS[clientTestimonialIndex]!.quote }} »
                </p>
                <footer class="mt-6 text-sm font-semibold text-white/60">
                  {{ CLIENT_TESTIMONIALS[clientTestimonialIndex]!.author }}
                  <span class="font-normal italic">
                    , {{ CLIENT_TESTIMONIALS[clientTestimonialIndex]!.role }}
                  </span>
                </footer>
              </blockquote>
            </Transition>
          </div>

          <button
            type="button"
            aria-label="Témoignage suivant"
            class="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
            @click="nextClientTestimonial"
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

        <p class="mt-6 text-sm font-semibold text-white/50">
          {{ clientTestimonialIndex + 1 }} / {{ CLIENT_TESTIMONIALS.length }}
        </p>
      </div>
    </section>

    <!-- ==================================================================
       6. REFERENCES CLIENTS  section ref home, meme composant que HomeView.vue.
       ================================================================== -->
    <section
      id="references"
      data-theme="light"
      class="h-dvh shrink-0 w-full snap-start snap-always overflow-hidden bg-white"
    >
      <ReferencesSection />
    </section>

    <!-- ==================================================================
       7. FOOTER  repris dans le flux snap local (cf. HomeView.vue) ;
       App.vue masque son footer global pour cette route pour éviter le
       doublon.
       ================================================================== -->
    <section
      data-theme="dark"
      class="h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-end bg-[#000066]"
    >
      <TheFooter />
    </section>
  </div>
  <!-- /conteneur snap -->
</template>
