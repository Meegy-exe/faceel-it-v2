<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import imgHero from '@/assets/images/photos/f-it-01.jpg'
import imgNoemie from '@/assets/images/photos/bus/digital/noemie.jpeg'
import imgStephanie from '@/assets/images/photos/bus/digital/stephanie.jpeg'
import imgAngular from '@/assets/images/stacks/angular.svg'
import imgDocker from '@/assets/images/stacks/docker.svg'
import imgJava from '@/assets/images/stacks/java.svg'
import imgMysql from '@/assets/images/stacks/mysql.svg'
import imgNextJs from '@/assets/images/stacks/next-js.svg'
import imgNodeJs from '@/assets/images/stacks/node-js.svg'
import imgPostgresql from '@/assets/images/stacks/postgresql.svg'
import imgPython from '@/assets/images/stacks/python.svg'
import imgSpring from '@/assets/images/stacks/spring.svg'
import imgTypescript from '@/assets/images/stacks/typescript.svg'
import imgVueJs from '@/assets/images/stacks/vue-js.svg'
import UseCasesSection from '@/components/home/UseCasesSection.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import { scrollRevealClass, useScrollReveal } from '@/composables/useScrollReveal'
import { useSeo } from '@/composables/useSeo'

/**
 * Page modèle (template) pour une Business Unit - textes volontairement
 * génériques : sert de base que les RH dupliquent et complètent pour chaque
 * BU, pas un contenu final à publier tel quel.
 */
useSeo({
  // seo local
  title: 'Développement web et mobile - ESN à Wasquehal, dans la métropole lilloise',
  description:
    'La BU Digital de Faceel-IT, ESN basée à Wasquehal, conçoit vos applications web et ' +
    'mobile sur la métropole lilloise et dans les Hauts-de-France.',
})

const router = useRouter()

// animations d'entree au scroll, section hero
const heroTextEl = useTemplateRef<HTMLElement>('heroTextEl')
const heroTextReveal = useScrollReveal(heroTextEl)
const heroImageEl = useTemplateRef<HTMLElement>('heroImageEl')
const heroImageReveal = useScrollReveal(heroImageEl)

// chiffres cles hero : une rangee de 4 des sm, rotation par paires en dessous
const KPIS = [
  { label: 'Collaborateurs', value: '24' },
  { label: 'Dédiés au web', value: '72%' },
  { label: 'Taux de turnover', value: '3%' },
  { label: "Développeurs certifiés sur l'IA", value: '100%' },
]

// rotation des chiffres cles par paires sous sm (fondu seul, pas de transform)
const kpiPair = ref(0)
const visibleKpis = computed(() => KPIS.slice(kpiPair.value * 2, kpiPair.value * 2 + 2))
let kpiInterval: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  kpiInterval = setInterval(() => {
    kpiPair.value = (kpiPair.value + 1) % (KPIS.length / 2)
  }, 4500)
})

onUnmounted(() => {
  clearInterval(kpiInterval)
})

// section approche sous md : alternance paragraphe 1 / paragraphe 2 toutes les 5 s
const showApproachPart2 = ref(false)
let approachInterval: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  approachInterval = setInterval(() => {
    showApproachPart2.value = !showApproachPart2.value
  }, 5000)
})

onUnmounted(() => {
  clearInterval(approachInterval)
})

// offres sous md : une offre a la fois, rotation auto en pause au survol, bouton suivant
const activeJobIndex = ref(0)
let jobsInterval: ReturnType<typeof setInterval> | undefined

const stopJobsCarousel = () => {
  clearInterval(jobsInterval)
  jobsInterval = undefined
}
const startJobsCarousel = () => {
  stopJobsCarousel()
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  jobsInterval = setInterval(() => {
    activeJobIndex.value = (activeJobIndex.value + 1) % Math.max(digitalJobs.value.length, 1)
  }, 5000)
}
const nextJob = () => {
  activeJobIndex.value = (activeJobIndex.value + 1) % Math.max(digitalJobs.value.length, 1)
  startJobsCarousel()
}
onMounted(startJobsCarousel)
onUnmounted(stopJobsCarousel)

// intro hero sous lg : alternance partie 1 / partie 2 toutes les 5 s
const showIntroPart2 = ref(false)
let introInterval: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  introInterval = setInterval(() => {
    showIntroPart2.value = !showIntroPart2.value
  }, 5000)
})

onUnmounted(() => {
  clearInterval(introInterval)
})

// animations d'entree au scroll, en-tete section equipe
const teamHeaderEl = useTemplateRef<HTMLElement>('teamHeaderEl')
const teamHeaderReveal = useScrollReveal(teamHeaderEl)

// animation d'entree au scroll, section "notre approche"
const approcheEl = useTemplateRef<HTMLElement>('approcheEl')
const approcheReveal = useScrollReveal(approcheEl)
const isApprocheVisible = computed(() => approcheReveal.value !== 'hidden')

// citations qui tournent dans la section temoignage
const testimonials = [
  "Témoignage générique illustrant l'expérience d'un collaborateur ou d'un client de cette Business Unit.",
  'Deuxieme témoignage générique mettant en avant un autre aspect de la Business Unit Digital.',
  'Troisieme témoignage générique, pour varier le discours affiche sur cette section.',
]
const activeTestimonial = ref(0)
let testimonialInterval: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  testimonialInterval = setInterval(() => {
    activeTestimonial.value = (activeTestimonial.value + 1) % testimonials.length
  }, 4500)
})

onUnmounted(() => {
  clearInterval(testimonialInterval)
})

// liste des technos
interface Stack {
  name: string
  icon: string
  needsInvert?: boolean
}

const allStacks: Stack[] = [
  // angular.svg est deja blanc dans ce fichier, pas besoin d'invert
  { name: 'Angular', icon: imgAngular },
  { name: 'Docker', icon: imgDocker },
  { name: 'Java', icon: imgJava },
  { name: 'MySQL', icon: imgMysql },
  // next-js.svg n'a pas de fill, donc noir par defaut, invisible sur fond bleu
  { name: 'Next.js', icon: imgNextJs, needsInvert: true },
  { name: 'Node.js', icon: imgNodeJs },
  { name: 'PostgreSQL', icon: imgPostgresql },
  { name: 'Python', icon: imgPython },
  { name: 'Spring', icon: imgSpring },
  { name: 'TypeScript', icon: imgTypescript },
  { name: 'Vue.js', icon: imgVueJs },
]

/** Les 6 premieres technos, dans l'ordre fixe de `allStacks` : garde le rendu
 *  identique entre le serveur (build) et le client avant hydratation (pas de
 *  Math.random ici, cf. CLAUDE.md "Determinisme obligatoire"). Le tirage au
 *  sort reel se fait juste apres, dans onMounted, donc seulement cote client. */
const displayedStacks = ref<Stack[]>(allStacks.slice(0, 6))

let stackInterval: ReturnType<typeof setInterval> | undefined

function swapRandomStack() {
  const index = Math.floor(Math.random() * displayedStacks.value.length)
  const used = displayedStacks.value.map((s) => s.name)
  const options = allStacks.filter((s) => !used.includes(s.name))
  const next = options[Math.floor(Math.random() * options.length)]
  if (next) displayedStacks.value[index] = next
}

// change la stack au clic sur sa carte
function changeSpecificStack(index: number) {
  const used = displayedStacks.value.map((s) => s.name)
  const options = allStacks.filter((s) => !used.includes(s.name))
  const next = options[Math.floor(Math.random() * options.length)]
  if (next) displayedStacks.value[index] = next

  // reset du timer au clic
  clearInterval(stackInterval)
  stackInterval = setInterval(swapRandomStack, 2500)
}

onMounted(() => {
  // tirage au sort initial, cote client seulement
  displayedStacks.value = [...allStacks].sort(() => Math.random() - 0.5).slice(0, 6)
  // timer qui change un logo au hasard
  stackInterval = setInterval(swapRandomStack, 2500)
})

onUnmounted(() => {
  clearInterval(stackInterval)
})

// 4 logos mobile : rangee compacte, distincte de la grille desktop
const mobileStacks = ref<Stack[]>(allStacks.slice(0, 4))
let mobileStackInterval: ReturnType<typeof setInterval> | undefined

function swapRandomMobileStack() {
  const index = Math.floor(Math.random() * mobileStacks.value.length)
  const used = mobileStacks.value.map((s) => s.name)
  const options = allStacks.filter((s) => !used.includes(s.name))
  const next = options[Math.floor(Math.random() * options.length)]
  if (next) mobileStacks.value[index] = next
}

onMounted(() => {
  mobileStacks.value = [...allStacks].sort(() => Math.random() - 0.5).slice(0, 4)
  // rotation tech rapide
  mobileStackInterval = setInterval(swapRandomMobileStack, 2500)
})

onUnmounted(() => {
  clearInterval(mobileStackInterval)
})

// profils equipe, affiches un a un sur mobile (alterne profil mobile)
const TEAM_PROFILES = [
  {
    initials: 'NV',
    name: 'Noémie Vannoye',
    role: 'Responsable RH BU Digital',
    quote: [
      "« Révéler les talents, valoriser les compétences et ouvrir de nouvelles perspectives : j'ai à cœur de contribuer à l'épanouissement professionnel de chacun, car le sourire de mes consultants est ma plus belle satisfaction. »",
    ],
  },
  {
    initials: 'SD',
    name: 'Stéphanie Demarez',
    role: 'Directrice BU Digital',
    quote: [
      "« Écouter, comprendre, répondre juste... et recommencer ! C'est comme ça qu'une belle relation client se construit. »",
    ],
  },
]

const currentProfileIndex = ref(0)
let profileInterval: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  profileInterval = setInterval(() => {
    currentProfileIndex.value = (currentProfileIndex.value + 1) % TEAM_PROFILES.length
  }, 4500)
})

onUnmounted(() => {
  clearInterval(profileInterval)
})

// fausses offres, toutes bu confondues
const allJobs = [
  {
    id: 101,
    title: 'Développeur Fullstack',
    contract: 'CDI',
    location: 'Lille',
    buTag: 'Digital',
    shortDescription:
      'Rejoignez notre équipe pour concevoir et développer des applications web modernes et performantes, du back-end au front-end.',
    stacks: ['Vue.js', 'Node.js', 'PostgreSQL', 'Docker'],
  },
  {
    id: 102,
    title: 'Tech Lead Web',
    contract: 'CDI',
    location: 'Lille',
    buTag: 'Digital',
    shortDescription:
      'Encadrez une équipe de développeurs et garantissez la qualité technique des projets web confiés à la BU Digital.',
    stacks: ['TypeScript', 'Angular', 'Java'],
  },
  {
    id: 103,
    title: 'Product Owner',
    contract: 'CDI',
    location: 'Lille',
    buTag: 'Digital',
    shortDescription:
      'Pilotez le backlog produit et faites le lien entre les besoins métier et les équipes de développement.',
    stacks: ['Agile', 'Jira'],
  },
  {
    id: 104,
    title: 'Data Engineer',
    contract: 'CDI',
    location: 'Lille',
    buTag: 'Data',
    shortDescription:
      'Construisez et fiabilisez les pipelines de données qui alimentent les projets analytics de nos clients.',
    stacks: ['Python', 'Spark'],
  },
]

// ne garde que les offres de la bu digital
const digitalJobs = computed(() => allJobs.filter((job) => job.buTag === 'Digital'))

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
</script>

<template>
  <div class="h-dvh w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory">
    <!-- hero section, fond bleu -->
    <section
      id="hero"
      data-theme="dark"
      class="relative min-h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-[#000066] flex flex-col"
    >
      <!-- degrade deep ambient en fond -->
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-primary-700/40 to-transparent"
        aria-hidden="true"
      />

      <!-- conteneur aligne sur la nav -->
      <!-- tasser hero mobile -->
      <div
        class="grid w-full grid-cols-1 items-stretch gap-4 px-4 pt-24 pb-2 sm:gap-6 sm:px-6 sm:pt-28 md:gap-8 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:pt-32 lg:pb-8 xl:px-12"
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
          <p class="mb-3 font-bold uppercase tracking-widest text-blue-100 lg:mb-6">BU Digital</p>
          <h1 class="mb-4 font-display text-2xl font-black leading-tight text-white sm:text-3xl md:text-4xl lg:mb-8 lg:text-5xl">
            Web & mobile, notre spécialité à Lille
          </h1>
          <!-- sous lg : les 2 parties s'alternent dans la meme cellule de grille (la plus haute
               fixe la hauteur, donc aucun saut de layout) ; des lg : texte complet d'un bloc -->
          <p
            class="mb-6 grid max-w-xl text-sm leading-relaxed text-white sm:text-base lg:mb-8 lg:block lg:text-lg"
          >
            <span
              class="col-start-1 row-start-1 transition-opacity duration-500 motion-reduce:transition-none"
              :class="showIntroPart2 ? 'opacity-0 lg:opacity-100' : 'opacity-100'"
              >La BU Digital accompagne nos clients stratégiques sur les métiers du développement et
              du DevOps. Elle met à leur disposition des profils tech qui contribuent à leurs
              projets de transformation digitale, de la conception applicative au
              déploiement.</span
            >
            {{ ' ' }}
            <span
              class="col-start-1 row-start-1 transition-opacity duration-500 motion-reduce:transition-none"
              :class="showIntroPart2 ? 'opacity-100' : 'opacity-0 lg:opacity-100'"
              >Notre approche repose sur une bonne connaissance des enjeux de chaque client, des
              offres adaptées et un suivi attentif de la qualité de service, en lien étroit avec les
              directions comptes. La BU s'appuie sur des équipes engagées, accompagnées dans leur
              montée en compétences.</span
            >
          </p>

          <!-- liste d'arguments -->
          <ul class="mt-2 flex flex-col gap-3 text-sm sm:text-base md:mt-4 lg:gap-4 lg:text-lg">
            <li class="flex items-start gap-2.5 text-white">
              <span class="shrink-0 text-accent-500" aria-hidden="true">&bull;</span>
              Expertise reconnue sur les technos du marché
            </li>
            <li class="flex items-start gap-2.5 text-white">
              <span class="shrink-0 text-accent-500" aria-hidden="true">&bull;</span>
              Equipe soudée et proche de nos clients
            </li>
            <li class="flex items-start gap-2.5 text-white">
              <span class="shrink-0 text-accent-500" aria-hidden="true">&bull;</span>
              Projets concrets, livrés avec exigence
            </li>
          </ul>

          <!-- masque btn mobile -->
          <!-- fix wcag button : primary-950 restait a 4.29, noir pur passe 6.8:1 -->
          <button
            type="button"
            class="mt-8 hidden w-fit self-start rounded-full bg-accent-500 px-10 py-4 text-lg font-bold text-black shadow-soft transition-all duration-300 hover:scale-105 hover:shadow-glow md:inline-flex"
            @click="router.push({ name: 'offres', query: { bu: 'Digital' } })"
          >
            Découvrir nos offres
          </button>
        </div>

        <!-- image de droite, aeree par rapport au texte, glissement au scroll -->
        <!-- bride image hero -->
        <!-- remonte image -->
        <img
          ref="heroImageEl"
          :src="imgHero"
          alt="Equipe Faceel-IT"
          class="mx-auto h-44 w-full max-w-md rounded-2xl object-cover shadow-2xl transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-2xl sm:h-64 md:h-72 lg:ml-10 lg:mr-16 lg:mt-0 lg:h-full lg:max-h-[80vh] lg:max-w-none xl:mr-24"
          :class="
            scrollRevealClass(heroImageReveal, 'right', {
              offsetClass: 'translate-x-16',
              durationClass: 'duration-1000',
            })
          "
        />
      </div>

      <!-- conteneur externe, juste le padding de la nav -->
      <div class="px-4 sm:px-6 lg:px-8 xl:px-12">
        <!-- sous sm : 2 chiffres a la fois en fondu, hauteur reservee (pas de saut) -->
        <Transition
          mode="out-in"
          enter-active-class="transition-opacity duration-500 ease-out motion-reduce:transition-none"
          leave-active-class="transition-opacity duration-300 ease-in motion-reduce:transition-none"
          enter-from-class="opacity-0"
          leave-to-class="opacity-0"
        >
          <div
            :key="kpiPair"
            class="relative z-20 mt-3 mb-1 grid min-h-[84px] w-full grid-cols-2 gap-3 px-2 pb-2 text-center sm:hidden"
          >
            <div v-for="kpi in visibleKpis" :key="kpi.label">
              <p class="font-display text-xl font-bold text-accent-500">{{ kpi.value }}</p>
              <p class="mt-1 text-xs text-white">{{ kpi.label }}</p>
            </div>
          </div>
        </Transition>

        <!-- force premier plan -->
        <div
          class="relative z-20 mt-10 hidden w-full grid-cols-4 gap-6 px-2 pb-8 text-center sm:grid md:px-8 lg:mt-16 lg:px-16 xl:px-32"
        >
          <div v-for="kpi in KPIS" :key="kpi.label">
            <p class="font-display text-xl font-bold text-accent-500 sm:text-2xl lg:text-3xl">
              {{ kpi.value }}
            </p>
            <p class="mt-1 text-xs text-white sm:text-sm">{{ kpi.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 2 (Wireframe 10) - présentation statique des BU, deux profils
         de la BU Digital (pas de carrousel : juste un en-tête + un indicateur
         de position parmi les BU, et deux portraits avec un léger effet 3D
         statique, sans interaction). -->
    <section
      id="equipe"
      data-theme="light"
      class="relative h-dvh w-full shrink-0 snap-start snap-always flex flex-col bg-light px-4 pt-36 [@media(max-height:850px)]:pt-16 pb-8 sm:px-6 lg:px-8 xl:px-12"
    >
      <header
        ref="teamHeaderEl"
        class="max-w-5xl px-4 md:px-24 2xl:px-28"
        :class="scrollRevealClass(teamHeaderReveal, 'up')"
      >
        <h2
          class="mt-4 [@media(max-height:850px)]:mt-2 font-display text-display min-[1030px]:whitespace-nowrap text-primary-900"
        >
          Nos BUs, Expertes de vos besoins.
        </h2>
        <p
          class="mt-4 min-[1030px]:whitespace-nowrap text-sm md:text-base min-[1030px]:text-lg leading-relaxed text-primary-900/60"
        >
          Une organisation interne adaptée au marché pour une réponse sur-mesure à nos clients
        </p>
      </header>

      <!-- Rangée statique : une seule BU sur cette page, « Digital » occupe
           désormais seule cette rangée, centrée sous la description. -->
      <div
        class="flex w-full justify-center items-end mt-8 mb-8 px-4 md:px-24 2xl:px-28 max-[459px]:hidden"
      >
        <h3 class="font-display font-bold text-3xl md:text-4xl text-accent-700 text-center">
          Digital
        </h3>
      </div>

      <!-- Arène « Street Fighter », figée sur l'unique BU de la page : plus de
           flip au clic/survol (rien à révéler au dos, aucune autre BU à
           montrer), plus de minuteur. Tailles, marges et décalage conservés
           à l'identique de `BuSection.vue` - le seul « décalage » réel du
           composant source est horizontal (`-translate-x-16`/`translate-x-16`,
           uniquement entre 630px et 984px), pas vertical : pas de stagger
           vertical entre les deux cartes dans le composant d'origine.
           Noémie à gauche, Stéphanie à droite - photos réelles sur la face
           avant des cartes à la place des initiales. -->
      <div
        class="relative flex w-full flex-1 items-stretch max-[984px]:justify-center min-[985px]:justify-between gap-4 min-[985px]:gap-8 px-4 md:px-24 2xl:px-28 max-[459px]:hidden"
      >
        <!-- Combattant gauche : Noémie Vannoye -->
        <div
          class="flex w-auto shrink-0 flex-col items-center justify-center min-[630px]:max-[984px]:-translate-x-16"
        >
          <div class="mb-4 max-w-32 text-center min-[985px]:hidden">
            <p class="text-sm font-bold text-primary-950">Noémie Vannoye</p>
            <p class="text-[11px] font-medium text-primary-900/80">Responsable RH BU Digital</p>
            <p class="mt-1 min-h-[72px] text-xs italic leading-snug text-primary-900/80">
              <span class="block"
                >« Révéler les talents, valoriser les compétences et ouvrir de nouvelles
                perspectives : j'ai à cœur de contribuer à l'épanouissement professionnel de chacun,
                car le sourire de mes consultants est ma plus belle satisfaction. »</span
              >
            </p>
          </div>
          <div class="flex flex-col items-center">
            <div
              class="w-32 h-48 min-[985px]:w-48 min-[985px]:h-72 2xl:w-[320px] 2xl:h-[480px] bg-primary-950 rounded-2xl flex items-center justify-center overflow-hidden"
            >
              <img :src="imgNoemie" class="h-full w-full object-cover" alt="Noémie" />
            </div>
          </div>
        </div>

        <!-- Citations centrales - permanentes, en diagonale franche. Masquées
             sous 985px : le texte y est remplacé par les copies compactes
             attachées à chaque carte (cf. ci-dessus/dessous). -->
        <div class="hidden min-[985px]:flex flex-1 items-center px-4">
          <div class="relative w-full h-48 min-[985px]:h-72 2xl:h-[480px]">
            <div class="-mt-2 absolute inset-x-0 top-0 w-full px-4 text-left">
              <p class="text-base 2xl:text-2xl font-bold text-primary-950 mb-1">Noémie Vannoye</p>
              <p class="text-sm font-medium text-primary-900/80 mb-2">Responsable RH BU Digital</p>
              <p
                class="min-h-[100px] 2xl:min-h-[120px] w-full max-w-full overflow-hidden text-xs 2xl:text-lg italic text-primary-900/80 leading-relaxed"
              >
                <span class="block whitespace-normal break-words"
                  >« Révéler les talents, valoriser les compétences et ouvrir de nouvelles
                  perspectives : j'ai à cœur de contribuer à l'épanouissement professionnel de
                  chacun, car le sourire de mes consultants est ma plus belle satisfaction. »</span
                >
              </p>
            </div>
            <div class="-mb-2 absolute inset-x-0 bottom-0 w-full px-4 text-right">
              <p class="text-base 2xl:text-2xl font-bold text-primary-950 mb-1">
                Stéphanie Demarez
              </p>
              <p class="text-sm font-medium text-primary-900/80 mb-2">
                Directrice Commercial BU Digital
              </p>
              <p
                class="min-h-[100px] 2xl:min-h-[120px] w-full max-w-full overflow-hidden text-xs 2xl:text-lg italic text-primary-900/80 leading-relaxed"
              >
                <span class="block whitespace-normal break-words"
                  >« Écouter, comprendre, répondre juste... et recommencer ! C'est comme ça qu'une belle relation client se construit. »</span
                >
              </p>
            </div>
          </div>
        </div>

        <!-- Combattant droit : Stéphanie Demarez -->
        <div
          class="flex w-auto shrink-0 flex-col items-center justify-center min-[630px]:max-[984px]:translate-x-16"
        >
          <div class="flex flex-col items-center">
            <div
              class="w-32 h-48 min-[985px]:w-48 min-[985px]:h-72 2xl:w-[320px] 2xl:h-[480px] bg-primary-950 rounded-2xl flex items-center justify-center overflow-hidden"
            >
              <img :src="imgStephanie" class="h-full w-full object-cover" alt="Stéphanie" />
            </div>
          </div>
          <div class="mt-4 max-w-32 text-center min-[985px]:hidden">
            <p class="text-sm font-bold text-primary-950">Stéphanie Demarez</p>
            <p class="text-[11px] font-medium text-primary-900/80">Directrice Commercial BU Digital</p>
            <p class="mt-1 min-h-[72px] text-xs italic leading-snug text-primary-900/80">
              <span class="block">« Écouter, comprendre, répondre juste... et recommencer ! C'est comme ça qu'une belle relation client se construit. »</span>
            </p>
          </div>
        </div>
      </div>

      <!-- transition carte unique : un seul profil a la fois sous 460px -->
      <div class="hidden max-[459px]:block w-full flex-1 px-4">
        <Transition
          mode="out-in"
          enter-active-class="transition-all duration-500 ease-out"
          leave-active-class="transition-all duration-300 ease-in"
          enter-from-class="opacity-0 translate-x-4"
          leave-to-class="opacity-0 -translate-x-4"
        >
          <div
            :key="currentProfileIndex"
            class="flex h-full w-full flex-col items-center justify-center gap-4"
          >
            <div
              class="flex h-40 w-52 shrink min-h-0 items-center justify-center overflow-hidden rounded-2xl bg-primary-950 [@media(max-height:690px)]:h-28"
            >
              <span class="font-display text-6xl font-extrabold text-white/10">{{
                TEAM_PROFILES[currentProfileIndex]!.initials
              }}</span>
            </div>
            <div class="w-full max-w-[18rem] flex flex-col justify-start text-center">
              <p class="text-xl font-bold text-primary-950">
                {{ TEAM_PROFILES[currentProfileIndex]!.name }}
              </p>
              <p class="text-sm font-medium text-primary-900/80">
                {{ TEAM_PROFILES[currentProfileIndex]!.role }}
              </p>
              <p
                class="mt-1 text-base italic leading-snug text-primary-900/80 [@media(max-height:690px)]:text-sm [@media(max-height:690px)]:leading-tight"
              >
                <span
                  v-for="line in TEAM_PROFILES[currentProfileIndex]!.quote"
                  :key="line"
                  class="block"
                  >{{ line }}</span
                >
              </p>
            </div>
          </div>
        </Transition>
      </div>
    </section>

    <!-- SECTION 3 (Wireframe 7) - photo empilée à gauche, témoignage à droite. -->
    <!-- compense hauteur navbar -->
    <section
      id="temoignage"
      data-theme="dark"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-[#000066] grid grid-cols-1 pt-24 lg:grid-cols-2 lg:pt-0"
    >
      <!-- Colonne gauche : photo (effet d'empilement) -->
      <!-- fix hauteur temoignages -->
      <div class="flex items-center justify-center px-8 pb-6 lg:px-24 lg:py-12">
        <div class="relative aspect-square max-h-[150px] w-full max-w-md lg:max-h-none">
          <div
            class="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl bg-gray-100"
            aria-hidden="true"
          />
          <div
            class="relative flex h-full w-full items-center justify-center rounded-3xl border border-gray-300 bg-white"
          >
            <p class="text-lg font-semibold text-gray-800">Photo</p>
          </div>
        </div>
      </div>

      <!-- Colonne droite : témoignage -->
      <div
        class="relative z-10 flex flex-col justify-center overflow-hidden px-8 pb-6 lg:px-24 lg:py-12"
      >
        <!-- halo core glow derriere la citation, contenu et discret -->
        <div
          class="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[80%] w-[90%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-[4rem] bg-primary-500/30 blur-[80px]"
          aria-hidden="true"
        />

        <p class="text-sm font-bold uppercase tracking-widest text-accent-500">Surtitre</p>

        <div class="mt-6 flex flex-col">
          <span
            class="self-start font-display text-6xl font-black leading-none text-white"
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <!-- hauteur fixe pour que le changement de citation ne bouge pas la mise en page -->
          <div class="flex h-40 flex-col justify-center md:h-48">
            <Transition mode="out-in" name="slide-fade">
              <p
                :key="activeTestimonial"
                class="mx-auto max-w-md text-center text-xl leading-relaxed text-white"
              >
                {{ testimonials[activeTestimonial] }}
              </p>
            </Transition>
          </div>
          <span
            class="self-end font-display text-6xl font-black leading-none text-white"
            aria-hidden="true"
          >
            &rdquo;
          </span>
        </div>

        <div class="mt-6">
          <p class="font-semibold text-white">Nom Prénom</p>
          <p class="text-sm text-blue-200">Poste</p>
        </div>

        <!-- Navigation visuelle : trait plein, deux segments pointillés, flèche -->
        <div class="mt-8 flex items-center gap-2">
          <span class="h-0.5 w-10 bg-accent-500" aria-hidden="true" />
          <span class="h-0 w-6 border-t-2 border-dashed border-accent-500" aria-hidden="true" />
          <span class="h-0 w-6 border-t-2 border-dashed border-accent-500" aria-hidden="true" />
          <svg class="size-5 text-accent-500" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>

    <!-- section approche, design typographique -->
    <section
      id="expertises"
      ref="approcheEl"
      data-theme="light"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-white flex flex-col justify-center pt-24 pb-10 sm:py-24 md:py-32"
    >
      <!-- en tete, fondu vers le haut -->
      <!-- compense hauteur navbar -->
      <p
        class="mb-4 text-center text-sm font-bold uppercase tracking-widest text-accent-500 sm:mb-6 sm:text-base"
        :class="
          isApprocheVisible
            ? 'translate-y-0 opacity-100 transition-all duration-700 ease-out'
            : 'translate-y-4 opacity-0'
        "
      >
        Notre approche
      </p>
      <h2
        class="mx-auto mb-6 max-w-5xl px-4 text-center font-display text-3xl font-black leading-snug text-primary-900 sm:mb-8 sm:text-4xl md:mb-24 lg:text-5xl"
        :class="
          isApprocheVisible
            ? 'translate-y-0 opacity-100 transition-all duration-700 delay-150 ease-out'
            : 'translate-y-4 opacity-0'
        "
      >
        Coder juste, déployer vite, opérer durablement,
        <span
          class="underline decoration-accent-500 decoration-[4px] underline-offset-4 [-webkit-box-decoration-break:clone] [box-decoration-break:clone]"
          >avec l'IA comme accélérateur</span
        >
      </h2>

      <!-- deux colonnes des md ; en dessous, les 2 paragraphes s'alternent en fondu dans la meme
           cellule de grille (la plus haute fixe la hauteur, pas de saut de layout) -->
      <div
        class="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-2 md:gap-16"
      >
        <div
          class="col-start-1 row-start-1 md:col-auto md:row-auto"
          :class="
            isApprocheVisible
              ? 'translate-x-0 opacity-100 transition-all duration-700 delay-300 ease-out'
              : '-translate-x-8 opacity-0'
          "
        >
          <p
            class="text-lg leading-relaxed text-gray-700 transition-opacity duration-500 motion-reduce:transition-none sm:text-xl"
            :class="showApproachPart2 ? 'opacity-0 md:opacity-100' : 'opacity-100'"
          >
            Notre approche commence par l'analyse de votre contexte technique : architecture
            existante, stack, contraintes de production et maturité de vos pratiques. Chaque projet
            est abordé de bout en bout, du développement applicatif jusqu'au déploiement, afin de
            construire des solutions cohérentes, maintenables et alignées sur vos objectifs métier.
          </p>
        </div>
        <div
          class="col-start-1 row-start-1 md:col-auto md:row-auto"
          :class="
            isApprocheVisible
              ? 'translate-x-0 opacity-100 transition-all duration-700 delay-300 ease-out'
              : 'translate-x-8 opacity-0'
          "
        >
          <p
            class="text-lg leading-relaxed text-gray-700 transition-opacity duration-500 motion-reduce:transition-none sm:text-xl"
            :class="showApproachPart2 ? 'opacity-100' : 'opacity-0 md:opacity-100'"
          >
            Nous plaçons la qualité logicielle et l'automatisation au cœur de chaque projet : bonnes
            pratiques de développement, CI/CD, infrastructure as code et monitoring. Nos équipes
            intègrent l'IA dans leur quotidien, de l'assistance au code à la génération de tests, en
            passant par l'analyse des incidents, pour livrer plus vite des applications
            performantes, sécurisées et évolutives.
          </p>
        </div>
      </div>

      <!-- pagination de la rotation, sous md uniquement -->
      <div class="mt-8 flex justify-center gap-2 md:hidden" aria-hidden="true">
        <span
          class="h-2 rounded-full bg-accent-500 transition-all duration-500 motion-reduce:transition-none"
          :class="showApproachPart2 ? 'w-2 opacity-40' : 'w-6'"
        />
        <span
          class="h-2 rounded-full bg-accent-500 transition-all duration-500 motion-reduce:transition-none"
          :class="showApproachPart2 ? 'w-6' : 'w-2 opacity-40'"
        />
      </div>
    </section>

    <!-- SECTION 5 (Wireframe 8) - grille de 10 cartes "stack technique", la 3e mise en avant. -->
    <section
      id="stack"
      data-theme="dark"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-[#000066] flex flex-col justify-center px-8 pt-24 pb-6 text-center lg:px-24"
    >
      <!-- halo core glow derriere la grille de logos -->
      <div
        class="pointer-events-none absolute top-1/2 left-1/2 h-[80%] w-[80%] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-primary-600/20 blur-[120px]"
        aria-hidden="true"
      />

      <!-- en tete massif, remonte en haut sur mobile -->
      <div class="text-center">
        <p class="mb-3 text-center text-base font-bold uppercase tracking-widest text-accent-500 sm:mb-4 sm:text-lg">
          Un écosystème technologique au service de vos ambitions digitales
        </p>
        <h2
          class="mb-8 font-display text-4xl font-black text-white sm:mb-16 sm:text-5xl md:text-7xl"
        >
          Notre expertise technologique
        </h2>
      </div>

      <!-- grille 2x2 tech mobile -->
      <div class="mx-auto grid w-full max-w-sm grid-cols-2 gap-4 sm:max-w-md sm:gap-6 md:hidden">
        <div
          v-for="(stack, index) in mobileStacks"
          :key="index"
          class="flex aspect-square w-full items-center justify-center rounded-2xl border border-transparent bg-white/10 p-6 sm:p-8"
        >
          <Transition mode="out-in" name="fade">
            <img
              :key="stack.name"
              :src="stack.icon"
              :alt="stack.name"
              class="h-24 w-24 object-contain sm:h-28 sm:w-28"
              :class="{ 'brightness-0 invert': stack.needsInvert }"
            />
          </Transition>
        </div>
      </div>

      <!-- grille complete, statique a partir de md -->
      <div class="mx-auto hidden w-full max-w-7xl md:grid md:grid-cols-3 md:gap-8">
        <div
          v-for="(stack, index) in displayedStacks"
          :key="index"
          class="group flex h-64 cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border border-transparent bg-white/10 p-10 transition-colors hover:border-accent-500 active:scale-95"
          @click="changeSpecificStack(index)"
        >
          <Transition mode="out-in" name="fade">
            <div :key="stack.name" class="flex items-center justify-center">
              <img
                :src="stack.icon"
                :alt="stack.name"
                class="h-40 w-40 object-contain"
                :class="{ 'brightness-0 invert': stack.needsInvert }"
              />
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <!-- cas d'usage (Boulanger, Adeo), composant partage avec DataIaView.vue -->
    <UseCasesSection />

    <!-- section offres d'emploi, structure identique a data ia -->
    <!-- compense hauteur navbar -->
    <section
      id="offres"
      data-theme="light"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-white flex flex-col justify-center px-8 pt-24 pb-6 text-center sm:py-24 md:py-32 lg:px-24"
    >
      <div>
        <p class="text-sm font-bold uppercase tracking-widest text-accent-500">Rejoignez-nous</p>
        <h2
          class="mt-2 mb-3 font-display text-3xl font-black text-[#000066] sm:mb-6 md:text-6xl xl:text-7xl"
        >
          Nos offres du moment
        </h2>
        <p class="mx-auto mt-2 max-w-2xl text-lg text-gray-600 sm:mt-4 md:text-xl">
          Portez la vision produit, priorisez le backlog et faites le lien entre les besoins métiers
          et l'équipe technique.
        </p>
      </div>

      <!-- calque data ia : carrousel horizontal mobile -->
      <div
        v-if="digitalJobs.length > 0"
        class="mx-auto mt-4 w-full max-w-md sm:mt-10 md:max-w-[1400px]"
        @mouseenter="stopJobsCarousel"
        @mouseleave="startJobsCarousel"
      >
      <!-- sous md : cartes superposees dans la meme cellule (la plus haute fixe la hauteur), fondu ;
           des md : grille de 3 -->
      <div class="grid md:grid-cols-3 md:gap-12">
        <!-- cache ombre mobile -->
        <div
          v-for="(job, index) in digitalJobs"
          :key="index"
          class="relative col-start-1 row-start-1 flex min-h-[260px] w-full cursor-pointer flex-col justify-between rounded-[2rem] border border-gray-100 bg-white p-6 text-left shadow-none transition-opacity duration-500 motion-reduce:transition-none md:col-auto md:row-auto md:min-h-[400px] md:p-12 md:opacity-100 md:shadow-2xl md:pointer-events-auto"
          :class="index === activeJobIndex ? 'opacity-100' : 'pointer-events-none opacity-0'"
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

          <!-- badges stack tech, limite a 3 stacks. couleurs opaques : texte blanc sur vert echouait -->
          <div class="mt-8 flex flex-wrap gap-3">
            <span
              v-for="(stack, stackIndex) in job.stacks.slice(0, 3)"
              :key="stackIndex"
              class="rounded-full bg-accent-500 px-4 py-2 text-sm font-bold text-black"
            >
              {{ stack }}
            </span>
          </div>

                    <button
            type="button"
            aria-label="Voir la fiche complete de l'offre"
            class="absolute bottom-6 right-6 flex size-10 items-center justify-center rounded-full bg-[#000066] text-white transition-colors hover:bg-primary-700"
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

      <!-- sous md : pagination + bouton suivant -->
      <div v-if="digitalJobs.length > 1" class="mt-4 flex items-center justify-center gap-4 md:hidden">
        <div class="flex gap-2" aria-hidden="true">
          <span
            v-for="(job, index) in digitalJobs"
            :key="job.id"
            class="h-2 rounded-full bg-[#000066] transition-all duration-500 motion-reduce:transition-none"
            :class="index === activeJobIndex ? 'w-6' : 'w-2 opacity-30'"
          />
        </div>
        <button
          type="button"
          aria-label="Offre suivante"
          class="flex size-10 items-center justify-center rounded-full bg-[#000066] text-white transition-colors hover:bg-primary-700"
          @click="nextJob"
        >
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
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
          @click="router.push({ name: 'offres', query: { bu: 'Digital' } })"
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
              class="rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-black"
            >
              {{ stack }}
            </span>
          </div>

          <p class="mt-6 text-sm leading-relaxed text-primary-900/70">
            Description générique présentant cette offre, le temps que la BU complète sa fiche
            définitive.
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
/* transition douce entre les logos stack */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* glissement rapide entre les citations du temoignage */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
