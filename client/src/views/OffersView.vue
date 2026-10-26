<script setup lang="ts">
import { ref, computed, watch, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import TheFooter from '@/components/layout/TheFooter.vue'
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

const selectedOffer = ref<JobOffer | null>(null)

/* -------------------------------------------------------------------------- */
/* Données mock — à remplacer par un appel API une fois le back disponible.   */
/* -------------------------------------------------------------------------- */

interface JobOffer {
  id: number
  title: string
  location: string
  category: string
  contract: 'CDI' | 'CDD' | 'Stage' | 'Alternance'
  level: string
  metier: string
  description: string
  date: string
  /** Technologies citées par l'offre — vide pour les postes sans stack
   *  technique propre (conseil, architecture SI, Scrum Master…). */
  stack: string[]
}

const OFFERS: JobOffer[] = [
  {
    id: 1,
    title: 'Data Engineer (H/F)',
    location: 'Lille',
    category: 'Data',
    contract: 'CDI',
    level: '3 à 5 ans',
    metier: 'Data et intelligence artificielle',
    date: 'Publié il y a 9 mois',
    description:
      "Pour un client dans le secteur du retail, vous rejoindrez une équipe en charge de la mise en place et de l'optimisation des pipelines de données. Vous développerez et maintiendrez des flux fiables, structurerez les architectures data et assurerez l'intégrité et la qualité des informations utilisées par les équipes business et analytics, dans un environnement Agile et orienté performance.",
    stack: ['Python', 'SQL', 'Airflow'],
  },
  {
    id: 2,
    title: 'Consultante / Consultant fonctionnel - Expert S4HANA SAP SD',
    location: 'Lille, Toulouse, Paris',
    category: 'Solutions SaaS',
    contract: 'CDI',
    level: 'Plus de 10 ans',
    metier: 'Business Analyst',
    date: 'Publié il y a 3 mois',
    description:
      "Vous intégrerez une équipe projet pour accompagner la transformation SAP S/4HANA de nos clients industriels. Vous serez en charge de l'analyse des besoins fonctionnels, de la conception des solutions et de la conduite du changement auprès des équipes métier.",
    stack: ['SAP S/4HANA', 'SAP SD'],
  },
  {
    id: 3,
    title: 'Architecte solutions - Microsoft Azure',
    location: 'Lyon, Remote',
    category: 'Cloud & Infrastructure',
    contract: 'CDI',
    level: '6 à 10 ans',
    metier: 'Architecture',
    date: 'Publié il y a 2 semaines',
    description:
      "Vous interviendrez en tant qu'Architecte Cloud principal sur des projets de migration et de modernisation d'infrastructures vers Microsoft Azure. Vous définirez les architectures cibles, accompagnerez les équipes techniques et assurerez la conformité des solutions déployées.",
    stack: ['Microsoft Azure'],
  },
  {
    id: 4,
    title: 'Business Analyst - Transformation digitale retail',
    location: 'Lille',
    category: 'Conseil',
    contract: 'CDD',
    level: '0 à 2 ans',
    metier: 'Business Analyst',
    date: 'Publié il y a 1 mois',
    description:
      "Dans le cadre d'un programme de transformation digitale pour un acteur majeur du retail, vous contribuerez à la définition des besoins fonctionnels, à la rédaction des spécifications et au pilotage des recettes utilisateurs. Bonne maîtrise des méthodes Agile requise.",
    stack: [],
  },
  {
    id: 5,
    title: 'Développeur fullstack - React / Node.js',
    location: 'Toulouse',
    category: 'Développement',
    contract: 'CDI',
    level: '3 à 5 ans',
    metier: 'Développement',
    date: 'Publié il y a 5 mois',
    description:
      "Vous rejoindrez une squad produit pour développer et maintenir des applications web en React et Node.js. Vous participerez aux cérémonies Agile, contribuerez aux revues de code et serez acteur de l'amélioration continue des pratiques d'ingénierie au sein de l'équipe.",
    stack: ['React', 'Node.js'],
  },
  {
    id: 6,
    title: 'Stage - Data Scientist junior IA générative',
    location: 'Paris',
    category: 'Data & IA',
    contract: 'Stage',
    level: '0 à 2 ans',
    metier: 'Data et intelligence artificielle',
    date: 'Publié il y a 1 semaine',
    description:
      "Dans le cadre d'un stage de fin d'études, vous travaillerez sur des cas d'usage d'intelligence artificielle générative. Vous participerez à la conception de pipelines de traitement de données et à l'évaluation de modèles de langage dans un environnement orienté recherche appliquée.",
    stack: ['Python'],
  },
  {
    id: 7,
    title: 'Développeur Android (H/F)',
    location: 'Lille',
    category: 'Digital',
    contract: 'CDI',
    level: '3 à 5 ans',
    metier: 'Développeur',
    date: 'Publié il y a 2 mois',
    description:
      "Vous rejoindrez une équipe mobile pour concevoir et maintenir des applications Android natives (Kotlin) à forte volumétrie. Vous travaillerez en étroite collaboration avec les équipes design et backend dans un cycle Agile.",
    stack: ['Android', 'Kotlin'],
  },
  {
    id: 8,
    title: 'Développeur(se) Fullstack Vue / Node.js',
    location: 'Wasquehal',
    category: 'Digital',
    contract: 'CDI',
    level: '0 à 2 ans',
    metier: 'Développeur',
    date: 'Publié il y a 3 semaines',
    description:
      "Vous interviendrez sur l'ensemble de la chaîne applicative (Vue 3, Node.js) d'une plateforme métier interne. Vous participerez aux choix d'architecture frontend et à la mise en place de bonnes pratiques de test.",
    stack: ['Vue.js', 'Node.js'],
  },
  {
    id: 9,
    title: 'Ingénieur DevOps (H/F)',
    location: 'Métropole Lilloise',
    category: 'Cloud & Infrastructure',
    contract: 'CDI',
    level: '6 à 10 ans',
    metier: "Architecte d’Entreprise",
    date: 'Publié il y a 1 mois',
    description:
      "Vous industrialisez les pipelines CI/CD et l'infrastructure cloud de nos clients (conteneurisation, supervision, sécurité). Vous accompagnez les équipes de développement vers une démarche DevOps mature.",
    stack: ['Docker', 'CI/CD'],
  },
  {
    id: 10,
    title: 'Tech Lead Java (H/F)',
    location: 'Lille',
    category: 'Digital',
    contract: 'CDI',
    level: 'Plus de 10 ans',
    metier: 'Développeur',
    date: 'Publié il y a 4 mois',
    description:
      "Vous encadrez techniquement une équipe de développeurs Java/Spring sur un projet métier critique. Vous garantissez la qualité du code, les choix d'architecture et la montée en compétence de l'équipe.",
    stack: ['Java', 'Spring'],
  },
  {
    id: 11,
    title: 'Data Analyst (H/F)',
    location: 'Wasquehal',
    category: 'Data & IA',
    contract: 'CDI',
    level: '0 à 2 ans',
    metier: 'Data Analyst',
    date: 'Publié il y a 2 semaines',
    description:
      "Vous produisez des tableaux de bord et analyses pour accompagner la prise de décision de nos clients. Vous travaillez sur des outils de BI (Power BI) et participez à la fiabilisation des données sources.",
    stack: ['Power BI', 'SQL'],
  },
  {
    id: 12,
    title: 'Alternance – Développeur Fullstack',
    location: 'Lille',
    category: 'Digital',
    contract: 'Alternance',
    level: '0 à 2 ans',
    metier: 'Développeur',
    date: 'Publié il y a 1 semaine',
    description:
      "En alternance, vous contribuez au développement de fonctionnalités sur une application web Vue/Node.js, encadré par un développeur senior. Formation Bac+4/5 en informatique requise.",
    stack: ['Vue.js', 'Node.js'],
  },
  {
    id: 13,
    title: 'Scrum Master / Transformation Agile',
    location: 'Métropole Lilloise',
    category: 'Conseil',
    contract: 'CDI',
    level: '3 à 5 ans',
    metier: 'Transformation manager',
    date: 'Publié il y a 6 mois',
    description:
      "Vous accompagnez plusieurs équipes produit dans l'adoption et l'amélioration continue des pratiques Agile. Vous facilitez les rituels Scrum et diffusez une culture d'amélioration continue.",
    stack: [],
  },
  {
    id: 14,
    title: 'Responsable Applicatif PLM (H/F)',
    location: 'Wasquehal',
    category: 'Digital',
    contract: 'CDI',
    level: '6 à 10 ans',
    metier: "Responsable d’Application",
    date: 'Publié il y a 5 mois',
    description:
      "Vous pilotez le maintien en conditions opérationnelles et les évolutions d'une application PLM métier. Vous coordonnez les équipes techniques et les utilisateurs clés côté client.",
    stack: ['PLM'],
  },
  {
    id: 15,
    title: "Architecte d'Entreprise",
    location: 'Lille',
    category: 'Digital',
    contract: 'CDI',
    level: 'Plus de 10 ans',
    metier: "Architecte d’Entreprise",
    date: 'Publié il y a 2 mois',
    description:
      "Vous définissez la cible d'architecture SI de nos clients grands comptes, en cohérence avec leur stratégie métier. Vous cadrez les projets de transformation et en garantissez la cohérence technique globale.",
    stack: [],
  },
]

/* -------------------------------------------------------------------------- */
/* Filtres                                                                     */
/* -------------------------------------------------------------------------- */

const LEVELS = ['0 à 2 ans', '3 à 5 ans', '6 à 10 ans', 'Plus de 10 ans']
const METIERS = [
  "Responsable d’Application",
  "Architecte d’Entreprise",
  'Développeur',
  'Transformation manager',
  'Business Analyst',
  "Responsable d’applications",
  'Data Engineer',
  'Data Analyst',
]
/** Liste stricte des BUs officielles — fixée indépendamment des valeurs
 *  libres de `category` sur les offres mock. BU Cloud retirée. */
const CATEGORIES = ['Data & IA', 'Product', 'Digital']

const searchQuery = ref('')
const showSuggestions = ref(false)
const currentPage = ref(1)
const PAGE_SIZE = 10

const selectedLevels = ref<string[]>([])
const selectedMetiers = ref<string[]>([])
const selectedCategories = ref<string[]>([])
/** Filtre par stack technique — sélection unique, '' = « Toutes ». */
const selectedStack = ref('')

const isLevelsOpen = ref(false)
const isMetiersOpen = ref(false)
const isCategoriesOpen = ref(false)
const isStackOpen = ref(false)

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

/** Liste unique et dédoublonnée de toutes les technologies renseignées sur
 *  les offres, triée alphabétiquement pour un ordre d'affichage stable. */
const availableStacks = computed(() => {
  const pool = new Set<string>()
  OFFERS.forEach((o) => o.stack.forEach((tech) => pool.add(tech)))
  return [...pool].sort((a, b) => a.localeCompare(b))
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
    if (selectedCategories.value.length && !selectedCategories.value.includes(o.category))
      return false
    if (selectedStack.value && !o.stack.includes(selectedStack.value)) return false
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

function clearGroup(group: 'levels' | 'metiers' | 'categories') {
  if (group === 'levels') selectedLevels.value = []
  else if (group === 'metiers') selectedMetiers.value = []
  else selectedCategories.value = []
}

watch(
  [selectedLevels, selectedMetiers, selectedCategories, selectedStack],
  () => {
    currentPage.value = 1
  },
  { deep: true },
)
</script>

<template>
  <!-- Pas de <main> ici : App.vue le fournit déjà. -->

  <!-- Scroll libre (page dédiée, hors du régime snap-scroll des autres
       vues principales, cf. CLAUDE.md) — exception demandée pour cette page. -->
  <div class="flex flex-col min-h-screen w-full overflow-x-hidden">
  <!-- ==================================================================
       1. HERO — sombre
       ================================================================== -->
  <section
    id="hero"
    data-theme="dark"
    class="relative w-full h-auto min-h-[40vh] flex flex-col justify-center overflow-hidden px-4 pt-32 pb-16 sm:px-6 lg:px-8 xl:px-12 bg-[#000066] text-white"
  >
    <!-- Fond vivant — remplace la vague animée d'origine (hors format pour
         un Hero réduit h-auto) : lignes filaires ondulantes + halos
         respirants, statiques sous prefers-reduced-motion. -->
    <div
      aria-hidden="true"
      class="glow-pulse glow-pulse-1 pointer-events-none absolute -left-32 -top-32 z-0 h-[420px] w-[420px] rounded-full bg-[#5EC6FF] opacity-[0.15] blur-3xl"
    />
    <div
      aria-hidden="true"
      class="glow-pulse glow-pulse-2 pointer-events-none absolute -right-32 -bottom-32 z-0 h-[420px] w-[420px] rounded-full bg-accent-500 opacity-[0.15] blur-3xl"
    />
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-30">
      <div class="mosaic-tile absolute top-[8%] left-[6%] h-14 w-14 rounded-md bg-[#5EC6FF] opacity-20" />
      <div class="mosaic-tile absolute top-[20%] left-[42%] h-10 w-10 rounded-md bg-accent-500 opacity-30" />
      <div class="mosaic-tile absolute top-[12%] right-[10%] h-20 w-20 rounded-md bg-[#5EC6FF] opacity-10" />
      <div class="mosaic-tile absolute bottom-[18%] left-[18%] h-16 w-16 rounded-md bg-accent-500 opacity-20" />
      <div class="mosaic-tile absolute bottom-[10%] right-[30%] h-12 w-12 rounded-md bg-[#5EC6FF] opacity-30" />
      <div class="mosaic-tile absolute bottom-[28%] right-[8%] h-24 w-24 rounded-md bg-accent-500 opacity-10" />
      <div class="mosaic-tile absolute top-[48%] left-[28%] h-8 w-8 rounded-md bg-[#5EC6FF] opacity-20" />
    </div>

    <div
      ref="heroEl"
      class="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center transition-all duration-700 ease-out motion-reduce:transition-none"
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
       ================================================================== -->
  <section id="job-board" data-theme="light" class="w-full flex flex-col bg-light">
    <div class="px-4 pt-28 pb-8 sm:px-6 lg:px-8 xl:px-12">
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
          <!-- Colonne gauche : liste + pagination. `min-h-[60vh]` : un filtre
               très restrictif (ex. une seule offre) ne doit pas faire
               s'effondrer la hauteur totale de la page — sinon, si l'utilisateur
               était déjà scrollé plus bas que la nouvelle hauteur (plus courte),
               le navigateur borne (clamp) sa position de scroll au nouveau
               maximum, ce qui se perçoit comme un saut/recentrage automatique
               alors qu'aucun code ne pilote de scroll ici (vérifié : aucun
               `window.scrollTo`/`scrollIntoView`/`scrollTop` dans ce fichier). -->
          <div class="min-h-[60vh]">
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
                <!-- Titre + date + aperçu rapide -->
                <div class="flex items-start justify-between gap-4">
                  <h3 class="font-semibold text-primary-900">{{ offer.title }}</h3>
                  <div class="flex shrink-0 items-center gap-2">
                    <span class="text-xs text-gray-400">{{ offer.date }}</span>
                    <button
                      type="button"
                      aria-label="Aperçu rapide de l'offre"
                      class="flex size-7 items-center justify-center rounded-full text-primary-900/50 transition-colors hover:bg-gray-100 hover:text-primary-900"
                      @click.stop="selectedOffer = offer"
                    >
                      <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12Z"
                        />
                        <circle cx="12" cy="12" r="3" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </button>
                  </div>
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
                  <span
                    v-for="tech in offer.stack"
                    :key="tech"
                    class="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-primary-900/70"
                  >
                    {{ tech }}
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
            <RouterLink
              :to="{ name: 'candidature-spontanee' }"
              class="mb-6 flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-bold text-primary-950 transition-colors hover:bg-accent-400"
            >
              Candidature spontanée
            </RouterLink>

            <h2 class="font-display text-lg font-bold text-primary-900">Filtres</h2>

            <!-- Métiers -->
            <div class="mt-5 border-t border-gray-200 pt-5">
              <button
                type="button"
                class="flex w-full items-center justify-between gap-2 bg-transparent text-left"
                :aria-expanded="isMetiersOpen"
                @click="isMetiersOpen = !isMetiersOpen"
              >
                <span class="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Métiers
                </span>
                <svg
                  class="size-4 shrink-0 text-primary-950 transition-transform duration-200 motion-reduce:transition-none"
                  :class="isMetiersOpen ? 'rotate-180' : ''"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="m5 7 5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <div v-show="isMetiersOpen">
                <button
                  v-if="selectedMetiers.length"
                  class="mt-3 text-xs text-primary-900/60 hover:text-primary-900 hover:underline"
                  @click="clearGroup('metiers')"
                >
                  Effacer
                </button>
                <ul class="mt-3 max-h-60 space-y-2.5 overflow-y-auto pr-1">
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
            </div>

            <!-- BUs -->
            <div class="mt-5 border-t border-gray-200 pt-5">
              <button
                type="button"
                class="flex w-full items-center justify-between gap-2 bg-transparent text-left"
                :aria-expanded="isCategoriesOpen"
                @click="isCategoriesOpen = !isCategoriesOpen"
              >
                <span class="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  BUSINESS UNITS
                </span>
                <svg
                  class="size-4 shrink-0 text-primary-950 transition-transform duration-200 motion-reduce:transition-none"
                  :class="isCategoriesOpen ? 'rotate-180' : ''"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="m5 7 5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <div v-show="isCategoriesOpen">
                <button
                  v-if="selectedCategories.length"
                  class="mt-3 text-xs text-primary-900/60 hover:text-primary-900 hover:underline"
                  @click="clearGroup('categories')"
                >
                  Effacer
                </button>
                <ul class="mt-3 max-h-60 space-y-2.5 overflow-y-auto pr-1">
                  <li v-for="category in CATEGORIES" :key="category">
                    <label
                      class="flex cursor-pointer items-center gap-3 text-sm text-primary-900/70 hover:text-primary-900 transition-colors"
                    >
                      <input
                        v-model="selectedCategories"
                        type="checkbox"
                        :value="category"
                        class="h-4 w-4 rounded accent-accent-500"
                      />
                      {{ category }}
                    </label>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Niveau d'expérience -->
            <div class="mt-5 border-t border-gray-200 pt-5">
              <button
                type="button"
                class="flex w-full items-center justify-between gap-2 bg-transparent text-left"
                :aria-expanded="isLevelsOpen"
                @click="isLevelsOpen = !isLevelsOpen"
              >
                <span class="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Niveau d'expérience
                </span>
                <svg
                  class="size-4 shrink-0 text-primary-950 transition-transform duration-200 motion-reduce:transition-none"
                  :class="isLevelsOpen ? 'rotate-180' : ''"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="m5 7 5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <div v-show="isLevelsOpen">
                <button
                  v-if="selectedLevels.length"
                  class="mt-3 text-xs text-primary-900/60 hover:text-primary-900 hover:underline"
                  @click="clearGroup('levels')"
                >
                  Effacer
                </button>
                <ul class="mt-3 max-h-60 space-y-2.5 overflow-y-auto pr-1">
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
            </div>

            <!-- Stack technique : sélection unique (pas de v-model array comme
                 les groupes ci-dessus), affichée en badges empilés plutôt
                 qu'en cases à cocher — cohérent avec la disposition verticale
                 de la barre latérale, sans le défilement horizontal du
                 placement précédent. -->
            <div class="mt-5 border-t border-gray-200 pt-5">
              <button
                type="button"
                class="flex w-full items-center justify-between gap-2 bg-transparent text-left"
                :aria-expanded="isStackOpen"
                @click="isStackOpen = !isStackOpen"
              >
                <span class="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Stack technique
                </span>
                <svg
                  class="size-4 shrink-0 text-primary-950 transition-transform duration-200 motion-reduce:transition-none"
                  :class="isStackOpen ? 'rotate-180' : ''"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="m5 7 5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <div v-show="isStackOpen">
                <button
                  v-if="selectedStack"
                  class="mt-3 text-xs text-primary-900/60 hover:text-primary-900 hover:underline"
                  @click="selectedStack = ''"
                >
                  Effacer
                </button>
                <div class="mt-3 flex max-h-60 flex-wrap gap-2 overflow-y-auto pr-1">
                  <button
                    v-for="stack in availableStacks"
                    :key="stack"
                    type="button"
                    class="rounded-full px-3 py-1 text-xs font-medium transition-colors"
                    :class="
                      selectedStack === stack
                        ? 'bg-accent-500 text-white'
                        : 'border border-gray-300 bg-white text-primary-900/70 hover:border-accent-500'
                    "
                    @click="selectedStack = selectedStack === stack ? '' : stack"
                  >
                    {{ stack }}
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
        <!-- fin grille -->
      </div>
      <!-- fin max-w-6xl -->
    </div>
  </section>

  <!-- ==================================================================
       3. FOOTER — App.vue masque son footer global pour cette route pour
       éviter le doublon ; il est repris ici dans le flux normal de la page.
       ================================================================== -->
  <section data-theme="dark" class="w-full bg-[#000066]">
    <TheFooter />
  </section>
  </div>
  <!-- /conteneur en flux normal (pas de snap-scroll, cf. commentaire plus haut) -->

  <!-- ==================================================================
       MODALE — aperçu rapide d'une offre
       ================================================================== -->
  <Teleport to="body">
    <div
      v-if="selectedOffer"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-md p-4"
      @click.self="selectedOffer = null"
    >
      <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-gray-200 shadow-2xl">
        <!-- Bandeau en-tête bleu -->
        <div class="sticky top-0 z-10 flex items-start justify-between gap-4 rounded-t-2xl bg-[#000066] px-6 py-5 md:px-8">
          <div class="pr-8">
            <p class="text-xs font-semibold uppercase tracking-widest text-white/50">{{ selectedOffer.category }}</p>
            <h2 class="mt-1 font-display text-xl font-bold text-white sm:text-2xl">
              {{ selectedOffer.title }}
            </h2>
            <p class="mt-0.5 text-sm text-white/60">Faceel IT · {{ selectedOffer.date }}</p>
          </div>
          <button
            type="button"
            aria-label="Fermer"
            class="shrink-0 flex size-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            @click="selectedOffer = null"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" class="size-5" aria-hidden="true">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <!-- Corps -->
        <div class="px-6 py-6 md:px-8">
          <!-- Grille de badges -->
          <div class="flex flex-wrap gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-accent-500/15 px-3 py-1 text-xs font-semibold text-primary-900">
              {{ selectedOffer.contract }}
            </span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-primary-900/70">
              <svg class="size-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M8 1.5A4.5 4.5 0 003.5 6c0 2.9 3.23 6.77 4.5 8.25C9.27 12.77 12.5 8.9 12.5 6A4.5 4.5 0 008 1.5zm0 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clip-rule="evenodd" />
              </svg>
              {{ selectedOffer.location }}
            </span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-primary-900/70">
              {{ selectedOffer.level }}
            </span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-primary-900/70">
              <!-- Télétravail : TODO — à récupérer depuis l'API -->
              Hybride
            </span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-primary-900/70">
              <!-- Salaire : TODO — à récupérer depuis l'API -->
              Salaire selon profil
            </span>
          </div>

          <!-- Contexte -->
          <h3 class="mt-6 mb-2 text-lg font-bold text-[#000066]">Le poste</h3>
          <p class="text-sm leading-relaxed text-primary-900/70">{{ selectedOffer.description }}</p>

          <!-- Missions (TODO : à connecter au champ API dédié) -->
          <h3 class="mt-6 mb-2 text-lg font-bold text-[#000066]">Vos missions</h3>
          <ul class="space-y-2 text-sm text-primary-900/70">
            <li class="flex items-start gap-2">
              <span class="mt-1 size-1.5 shrink-0 rounded-full bg-[#12D80A]" aria-hidden="true" />
              Analyser les besoins fonctionnels et techniques en collaboration avec les équipes métier.
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1 size-1.5 shrink-0 rounded-full bg-[#12D80A]" aria-hidden="true" />
              Concevoir et implémenter les solutions dans le respect des standards de qualité du client.
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1 size-1.5 shrink-0 rounded-full bg-[#12D80A]" aria-hidden="true" />
              Participer aux rituels Agile (sprint planning, daily, retrospective) et aux revues de code.
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1 size-1.5 shrink-0 rounded-full bg-[#12D80A]" aria-hidden="true" />
              Assurer la documentation technique et la montée en compétence des équipes.
            </li>
          </ul>

          <!-- Profil (TODO : à connecter au champ API dédié) -->
          <h3 class="mt-6 mb-2 text-lg font-bold text-[#000066]">Votre profil</h3>
          <ul class="space-y-2 text-sm text-primary-900/70">
            <li class="flex items-start gap-2">
              <span class="mt-1 size-1.5 shrink-0 rounded-full bg-[#12D80A]" aria-hidden="true" />
              Diplômé(e) Bac+5 (école d'ingénieurs, université) avec une spécialisation dans le domaine concerné.
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1 size-1.5 shrink-0 rounded-full bg-[#12D80A]" aria-hidden="true" />
              Expérience significative en environnement de conseil ou ESN sur des missions similaires.
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1 size-1.5 shrink-0 rounded-full bg-[#12D80A]" aria-hidden="true" />
              Autonomie, rigueur et excellent relationnel client — vous êtes à l'aise en prise de parole.
            </li>
            <li class="flex items-start gap-2">
              <span class="mt-1 size-1.5 shrink-0 rounded-full bg-[#12D80A]" aria-hidden="true" />
              Maîtrise des outils et méthodologies propres à la BU <strong class="font-semibold text-primary-900">{{ selectedOffer.metier }}</strong>.
            </li>
          </ul>
        </div>

        <!-- Pied fixe avec actions -->
        <div class="sticky bottom-0 flex flex-col-reverse gap-3 rounded-b-2xl border-t border-gray-100 bg-white px-6 py-4 sm:flex-row sm:justify-end md:px-8">
          <button
            type="button"
            class="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-primary-900 transition-colors hover:bg-gray-50"
            @click="selectedOffer = null"
          >
            Fermer
          </button>
          <button
            type="button"
            class="rounded-lg bg-[#12D80A] px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-[#0fc009]"
            @click="router.push({ name: 'offre-detail', params: { id: selectedOffer!.id } }); selectedOffer = null"
          >
            Voir l'offre complète
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* Fond animé du Hero (mosaïque de tuiles + halos respirants) — neutralisé
   sous prefers-reduced-motion, cf. CLAUDE.md. Rien de ceci n'anime le
   layout, donc zéro impact sur le CLS. */
@media (prefers-reduced-motion: no-preference) {
  .mosaic-tile {
    animation: floatTile 20s ease-in-out infinite;
  }

  .mosaic-tile:nth-child(1) {
    animation-duration: 18s;
    animation-delay: -2s;
  }

  .mosaic-tile:nth-child(2) {
    animation-duration: 15s;
    animation-delay: -5s;
  }

  .mosaic-tile:nth-child(3) {
    animation-duration: 24s;
    animation-delay: -8s;
  }

  .mosaic-tile:nth-child(4) {
    animation-duration: 20s;
    animation-delay: -11s;
  }

  .mosaic-tile:nth-child(5) {
    animation-duration: 17s;
    animation-delay: -14s;
  }

  .mosaic-tile:nth-child(6) {
    animation-duration: 25s;
    animation-delay: -17s;
  }

  .mosaic-tile:nth-child(7) {
    animation-duration: 16s;
    animation-delay: -20s;
  }

  @keyframes floatTile {
    0% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(5deg);
    }
    100% {
      transform: translateY(0) rotate(0deg);
    }
  }

  .glow-pulse {
    animation: pulseGlow 10s ease-in-out infinite alternate;
  }

  .glow-pulse-2 {
    animation-duration: 12s;
    animation-delay: -5s;
  }

  @keyframes pulseGlow {
    0% {
      opacity: 0.1;
      transform: scale(0.9);
    }
    100% {
      opacity: 0.22;
      transform: scale(1.1);
    }
  }
}
</style>
