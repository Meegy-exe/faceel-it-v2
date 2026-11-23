<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
// TODO: remplacer par la photo de l'équipe Product (assets/images/photos/bus/product/ est vide)
import imgHero from '@/assets/images/photos/f-it-02.jpg'
import imgFaceel04 from '@/assets/images/photos/faceel_04.jpeg'
import TheFooter from '@/components/layout/TheFooter.vue'
import { scrollRevealClass, useScrollReveal } from '@/composables/useScrollReveal'
import { useSeo } from '@/composables/useSeo'

/**
 * Hero de la BU Product, sur le même gabarit que DigitalView.vue (Full Page
 * Snap Scroll, cf. CLAUDE.md) mais avec la photo à gauche et le texte à droite
 * sur desktop. Textes et chiffres : placeholders à valider par les RH.
 */
useSeo({
  // seo local
  title: 'BU Product - ESN à Wasquehal, dans la métropole lilloise',
  description:
    "Découvrez l'expertise Product de Faceel-IT, ESN basée à Wasquehal, " +
    'au service des entreprises de la métropole lilloise.',
})

const router = useRouter()

// animations d'entree au scroll, section hero
const heroTextEl = useTemplateRef<HTMLElement>('heroTextEl')
const heroTextReveal = useScrollReveal(heroTextEl)
const heroImageEl = useTemplateRef<HTMLElement>('heroImageEl')
const heroImageReveal = useScrollReveal(heroImageEl)

// animation d'entree au scroll, en-tete de la section 2
const introHeaderEl = useTemplateRef<HTMLElement>('introHeaderEl')
const introHeaderReveal = useScrollReveal(introHeaderEl)
// un seul observateur sur la grille : les deux citations partagent l'etat, le stagger est porte par le delai
const quotesGridEl = useTemplateRef<HTMLElement>('quotesGridEl')
const quotesReveal = useScrollReveal(quotesGridEl)

// TODO: remplacer les placeholders par les vrais temoignages et postes
// animation d'entree au scroll, section Expertise
const expertiseEl = useTemplateRef<HTMLElement>('expertiseEl')
const expertiseReveal = useScrollReveal(expertiseEl)
const isExpertiseVisible = computed(() => expertiseReveal.value !== 'hidden')

interface ExpertiseOffer {
  name: string
  headline: string
  description: string
  /** Attribut `d` d'une icône trait 24×24 (stroke `currentColor`). */
  iconPath: string
  /** Carte mise en avant (bordure accent), cf. maquette : une seule. */
  featured?: boolean
}

// TODO: textes a valider par les RH
const EXPERTISE_OFFERS: ExpertiseOffer[] = [
  {
    name: 'NAISSANCE DU PROJET',
    headline: 'Cadrage & conception UX/UI',
    description:
      "De l'idée au prototype : ateliers de cadrage, recherche utilisateur et conception UI/UX pour poser les fondations solides de votre produit digital.",
    // ampoule
    iconPath:
      'M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18',
  },
  {
    name: 'DÉROULEMENT',
    headline: 'Pilotage & Intervention',
    description:
      'Gestion de projet digital de A à Z : pilotage de la roadmap produit, coordination des équipes et intervention au plus près des besoins.',
    // roues crantees
    iconPath:
      'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
    featured: true,
  },
  {
    name: 'MAINTIEN',
    headline: 'Maintien en condition & Évolutions',
    description:
      'Suivi des performances, corrections et évolutions produit continues pour garder votre produit fiable et en phase avec ses utilisateurs.',
    // bouclier
    iconPath:
      'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z',
  },
]

// section 4, accordeon : un seul metier ouvert a la fois, le premier par defaut
// TODO: remplacer les 10 metiers factices par les vrais intitules et descriptions
const activeExpert = ref(1)
const experts = [
  {
    id: 1,
    title: 'Product Owner',
    description:
      'Pilotez le backlog produit et faites le lien entre les besoins métier et les équipes de développement.',
  },
  {
    id: 2,
    title: 'Product Manager',
    description:
      "Définissez la vision et la roadmap produit, de la découverte des besoins jusqu'au suivi des résultats.",
  },
  {
    id: 3,
    title: 'UX/UI Designer',
    description:
      "Concevez des interfaces claires et utiles, de la recherche utilisateur jusqu'au prototype.",
  },
  {
    id: 4,
    title: 'Product Analyst / Data Product Manager',
    description:
      'Analysez les usages, mesurez la performance des fonctionnalités et éclairez les décisions produit par la donnée.',
  },
  {
    id: 5,
    title: 'UX Researcher',
    description:
      "Menez des entretiens, tests utilisateurs et parcours d'observation pour ancrer chaque décision dans des besoins réels.",
  },
  {
    id: 6,
    title: 'UI Designer / Design System Specialist',
    description:
      "Déclinez l'identité visuelle en interfaces cohérentes, accessibles et maintenables via un design system structuré.",
  },
  {
    id: 7,
    title: 'Scrum Master / Agile Coach',
    description:
      "Fluidifiez les rituels, levez les blocages d'équipe et accompagnez l'amélioration continue au rythme du produit.",
  },
  {
    id: 8,
    title: 'Technical Product Owner',
    description:
      'Faites le lien entre enjeux métier, architecture technique et priorisation du backlog avec les équipes de développement.',
  },
  {
    id: 9,
    title: 'Discovery & Cadrage Lead',
    description:
      'Structurez les ateliers de cadrage, validez la faisabilité et alignez les parties prenantes avant le lancement.',
  },
  {
    id: 10,
    title: 'Product Ops',
    description:
      "Optimisez les outils, processus et rituels transverses pour faire gagner en efficacité l'ensemble des équipes produit.",
  },
]

// animation d'entree au scroll, section "force d'execution"
const executionEl = useTemplateRef<HTMLElement>('executionEl')
const executionReveal = useScrollReveal(executionEl)
const isExecutionVisible = computed(() => executionReveal.value !== 'hidden')

// section 6, rotation auto entre 3 temoignages clients et 3 temoignages consultants
// TODO: remplacer les faux textes par de vrais temoignages, noms et postes
const clientTestimonials = [
  {
    id: 'client-1',
    text: 'Témoignage client à venir : un retour sur la qualité du pilotage et de la collaboration avec la BU Product.',
    name: 'Prénom Nom',
    role: 'Client',
  },
  {
    id: 'client-2',
    text: 'Deuxième témoignage client à venir : un retour sur la transition entre cadrage, conception et exécution.',
    name: 'Prénom Nom',
    role: 'Client',
  },
  {
    id: 'client-3',
    text: 'Troisième témoignage client à venir : un retour sur la réactivité et la qualité des livrables.',
    name: 'Prénom Nom',
    role: 'Client',
  },
]
const consultantTestimonials = [
  {
    id: 'consultant-1',
    text: "Ce que j'aime chez Faceel-it ? On n'est jamais seul sur un projet. Du cadrage à la mise en production, je suis accompagné de A à Z c'est vraiment agréable",
    name: 'Prénom Nom',
    role: 'Consultant Product',
  },
  {
    id: 'consultant-2',
    text: "Deuxième témoignage consultant à venir : un retour sur l'accompagnement et la montée en compétences.",
    name: 'Prénom Nom',
    role: 'Consultant Product',
  },
  {
    id: 'consultant-3',
    text: 'Troisième témoignage consultant à venir : un retour sur la variété des missions et la liberté de proposition.',
    name: 'Prénom Nom',
    role: 'Consultant Product',
  },
]
// 2 cartes a taille fixe : une colonne client, une colonne consultant. A chaque rotation,
// seul le contenu avance d'un cran (3 paires), la grille reste calee sur 2 cartes
const visibleTestimonials = ref([clientTestimonials[0]!, consultantTestimonials[0]!])
let testimonialPair = 0
let testimonialsInterval: ReturnType<typeof setInterval> | undefined
let testimonialTimeouts: ReturnType<typeof setTimeout>[] = []

// apparition au scroll : immediate, puis +300 ms par carte.
// Porte par le <li> seulement : le <Transition> de rotation, a l'interieur, n'est pas retarde.
// Classes litterales pour que Tailwind les genere.
const testimonialsGridEl = useTemplateRef<HTMLElement>('testimonialsGridEl')
const testimonialsReveal = useScrollReveal(testimonialsGridEl)
// titre : les animations CSS ne partent qu'a l'entree dans le viewport (sinon elles
// sont deja finies quand l'utilisateur arrive sur la section)
const titleRef = useTemplateRef<HTMLElement>('titleRef')
const titleReveal = useScrollReveal(titleRef)
const isTitleVisible = computed(() => titleReveal.value === 'visible')
const TESTIMONIAL_DELAYS = ['delay-0', 'delay-[300ms]']

function swapTestimonials() {
  testimonialPair = (testimonialPair + 1) % clientTestimonials.length
  // carte par carte, a 0 / 1 s
  visibleTestimonials.value[0] = clientTestimonials[testimonialPair]!
  testimonialTimeouts = [
    setTimeout(() => {
      visibleTestimonials.value[1] = consultantTestimonials[testimonialPair]!
    }, 1000),
  ]
}

onMounted(() => {
  testimonialsInterval = setInterval(swapTestimonials, 10000)
})

onUnmounted(() => {
  clearInterval(testimonialsInterval)
  testimonialTimeouts.forEach(clearTimeout)
})

// section 7, mot qui tourne en boucle (effet machine a sous) toutes les 2,5 s
const ROTATING_WORDS = ['quand ?', 'pourquoi ?', 'pour ?']
const wordIndex = ref(0)
let wordInterval: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  wordInterval = setInterval(() => {
    wordIndex.value = (wordIndex.value + 1) % ROTATING_WORDS.length
  }, 2500)
})

onUnmounted(() => {
  clearInterval(wordInterval)
})

// section 8, "Nos references" : copie brute de UseCasesSection.vue (Data & IA)
const realisationsEl = useTemplateRef<HTMLElement>('realisationsEl')
const realisationsReveal = useScrollReveal(realisationsEl)
const isRealisationsVisible = computed(() => realisationsReveal.value !== 'hidden')

interface CaseStudy {
  name: string
  description: string
  /** Graine picsum.photos  déterministe (même visuel à chaque rendu/build),
   *  pas d'image aléatoire. Absente quand `image` est fourni (cas réel, ex.
   *  Boulanger) : pas besoin d'un visuel de substitution. */
  seed?: string
  /** Image de fond réelle (remplace le picsum)  uniquement pour les cas
   *  clients réels, documentés, avec un visuel propre. */
  image?: string
  /** Logo blanc affiché à la place du nom en texte uniquement pour les cas
   *  clients réels disposant d'un logo officiel (ex. Boulanger). */
  logo?: string
  /** Présent uniquement pour les cas clients réels, documentés par une page
   *  de référence dédiée : la carte entière devient un lien. */
  to?: RouteLocationRaw
  /** Fond de marque (ex. orange Boulanger) remplace le fond neutre par
   *  défaut de la carte ; pilote aussi le cadrage de l'image (cf. template :
   *  `object-contain` diminué plutôt que `object-cover` plein cadre). */
  bgColor?: string
}

const CASE_STUDIES: CaseStudy[] = [
  {
    name: 'Boulanger',
    description:
      "Refonte complète de l'application Boulanger pour moderniser l'interface et accompagner le lancement des projets stratégiques.",
    image: '/images/partners/boulanger/tel.png',
    logo: '/images/partners/boulanger-white.svg',
    to: { name: 'reference-boulanger' },
    bgColor: 'bg-[#ff6200]',
  },
  {
    name: 'Adeo',
    description:
      'Déploiement de solutions IA et automatisation des flux de données RH pour garantir une vision globale et fiable des applications internes.',
    /** `/images/references/adeo.svg` : seul fichier logo Adeo du dépôt, déjà
     *  utilisé tel quel (logo multicolore, pas de variante blanche) dans
     *  AdeoView.vue pas de fichier `adeo-white.svg`. Couleur de marque
     *  `#059dab` reprise de ce même fichier (teal), pas `#004f9f`. */
    image: '/images/partners/adeo/tt.png',
    logo: '/images/references/adeo.svg',
    to: { name: 'reference-adeo' },
    bgColor: 'bg-[#059dab]',
  },
  // retire cartes vides
]

// section "offres" : bloc copie de DataIaView.vue, seuls les textes et les donnees changent
const jobsEl = useTemplateRef<HTMLElement>('jobsEl')
const jobsReveal = useScrollReveal(jobsEl)
const isJobsVisible = computed(() => jobsReveal.value !== 'hidden')

// TODO: brancher sur les vraies offres de la BU Product (ids fictifs : la fiche detaillee n'existe pas encore)
const allJobs = [
  {
    id: 301,
    title: 'Product Owner',
    contract: 'CDI',
    location: 'Lille',
    buTag: 'Product',
    shortDescription:
      'Pilotez le backlog produit et faites le lien entre les besoins métier et les équipes de développement.',
    stacks: ['Agile', 'Scrum', 'Jira'],
  },
  {
    id: 302,
    title: 'Product Manager',
    contract: 'CDI',
    location: 'Lille',
    buTag: 'Product',
    shortDescription:
      "Définissez la vision et la roadmap produit, de la découverte des besoins jusqu'au suivi des résultats.",
    stacks: ['Roadmap', 'Stratégie', 'Discovery'],
  },
  {
    id: 303,
    title: 'UX/UI Designer',
    contract: 'CDI',
    location: 'Lille',
    buTag: 'Product',
    shortDescription:
      "Concevez des interfaces claires et utiles, de la recherche utilisateur jusqu'au prototype.",
    stacks: ['Figma', 'Recherche UX', 'Prototypage'],
  },
]

// ne garde que les offres de la bu product
const productJobs = computed(() => allJobs.filter((job) => job.buTag === 'Product'))

// modale offre : apercu rapide au clic sur la carte
type Job = (typeof allJobs)[number]
const selectedJob = ref<Job | null>(null)
const isModalOpen = ref(false)

function openModal(job: Job) {
  selectedJob.value = job
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

// redirige vers la fiche complete de l'offre
function goToJob(id: number) {
  router.push({ name: 'offre-detail', params: { id } })
}

// clic "voir l'offre complete" : navigue puis ferme la modale
function goToSelectedJobDetail() {
  if (!selectedJob.value) return
  goToJob(selectedJob.value.id)
  closeModal()
}

const QUOTES = [
  {
    id: 'left',
    text: 'Etre à l’écoute est pour moi le plus important pour répondre au mieux au besoin de nos clients.',
    name: 'Laetitia Lesaffre',
    role: 'Directrice BU Product',
  },
  {
    id: 'right',
    text: 'Je cherche avant tout des qualités humaines avant des qualités techniques.',
    name: 'Victoire Machowiak',
    role: 'Responsable RH BU Product  ',
  },
]

// TODO: valeurs a confirmer, indicateurs fictifs en attendant les vrais chiffres
const KPIS = [
  { label: 'Collaborateurs', value: 'XX' },
  { label: 'Projets cadrés', value: 'XX' },
  { label: 'Taux de satisfaction', value: 'XX%' },
]

// cycle stats, affiches par deux sur mobile (grille complete des 4 sur desktop)
const kpiIndex = ref(0)
let kpiInterval: ReturnType<typeof setInterval> | undefined

const visibleKpis = computed(() => [
  KPIS[kpiIndex.value]!,
  KPIS[(kpiIndex.value + 1) % KPIS.length]!,
])

onMounted(() => {
  kpiInterval = setInterval(() => {
    kpiIndex.value = (kpiIndex.value + 1) % KPIS.length
  }, 3500)
})

onUnmounted(() => {
  clearInterval(kpiInterval)
})
</script>

<template>
  <div class="h-dvh w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory">
    <!-- hero section, fond bleu -->
    <section
      id="hero"
      data-theme="dark"
      class="relative min-h-dvh w-full shrink-0 snap-start snap-always bg-[#000066] flex flex-col"
    >
      <!-- degrade deep ambient en fond -->
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-primary-700/40 to-transparent"
        aria-hidden="true"
      />

      <!-- conteneur aligne sur la nav -->
      <!-- tasser hero mobile -->
      <div
        class="grid w-full grid-cols-1 items-stretch gap-4 px-4 pt-32 pb-4 sm:px-6 lg:gap-12 lg:px-8 lg:pb-8 lg:grid-cols-2 xl:px-12"
      >
        <!-- colonne texte, prend toute la hauteur, fondu au scroll -->
        <div
          ref="heroTextEl"
          class="flex h-full max-w-2xl flex-col lg:max-w-none"
          :class="
            scrollRevealClass(heroTextReveal, 'up', {
              offsetClass: '',
              durationClass: 'duration-1000',
            })
          "
        >
          <!-- fix contraste texte : vert accent trop sombre une fois rendu sur navy -->
          <p class="mb-3 font-bold uppercase tracking-widest text-blue-100 lg:mb-6">BU Product</p>
          <h1 class="mb-4 font-display text-4xl font-black text-white lg:mb-8 lg:text-6xl">
            Notre expertise dans la métropole lilloise
          </h1>
          <p class="mb-6 text-lg text-white md:text-xl lg:mb-8">
            De l'atelier de cadrage à la conception UX/UI, jusqu'au pilotage de votre roadmap
            produit : notre BU Product accompagne vos projets digitaux au plus près de vos
            utilisateurs.
          </p>

          <!-- liste d'arguments -->
          <ul class="mt-6 flex flex-col gap-3 text-lg md:mt-8 md:text-xl lg:gap-4">
            <li class="flex items-center gap-3 text-white">
              <span class="text-accent-500" aria-hidden="true">&bull;</span>
              Product management et pilotage de roadmap produit
            </li>
            <li class="flex items-center gap-3 text-white">
              <span class="text-accent-500" aria-hidden="true">&bull;</span>
              Conception UX/UI centrée utilisateur
            </li>
            <li class="flex items-center gap-3 text-white">
              <span class="text-accent-500" aria-hidden="true">&bull;</span>
              Des produits digitaux utiles, mesurés et améliorés en continu
            </li>
          </ul>
        </div>

        <!-- image de droite, aeree par rapport au texte, glissement au scroll -->
        <!-- bride image hero -->
        <!-- remonte image -->
        <!-- wrapper = 1 colonne de la grille ; l'espacement est en padding (pas en margin)
             pour que l'img remplisse son wrapper sans deborder sur le texte -->
        <div class="min-w-0 lg:order-first lg:pl-6 lg:pr-10 xl:pl-10">
          <img
            ref="heroImageEl"
            :src="imgHero"
            alt="Equipe Product de Faceel-IT"
            class="mt-2 max-h-[160px] w-full rounded-[2rem] object-cover shadow-2xl transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-2xl lg:mt-0 lg:aspect-[3/2] lg:h-full lg:max-h-[80vh]"
            :class="
              scrollRevealClass(heroImageReveal, 'left', {
                offsetClass: '-translate-x-16',
                durationClass: 'duration-1000',
              })
            "
          />
        </div>
      </div>

      <!-- conteneur externe, juste le padding de la nav -->
      <div class="px-4 sm:px-6 lg:px-8 xl:px-12">
        <!-- metriques bu product, cycle stats sur mobile -->
        <!-- anim propre out-in -->
        <Transition
          mode="out-in"
          enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-300 ease-in"
          enter-from-class="opacity-0 translate-x-4"
          leave-to-class="opacity-0 -translate-x-4"
        >
          <!-- fix hauteur saut : reserve l'espace entre les deux etats de l'animation -->
          <!-- force premier plan, fix z-index couleur -->
          <div
            :key="kpiIndex"
            class="relative z-20 mt-8 grid min-h-[140px] w-full grid-cols-2 gap-8 px-8 pb-8 text-center transform-gpu md:hidden"
          >
            <div v-for="kpi in visibleKpis" :key="kpi.label">
              <p class="font-display text-4xl font-bold text-accent-500">{{ kpi.value }}</p>
              <p class="mt-2 text-sm text-white">{{ kpi.label }}</p>
            </div>
          </div>
        </Transition>

        <!-- grille complete, statique a partir de md -->
        <!-- force premier plan -->
        <div
          class="relative z-20 mt-16 hidden w-full grid-cols-3 gap-4 px-4 pb-8 text-center sm:gap-6 md:grid md:px-16 lg:gap-8 lg:px-32"
        >
          <div v-for="kpi in KPIS" :key="kpi.label">
            <p class="font-display text-2xl font-bold text-accent-500 md:text-3xl lg:text-5xl">
              {{ kpi.value }}
            </p>
            <p class="mt-2 text-xs text-white sm:text-sm lg:text-base">{{ kpi.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- section 2, fond clair : presentation et citations -->
    <section
      id="presentation"
      data-theme="light"
      class="relative min-h-dvh w-full shrink-0 snap-start snap-always flex flex-col justify-center bg-light px-4 pt-36 pb-24 sm:px-6 lg:px-8 lg:pb-32 xl:px-12"
    >
      <header
        ref="introHeaderEl"
        class="mx-auto max-w-4xl text-center"
        :class="scrollRevealClass(introHeaderReveal, 'up')"
      >
        <h2 class="font-display text-display text-primary-900">
          Nos BUs, Expertes de vos besoins.
        </h2>
        <!-- accent-700 : le vert accent clair ne passe pas le contraste sur fond clair -->
        <p class="mt-4 text-base font-semibold leading-relaxed text-accent-700 md:text-lg">
          Chez Faceel-it, l'accompagnement c'est une vraie valeur, pas juste un mot. C'est pour ça que nous nous sommes organisés en BUs spécialisées : chaque client reçoit une réponse sur-mesure.
        </p>
      </header>

      <!-- mobile : photo, citation 1, citation 2 ; desktop : citation | photo | citation -->
      <div
        ref="quotesGridEl"
        class="mx-auto mt-12 grid w-full max-w-[1500px] grid-cols-1 items-center gap-6 sm:grid-cols-[1fr_auto_1fr] sm:gap-6 lg:mt-16 lg:gap-10"
      >
        <!-- TODO: remplacer par la photo de Laëtitia et Victoire -->
        <div
          role="img"
          aria-label="Photo de Laëtitia et Victoire"
          class="order-1 mx-auto flex size-44 cursor-pointer items-center justify-center overflow-hidden rounded-[2rem] bg-gray-100 text-center transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl motion-reduce:transition-none motion-reduce:hover:scale-100 sm:order-2 sm:size-56 md:size-64 lg:size-72"
        >
          <span class="px-2 text-sm font-medium text-gray-500 md:text-xl">Photo (Laëtitia &amp; Victoire)</span>
        </div>

        <figure
          v-for="(quote, index) in QUOTES"
          :key="quote.id"
          class="min-w-0 px-2 py-2 sm:px-0 lg:px-6 lg:py-4"
          :class="[
            index === 0 ? 'order-2 sm:order-1' : 'order-3',
            scrollRevealClass(quotesReveal, 'up', {
              delayClass: index === 0 ? '' : 'delay-300',
            }),
          ]"
        >
          <blockquote class="text-base italic leading-relaxed text-primary-900 sm:text-xs md:text-sm lg:text-xl xl:text-2xl">
            « {{ quote.text }} »
          </blockquote>
          <figcaption class="mt-4 lg:mt-8">
            <p class="font-display text-base font-bold text-accent-700 sm:text-sm lg:text-xl">{{ quote.name }}</p>
            <p class="text-sm text-primary-900/70 sm:text-xs lg:text-base">{{ quote.role }}</p>
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- section 3 (Expertise), fond bleu, cartes plates claires. Seule la carte
         centrale porte la bordure accent a gauche : une touche, jamais un aplat.
         Mobile : icone a gauche du texte plutot qu'au-dessus. -->
    <section
      id="expertise-offre"
      ref="expertiseEl"
      data-theme="dark"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-[#000066] flex flex-col justify-center px-4 pt-24 pb-12 sm:px-6 lg:px-8 xl:px-12"
    >
      <!-- en tete, fondu vers le haut -->
      <div
        class="mx-auto flex max-w-3xl flex-col items-center text-center"
        :class="
          isExpertiseVisible
            ? 'translate-y-0 opacity-100 transition-all duration-700 ease-out'
            : 'translate-y-8 opacity-0'
        "
      >
        <h2
          class="font-display text-5xl font-black tracking-tight text-white underline decoration-accent-500 decoration-[6px] underline-offset-8 md:text-6xl xl:text-7xl"
        >
          NOTRE EXPERTISE
        </h2>
        <p class="mt-8 text-lg text-white md:text-xl">
          Notre expertise Product, du cadrage à la mise en production.
        </p>
      </div>

      <!-- `mt-16 md:mt-24` (au lieu de `mt-10`) : les paliers de hauteur
           mobile ci-dessous (bloc <style>) imposent déjà `margin-top` en
           `!important` sur `.expertise-grid` à 900px/740px de haut ils
           continuent de s'appliquer quelle que soit la valeur de base, donc
           ce changement n'a besoin d'aucun ajustement mobile supplémentaire. -->
      <div
        class="expertise-grid mx-auto mt-16 flex w-full max-w-[1400px] snap-x snap-mandatory gap-4 overflow-x-auto pb-2 hide-scrollbar md:mt-24 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0 xl:gap-10"
      >
        <!-- cascade cartes -->
        <article
          v-for="(offer, index) in EXPERTISE_OFFERS"
          :key="offer.name"
          :style="{ transitionDelay: isExpertiseVisible ? `${index * 150}ms` : '0ms' }"
          :class="[
            'expertise-card flex w-[85vw] shrink-0 snap-center items-start gap-4 rounded-3xl bg-gray-50 p-6 text-left sm:p-8 md:w-auto md:flex-col md:gap-6 md:min-h-[450px] md:p-10 xl:min-h-[500px]',
            offer.featured && 'border-l-4 border-accent-500',
            isExpertiseVisible
              ? 'translate-y-0 opacity-100 transition-all duration-700 ease-out'
              : 'translate-y-8 opacity-0 transition-none',
          ]"
        >
          <div
            :class="[
              'expertise-icon flex size-11 shrink-0 items-center justify-center rounded-2xl md:size-16 xl:size-20',
              offer.featured ? 'bg-accent-500 text-[#000066]' : 'bg-[#000066] text-white',
            ]"
            aria-hidden="true"
          >
            <svg
              class="size-5 md:size-8 xl:size-9"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                :d="offer.iconPath"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <!-- md:mt-4 + gap-6 = marge fixe de 40px : le texte démarre au même niveau dans les 3 cartes -->
          <div class="min-w-0 md:mt-4">
            <p class="text-sm font-bold uppercase tracking-widest text-accent-700">
              {{ offer.name }}
            </p>
            <h3
              class="expertise-headline mt-2 font-display text-xl font-bold leading-tight text-[#000066] md:text-3xl"
            >
              {{ offer.headline }}
            </h3>
            <p class="expertise-desc mt-3 text-base leading-relaxed text-gray-700 md:text-lg">
              {{ offer.description }}
            </p>
          </div>
        </article>
      </div>
    </section>

    <!-- section 4, fond clair : accordeon des metiers de l'equipe -->
    <section
      id="experts"
      data-theme="light"
      class="relative min-h-dvh w-full shrink-0 snap-start snap-always flex flex-col justify-center bg-white px-4 pt-32 pb-16 sm:px-6 lg:px-8 xl:px-12"
    >
      <div class="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-12 lg:grid-cols-2">
        <!-- colonne gauche, figee pendant le scroll de l'accordeon -->
        <div class="lg:sticky lg:top-32">
          <h2
            class="font-display text-4xl font-black text-primary-900 underline decoration-accent-500 decoration-[6px] underline-offset-8 lg:text-5xl"
          >
            Nos experts
          </h2>
          <p class="mt-6 max-w-md text-lg leading-relaxed text-gray-600">
            Derrière chaque projet, il y a une équipe ! Des profils complémentaires, réunis du
            cadrage à la mise en production.
          </p>
        </div>

        <!-- colonne droite : liste scrollable ; wrapper relatif pour porter le fondu et l'indicateur de scroll -->
        <div class="relative">
          <div class="flex max-h-[600px] flex-col gap-4 overflow-y-auto pr-4 hide-scrollbar">
            <div
              v-for="expert in experts"
              :key="expert.id"
              class="cursor-pointer rounded-[2rem] border-2 p-6 transition-all duration-300 motion-reduce:transition-none lg:p-8"
              :class="
                activeExpert === expert.id
                  ? 'border-accent-500 bg-white shadow-soft'
                  : 'border-gray-200 bg-white'
              "
              @click="activeExpert = expert.id"
            >
              <button
                type="button"
                class="flex w-full items-center gap-4 text-left"
                :aria-expanded="activeExpert === expert.id"
                :aria-controls="`expert-panel-${expert.id}`"
              >
                <span class="font-display text-xl font-black text-accent-700">
                  {{ String(expert.id).padStart(2, '0') }}.
                </span>
                <span
                  class="flex-1 text-xl font-bold transition-colors duration-300 motion-reduce:transition-none"
                  :class="activeExpert === expert.id ? 'text-primary-900' : 'text-primary-900/60'"
                >
                  {{ expert.title }}
                </span>
                <svg
                  class="size-6 shrink-0 text-primary-900 transition-transform duration-300 motion-reduce:transition-none"
                  :class="activeExpert === expert.id ? 'rotate-180' : ''"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <!-- rétraction douce via grid-rows 0fr -> 1fr ; inert pour sortir le contenu masqué du focus -->
              <div
                :id="`expert-panel-${expert.id}`"
                class="grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none"
                :class="activeExpert === expert.id ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
                :inert="activeExpert !== expert.id"
              >
                <div class="overflow-hidden">
                  <p class="pt-4 leading-relaxed text-gray-600">{{ expert.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- fondu bas : suggere que la liste continue -->
          <div
            class="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent"
            aria-hidden="true"
          ></div>
          <!-- indicateur de scroll, dans la gouttiere de la grille (gap-12) pour ne pas chevaucher le texte -->
          <div
            class="pointer-events-none absolute -right-8 bottom-6 hidden text-accent-500 animate-bounce motion-reduce:animate-none lg:block"
            aria-hidden="true"
          >
            <svg class="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- section 6, copie de la section "force d'execution" de Data & IA, sans la banniere de chiffres -->
    <section
      id="execution"
      ref="executionEl"
      data-theme="dark"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-[#000066] flex flex-col justify-center px-4 py-20 sm:px-6 md:py-32 lg:px-8 xl:px-12"
    >
      <!-- degrade fond, effet deep ambient -->
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-primary-700/40 to-transparent"
      />

      <div
        class="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-16 xl:gap-24"
      >
        <!-- Colonne gauche : image, glisse depuis la gauche -->
        <img
          :src="imgFaceel04"
          alt="Équipe Faceel-IT en intervention chez un client."
          class="min-h-[400px] w-full rounded-3xl object-cover shadow-2xl md:min-h-[600px]"
          :class="
            isExecutionVisible
              ? 'translate-x-0 opacity-100 transition-all duration-700 ease-out'
              : '-translate-x-8 opacity-0'
          "
        />

        <!-- Colonne droite : texte -->
        <div>
          <h2
            class="font-display text-4xl font-black text-white md:text-5xl xl:text-6xl"
            :class="
              isExecutionVisible
                ? 'translate-y-0 opacity-100 transition-all duration-700 ease-out'
                : 'translate-y-8 opacity-0'
            "
          >
            De la cohésion à l'exécution.
          </h2>
          <!-- glisse depuis la droite -->
          <div
            class="mt-4 space-y-4 text-lg leading-relaxed text-white md:text-xl"
            :class="
              isExecutionVisible
                ? 'translate-x-0 opacity-100 transition-all duration-700 delay-150 ease-out'
                : 'translate-x-8 opacity-0'
            "
          >
            <p>
              Notre force réside dans le lien qui unit nos équipes Product. Nos collaborateurs
              partagent une culture commune et parlent le même langage.
            </p>
            <p>
              Cette synergie et cette communication fluide nous permettent de piloter vos projets digitaux
              de bout en bout, garantissant une transition parfaite entre le cadrage stratégique, la
              conception UX/UI et l'exécution technique.
            </p>
            <p class="font-bold">
              Une équipe soudée pour des projets réussis : c'est ça aussi, l'esprit Faceel-it.
            </p>
          </div>
          <RouterLink
            to="/contact-entreprise"
            class="mt-8 inline-block rounded-full bg-[#12D80A] px-8 py-4 font-bold text-white transition-colors hover:bg-accent-400"
          >
            Parlons de votre projet !
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- section 7, fond clair : grille de 3 temoignages -->
    <section
      id="temoignages"
      data-theme="light"
      class="relative min-h-dvh w-full shrink-0 snap-start snap-always flex flex-col justify-center overflow-x-hidden bg-white px-4 pt-32 pb-16 sm:px-6 lg:px-8 xl:px-12"
    >
      <header class="mx-auto max-w-4xl text-center">
        <h2 ref="titleRef" class="font-display text-2xl font-bold text-primary-900 sm:text-3xl lg:text-4xl">
          <span class="typewriter-base" :class="{ typewriter: isTitleVisible }"
            >Nos clients le disent,</span
          >
          {{ ' ' }}
          <span class="underline-base" :class="{ 'animated-underline': isTitleVisible }"
            
            >nos collaborateurs le pensent !</span
          >
        </h2>
      </header>

      <ul
        ref="testimonialsGridEl"
        class="mx-auto mt-8 grid w-full max-w-7xl grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:gap-8"
      >
        <li
          v-for="(item, index) in visibleTestimonials"
          :key="index"
          class="min-w-0"
          :class="
            scrollRevealClass(testimonialsReveal, 'left', {
              delayClass: TESTIMONIAL_DELAYS[index]!,
              durationClass: 'duration-700',
            })
          "
        >
          <!-- out-in sur le contenu seul : le <li> garde sa taille, pas de layout shift -->
          <Transition mode="out-in" name="fade">
            <figure :key="item.id">
              <!-- TODO: remplacer par la photo de la personne -->
              <div
                role="img"
                :aria-label="`Photo de ${item.name}`"
                class="flex h-48 w-full items-center justify-center rounded-[2rem] bg-gray-200 sm:h-56 lg:aspect-square lg:h-auto"
              >
                <span class="text-lg font-medium text-gray-500">Photo</span>
              </div>

              <blockquote class="mt-4 text-base italic leading-relaxed text-gray-700 lg:mt-6 lg:text-lg">
                « {{ item.text }} »
              </blockquote>

              <figcaption class="mt-4">
                <p class="font-bold text-primary-900">{{ item.name }}</p>
                <!-- accent-700 : texte vert sur fond clair -->
                <p class="text-sm text-accent-700">{{ item.role }}</p>
              </figcaption>
            </figure>
          </Transition>
        </li>
      </ul>
    </section>

    <!-- section 8, fond bleu : "Parlons IA" avec mot dynamique -->
    <section
      id="parlons-ia"
      data-theme="dark"
      class="relative min-h-dvh w-full shrink-0 snap-start snap-always flex flex-col justify-center bg-[#000066] px-4 pt-32 pb-24 sm:px-6 lg:px-8 xl:px-12"
    >
      <div
        class="mx-auto grid min-h-[400px] w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2"
      >
        <!-- gauche : phrase fixe + mot qui glisse verticalement (le nouveau remplace l'ancien) -->
        <h2 class="font-display text-4xl font-black text-white lg:text-6xl">
          Tu en as besoin
          <!-- accent-500 : le vert vif a un bon contraste sur fond bleu marine -->
          <span class="relative inline-block overflow-hidden align-bottom text-accent-500">
            <Transition
              mode="out-in"
              enter-active-class="transition-all duration-500 ease-out motion-reduce:transition-none"
              leave-active-class="transition-all duration-300 ease-in motion-reduce:transition-none"
              enter-from-class="translate-y-full opacity-0"
              leave-to-class="-translate-y-full opacity-0"
            >
              <span :key="wordIndex" class="inline-block">{{ ROTATING_WORDS[wordIndex] }}</span>
            </Transition>
          </span>
        </h2>

        <!-- droite : message cle et explication -->
        <div>
          <p
            class="mb-4 text-xl font-bold uppercase tracking-widest text-white underline decoration-accent-500 decoration-[4px] underline-offset-[6px]"
          >
            Parlons IA
          </p>
          <p class="mb-6 text-3xl font-bold leading-tight text-white lg:text-4xl">
            L'IA accélère, l'humain décide.
          </p>
          <!-- TODO: texte a valider par les RH -->
          <div class="space-y-4 text-lg leading-relaxed text-gray-300 lg:text-xl">
            <p>
              Au sein de la BU Product, l'intelligence artificielle nous fait gagner un temps
              précieux sur les tâches répétitives : synthèse de recherches utilisateurs, exploration
              d'idées, premières versions de maquettes UX/UI ou de documentation.
            </p>
            <p>
              Mais les choix de produit, les priorités et la vision stratégique, eux, restent entre
              les mains de nos équipes et des vôtres. Vous gardez le contrôle à chaque étape !
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 4 (Cas d'usage) galerie (portfolio immersif, image + overlay). -->
    <!-- fix hauteur mobile -->
    <section
      id="realisations"
      ref="realisationsEl"
      data-theme="light"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-white flex flex-col justify-center py-10 sm:py-20"
    >
      <!-- en tete, fondu vers le haut -->
      <div
        class="mx-auto max-w-3xl px-4 text-center"
        :class="
          isRealisationsVisible
            ? 'translate-y-0 opacity-100 transition-all duration-700 ease-out'
            : 'translate-y-8 opacity-0'
        "
      >
        <h2 class="font-display text-3xl font-extrabold text-[#000066] sm:text-5xl">
          Nos références
        </h2>
        <p class="mx-auto mt-2 max-w-2xl text-gray-600 sm:mt-4">
          Un aperçu des projets menés aux côtés de nos clients, tous secteurs confondus.
        </p>
      </div>

      <div
        class="mx-auto mt-6 grid w-full max-w-6xl grid-cols-1 gap-4 px-4 sm:mt-10 sm:gap-6 md:grid-cols-2 lg:gap-8"
      >
        <!-- `study.to` : cas client réel documenté par sa propre page (ex.
               Boulanger) la carte entière devient un lien ; absent pour les
               autres (mockups), qui restent de simples `<div>`. -->
        <!-- cascade cartes -->
        <component
          :is="study.to ? 'RouterLink' : 'div'"
          v-for="(study, index) in CASE_STUDIES"
          :key="study.name"
          v-bind="study.to ? { to: study.to } : {}"
          :style="{ transitionDelay: isRealisationsVisible ? `${index * 150}ms` : '0ms' }"
          :class="[
            study.bgColor || 'bg-gray-900',
            'group relative aspect-video overflow-hidden rounded-3xl',
            isRealisationsVisible
              ? 'translate-y-0 opacity-100 transition-all duration-700 ease-out'
              : 'translate-y-8 opacity-0 transition-none',
          ]"
        >
          <!-- `v-if` : Télécom/EDF n'ont plus ni `image` ni `seed` (fond
                 blanc uni demandé) sans ce garde-fou, l'`<img>` pointerait
                 vers une URL picsum invalide (`seed` undefined). -->
          <img
            v-if="study.image || study.seed"
            :src="study.image ?? `https://picsum.photos/seed/${study.seed}/800/600`"
            :alt="study.name"
            loading="lazy"
            decoding="async"
            :class="[
              'absolute transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100',
              study.bgColor
                ? 'inset-0 h-full w-full object-contain object-right p-4'
                : 'inset-0 h-full w-full object-cover',
            ]"
          />
          <!-- Dégradé navy prévu pour assombrir une photo de fond : sur les
                 cartes à fond blanc uni, il ne ferait que ternir ce blanc sans
                 raison (pas de photo à estomper dessous). -->
          <div
            v-if="study.bgColor !== 'bg-white'"
            class="absolute inset-0 bg-gradient-to-t from-[#000066]/90 via-[#000066]/40 to-transparent"
            aria-hidden="true"
          />
          <div class="absolute bottom-0 left-0 p-6">
            <img
              v-if="study.logo"
              :src="study.logo"
              :alt="study.name"
              class="h-8 w-auto object-contain"
            />
            <p
              v-else
              class="font-display font-bold"
              :class="study.bgColor === 'bg-white' ? 'text-[#000066]' : 'text-white'"
            >
              {{ study.name }}
            </p>
            <p
              class="mt-1 line-clamp-2 text-sm"
              :class="study.bgColor === 'bg-white' ? 'text-[#000066]' : 'text-white/80'"
            >
              {{ study.description }}
            </p>
          </div>
        </component>
      </div>
    </section>

    <!-- compense hauteur navbar -->
    <!-- section offres, fond bleu -->
    <section
      id="offres"
      ref="jobsEl"
      data-theme="dark"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-[#000066] flex flex-col justify-center px-8 pt-24 pb-6 text-center sm:py-24 md:py-32 lg:px-24"
    >
      <!-- en tete, fondu vers le haut -->
      <div
        :class="
          isJobsVisible
            ? 'translate-y-0 opacity-100 transition-all duration-700 ease-out'
            : 'translate-y-8 opacity-0'
        "
      >
        <h2
          class="mt-2 mb-3 font-display text-3xl font-black text-white underline decoration-accent-500 decoration-[6px] underline-offset-8 sm:mb-6 md:text-6xl xl:text-7xl"
        >
          REJOIGNEZ LA BU PRODUCT
        </h2>
        <p class="mx-auto mt-2 max-w-2xl text-lg text-gray-300 sm:mt-4 md:text-xl">
          Et si vous rejoigniez l'aventure ?
        </p>
      </div>

      <!-- defilement horizontal offres -->
      <div
        v-if="productJobs.length > 0"
        class="mx-auto mt-4 flex w-full max-w-[1400px] snap-x snap-mandatory gap-4 overflow-x-auto pb-4 hide-scrollbar sm:mt-10 md:grid md:grid-cols-3 md:gap-12 md:overflow-visible md:pb-0"
      >
        <!-- cache ombre mobile -->
        <div
          v-for="(job, index) in productJobs"
          :key="index"
          class="relative flex w-[85vw] min-h-[260px] shrink-0 cursor-pointer snap-center flex-col justify-between rounded-[2rem] border border-gray-100 bg-white p-6 text-left shadow-none md:w-auto md:min-h-[400px] md:p-12 md:shadow-2xl"
          :style="{ transitionDelay: isJobsVisible ? `${index * 150}ms` : '0ms' }"
          :class="
            isJobsVisible
              ? 'translate-y-0 opacity-100 transition-all duration-700 ease-out'
              : 'translate-y-8 opacity-0 transition-none'
          "
          @click="openModal(job)"
        >
          <div>
            <!-- lien sur titre -->
            <router-link
              :to="{ name: 'offre-detail', params: { id: job.id } }"
              class="block text-2xl font-bold text-[#000066] transition-colors hover:text-accent-500 md:text-3xl"
              @click.stop
            >
              {{ job.title }}
            </router-link>
            <p class="mt-2 text-sm text-gray-700">{{ job.contract }} - {{ job.location }}</p>
          </div>

          <!-- resume court -->
          <p class="my-4 line-clamp-2 text-sm leading-relaxed text-gray-600 md:my-6">
            {{ job.shortDescription }}
          </p>

          <!-- badges stack tech, limite a 3 stacks -->
          <div class="mt-8 flex flex-wrap gap-3">
            <span
              v-for="(stack, stackIndex) in job.stacks.slice(0, 3)"
              :key="stackIndex"
              class="rounded-full bg-accent-500 px-4 py-2 text-sm font-bold text-white"
            >
              {{ stack }}
            </span>
          </div>

          <!-- masque fleche mobile -->
          <button
            type="button"
            aria-label="Voir la fiche complete de l'offre"
            class="absolute bottom-6 right-6 hidden size-10 items-center justify-center rounded-full bg-[#000066] text-white transition-colors hover:bg-primary-700 md:flex"
            @click.stop="goToJob(job.id)"
          >
            <svg
              class="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 17 17 7M7 7h10v10" />
            </svg>
          </button>
        </div>
      </div>
      <!-- fallback zero offre -->
      <p v-else class="mt-4 text-center text-primary-900/80 sm:mt-10">
        Aucune offre spécifique pour le moment. N'hésitez pas à nous envoyer une candidature
        spontanée !
      </p>

      <div class="mt-4 flex w-full justify-center sm:mt-12">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full bg-[#12D80A] px-10 py-4 text-lg font-bold text-[#000066] shadow-[0_10px_30px_rgba(18,216,10,0.3)] transition-transform hover:scale-105 md:text-xl"
          @click="router.push({ name: 'offres', query: { bu: 'Product' } })"
        >
          Découvrez plus d'offres
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </section>

    <TheFooter full-page-scroll />
  </div>

  <!-- modale offre, apercu rapide -->
  <Teleport to="body">
    <div
      v-if="isModalOpen && selectedJob"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-md"
      @click.self="closeModal"
    >
      <div
        class="relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
      >
        <div class="flex items-start justify-between gap-4 bg-[#000066] px-6 py-5 md:px-8">
          <div class="pr-8">
            <p class="text-xs font-semibold uppercase tracking-widest text-white/50">
              {{ selectedJob.buTag }}
            </p>
            <h2 class="mt-1 font-display text-xl font-bold text-white sm:text-2xl">
              {{ selectedJob.title }}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Fermer"
            class="flex size-8 shrink-0 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            @click="closeModal"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" class="size-5" aria-hidden="true">
              <path
                d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
              />
            </svg>
          </button>
        </div>

        <div class="px-6 py-6 md:px-8">
          <div class="flex flex-wrap gap-2">
            <span
              class="rounded-full bg-accent-500/15 px-3 py-1 text-xs font-semibold text-primary-900"
            >
              {{ selectedJob.contract }}
            </span>
            <span
              class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-primary-900/70"
            >
              {{ selectedJob.location }}
            </span>
          </div>

          <!-- stacks, pas de limite ici, apercu complet -->
          <div class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="(stack, stackIndex) in selectedJob.stacks"
              :key="stackIndex"
              class="rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-white"
            >
              {{ stack }}
            </span>
          </div>

          <p class="mt-6 text-sm leading-relaxed text-primary-900/70">
            {{ selectedJob.shortDescription }}
          </p>
        </div>

        <div
          class="flex flex-col-reverse gap-3 border-t border-gray-100 px-6 py-4 sm:flex-row sm:justify-end md:px-8"
        >
          <button
            type="button"
            class="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-primary-900 transition-colors hover:bg-gray-50"
            @click="closeModal"
          >
            Fermer
          </button>
          <button
            type="button"
            class="rounded-lg bg-[#12D80A] px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-[#0fc009]"
            @click="goToSelectedJobDetail"
          >
            Voir l'offre complète
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* Etat initial : le texte occupe deja sa taille finale (aucun layout shift), un masque
   clip-path le cache par la droite. .typewriter ne fait que lancer l'ouverture. */
.typewriter-base {
  display: inline-block;
  clip-path: inset(0 100% 0 0);
}
.typewriter {
  animation: reveal-text 1.5s ease-out forwards;
}

@keyframes reveal-text {
  to {
    clip-path: inset(0 0 0 0);
  }
}

/* Le texte reste bleu marine : le trait est decoratif, accent-500 est donc admis ici. */
.underline-base {
  opacity: 0; /* texte cache au depart, revele apres la fin de reveal-text */
  background: linear-gradient(to right, var(--color-accent-500), var(--color-accent-500));
  background-repeat: no-repeat;
  background-size: 0% 8px;
  background-position: left bottom;
  /* clone : le trait reste complet si le texte passe sur deux lignes */
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  color: inherit;
  padding-bottom: 8px;
}
/* fondu du texte + trace du trait, tous deux apres reveal-text : le delai (1.5s)
   doit rester egal a la duree de .typewriter */
.animated-underline {
  animation:
    fade-in-text 0.5s ease 1.5s forwards,
    draw-underline 1s ease 1.5s forwards;
}

@keyframes fade-in-text {
  to {
    opacity: 1;
  }
}

@keyframes draw-underline {
  to {
    background-size: 100% 8px;
  }
}

/* Mobile : un masque sur inline-block casserait le retour a la ligne, on coupe la revelation
   (texte toujours visible) et on enchaine le trait tout de suite. */
@media (max-width: 639px) {
  .typewriter-base {
    display: inline;
    clip-path: none;
  }
  .typewriter {
    animation: none;
  }
  .animated-underline {
    animation-delay: 0.3s;
  }
}

/* Etat final direct, sans animation */
@media (prefers-reduced-motion: reduce) {
  .typewriter-base {
    clip-path: none;
  }
  .typewriter {
    animation: none;
  }
  .underline-base {
    opacity: 1;
    background-size: 100% 8px;
  }
  .animated-underline {
    animation: none;
  }
}

/* Rotation des temoignages : fondu + glissement vertical doux (out-in, la hauteur du <li>
   reste fixe car seul le contenu bouge). */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}
</style>
