<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import { useTemplateRef } from 'vue'
import PartnerCarousel, { type PartnerCarouselItem } from '@/components/ui/PartnerCarousel.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import { scrollRevealClass, useScrollReveal } from '@/composables/useScrollReveal'
import { useSeo } from '@/composables/useSeo'

/**
 * Page « Je suis une entreprise » — V0.8.
 *
 * ROUTE DÉDIÉE, PAS UNE ANCRE DE `/` : `mainNav.ts` (entrée `id: 'entreprise'`)
 * documentait déjà cette page comme la destination finale prévue (« CIBLES
 * PROVISOIRES […] À l'ouverture des pages dédiées, remplacer les `hash` par
 * les `name` de route correspondants ») — `router/routes.ts` et `mainNav.ts`
 * ont été mis à jour dans le même mouvement, cf. leurs commentaires respectifs.
 *
 * DÉFILEMENT PLEIN ÉCRAN : `meta.fullPageScroll` posé sur cette route (même
 * mécanisme qu'`ADR 26`/`docs/DECISIONS.md`, déjà réutilisé pour
 * `/qui-sommes-nous/notre-histoire` — aucune troisième variante inventée ici).
 *
 * LOGOS PARTENAIRES DUPLIQUÉS DEPUIS `HomeView.vue` — la liste n'est pas
 * exportée depuis un module `features/` (elle vit en `const` locale dans
 * `HomeView.vue`) ; l'extraire aurait dépassé le périmètre demandé (« produis
 * uniquement EnterpriseView.vue »). Un troisième consommateur rendrait
 * l'extraction vers `features/partners/` incontournable. AXA, cité dans le
 * brief, n'existe PAS dans le jeu de logos déjà importés par le site (aucun
 * SVG source, aucune mention ailleurs dans le dépôt) — non ajouté, cf. règle
 * d'intégrité du contenu (CLAUDE.md) : la liste réelle du site est reprise
 * telle quelle plutôt que complétée d'un logo inventé.
 */
useSeo({
  title: 'Je suis une entreprise',
  description:
    'Faceel-IT accompagne les entreprises dans leurs projets stratégiques : régie de proximité, ' +
    'centre de services à Lille, 65 collaborateurs, plus de 170 projets réalisés.',
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
const testimonialEl = useTemplateRef<HTMLElement>('testimonialEl')
const testimonialReveal = useScrollReveal(testimonialEl)
const confianceEl = useTemplateRef<HTMLElement>('confianceEl')
const confianceReveal = useScrollReveal(confianceEl)

/* -------------------------------------------------------------------------- */
/* Confiance — bandeau de logos (repris de `HomeView.vue`, cf. commentaire   */
/* d'en-tête)                                                                 */
/* -------------------------------------------------------------------------- */

const PARTNERS: PartnerCarouselItem[] = [
  { name: 'Auchan', logoUrl: '/images/partners/auchan.svg', url: 'https://www.auchan.fr/' },
  { name: 'Boulanger', logoUrl: '/images/partners/boulanger.svg', url: 'https://www.boulanger.com/' },
  { name: 'Verspieren', logoUrl: '/images/partners/verspieren.svg', url: 'https://www.verspieren.com/' },
  { name: 'Decathlon', logoUrl: '/images/partners/decathlon.svg', url: 'https://www.decathlon.fr/' },
  { name: 'Midas', logoUrl: '/images/partners/midas.svg', url: 'https://www.midas.fr/' },
  { name: 'Kiabi', logoUrl: '/images/partners/kiabi.svg', url: 'https://www.kiabi.com/' },
  { name: 'Mondial Relay', logoUrl: '/images/partners/mondial_relay.svg', url: 'https://www.mondialrelay.fr/' },
  { name: 'Leroy Merlin', logoUrl: '/images/partners/leroy_merlin.svg', url: 'https://www.leroymerlin.fr/' },
]

/* -------------------------------------------------------------------------- */
/* Compteurs animés — chiffres clés et taux de recommandation                */
/* -------------------------------------------------------------------------- */

/**
 * Valeurs fournies telles quelles par le brief — aucune valeur inventée
 * (cf. CLAUDE.md, intégrité du contenu).
 */
const STAT_COLLABORATEURS = 65
const STAT_PROJETS = 170
const STAT_CLIENTS = 30
const STAT_RECOMMANDATION = 89

/**
 * `ref` initialisée DIRECTEMENT à sa valeur finale, jamais à 0 : le
 * pré-rendu `vite-ssg` et le tout premier rendu client doivent afficher le
 * même chiffre (même discipline que `typedText` du typewriter de `HomeView`
 * — cf. son commentaire d'en-tête). Le compte à rebours vers 0 puis la
 * remontée animée n'ont lieu QUE sur la transition `hidden` → `visible` de
 * `useScrollReveal` (cf. `animateCount` plus bas) : jamais au montage, jamais
 * si la section est déjà à l'écran au chargement (pas de faux « saut à 0 »
 * visible), et jamais sous `prefers-reduced-motion` (cette transition ne se
 * produit alors tout simplement pas, l'état reste `idle` pour toujours — cf.
 * `useScrollReveal.ts`).
 */
const statCollaborateurs = ref(STAT_COLLABORATEURS)
const statProjets = ref(STAT_PROJETS)
const statClients = ref(STAT_CLIENTS)
const statRecommandation = ref(STAT_RECOMMANDATION)

/**
 * `performance.now()`, pas `Date.now()` : seule différence pertinente ici,
 * les deux sont non déterministes, mais cette fonction n'est JAMAIS appelée
 * pendant un rendu (SSR ou premier rendu client) — uniquement en réaction à
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

watch(testimonialReveal, (state, previous) => {
  if (state === 'hidden') {
    statRecommandation.value = 0
    return
  }
  if (state !== 'visible' || previous !== 'hidden') return
  animateCount(statRecommandation, STAT_RECOMMANDATION)
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
 * Courbe de croissance — SEULS DEUX POINTS SONT TRACÉS (2022, 2024) : le
 * brief donne un point de départ (2,5 M€) et un point d'arrivée (> 7,5 M€),
 * jamais de valeur intermédiaire 2023. En ajouter une inventée violerait la
 * règle d'intégrité du contenu (CLAUDE.md) — la coordonnée manquante ne se
 * remplace jamais par une valeur plausible. 2023 reste une simple graduation
 * d'axe (repère temporel), sans hauteur de courbe qui lui soit propre.
 */
const GROWTH_START_LABEL = '2022 · 2,5 M€'
const GROWTH_END_LABEL = '2024 · > 7,5 M€'
/** Longueur de tracé volontairement large (la vraie longueur du chemin SVG
 *  est d'environ 420 unités) : un `stroke-dasharray` supérieur au tracé réel
 *  reste correct (le trait « en trop » ne se voit jamais), pas besoin de
 *  mesurer la longueur exacte au pixel près. */
const GROWTH_DASH_LENGTH = 500
</script>

<template>
  <!-- Pas de `<main>` ici : la coquille (`App.vue`) le fournit déjà. -->

  <!-- CONTENEUR SNAP OPT-IN : isole le scroll magnétique de cette vue sans
       dépendre de la hauteur flexée de <main> (cf. HomeView.vue) — le
       `meta.fullPageScroll` évoqué plus haut n'existe nulle part ailleurs
       dans le dépôt (routes.ts / App.vue), ce conteneur local est donc le
       seul mécanisme réel de snap sur cette page. -->
  <div class="h-dvh w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory">
  <!-- ==================================================================
       1. INTRODUCTION — sombre, titre à gauche / texte à droite.
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
             repli (`supports-[...]`) — sur un navigateur qui ne le supporte
             pas, le mot reste simplement en plein blanc, jamais invisible. -->
        <span
          class="text-white supports-[-webkit-text-stroke:1px]:text-transparent supports-[-webkit-text-stroke:1px]:[-webkit-text-stroke:2px_white]"
        >
          service
        </span>
        de nos clients
      </h1>

      <div
        class="transition-all duration-700 ease-out motion-reduce:transition-none [animation-delay:160ms]"
        :class="scrollRevealClass(introReveal, 'right')"
      >
        <p class="text-lg leading-relaxed text-white/75 sm:text-xl">
          Depuis notre création en 2020, de nombreuses entreprises nous confient leurs projets les
          plus stratégiques&nbsp;: grandes enseignes, PME innovantes ou startups ambitieuses. Toutes
          partagent une même exigence de qualité, de proximité et de performance.
        </p>
        <p class="mt-6 text-lg leading-relaxed text-white/75 sm:text-xl">
          Chez Faceel-IT, nous allons au-delà de la simple prestation&nbsp;: nous co-construisons
          des solutions durables, agiles et sur-mesure. La satisfaction de nos clients est notre
          plus grande fierté.
        </p>
      </div>
    </div>
  </section>

  <!-- ==================================================================
       2. NOS OFFRES DE SERVICES — clair, deux cartes plein écran.

       Cartes en SURFACE SOMBRE (`bg-primary-900`) À L'INTÉRIEUR d'une
       section `data-theme="light"` : c'est ce qui permet au titre de
       respecter la couleur demandée par le brief, `text-accent-500` (9,1:1
       sur `bg-primary-900`) — sur l'aplat clair de la section elle-même, ce
       même vert ne tient que 1,9:1 (cf. l'en-tête de `main.css`). Motif
       décoratif en dégradé plutôt qu'une photo : le brief autorise
       explicitement « images de fond OU d'illustration », et aucune photo
       distincte du reste du site n'était disponible sans dépasser plusieurs
       Mo (cf. `HistoireView.vue`, même arbitrage). -->
  <section
    id="offres"
    data-theme="light"
    class="h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center px-4 py-16 sm:px-6 lg:px-8 xl:px-12 bg-light"
  >
    <div ref="offresEl" class="mx-auto grid w-full max-w-6xl gap-6 sm:grid-cols-2">
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
          Accompagnement sur mesure et de proximité auprès de nos clients parisiens et lillois. Une
          équipe RH et commerce qui travaille à vous proposer les meilleurs talents.
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
       3. PHILOSOPHIE & CHIFFRES CLÉS — sombre, accroche géante + compteurs.
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
           que le bloc parent — l'effet « waouh » demandé sans réinventer de
           mécanique d'animation à part. -->
      <dl class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div class="[animation-delay:80ms]">
          <dd
            class="font-display text-6xl font-extrabold tracking-tight text-accent-500 sm:text-7xl"
          >
            {{ statCollaborateurs }}
          </dd>
          <dt class="mt-2 text-eyebrow uppercase text-white/60">Collaborateurs</dt>
        </div>
        <div class="[animation-delay:200ms]">
          <dd
            class="font-display text-6xl font-extrabold tracking-tight text-accent-500 sm:text-7xl"
          >
            {{ statProjets }}+
          </dd>
          <dt class="mt-2 text-eyebrow uppercase text-white/60">Projets réalisés</dt>
        </div>
        <div class="[animation-delay:320ms]">
          <dd
            class="font-display text-6xl font-extrabold tracking-tight text-accent-500 sm:text-7xl"
          >
            {{ statClients }}
          </dd>
          <dt class="mt-2 text-eyebrow uppercase text-white/60">Clients satisfaits</dt>
        </div>
      </dl>
    </div>
  </section>

  <!-- ==================================================================
       4. VALEURS & CROISSANCE — clair, bento (4 blocs + courbe SVG).
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
             classe utilitaire calculée — déterministe (dérivée de `index`,
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
             `idle` pour toujours (cf. `useScrollReveal.ts`) — un test strict
             sur `'visible'` aurait laissé le graphique éternellement
             masqué pour ces visiteurs, pire qu'une absence d'animation. -->
        <div
          class="flex flex-col justify-center rounded-card bg-white p-6 ring-1 ring-primary-900/8 shadow-soft sm:p-8"
        >
          <p class="text-eyebrow uppercase text-primary-900/45">Croissance</p>
          <svg viewBox="0 0 400 220" class="mt-4 h-auto w-full" aria-hidden="true">
            <path
              d="M20,180 L20,190 M380,180 L380,190"
              stroke="currentColor"
              class="text-primary-900/15"
              stroke-width="2"
            />
            <path
              d="M20,190 C130,190 150,60 220,60 C280,60 260,40 380,30"
              fill="none"
              stroke="currentColor"
              stroke-width="4"
              stroke-linecap="round"
              class="text-accent-500 transition-[stroke-dashoffset] duration-[1800ms] ease-out motion-reduce:transition-none"
              :stroke-dasharray="GROWTH_DASH_LENGTH"
              :stroke-dashoffset="valeursReveal !== 'hidden' ? 0 : GROWTH_DASH_LENGTH"
            />
            <circle cx="20" cy="190" r="5" class="fill-accent-500" />
            <circle cx="380" cy="30" r="5" class="fill-accent-500" />
          </svg>
          <div
            class="mt-2 flex items-center justify-between text-sm font-semibold text-primary-900"
          >
            <span>{{ GROWTH_START_LABEL }}</span>
            <span>{{ GROWTH_END_LABEL }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================================================================
       5. TESTIMONIAL & RECOMMANDATION — sombre, typographie très forte.
       ================================================================== -->
  <section
    id="recommandation"
    data-theme="dark"
    class="h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center px-4 py-16 text-center text-white sm:px-6 lg:px-8 xl:px-12 bg-[#000066]"
  >
    <div
      ref="testimonialEl"
      class="mx-auto w-full max-w-4xl transition-all duration-700 ease-out motion-reduce:transition-none"
      :class="scrollRevealClass(testimonialReveal)"
    >
      <p class="font-display text-8xl font-extrabold tracking-tight text-accent-500 sm:text-9xl">
        {{ statRecommandation }}&nbsp;%
      </p>
      <p class="mt-2 text-lg font-semibold text-white sm:text-xl">
        de taux de recommandation parmi nos clients
      </p>

      <!-- Bloc simple, pas de carrousel : le brief ne fournit qu'une seule
           citation. Un carrousel n'a de sens qu'à partir de deux items — en
           construire un pour un seul suggérerait faussement qu'il en existe
           d'autres. -->
      <blockquote class="mt-12 border-t border-white/10 pt-12">
        <p class="text-xl leading-relaxed text-balance text-white/85 sm:text-2xl">
          « La relation commerciale avec Faceel-IT est fluide, constructive et marquée par une
          grande réactivité. Les échanges sont de qualité, le suivi RH et commercial est rigoureux,
          et la prestation répond pleinement à nos attentes. »
        </p>
        <footer class="mt-6 text-sm font-semibold text-white/60">
          Jérémy KACZMAREK — HR Digital Product Manager
        </footer>
      </blockquote>
    </div>
  </section>

  <!-- ==================================================================
       6. CONFIANCE — clair, bandeau de logos partenaires.
       ================================================================== -->
  <section
    id="confiance"
    data-theme="light"
    class="h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center px-4 py-16 sm:px-6 lg:px-8 xl:px-12 bg-light"
  >
    <div
      ref="confianceEl"
      class="mx-auto w-full max-w-6xl transition-all duration-700 ease-out motion-reduce:transition-none"
      :class="scrollRevealClass(confianceReveal)"
    >
      <p class="text-center text-eyebrow uppercase text-primary-900/45">
        Ils nous ont fait confiance
      </p>
      <div class="mt-10">
        <PartnerCarousel :partners="PARTNERS" tone="light" />
      </div>
    </div>
  </section>

  <!-- ==================================================================
       7. FOOTER — repris dans le flux snap local (cf. HomeView.vue) ;
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
