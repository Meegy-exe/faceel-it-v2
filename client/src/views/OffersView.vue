<script setup lang="ts">
import { ref, computed, watch, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import { scrollRevealClass, useScrollReveal } from '@/composables/useScrollReveal'
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'Consulter nos offres',
  description:
    "Explorez les offres d'emploi Faceel-IT : CDI, CDD et stages dans les métiers du numérique. " +
    'Consultants SAP, Data Engineers, Architectes, Développeurs — trouvez votre mission.',
})

const router = useRouter()

const heroEl = useTemplateRef<HTMLElement>('heroEl')
const heroReveal = useScrollReveal(heroEl)

/* -------------------------------------------------------------------------- */
/* Données mock — à remplacer par un appel API une fois le back disponible.   */
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
    title: 'Consultante / Consultant fonctionnel – Expert S4HANA SAP SD',
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
    title: 'Architecte solutions – Microsoft Azure',
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
    title: 'Business Analyst – Transformation digitale retail',
    location: 'Lille',
    category: 'Conseil',
    contract: 'CDD',
    level: 'Etudiants / Jeunes diplômés',
    metier: 'Business Analyst',
    date: 'Publié il y a 1 mois',
    description:
      "Dans le cadre d'un programme de transformation digitale pour un acteur majeur du retail, vous contribuerez à la définition des besoins fonctionnels, à la rédaction des spécifications et au pilotage des recettes utilisateurs. Bonne maîtrise des méthodes Agile requise.",
  },
  {
    id: 5,
    title: 'Développeur fullstack – React / Node.js',
    location: 'Toulouse',
    category: 'Développement',
    contract: 'CDI',
    level: 'Expérimentés',
    metier: 'Développement',
    date: 'Publié il y a 5 mois',
    description:
      "Vous rejoindrez une squad produit pour développer et maintenir des applications web en React et Node.js. Vous participerez aux cérémonies Agile, contribuerez aux revues de code et serez acteur de l'amélioration continue des pratiques d'ingénierie au sein de l'équipe.",
  },
  {
    id: 6,
    title: 'Stage – Data Scientist junior IA générative',
    location: 'Paris',
    category: 'Data & IA',
    contract: 'Stage',
    level: 'Etudiants / Jeunes diplômés',
    metier: 'Data et intelligence artificielle',
    date: 'Publié il y a 1 semaine',
    description:
      "Dans le cadre d'un stage de fin d'études, vous travaillerez sur des cas d'usage d'intelligence artificielle générative. Vous participerez à la conception de pipelines de traitement de données et à l'évaluation de modèles de langage dans un environnement orienté recherche appliquée.",
  },
]

/* -------------------------------------------------------------------------- */
/* Filtres                                                                     */
/* -------------------------------------------------------------------------- */

const LEVELS = ['Etudiants / Jeunes diplômés', 'Expérimentés']
const METIERS = [
  'Architecture',
  'Business Analyst',
  'Data et intelligence artificielle',
  'Développement',
]
const CONTRACTS = ['CDI', 'CDD', 'Stage']

const searchQuery = ref('')
const showSuggestions = ref(false)
const currentPage = ref(1)
const PAGE_SIZE = 4

const selectedLevels = ref<string[]>([])
const selectedMetiers = ref<string[]>([])
const selectedContracts = ref<string[]>([])

/* Tokens extraits de toutes les offres pour l'autocomplétion. */
const suggestions = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (q.length < 2) return []

  const pool = new Set<string>()
  OFFERS.forEach((o) => {
    pool.add(o.category)
    pool.add(o.metier)
    o.location.split(/,\s*/).forEach((loc) => pool.add(loc.trim()))
    o.title.split(/[\s–\-/()+]+/).forEach((w) => {
      if (w.length > 3) pool.add(w)
    })
  })

  return [...pool].filter((s) => s.toLowerCase().includes(q) && s.toLowerCase() !== q).slice(0, 6)
})

const filteredOffers = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  return OFFERS.filter((o) => {
    if (
      q &&
      !o.title.toLowerCase().includes(q) &&
      !o.location.toLowerCase().includes(q) &&
      !o.category.toLowerCase().includes(q) &&
      !o.description.toLowerCase().includes(q)
    )
      return false
    if (selectedLevels.value.length && !selectedLevels.value.includes(o.level)) return false
    if (selectedMetiers.value.length && !selectedMetiers.value.includes(o.metier)) return false
    if (selectedContracts.value.length && !selectedContracts.value.includes(o.contract))
      return false
    return true
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredOffers.value.length / PAGE_SIZE)))
const pageRange = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1))

const pagedOffers = computed(() => {
  const page = Math.min(currentPage.value, totalPages.value)
  const start = (page - 1) * PAGE_SIZE
  return filteredOffers.value.slice(start, start + PAGE_SIZE)
})

function submitSearch() {
  currentPage.value = 1
  showSuggestions.value = false
}

function selectSuggestion(suggestion: string) {
  searchQuery.value = suggestion
  showSuggestions.value = false
  currentPage.value = 1
}

function clearGroup(group: 'levels' | 'metiers' | 'contracts') {
  if (group === 'levels') selectedLevels.value = []
  else if (group === 'metiers') selectedMetiers.value = []
  else selectedContracts.value = []
}

watch(
  [selectedLevels, selectedMetiers, selectedContracts],
  () => {
    currentPage.value = 1
  },
  { deep: true },
)
</script>

<template>
  <!-- Pas de <main> ici : App.vue le fournit déjà. -->

  <!-- ==================================================================
       1. HERO — sombre
       ================================================================== -->
  <section
    id="hero"
    data-theme="dark"
    class="relative h-full w-full snap-start snap-always flex flex-col justify-center overflow-hidden px-4 sm:px-6 lg:px-8 xl:px-12 bg-[#000066] text-white"
  >
    <!-- Cercle décoratif vert — touche d'accent sur fond sombre. -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute -right-40 top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-accent-500/15 blur-3xl"
    />

    <div
      ref="heroEl"
      class="relative mx-auto w-full max-w-4xl transition-all duration-700 ease-out motion-reduce:transition-none"
      :class="scrollRevealClass(heroReveal)"
    >
      <h1 class="font-display text-display text-balance text-white">
        Intégrer un collectif où ton
        <span class="relative inline-block">
          talent
          <svg
            aria-hidden="true"
            class="absolute -bottom-1 left-0 h-3 w-full overflow-visible text-accent-500"
            viewBox="0 0 100 8"
            preserveAspectRatio="none"
          >
            <path
              d="M0 6 Q25 2 50 6 Q75 10 100 6"
              stroke="currentColor"
              stroke-width="2.5"
              fill="none"
              stroke-linecap="round"
            />
          </svg>
        </span>
        compte vraiment.
      </h1>

      <p class="mt-6 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
        Ici, on ne cherche pas des CV parfaits, mais des personnes engagées, curieuses, et prêtes à
        construire des projets concrets. Tu veux évoluer, apprendre, avoir un impact&nbsp;? Tu es au
        bon endroit.
      </p>
    </div>
  </section>

  <!-- ==================================================================
       2. JOB BOARD — clair
       La section tient h-full (snap). L'intérieur est overflow-y-auto
       pour scroller les offres sans déclencher le snap global de la page.
       ================================================================== -->
  <section
    id="job-board"
    data-theme="light"
    class="h-full w-full snap-start snap-always flex flex-col bg-light overflow-hidden"
  >
    <div class="flex-1 overflow-y-auto px-4 pt-28 pb-8 sm:px-6 lg:px-8 xl:px-12">
      <div class="mx-auto max-w-6xl">
        <!-- ① Barre de recherche -->
        <div class="relative w-full mb-8 z-20">
          <span
            class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400"
          >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher par ville, métier ou mot-clé"
            autocomplete="off"
            class="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-primary-900 placeholder:text-gray-400 outline-none focus:border-transparent focus:ring-2 focus:ring-accent-500 transition-shadow"
            @focus="showSuggestions = true"
            @input="showSuggestions = true"
            @blur="showSuggestions = false"
            @keydown.enter.prevent="submitSearch"
            @keydown.escape="showSuggestions = false"
          />

          <!-- Dropdown suggestions -->
          <ul
            v-if="showSuggestions && suggestions.length"
            role="listbox"
            aria-label="Suggestions de recherche"
            class="absolute w-full mt-1 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg z-50"
          >
            <li v-for="s in suggestions" :key="s" role="option">
              <button
                type="button"
                class="w-full px-4 py-2.5 text-left text-sm text-primary-900 transition-colors hover:bg-gray-50"
                @mousedown.prevent
                @click="selectSuggestion(s)"
              >
                {{ s }}
              </button>
            </li>
          </ul>
        </div>

        <!-- ② Grille : offres + filtres -->
        <div class="grid gap-8 lg:grid-cols-[1fr_272px]">
          <!-- Colonne gauche : liste + pagination -->
          <div>
            <p class="mb-4 text-sm text-primary-900/50">
              {{ filteredOffers.length }}
              {{ filteredOffers.length !== 1 ? 'offres disponibles' : 'offre disponible' }}
            </p>

            <p v-if="pagedOffers.length === 0" class="py-16 text-center text-primary-900/50">
              Aucune offre ne correspond à votre recherche.
            </p>

            <ul v-else class="space-y-4">
              <li
                v-for="offer in pagedOffers"
                :key="offer.id"
                class="group rounded-2xl bg-white p-5 ring-1 ring-gray-200 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:ring-gray-300 hover:shadow-md cursor-pointer"
                @click="router.push({ name: 'offre-detail', params: { id: offer.id } })"
              >
                <!-- Titre + date -->
                <div class="flex items-start justify-between gap-4">
                  <h3 class="font-semibold text-primary-900">{{ offer.title }}</h3>
                  <span class="shrink-0 text-xs text-gray-400">{{ offer.date }}</span>
                </div>

                <!-- Description tronquée -->
                <p class="mt-2 text-sm leading-relaxed text-primary-900/60 line-clamp-2">
                  {{ offer.description }}
                </p>

                <!-- Badges -->
                <div class="mt-3 flex flex-wrap items-center gap-2">
                  <span class="flex items-center gap-1 text-sm text-primary-900/55">
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
                    {{ offer.location }}
                  </span>
                  <span
                    class="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-primary-900/70"
                  >
                    {{ offer.category }}
                  </span>
                  <span
                    class="rounded-full bg-accent-500/15 px-2.5 py-0.5 text-xs font-medium text-primary-900"
                  >
                    {{ offer.contract }}
                  </span>
                  <span
                    class="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-primary-900/70"
                  >
                    {{ offer.level }}
                  </span>
                </div>
              </li>
            </ul>

            <!-- Pagination -->
            <nav
              v-if="totalPages > 1"
              aria-label="Pagination des offres"
              class="mt-6 flex items-center justify-center gap-1"
            >
              <button
                :disabled="currentPage === 1"
                class="rounded-lg px-3 py-2 text-sm text-primary-900/60 transition-colors hover:text-primary-900 disabled:opacity-30 disabled:cursor-not-allowed"
                @click="currentPage--"
              >
                Précédent
              </button>
              <button
                v-for="page in pageRange"
                :key="page"
                class="min-w-[2.25rem] rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                :class="
                  currentPage === page
                    ? 'bg-accent-500 text-primary-900'
                    : 'text-primary-900/60 hover:text-primary-900 hover:bg-gray-100'
                "
                :aria-current="currentPage === page ? 'page' : undefined"
                @click="currentPage = page"
              >
                {{ page }}
              </button>
              <button
                :disabled="currentPage === totalPages"
                class="rounded-lg px-3 py-2 text-sm text-primary-900/60 transition-colors hover:text-primary-900 disabled:opacity-30 disabled:cursor-not-allowed"
                @click="currentPage++"
              >
                Suivant
              </button>
            </nav>
          </div>

          <!-- Colonne droite : filtres -->
          <aside aria-label="Filtres">
            <h2 class="font-display text-lg font-bold text-primary-900">Filtres</h2>

            <!-- Niveaux d'expérience -->
            <div class="mt-5 border-t border-gray-200 pt-5">
              <div class="flex items-center justify-between">
                <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Niveaux d'expérience
                </h3>
                <button
                  v-if="selectedLevels.length"
                  class="text-xs text-primary-900/60 hover:text-primary-900 hover:underline"
                  @click="clearGroup('levels')"
                >
                  Effacer
                </button>
              </div>
              <ul class="mt-3 space-y-2.5">
                <li v-for="level in LEVELS" :key="level">
                  <label
                    class="flex cursor-pointer items-center gap-3 text-sm text-primary-900/70 hover:text-primary-900 transition-colors"
                  >
                    <input
                      v-model="selectedLevels"
                      type="checkbox"
                      :value="level"
                      class="h-4 w-4 rounded accent-accent-500"
                    />
                    {{ level }}
                  </label>
                </li>
              </ul>
            </div>

            <!-- Métiers -->
            <div class="mt-5 border-t border-gray-200 pt-5">
              <div class="flex items-center justify-between">
                <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Métiers
                </h3>
                <button
                  v-if="selectedMetiers.length"
                  class="text-xs text-primary-900/60 hover:text-primary-900 hover:underline"
                  @click="clearGroup('metiers')"
                >
                  Effacer
                </button>
              </div>
              <ul class="mt-3 space-y-2.5">
                <li v-for="metier in METIERS" :key="metier">
                  <label
                    class="flex cursor-pointer items-center gap-3 text-sm text-primary-900/70 hover:text-primary-900 transition-colors"
                  >
                    <input
                      v-model="selectedMetiers"
                      type="checkbox"
                      :value="metier"
                      class="h-4 w-4 rounded accent-accent-500"
                    />
                    {{ metier }}
                  </label>
                </li>
              </ul>
            </div>

            <!-- Types de contrat -->
            <div class="mt-5 border-t border-gray-200 pt-5">
              <div class="flex items-center justify-between">
                <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Types de contrat
                </h3>
                <button
                  v-if="selectedContracts.length"
                  class="text-xs text-primary-900/60 hover:text-primary-900 hover:underline"
                  @click="clearGroup('contracts')"
                >
                  Effacer
                </button>
              </div>
              <ul class="mt-3 space-y-2.5">
                <li v-for="contract in CONTRACTS" :key="contract">
                  <label
                    class="flex cursor-pointer items-center gap-3 text-sm text-primary-900/70 hover:text-primary-900 transition-colors"
                  >
                    <input
                      v-model="selectedContracts"
                      type="checkbox"
                      :value="contract"
                      class="h-4 w-4 rounded accent-accent-500"
                    />
                    {{ contract }}
                  </label>
                </li>
              </ul>
            </div>
          </aside>
        </div>
        <!-- fin grille -->
      </div>
      <!-- fin max-w-6xl -->
    </div>
    <!-- fin overflow-y-auto -->
  </section>
</template>
