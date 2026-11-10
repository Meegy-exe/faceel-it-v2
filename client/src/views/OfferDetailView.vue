<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSeo } from '@/composables/useSeo'
import photoDataIa from '@/assets/images/photos/f-it-01.jpg'
import photoDigital from '@/assets/images/photos/f-it-02.jpg'
import photoProduct from '@/assets/images/photos/f-it-03.jpg'
import photoCloudDevops from '@/assets/images/photos/afterwork.jpg'

const route = useRoute()

onMounted(() => {
  window.scrollTo(0, 0)
  document.querySelector('#app')?.scrollTo(0, 0)
})

/* -------------------------------------------------------------------------- */
/* Données mock à remplacer par un appel API une fois le back disponible.   */
/* -------------------------------------------------------------------------- */

interface JobOffer {
  id: number
  title: string
  location: string
  category: string
  contract: 'CDI' | 'CDD' | 'Stage'
  level: string
  metier: string
  description: string
  date: string
}

const OFFERS: JobOffer[] = [
  {
    id: 1,
    title: 'Data Engineer (H/F)',
    location: 'Lille',
    category: 'Data',
    contract: 'CDI',
    level: 'Expérimentés',
    metier: 'Data et intelligence artificielle',
    date: 'Publié il y a 9 mois',
    description:
      "Pour un client dans le secteur du retail, vous rejoindrez une équipe en charge de la mise en place et de l'optimisation des pipelines de données. Vous développerez et maintiendrez des flux fiables, structurerez les architectures data et assurerez l'intégrité et la qualité des informations utilisées par les équipes business et analytics, dans un environnement Agile et orienté performance.",
  },
  {
    id: 2,
    title: 'Consultante / Consultant fonctionnel - Expert S4HANA SAP SD',
    location: 'Lille, Toulouse, Paris',
    category: 'Solutions SaaS',
    contract: 'CDI',
    level: 'Expérimentés',
    metier: 'Business Analyst',
    date: 'Publié il y a 3 mois',
    description:
      "Vous intégrerez une équipe projet pour accompagner la transformation SAP S/4HANA de nos clients industriels. Vous serez en charge de l'analyse des besoins fonctionnels, de la conception des solutions et de la conduite du changement auprès des équipes métier.",
  },
  {
    id: 3,
    title: 'Architecte solutions - Microsoft Azure',
    location: 'Lyon, Remote',
    category: 'Cloud & Infrastructure',
    contract: 'CDI',
    level: 'Expérimentés',
    metier: 'Architecture',
    date: 'Publié il y a 2 semaines',
    description:
      "Vous interviendrez en tant qu'Architecte Cloud principal sur des projets de migration et de modernisation d'infrastructures vers Microsoft Azure. Vous définirez les architectures cibles, accompagnerez les équipes techniques et assurerez la conformité des solutions déployées.",
  },
  {
    id: 4,
    title: 'Business Analyst - Transformation digitale retail',
    location: 'Lille',
    category: 'Conseil',
    contract: 'CDD',
    level: 'Etudiants / Jeunes diplômés',
    metier: 'Business Analyst',
    date: 'Publié il y a 1 mois',
    description:
      "Dans le cadre d'un programme de transformation digitale pour un acteur majeur du retail, vous contribuerez à la définition des besoins fonctionnels, à la rédaction des spécifications et au pilotage des recettes utilisateurs.",
  },
  {
    id: 5,
    title: 'Développeur fullstack - React / Node.js',
    location: 'Toulouse',
    category: 'Développement',
    contract: 'CDI',
    level: 'Expérimentés',
    metier: 'Développement',
    date: 'Publié il y a 5 mois',
    description:
      "Vous rejoindrez une squad produit pour développer et maintenir des applications web en React et Node.js. Vous participerez aux cérémonies Agile, contribuerez aux revues de code et serez acteur de l'amélioration continue des pratiques d'ingénierie.",
  },
  {
    id: 6,
    title: 'Stage - Data Scientist junior IA générative',
    location: 'Paris',
    category: 'Data & IA',
    contract: 'Stage',
    level: 'Etudiants / Jeunes diplômés',
    metier: 'Data et intelligence artificielle',
    date: 'Publié il y a 1 semaine',
    description:
      "Dans le cadre d'un stage de fin d'études, vous travaillerez sur des cas d'usage d'intelligence artificielle générative. Vous participerez à la conception de pipelines de traitement de données et à l'évaluation de modèles de langage.",
  },
]

const MISSIONS = [
  'Concevoir et développer des pipelines de données fiables et scalables',
  'Optimiser les performances des flux de traitement (batch et streaming) dans un environnement cloud',
  'Structurer les architectures data (lakehouse, data warehouse) selon les besoins métier et les exigences de performance',
  "Garantir l'intégrité, la qualité et la traçabilité des données tout au long de leur cycle de vie",
  'Collaborer au quotidien avec les équipes analytics, data science et business pour répondre aux enjeux de consommation de la donnée',
  "Contribuer aux cérémonies Agile (sprint planning, daily, retrospective) et à la culture ingénierie de l'équipe",
]

const TECH_STACK = [
  'Langages : Python, SQL, Scala',
  'Orchestration : Apache Airflow, Azure Data Factory',
  'Traitement distribué : Apache Spark, Databricks',
  'Stockage : Azure Data Lake, Delta Lake, PostgreSQL',
  'Versioning & CI/CD : Git, Azure DevOps',
]

const PROFIL = [
  "3+ ans d'expérience en ingénierie des données",
  'Maîtrise de Python et SQL ; connaissance de Spark appréciée',
  'Expérience sur les environnements cloud, Azure de préférence',
  'Autonomie, rigueur et sens du service client',
  'Goût pour le travail en équipe et les environnements Agile',
]

/** Sépare le libellé (avant " : ") du reste pour le mettre en gras dans le
 *  template  seul TECH_STACK suit ce format "Libellé : valeurs". */
function splitTechLabel(entry: string) {
  const [label, ...rest] = entry.split(' : ')
  return { label, rest: rest.join(' : ') }
}

const offer = computed(
  () => OFFERS.find((o) => String(o.id) === String(route.params.id)) ?? OFFERS[0]!,
)

const similarOffers = computed(() => OFFERS.filter((o) => o.id !== offer.value.id).slice(0, 3))

/* -------------------------------------------------------------------------- */
/* Widget vidéo témoignage  BU correspondant à la catégorie de l'offre.      */
/* Noms/rôles réels repris de `BuSection.vue` (page d'accueil). Aucune URL de */
/* vidéo ni citation fictive : cf. CLAUDE.md, intégrité du contenu  le       */
/* tournage de ces témoignages n'a pas encore eu lieu, d'où le `videoUrl` nul.*/
/* -------------------------------------------------------------------------- */

type BuSlug = 'data-ia' | 'digital' | 'product' | 'cloud-devops'

interface BuTestimonial {
  label: string
  name: string
  role: string
  thumbnail: string
  videoUrl: string | null
}

const BU_TESTIMONIALS: Record<BuSlug, BuTestimonial> = {
  'data-ia': {
    label: 'Data & IA',
    name: 'Robin Rins',
    role: 'Direction',
    thumbnail: photoDataIa,
    videoUrl: null,
  },
  digital: {
    label: 'Digital',
    name: 'Stéphanie Demarez',
    role: 'Direction',
    thumbnail: photoDigital,
    videoUrl: null,
  },
  product: {
    label: 'Product',
    name: 'Laetitia Lesaffre',
    role: 'Direction',
    thumbnail: photoProduct,
    videoUrl: null,
  },
  'cloud-devops': {
    label: 'Cloud & DevOps',
    name: 'Robin Rins',
    role: 'Direction',
    thumbnail: photoCloudDevops,
    videoUrl: null,
  },
}

/** Catégorie d'offre → BU. 'Solutions SaaS' (conseil fonctionnel SAP) rattaché
 *  à Product, cohérent avec son positionnement cadrage/fonctionnel. */
const BU_BY_CATEGORY: Record<string, BuSlug> = {
  Data: 'data-ia',
  'Data & IA': 'data-ia',
  Développement: 'digital',
  'Solutions SaaS': 'product',
  Conseil: 'product',
  'Cloud & Infrastructure': 'cloud-devops',
}

const buTestimonial = computed(
  () => BU_TESTIMONIALS[BU_BY_CATEGORY[offer.value.category] ?? 'digital'],
)

const isVideoModalOpen = ref(false)

function onEscKey(e: KeyboardEvent) {
  if (e.key === 'Escape') isVideoModalOpen.value = false
}

watch(isVideoModalOpen, (open) => {
  if (import.meta.env.SSR) return
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => window.addEventListener('keydown', onEscKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onEscKey)
  if (!import.meta.env.SSR) document.body.style.overflow = ''
})

/** Flèche de l'intro blanche  cible `#details` (section "Description de
 *  l'entreprise" et suivantes), déjà identifiée plus bas dans ce template. */
function scrollToContent() {
  const el = document.getElementById('details')
  if (!el) return
  const yOffset = -80
  const y = el.getBoundingClientRect().top + window.scrollY + yOffset
  window.scrollTo({ top: y, behavior: 'smooth' })
}

// title et description pilotes par l'offre affichee, pas figes
useSeo({
  title: computed(() => `${offer.value.title} - Faceel-IT Wasquehal`),
  description: computed(
    () =>
      `Rejoignez Faceel-IT, ESN à Wasquehal : ${offer.value.title}, ${offer.value.contract}, ${offer.value.location}. Postulez en ligne.`,
  ),
})
</script>

<template>
  <!-- Pas de <main> ici : App.vue le fournit déjà.
       fullPageScroll → <main> est `contents` : ces sections sont des enfants
       directs du conteneur snap-y d'App.vue, TheFooter compris. -->

  <!-- ==================================================================
       SECTION 1  HERO (bandeau bleu + intro blanche). min-h-[50vh] +
       flex-1 sur CHAQUE section (pas juste un conteneur parent dimensionné) :
       garantit que le blanc ne peut jamais dépasser visuellement le bleu même
       si son contenu est plus court, tout en se répartissant à égalité au-delà
       de ce plancher si le contenu déborde (ex. petit écran).
       ================================================================== -->
  <div class="flex w-full flex-col overflow-x-hidden">
    <section
      id="hero"
      data-theme="dark"
      class="relative flex min-h-[50vh] w-full flex-1 flex-col bg-[#000066] text-white"
    >
      <!-- Bouton Retour -->
      <div class="absolute top-20 left-4 sm:left-6 lg:left-8 lg:top-24 z-10">
        <RouterLink
          to="/consulter-nos-offres"
          class="inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-accent-400"
        >
          <svg
            class="h-4 w-4"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path d="M10 3L5 8l5 5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Retour aux offres
        </RouterLink>
      </div>

      <!-- pt-28 : descend le contenu dans sa moitié au lieu d'un centrage
           géométrique strict qui le remonte visuellement trop haut. -->
      <div
        class="flex flex-1 flex-col items-center justify-center px-4 pt-28 sm:px-6 lg:px-8 xl:px-12"
      >
        <!-- aligne a gauche : correspond au reste de la page -->
        <div class="mx-auto flex w-full max-w-4xl flex-col items-start text-left">
          <p class="mb-4 text-sm text-white">
            Équipe RH Faceel-IT · {{ offer.date }} · 3 min de lecture
          </p>

          <h1 class="font-display text-display text-balance text-white">
            {{ offer.title }}
          </h1>

          <div class="mt-6 flex flex-wrap items-center justify-start gap-3">
            <span
              class="rounded-full border-none pr-3 pl-0 py-1 text-sm font-semibold text-accent-400"
            >
              {{ offer.category }}
            </span>
            <span
              class="inline-flex items-center gap-1.5 rounded-full border-none px-3 py-1 text-sm font-semibold text-accent-400"
            >
              <svg
                class="h-4 w-4 shrink-0"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 1.5A4.5 4.5 0 003.5 6c0 2.9 3.23 6.77 4.5 8.25C9.27 12.77 12.5 8.9 12.5 6A4.5 4.5 0 008 1.5zm0 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ offer.location }}
            </span>
            <span class="rounded-full border-none px-3 py-1 text-sm font-semibold text-accent-400">
              {{ offer.contract }}
            </span>
            <span class="rounded-full border-none px-3 py-1 text-sm font-semibold text-accent-400">
              Selon profil
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 1bis  INTRODUCTION (Thème Clair  titre + paragraphe + flèche) -->
    <section
      data-theme="light"
      class="flex min-h-[50vh] w-full flex-1 flex-col items-start justify-center bg-white px-4 pt-20 sm:px-6 lg:px-8 md:items-center"
    >
      <!-- centrage desktop -->
      <h2 class="mb-6 text-left font-display text-2xl font-bold text-primary-900 md:text-center lg:text-3xl">
        Description de l'offre
      </h2>

      <p class="w-full max-w-4xl text-left text-lg leading-relaxed text-primary-900/70 md:mx-auto md:text-center">
        {{ offer.description }}
      </p>

      <!-- cache fleche mobile -->
      <button
        type="button"
        aria-label="Voir la description de l'offre"
        class="mx-auto mt-12 hidden size-10 items-center justify-center rounded-full text-accent-500 transition-colors duration-200 hover:text-accent-600 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary-900 md:flex"
        @click="scrollToContent"
      >
        <svg
          class="size-10 animate-bounce motion-reduce:animate-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="M12 4v16m0 0l-6-6m6 6l6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </section>
  </div>

  <!-- ==================================================================
       SECTION 2  DÉTAILS & PARTAGE (Thème Clair  scroll libre)
       Pas de h-full ni overflow-hidden : min-h-screen + h-auto permettent
       au contenu de déborder naturellement dans le scroll global du conteneur
       snap. pt-32 compense le MegaMenu fixe lors de l'accrochage snap.
       ================================================================== -->
  <section
    id="details"
    data-theme="light"
    class="h-auto bg-white text-primary-900 py-12 md:py-20 px-4 sm:px-6 lg:px-8"
  >
    <div class="mx-auto max-w-5xl">
      <div class="grid gap-10 lg:grid-cols-[1fr_300px] lg:items-start">
        <!-- Colonne gauche : contenu + CTA -->
        <article class="space-y-10 min-w-0">
          <section>
            <h2 class="text-xl font-bold text-primary-900 mb-4">Description de l'entreprise</h2>
            <p class="text-base leading-relaxed text-primary-900/70">
              Faceel-IT est une ESN spécialisée dans le conseil en transformation digitale. Nous
              accompagnons nos clients dans leurs projets data, cloud et applicatifs avec une équipe
              de consultants passionnés et engagés, répartis sur plusieurs sites en France.
              Rejoindre Faceel-IT, c'est intégrer un collectif à taille humaine où l'autonomie, la
              curiosité et l'impact concret sont valorisés au quotidien.
            </p>
          </section>

          <section>
            <h2 class="text-xl font-bold text-primary-900 mb-4">
              Tes missions seront les suivantes
            </h2>
            <ul class="space-y-3">
              <li v-for="mission in MISSIONS" :key="mission" class="flex items-start gap-3">
                <span
                  class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500"
                  aria-hidden="true"
                />
                <span class="text-base leading-relaxed text-primary-900/70">{{ mission }}</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 class="text-xl font-bold text-primary-900 mb-4">Ton environnement technique</h2>
            <ul class="space-y-3">
              <li v-for="tech in TECH_STACK" :key="tech" class="flex items-start gap-3">
                <span
                  class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500"
                  aria-hidden="true"
                />
                <span class="text-base leading-relaxed text-primary-900/70">
                  <strong class="font-semibold text-primary-900">{{
                    splitTechLabel(tech).label
                  }}</strong
                  >{{ ' : ' + splitTechLabel(tech).rest }}
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 class="text-xl font-bold text-primary-900 mb-4">Ton profil</h2>
            <ul class="space-y-3">
              <li v-for="item in PROFIL" :key="item" class="flex items-start gap-3">
                <span
                  class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500"
                  aria-hidden="true"
                />
                <span class="text-base leading-relaxed text-primary-900/70">{{ item }}</span>
              </li>
            </ul>
          </section>

          <!-- CTA -->
          <div class="pt-4 border-t border-gray-200">
            <RouterLink
              :to="{ name: 'offre-postuler', params: { id: offer.id } }"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-8 py-4 text-base font-semibold text-primary-900 transition-all duration-200 hover:bg-accent-500/90 hover:shadow-lg hover:shadow-accent-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
            >
              Postuler à cette offre
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                  clip-rule="evenodd"
                />
              </svg>
            </RouterLink>
          </div>
        </article>

        <!-- suppression partage v1 -->
        <aside class="lg:sticky lg:top-32 lg:self-start">

          <!-- Encart LinkedIn  repris tel quel de ContactView.vue (/contact-entreprise) -->
          <div class="mt-6 rounded-xl bg-blue-50 p-8">
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
              et coulisses de l'agence, suivez-nous pour ne rien manquer.
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

          <!-- Widget témoignage vidéo  BU correspondant à l'offre -->
          <button
            type="button"
            class="group mt-6 block w-full overflow-hidden rounded-2xl bg-primary-950 text-left ring-1 ring-primary-900/10 transition-transform hover:-translate-y-0.5"
            @click="isVideoModalOpen = true"
          >
            <div class="relative aspect-video w-full overflow-hidden">
              <img
                :src="buTestimonial.thumbnail"
                alt=""
                loading="lazy"
                decoding="async"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-primary-950/40" aria-hidden="true" />
              <span class="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                <span
                  class="flex size-14 items-center justify-center rounded-full bg-white/90 text-primary-950 shadow-lg transition-transform group-hover:scale-110"
                >
                  <svg
                    class="ml-0.5 size-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7L8 5z" />
                  </svg>
                </span>
              </span>
            </div>
            <div class="p-5">
              <p class="text-xs font-semibold uppercase tracking-widest text-accent-500">
                Témoignage {{ buTestimonial.label }}
              </p>
              <p class="mt-2 font-display text-base font-bold text-white">
                La vie d'équipe vue de l'intérieur
              </p>
              <p class="mt-1 text-sm text-white/60">
                {{ buTestimonial.name }} · {{ buTestimonial.role }}
              </p>
            </div>
          </button>
        </aside>
      </div>
    </div>
  </section>

  <!-- ==================================================================
       SECTION 3  OFFRES SIMILAIRES (flux naturel, fond gris pour séparer)
       ================================================================== -->
  <section
    id="similaires"
    data-theme="light"
    class="flex flex-col justify-center bg-white py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="mx-auto w-full max-w-4xl">
      <h2 class="font-display text-3xl font-bold text-primary-900 text-center sm:text-4xl">
        Offres similaires
      </h2>
      <p class="mt-3 text-center text-primary-900/60">
        Si cette offre ne vous convient pas, consultez celles-ci :
      </p>

      <div class="mt-10 space-y-4">
        <RouterLink
          v-for="similar in similarOffers"
          :key="similar.id"
          :to="{ name: 'offre-detail', params: { id: similar.id } }"
          class="group flex items-center justify-between rounded-xl bg-white p-5 ring-1 ring-gray-200 shadow-sm transition-all duration-200 hover:shadow-md hover:ring-gray-300"
        >
          <div class="min-w-0">
            <h3 class="font-semibold text-primary-900 truncate">{{ similar.title }}</h3>
            <p class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-primary-900/55">
              <span class="flex items-center gap-1">
                <svg
                  class="h-3.5 w-3.5 shrink-0"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 1.5A4.5 4.5 0 003.5 6c0 2.9 3.23 6.77 4.5 8.25C9.27 12.77 12.5 8.9 12.5 6A4.5 4.5 0 008 1.5zm0 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ similar.location }}
              </span>
              <span aria-hidden="true">·</span>
              <span>{{ similar.contract }}</span>
              <span aria-hidden="true">·</span>
              <span>{{ similar.category }}</span>
            </p>
          </div>
          <svg
            class="ml-4 h-5 w-5 shrink-0 text-primary-900/25 transition-colors group-hover:text-accent-500"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
              clip-rule="evenodd"
            />
          </svg>
        </RouterLink>
      </div>
    </div>
  </section>

  <!-- ==================================================================
       MODALE VIDÉO TÉMOIGNAGE
       ================================================================== -->
  <Teleport to="body">
    <div
      v-if="isVideoModalOpen"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-primary-950/40 p-4 backdrop-blur-sm"
      @click.self="isVideoModalOpen = false"
    >
      <div class="relative w-full max-w-3xl">
        <button
          type="button"
          class="absolute -top-12 right-0 inline-flex size-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
          aria-label="Fermer la vidéo"
          @click="isVideoModalOpen = false"
        >
          <svg class="size-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="m6 6 12 12M18 6 6 18"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <div class="overflow-hidden rounded-2xl bg-black shadow-2xl">
          <div v-if="buTestimonial.videoUrl" class="aspect-video w-full">
            <iframe
              :src="buTestimonial.videoUrl"
              title="Témoignage vidéo"
              class="h-full w-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowfullscreen
            />
          </div>
          <!-- TODO : vidéo à tourner pour cette BU  pas de contenu fictif en attendant. -->
          <div
            v-else
            class="flex aspect-video w-full flex-col items-center justify-center gap-3 p-8 text-center"
          >
            <p class="font-display text-lg font-bold text-white">Vidéo à venir</p>
            <p class="max-w-sm text-sm text-white/60">
              Le témoignage vidéo {{ buTestimonial.label }} de {{ buTestimonial.name }} est en cours
              de tournage.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
