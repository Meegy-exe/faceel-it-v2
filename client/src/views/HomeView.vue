<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import CardCarousel from '@/components/ui/CardCarousel.vue'
import CoverCarousel from '@/components/ui/CoverCarousel.vue'
import CarouselSlideContent from '@/components/ui/CarouselSlideContent.vue'
import ReferencesSection from '@/components/ui/ReferencesSection.vue'
import { scrollRevealClass, useScrollReveal } from '@/composables/useScrollReveal'
// PHOTOS « NOS ÉVÉNEMENTS » — déjà présentes dans `assets/images/` (dépôt
// client, dossier `Animate the header/assets/photos/`), aucune n'est encore
// utilisée ailleurs sur le site : pas de nouveau fichier à importer, pas de
// dépendance à un hébergeur d'images tiers. `picsum.photos` était exclu
// d'office — le CSP de production (`client/security-headers.conf`) déclare
// `img-src 'self'` sans exception, une image hotlinkée y serait simplement
// bloquée par le navigateur après déploiement.
import eventAfterwork from '@/assets/images/photos/afterwork.jpg'
import eventPaintball from '@/assets/images/photos/paintball.jpg'
import eventCourseGroupe from '@/assets/images/photos/course-groupe.jpg'
import eventCourseSolo from '@/assets/images/photos/course-solo.jpg'
import eventPadelEquipe from '@/assets/images/padel-equipe.jpg'
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'Accueil',
  fullTitle: 'Faceel-IT — ESN experte en Data, IA et Transformation digitale',
  description:
    'ESN à Wasquehal, Faceel-IT accompagne vos projets Data, Intelligence Artificielle, ' +
    'applications métier, Cloud et Cybersécurité.',
})

/* -------------------------------------------------------------------------- */
/* Animations d'apparition au défilement                                      */
/* -------------------------------------------------------------------------- */

const chiffresEl = useTemplateRef<HTMLElement>('chiffresEl')
const chiffresReveal = useScrollReveal(chiffresEl)
const servicesEl = useTemplateRef<HTMLElement>('servicesEl')
const servicesReveal = useScrollReveal(servicesEl)
const evenementsEl = useTemplateRef<HTMLElement>('evenementsEl')
const evenementsReveal = useScrollReveal(evenementsEl)
const secteursEl = useTemplateRef<HTMLElement>('secteursEl')
const secteursReveal = useScrollReveal(secteursEl)
const valeursEl = useTemplateRef<HTMLElement>('valeursEl')
const valeursReveal = useScrollReveal(valeursEl)
const rseEl = useTemplateRef<HTMLElement>('rseEl')
const rseReveal = useScrollReveal(rseEl)

/* -------------------------------------------------------------------------- */
/* Chiffres clés                                                              */
/* -------------------------------------------------------------------------- */

interface KeyStat {
  value: string
  label: string
}

/** Chiffres fournis tels quels par la demande client — aucune valeur
 *  inventée (cf. CLAUDE.md, intégrité du contenu). */
const KEY_STATS: KeyStat[] = [
  { value: '65', label: 'Collaborateurs' },
  { value: '170+', label: 'Projets réalisés' },
  { value: '30', label: 'Clients satisfaits' },
]

/* -------------------------------------------------------------------------- */
/* Services — « La tech au service des métiers »                              */
/* -------------------------------------------------------------------------- */

interface ServiceCard {
  title: string
  description: string
}

const SERVICES: ServiceCard[] = [
  {
    title: 'Accélération digitale',
    description:
      'Concevoir et déployer des solutions numériques performantes pour capter de nouveaux ' +
      "marchés, améliorer l'expérience client ou moderniser les parcours internes.",
  },
  {
    title: 'Performance opérationnelle',
    description:
      'Optimiser les processus métiers (production, logistique, vente, RH) grâce à des ' +
      "systèmes d'information sur mesure et interconnectés.",
  },
  {
    title: 'Valorisation des données',
    description:
      'Collecter, structurer et analyser les données pour en extraire des leviers de ' +
      "décision, d'innovation et de pilotage stratégique.",
  },
  {
    title: 'Maîtrise des risques',
    description:
      'Garantir la conformité (RGPD, sécurité, qualité), la fiabilité des systèmes et la ' +
      'réduction des vulnérabilités dans des environnements critiques.',
  },
  {
    title: 'Expérience utilisateur',
    description:
      'Concevoir des interfaces intuitives, améliorer la fluidité des parcours clients et ' +
      "collaborateurs, et renforcer l'engagement des utilisateurs finaux.",
  },
]

function activeService(index: number): ServiceCard {
  return SERVICES[index]!
}

/* -------------------------------------------------------------------------- */
/* Nos événements — galerie photo                                             */
/* -------------------------------------------------------------------------- */

interface EventPhoto {
  src: string
  alt: string
}

/** La première entrée est la tuile en vedette (cf. `v-for` du template, qui
 *  lui attribue seul `col-span-2 row-span-2`) — l'ordre du tableau porte donc
 *  une signification visuelle, ce n'est pas une liste interchangeable. */
const EVENT_PHOTOS: EventPhoto[] = [
  { src: eventAfterwork, alt: "Collègues réunis autour d'un after-work" },
  { src: eventPaintball, alt: 'Session de paintball entre collaborateurs' },
  { src: eventCourseGroupe, alt: "Course à pied en équipe lors d'un événement sportif" },
  { src: eventCourseSolo, alt: "Collaborateur à l'arrivée d'une course" },
  { src: eventPadelEquipe, alt: "Équipe réunie autour d'un terrain de padel" },
]

/* -------------------------------------------------------------------------- */
/* Secteurs d'activités                                                       */
/* -------------------------------------------------------------------------- */

interface SectorCard {
  title: string
  description: string
}

const SECTORS: SectorCard[] = [
  {
    title: 'Ecommerce',
    description: 'E-commerce & omnicanal, CRM & fidélisation, Gestion des stocks.',
  },
  {
    title: 'Industrie',
    description: 'ERP & production, Maintenance prédictive, Automatisation des flux.',
  },
  {
    title: 'Logistique',
    description: 'Optimisation supply chain, Traçabilité & tracking, Planification des ressources.',
  },
  {
    title: 'Banque & Assurance',
    description: 'Conformité & sécurité, Digitalisation des services, IA & automatisation.',
  },
]

function activeSector(index: number): SectorCard {
  return SECTORS[index]!
}

/* -------------------------------------------------------------------------- */
/* Valeur ajoutée                                                             */
/* -------------------------------------------------------------------------- */

interface ValueCard {
  title: string
  description: string
}

const VALUE_CARDS: ValueCard[] = [
  {
    title: 'Vision métier',
    description: 'Adaptation rapide aux besoins concrets de chaque secteur.',
  },
  {
    title: 'Adaptation rapide à votre contexte métier',
    description: 'Retail, industrie, ecommerce, assurance… Nos profils naviguent avec aisance.',
  },
  {
    title: 'Approche agile',
    description: 'Capacité à intervenir sur des projets courts ou de transformation profonde.',
  },
  {
    title: 'Rigueur technique',
    description: 'Une solide maîtrise des technologies modernes et des méthodologies IT.',
  },
]

function activeValue(index: number): ValueCard {
  return VALUE_CARDS[index]!
}

/* -------------------------------------------------------------------------- */
/* Politique RSE                                                              */
/* -------------------------------------------------------------------------- */

interface RseCard {
  title: string
  description: string
  badge?: string
}

const RSE_CARDS: RseCard[] = [
  {
    title: 'Mobilité urbaine',
    description:
      'Notre engagement pour une ville plus fluide et durable.\n' +
      "Nous soutenons activement les initiatives de mobilité urbaine visant à réduire l'empreinte carbone et à faciliter les déplacements doux.",
  },
  {
    title: 'Ecovadis',
    description:
      'Classée dans le top 15 % des entreprises évaluées par EcoVadis, notre entreprise est fière de contribuer à une économie plus responsable.',
    badge: 'Silver',
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

function activeRse(index: number): RseCard {
  return RSE_CARDS[index]!
}


/* -------------------------------------------------------------------------- */
/* Hero — effet machine à écrire                                              */
/* -------------------------------------------------------------------------- */

const HERO_TYPED_TEXT = 'On rejoint une équipe.'
const typedText = ref(HERO_TYPED_TEXT)

const HERO_TYPEWRITER_ERASE_MS = 45
const HERO_TYPEWRITER_TYPE_MS = 70
const HERO_TYPEWRITER_START_DELAY_MS = 1_500

let heroEraseTimeout: ReturnType<typeof setTimeout> | undefined
let heroTypeTimeout: ReturnType<typeof setTimeout> | undefined
let heroStartTimeout: ReturnType<typeof setTimeout> | undefined
let heroReduceMotionQuery: MediaQueryList | null = null

function clearHeroTypewriterTimeouts() {
  if (heroEraseTimeout !== undefined) {
    clearTimeout(heroEraseTimeout)
    heroEraseTimeout = undefined
  }
  if (heroTypeTimeout !== undefined) {
    clearTimeout(heroTypeTimeout)
    heroTypeTimeout = undefined
  }
}

function eraseHeroText(onDone: () => void) {
  function step() {
    if (typedText.value.length === 0) {
      onDone()
      return
    }
    typedText.value = typedText.value.slice(0, -1)
    heroEraseTimeout = setTimeout(step, HERO_TYPEWRITER_ERASE_MS)
  }
  step()
}

function typeHeroText(onDone: () => void) {
  let count = 0
  function step() {
    count += 1
    typedText.value = HERO_TYPED_TEXT.slice(0, count)
    if (count >= HERO_TYPED_TEXT.length) {
      onDone()
      return
    }
    heroTypeTimeout = setTimeout(step, HERO_TYPEWRITER_TYPE_MS)
  }
  step()
}

function playHeroTypewriterCycle() {
  eraseHeroText(() => typeHeroText(() => {}))
}

function startHeroTypewriterLoop() {
  heroStartTimeout = setTimeout(() => {
    heroStartTimeout = undefined
    playHeroTypewriterCycle()
  }, HERO_TYPEWRITER_START_DELAY_MS)
}

function stopHeroTypewriterLoop() {
  clearHeroTypewriterTimeouts()
  if (heroStartTimeout !== undefined) {
    clearTimeout(heroStartTimeout)
    heroStartTimeout = undefined
  }
}

function handleHeroReduceMotionChange() {
  stopHeroTypewriterLoop()
  if (heroReduceMotionQuery?.matches) {
    typedText.value = HERO_TYPED_TEXT
  } else {
    startHeroTypewriterLoop()
  }
}

onMounted(() => {
  if (import.meta.env.SSR) return

  heroReduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  heroReduceMotionQuery.addEventListener('change', handleHeroReduceMotionChange)

  if (!heroReduceMotionQuery.matches) startHeroTypewriterLoop()
})

onBeforeUnmount(() => {
  stopHeroTypewriterLoop()
  heroReduceMotionQuery?.removeEventListener('change', handleHeroReduceMotionChange)
})
</script>

<template>
  <section
    id="hero"
    data-theme="dark"
    class="relative isolate overflow-hidden h-full w-full snap-start snap-always flex flex-col justify-center bg-gradient-to-br from-[#000080] via-[#000066] to-[#000033] text-white pt-24 lg:pt-28"
  >
    <div class="relative z-10 w-full px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
      <div>
        <p
          class="animate-fade-up motion-reduce:animate-none text-eyebrow uppercase text-accent-500 drop-shadow-md"
        >
          ESN · Data × IA × Transformation digitale
        </p>

        <h1
          class="mt-6 flex max-w-7xl flex-col items-start gap-y-2 animate-fade-up motion-reduce:animate-none font-display text-5xl leading-[1.1] font-extrabold tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-8xl [animation-delay:80ms] drop-shadow-xl"
        >
          <span class="block text-white">On ne rejoint pas <br class="lg:hidden" />une ESN.</span>
          <span class="inline-flex h-[1.1em] items-baseline text-accent-500">
            <span class="sr-only">{{ HERO_TYPED_TEXT }}</span>
            <span aria-hidden="true">{{ typedText || '\u200B' }}</span>
            <span
              aria-hidden="true"
              class="ml-2 inline-block h-[0.7em] w-[0.09em] translate-y-[0.05em] animate-blink self-center bg-accent-500 motion-reduce:animate-none"
            />
          </span>
        </h1>
      </div>
    </div>
  </section>

  <section
    id="services"
    data-theme="light"
    class="h-full w-full snap-start snap-always flex flex-col bg-light px-4 pt-36 pb-8 sm:px-6 lg:px-8 xl:px-12"
  >
    <header
      ref="servicesEl"
      class="max-w-4xl px-20 md:px-24 lg:px-28 transition-all duration-700 ease-out motion-reduce:transition-none"
      :class="scrollRevealClass(servicesReveal)"
    >
      <h2 class="font-display text-display text-balance text-primary-900">
        La tech au service des métiers
      </h2>
    </header>

    <CardCarousel
      :count="SERVICES.length"
      label="Nos expertises"
      tone="light"
      class="flex-1 w-full mt-8"
    >
      <template #slide="{ index }">
        <CarouselSlideContent
          tone="light"
          size="lg"
          :title="activeService(index).title"
          :heading-level="3"
          class="max-w-5xl"
        >
          {{ activeService(index).description }}
        </CarouselSlideContent>
      </template>
    </CardCarousel>
  </section>

  <section
    id="valeurs"
    data-theme="dark"
    class="h-full w-full snap-start snap-always flex flex-col bg-[#000066] px-4 pt-36 pb-8 text-white sm:px-6 lg:px-8 xl:px-12"
  >
    <header
      ref="valeursEl"
      class="max-w-5xl px-20 md:px-24 lg:px-28 transition-all duration-700 ease-out motion-reduce:transition-none"
      :class="scrollRevealClass(valeursReveal)"
    >
      <h2 class="font-display text-display text-balance text-white">Nos valeurs</h2>
      <p class="mt-4 text-lg leading-relaxed text-white/70">
        Chez Faceel, nos collaborateurs possèdent une double culture : une solide
        <span
          class="bg-linear-to-t from-accent-500/30 to-transparent bg-[length:100%_40%] bg-bottom bg-no-repeat"
        >
          expertise technique
        </span>
        et une compréhension fine des
        <span
          class="bg-linear-to-t from-accent-500/30 to-transparent bg-[length:100%_40%] bg-bottom bg-no-repeat"
        >
          réalités métier
        </span>
        . C'est cette combinaison qui fait
        <span
          class="bg-linear-to-t from-accent-500/30 to-transparent bg-[length:100%_40%] bg-bottom bg-no-repeat"
        >
          notre différence
        </span>
        .
      </p>
    </header>

    <CoverCarousel
      :count="VALUE_CARDS.length"
      label="Nos valeurs"
      tone="dark"
      class="flex-1 w-full mt-8"
    >
      <template #slide="{ index }">
        <CarouselSlideContent
          tone="dark"
          :title="activeValue(index).title"
          :heading-level="3"
          class="max-w-xl"
        >
          {{ activeValue(index).description }}
        </CarouselSlideContent>
      </template>
    </CoverCarousel>
  </section>
  <!-- CHIFFRES CLÉS — preuve sociale, fond clair (alternance stricte, V0.6).
       Même gabarit que `#partenaires` (hauteur pleine, contenu centré
       verticalement) : c'est un bloc de conviction courte, pas un contenu
       qui a besoin de tout l'espace vertical. -->
  <section
    id="chiffres-cles"
    data-theme="light"
    class="h-full w-full snap-start snap-always flex flex-col justify-center bg-light px-4 py-16 sm:px-6 lg:px-8 xl:px-12"
  >
    <div
      ref="chiffresEl"
      class="mx-auto flex w-full max-w-5xl flex-col items-center text-center"
      :class="scrollRevealClass(chiffresReveal)"
    >
      <!-- Pas de `<h2>` distinct : même parti que `#confiance` juste au-dessus
           (surtitre seul, sans titre séparé) — la citation ci-dessous EST le
           message de la section, un second niveau de titre le dupliquerait. -->
      <p class="text-eyebrow uppercase text-accent-700">Nos chiffres clés</p>

      <!-- `accent-700`, pas `accent-500` : ce texte est sur fond clair
           (`bg-light`), où l'accent vif ne tient que 1,9:1 — `accent-700`
           est le seul des trois paliers d'accent validé AA sur blanc (4,9:1,
           cf. l'en-tête de `main.css`). Même raison pour le survol des
           chiffres plus bas. -->
      <blockquote
        class="mt-6 max-w-3xl font-display text-2xl leading-snug font-bold tracking-tight text-balance text-primary-900 sm:text-3xl lg:text-4xl"
      >
        « Chez Faceel-it, nous ne nous contentons pas de vous délivrer une prestation&nbsp;: nous
        co-construisons des solutions durables, agiles et sur-mesure. Votre satisfaction est notre
        plus grande fête. »
      </blockquote>

      <!-- Grille de 3 blocs. `group` sur chaque `<li>` : c'est lui qui pilote
           le `group-hover:` du chiffre à l'intérieur — l'élévation et le
           changement de couleur doivent se déclencher ensemble, au survol de
           TOUTE la carte, pas seulement du chiffre. -->
      <ul class="mt-12 grid w-full grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
        <li
          v-for="stat in KEY_STATS"
          :key="stat.label"
          class="group rounded-card bg-white p-8 ring-1 ring-primary-900/8 shadow-soft transition-all duration-300 ease-snap hover:-translate-y-2 hover:shadow-lift hover:ring-accent-500/60 motion-reduce:transition-none motion-reduce:transform-none"
        >
          <p
            class="font-display text-5xl font-extrabold tracking-tight text-primary-900 transition-colors duration-300 ease-snap group-hover:text-accent-700 sm:text-6xl"
          >
            {{ stat.value }}
          </p>
          <p class="mt-3 text-eyebrow uppercase text-primary-900/60">{{ stat.label }}</p>
        </li>
      </ul>
    </div>
  </section>
  <section
    id="references"
    data-theme="light"
    class="h-full w-full snap-start snap-always"
  >
    <ReferencesSection />
  </section>

  <section
    id="secteurs"
    data-theme="light"
    class="h-full w-full snap-start snap-always flex flex-col bg-light px-4 pt-36 pb-8 sm:px-6 lg:px-8 xl:px-12"
  >
    <header
      ref="secteursEl"
      class="max-w-4xl px-20 md:px-24 lg:px-28 transition-all duration-700 ease-out motion-reduce:transition-none"
      :class="scrollRevealClass(secteursReveal)"
    >
      <h2 class="font-display text-display text-balance text-primary-900">
        Nos secteurs d'activités
      </h2>
    </header>

    <CardCarousel
      :count="SECTORS.length"
      label="Nos secteurs d'activités"
      tone="light"
      class="flex-1 w-full mt-8"
    >
      <template #slide="{ index }">
        <CarouselSlideContent
          tone="light"
          size="lg"
          :title="activeSector(index).title"
          :heading-level="3"
          class="max-w-5xl"
        >
          {{ activeSector(index).description }}
        </CarouselSlideContent>
      </template>
    </CardCarousel>
  </section>
  <section
    id="rse"
    data-theme="dark"
    class="h-full w-full snap-start snap-always flex flex-col bg-[#000066] px-4 pt-36 pb-8 text-white sm:px-6 lg:px-8 xl:px-12"
  >
    <header
      ref="rseEl"
      class="max-w-4xl px-20 md:px-24 lg:px-28 transition-all duration-700 ease-out motion-reduce:transition-none"
      :class="scrollRevealClass(rseReveal)"
    >
      <h2 class="font-display text-display text-balance text-white">Politique RSE</h2>
    </header>

    <CardCarousel
      :count="RSE_CARDS.length"
      label="Politique RSE"
      tone="dark"
      class="flex-1 w-full mt-8"
    >
      <template #slide="{ index }">
        <CarouselSlideContent
          tone="dark"
          size="lg"
          :title="activeRse(index).title"
          :badge="activeRse(index).badge ?? ''"
          :heading-level="3"
          class="max-w-5xl"
        >
          {{ activeRse(index).description }}
        </CarouselSlideContent>
      </template>
    </CardCarousel>
  </section>

  <section
    id="evenements"
    data-theme="light"
    class="h-full w-full snap-start snap-always flex flex-col justify-center bg-white px-4 py-16 text-gray-900 sm:px-6 lg:px-8 xl:px-12"
  >
    <header
      ref="evenementsEl"
      class="mx-auto max-w-3xl text-center transition-all duration-700 ease-out motion-reduce:transition-none"
      :class="scrollRevealClass(evenementsReveal)"
    >
      <p class="text-eyebrow uppercase text-accent-700">La vie d'équipe</p>
      <h2 class="mt-4 font-display text-display text-balance text-primary-900">Nos événements</h2>
      <p class="mt-4 text-lg leading-relaxed text-primary-900/60">
        La cohésion ne s'arrête pas à la porte des bureaux&nbsp;: after-works, événements sportifs
        et repas partagés rythment aussi la vie de nos équipes.
      </p>
    </header>

    <!-- Bento asymétrique : 2 colonnes en mobile, 4 au-delà — la tuile en
         vedette (`col-span-2 row-span-2`) reste inchangée d'un palier à
         l'autre, seul le nombre de colonnes disponibles fait basculer les 4
         tuiles restantes d'un empilement 2×2 sous la vedette (mobile) à une
         bande de 4 colonnes à sa droite (desktop) — sans classe responsive
         dédiée par tuile. -->
    <ul
      class="mx-auto mt-12 grid w-full max-w-6xl grid-cols-2 auto-rows-[9rem] gap-4 sm:grid-cols-4 sm:auto-rows-[10rem] lg:auto-rows-[12rem]"
    >
      <li
        v-for="(photo, index) in EVENT_PHOTOS"
        :key="photo.src"
        class="group relative overflow-hidden rounded-card"
        :class="index === 0 ? 'col-span-2 row-span-2' : ''"
      >
        <img
          :src="photo.src"
          :alt="photo.alt"
          loading="lazy"
          decoding="async"
          class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </li>
    </ul>
  </section>
</template>
