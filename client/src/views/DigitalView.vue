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
import TheFooter from '@/components/layout/TheFooter.vue'
import { scrollRevealClass, useScrollReveal } from '@/composables/useScrollReveal'
import { useSeo } from '@/composables/useSeo'

/**
 * Page modèle (template) pour une Business Unit — textes volontairement
 * génériques : sert de base que les RH dupliquent et complètent pour chaque
 * BU, pas un contenu final à publier tel quel.
 */
useSeo({
  title: 'BU Digital',
  description: 'Page modèle pour la Business Unit Digital.',
})

const router = useRouter()

// animations d'entree au scroll, section hero
const heroTextEl = useTemplateRef<HTMLElement>('heroTextEl')
const heroTextReveal = useScrollReveal(heroTextEl)
const heroImageEl = useTemplateRef<HTMLElement>('heroImageEl')
const heroImageReveal = useScrollReveal(heroImageEl)

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

/** Retournement au clic des deux grandes cartes de la Section 2 (« Équipe »). */
const isSDFlipped = ref(false)
const isNVFlipped = ref(false)

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
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-[#000066] flex flex-col"
    >
      <!-- degrade deep ambient en fond -->
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-primary-700/40 to-transparent"
        aria-hidden="true"
      />

      <!-- conteneur aligne sur la nav -->
      <!-- espace genereux sous la navbar -->
      <div
        class="grid w-full flex-1 grid-cols-1 items-stretch gap-12 px-4 pt-32 pb-8 sm:px-6 lg:grid-cols-2 lg:px-8 xl:px-12"
      >
        <!-- colonne texte, prend toute la hauteur, fondu au scroll -->
        <div
          ref="heroTextEl"
          class="flex h-full max-w-2xl flex-col"
          :class="
            scrollRevealClass(heroTextReveal, 'up', {
              offsetClass: '',
              durationClass: 'duration-1000',
            })
          "
        >
          <p class="mb-6 font-bold uppercase tracking-widest text-accent-500">BU Digital</p>
          <h1 class="mb-8 font-display text-4xl font-black text-white lg:text-6xl">
            Web & mobile notre spécialité
          </h1>
          <p class="mb-8 text-base text-white">
            Description générique sur deux à trois lignes présentant la Business Unit, ses missions
            et ce qui la distingue au sein de Faceel-IT.
          </p>

          <!-- liste d'arguments -->
          <ul class="flex flex-col gap-4 text-sm">
            <li class="flex items-center gap-3 text-white">
              <span class="text-accent-500" aria-hidden="true">&bull;</span>
              Expertise reconnue sur les technos du marché
            </li>
            <li class="flex items-center gap-3 text-white">
              <span class="text-accent-500" aria-hidden="true">&bull;</span>
              Equipe soudée et proche de nos clients
            </li>
            <li class="flex items-center gap-3 text-white">
              <span class="text-accent-500" aria-hidden="true">&bull;</span>
              Projets concrets, livrés avec exigence
            </li>
          </ul>

          <button
            type="button"
            class="mt-auto w-fit self-start rounded-full bg-accent-500 px-10 py-4 text-lg font-bold text-primary-900 shadow-soft transition-all duration-300 hover:scale-105 hover:shadow-glow"
            @click="router.push({ name: 'offres', query: { bu: 'Digital' } })"
          >
            Découvrir nos offres
          </button>
        </div>

        <!-- image de droite, aeree par rapport au texte, glissement au scroll -->
        <img
          ref="heroImageEl"
          :src="imgHero"
          alt="Equipe Faceel-IT"
          class="mt-8 h-full w-full rounded-[2rem] object-cover shadow-2xl transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-2xl lg:mt-0 lg:ml-10"
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
        <!-- metriques bu digital -->
        <div
          class="mt-8 grid w-full grid-cols-2 gap-8 px-8 pb-8 text-center md:px-16 lg:grid-cols-4 lg:px-32"
        >
          <div>
            <p class="font-display text-4xl font-bold text-accent-500 md:text-5xl">XX</p>
            <p class="mt-2 text-sm text-white md:text-base">Collaborateurs</p>
          </div>
          <div>
            <p class="font-display text-4xl font-bold text-accent-500 md:text-5xl">XX%</p>
            <p class="mt-2 text-sm text-white md:text-base">Dédiés au mobile</p>
          </div>
          <div>
            <p class="font-display text-4xl font-bold text-accent-500 md:text-5xl">3%</p>
            <p class="mt-2 text-sm text-white md:text-base">Taux de turnover</p>
          </div>
          <div>
            <p class="font-display text-4xl font-bold text-accent-500 md:text-5xl">XX</p>
            <p class="mt-2 text-sm text-white md:text-base">Certifications obtenues</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 2 (Wireframe 10) — présentation statique des BU, deux profils
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
           à l'identique de `BuSection.vue` — le seul « décalage » réel du
           composant source est horizontal (`-translate-x-16`/`translate-x-16`,
           uniquement entre 630px et 984px), pas vertical : pas de stagger
           vertical entre les deux cartes dans le composant d'origine.
           Noémie à gauche, Stéphanie à droite — photos réelles sur la face
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
            <p class="text-[11px] font-medium text-primary-900/50">Responsable RH</p>
            <p class="mt-1 min-h-[72px] text-xs italic leading-snug text-primary-900/80">
              <span class="block">« Écouter pour mieux suivre et accompagner</span>
              <span class="block">mes collaborateurs dans leur montée en compétences. »</span>
            </p>
          </div>
          <div class="flex flex-col items-center">
            <div
              class="w-32 h-48 min-[985px]:w-48 min-[985px]:h-72 2xl:w-[320px] 2xl:h-[480px] [perspective:1000px] transform-gpu border-0 ring-0 outline-none cursor-pointer"
              role="button"
              tabindex="0"
              aria-label="Retourner la carte de Noémie Vannoye"
              @click="isNVFlipped = !isNVFlipped"
              @keydown.enter="isNVFlipped = !isNVFlipped"
              @keydown.space.prevent="isNVFlipped = !isNVFlipped"
            >
              <div
                class="relative w-full h-full [transform-style:preserve-3d] rounded-2xl shadow-[-40px_20px_50px_-15px_rgba(0,0,50,0.4)] will-change-transform transition-transform duration-700 ease-in-out border-0 ring-0 outline-none"
                :class="isNVFlipped ? '[transform:rotateY(195deg)]' : '[transform:rotateY(15deg)]'"
              >
                <!-- Face avant -->
                <div
                  class="absolute inset-0 h-full w-full backface-hidden antialiased translate-z-[1px] bg-primary-950 rounded-2xl flex items-center justify-center overflow-hidden border-0 border-transparent"
                >
                  <img :src="imgNoemie" class="h-full w-full object-cover" alt="Noémie" />
                </div>
                <!-- Face arrière — basique, prête à accueillir du contenu plus tard. -->
                <div
                  class="absolute inset-0 h-full w-full [transform:rotateY(180deg)] backface-hidden antialiased bg-white border border-gray-200 rounded-2xl overflow-hidden"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Citations centrales — permanentes, en diagonale franche. Masquées
             sous 985px : le texte y est remplacé par les copies compactes
             attachées à chaque carte (cf. ci-dessus/dessous). -->
        <div class="hidden min-[985px]:flex flex-1 items-center px-4">
          <div class="relative w-full h-48 min-[985px]:h-72 2xl:h-[480px]">
            <div class="-mt-2 absolute inset-x-0 top-0 w-full px-4 text-left">
              <p class="text-base 2xl:text-2xl font-bold text-primary-950 mb-1">Noémie Vannoye</p>
              <p class="text-sm font-medium text-primary-900/50 mb-2">Responsable RH</p>
              <p
                class="min-h-[100px] 2xl:min-h-[120px] w-full max-w-full overflow-hidden text-xs 2xl:text-lg italic text-primary-900/80 leading-relaxed"
              >
                <span class="block whitespace-normal break-words"
                  >« Écouter pour mieux suivre et accompagner</span
                >
                <span class="block whitespace-normal break-words"
                  >mes collaborateurs dans leur montée en compétences. »</span
                >
              </p>
            </div>
            <div class="-mb-2 absolute inset-x-0 bottom-0 w-full px-4 text-right">
              <p class="text-base 2xl:text-2xl font-bold text-primary-950 mb-1">
                Stéphanie Demarez
              </p>
              <p class="text-sm font-medium text-primary-900/50 mb-2">Directrice BU Digital</p>
              <p
                class="min-h-[100px] 2xl:min-h-[120px] w-full max-w-full overflow-hidden text-xs 2xl:text-lg italic text-primary-900/80 leading-relaxed"
              >
                <span class="block whitespace-normal break-words"
                  >« Je ne cherche pas seulement un business</span
                >
                <span class="block whitespace-normal break-words"
                  >mais avant tout à créer une relation durable. »</span
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
              class="w-32 h-48 min-[985px]:w-48 min-[985px]:h-72 2xl:w-[320px] 2xl:h-[480px] [perspective:1000px] transform-gpu border-0 ring-0 outline-none cursor-pointer"
              role="button"
              tabindex="0"
              aria-label="Retourner la carte de Stéphanie Demarez"
              @click="isSDFlipped = !isSDFlipped"
              @keydown.enter="isSDFlipped = !isSDFlipped"
              @keydown.space.prevent="isSDFlipped = !isSDFlipped"
            >
              <div
                class="relative w-full h-full [transform-style:preserve-3d] rounded-2xl shadow-[40px_20px_50px_-15px_rgba(0,0,50,0.4)] will-change-transform transition-transform duration-700 ease-in-out border-0 ring-0 outline-none"
                :class="
                  isSDFlipped ? '[transform:rotateY(-195deg)]' : '[transform:rotateY(-15deg)]'
                "
              >
                <!-- Face avant -->
                <div
                  class="absolute inset-0 h-full w-full backface-hidden antialiased translate-z-[1px] bg-primary-950 rounded-2xl flex items-center justify-center overflow-hidden border-0 border-transparent"
                >
                  <img :src="imgStephanie" class="h-full w-full object-cover" alt="Stéphanie" />
                </div>
                <!-- Face arrière — basique, prête à accueillir du contenu plus tard. -->
                <div
                  class="absolute inset-0 h-full w-full [transform:rotateY(180deg)] backface-hidden antialiased bg-white border border-gray-200 rounded-2xl overflow-hidden"
                />
              </div>
            </div>
          </div>
          <div class="mt-4 max-w-32 text-center min-[985px]:hidden">
            <p class="text-sm font-bold text-primary-950">Stéphanie Demarez</p>
            <p class="text-[11px] font-medium text-primary-900/50">Directrice BU Digital</p>
            <p class="mt-1 min-h-[72px] text-xs italic leading-snug text-primary-900/80">
              <span class="block">« Je ne cherche pas seulement un business</span>
              <span class="block">mais avant tout à créer une relation durable. »</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Sous 460px, l'arène à deux cartes ne tient plus : les deux profils
           sont empilés statiquement (pas de carrousel à une seule BU).
           Noémie en premier (haut), Stéphanie ensuite (bas). -->
      <div
        class="hidden max-[459px]:flex w-full flex-1 flex-col items-center justify-center gap-10 px-4"
      >
        <div class="flex flex-col items-center">
          <div
            class="flex h-[clamp(200px,40dvh,350px)] w-52 shrink min-h-0 items-center justify-center overflow-hidden rounded-2xl bg-primary-950 [@media(max-height:690px)]:max-h-[25dvh]"
          >
            <span class="font-display text-6xl font-extrabold text-white/10">NV</span>
          </div>
          <div
            class="mt-4 [@media(max-height:690px)]:mt-2 min-h-[160px] w-full max-w-[18rem] flex flex-col justify-start text-center"
          >
            <p class="text-xl font-bold text-primary-950">Noémie Vannoye</p>
            <p class="text-sm font-medium text-primary-900/50">Responsable RH</p>
            <p
              class="mt-1 text-base italic leading-snug text-primary-900/80 [@media(max-height:690px)]:text-sm [@media(max-height:690px)]:leading-tight"
            >
              <span class="block">« Écouter pour mieux suivre et accompagner</span>
              <span class="block">mes collaborateurs dans leur montée en compétences. »</span>
            </p>
          </div>
        </div>
        <div class="flex flex-col items-center">
          <div
            class="flex h-[clamp(200px,40dvh,350px)] w-52 shrink min-h-0 items-center justify-center overflow-hidden rounded-2xl bg-primary-950 [@media(max-height:690px)]:max-h-[25dvh]"
          >
            <span class="font-display text-6xl font-extrabold text-white/10">SD</span>
          </div>
          <div
            class="mt-4 [@media(max-height:690px)]:mt-2 min-h-[160px] w-full max-w-[18rem] flex flex-col justify-start text-center"
          >
            <p class="text-xl font-bold text-primary-950">Stéphanie Demarez</p>
            <p class="text-sm font-medium text-primary-900/50">Directrice BU Digital</p>
            <p
              class="mt-1 text-base italic leading-snug text-primary-900/80 [@media(max-height:690px)]:text-sm [@media(max-height:690px)]:leading-tight"
            >
              <span class="block">« Je ne cherche pas seulement un business</span>
              <span class="block">mais avant tout à créer une relation durable. »</span>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 3 (Wireframe 7) — photo empilée à gauche, témoignage à droite. -->
    <section
      id="temoignage"
      data-theme="dark"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-[#000066] grid grid-cols-1 lg:grid-cols-2"
    >
      <!-- Colonne gauche : photo (effet d'empilement) -->
      <div class="flex items-center justify-center px-8 py-12 lg:px-24">
        <div class="relative aspect-square w-full max-w-md">
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
      <div class="relative z-10 flex flex-col justify-center overflow-hidden px-8 py-12 lg:px-24">
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
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-white flex flex-col justify-center py-24 md:py-32"
    >
      <!-- en tete, fondu vers le haut -->
      <p
        class="mb-6 text-center font-bold uppercase tracking-widest text-accent-500"
        :class="
          isApprocheVisible
            ? 'translate-y-0 opacity-100 transition-all duration-700 ease-out'
            : 'translate-y-4 opacity-0'
        "
      >
        Notre approche
      </p>
      <h2
        class="mx-auto mb-24 max-w-5xl text-center font-display text-4xl font-black leading-tight text-primary-900 md:text-5xl lg:text-6xl"
        :class="
          isApprocheVisible
            ? 'translate-y-0 opacity-100 transition-all duration-700 delay-150 ease-out'
            : 'translate-y-4 opacity-0'
        "
      >
        Le digital, pensé avec méthode et conçu
        <span class="underline decoration-accent-500 decoration-4 underline-offset-[6px]"
          >avec ambition</span
        >, dans une démarche durable et collaborative.
      </h2>

      <!-- deux colonnes de texte, rassemblement lateral -->
      <div class="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-2 md:gap-16">
        <p
          class="text-lg leading-relaxed text-gray-700 md:text-xl"
          :class="
            isApprocheVisible
              ? 'translate-x-0 opacity-100 transition-all duration-700 delay-300 ease-out'
              : '-translate-x-8 opacity-0'
          "
        >
          Notre approche repose avant tout sur la compréhension de vos enjeux. Chaque projet est
          pensé dans sa globalité afin de construire des solutions cohérentes,
          <strong class="font-bold text-gray-900"
            >adaptées à vos besoins et à vos objectifs.</strong
          >
        </p>
        <p
          class="text-lg leading-relaxed text-gray-700 md:text-xl"
          :class="
            isApprocheVisible
              ? 'translate-x-0 opacity-100 transition-all duration-700 delay-300 ease-out'
              : 'translate-x-8 opacity-0'
          "
        >
          C'est pourquoi,
          <strong class="font-bold text-gray-900">nous plaçons l'exigence et la créativité</strong>
          au cœur de chaque projet, avec la volonté de concevoir des expériences digitales
          pertinentes, performantes et évolutives.
        </p>
      </div>
    </section>

    <!-- SECTION 5 (Wireframe 8) — grille de 10 cartes "stack technique", la 3e mise en avant. -->
    <section
      id="stack"
      data-theme="dark"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-[#000066] flex flex-col justify-center px-8 py-12 text-center lg:px-24"
    >
      <!-- halo core glow derriere la grille de logos -->
      <div
        class="pointer-events-none absolute top-1/2 left-1/2 h-[80%] w-[80%] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-primary-600/20 blur-[120px]"
        aria-hidden="true"
      />

      <!-- en tete massif -->
      <div class="text-center">
        <p class="mb-4 text-center font-bold uppercase tracking-widest text-accent-500">
          Un écosystème technologique au service de vos ambitions digitales
        </p>
        <h2 class="mb-16 font-display text-5xl font-black text-white md:text-7xl">
          Notre expertise technologique
        </h2>
      </div>

      <!-- grille stacks -->
      <div class="mx-auto grid w-full max-w-7xl grid-cols-2 gap-6 lg:grid-cols-3 md:gap-8">
        <div
          v-for="(stack, index) in displayedStacks"
          :key="index"
          class="group flex h-64 cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border border-transparent bg-white/10 p-8 transition-colors hover:border-accent-500 active:scale-95 md:p-10"
          @click="changeSpecificStack(index)"
        >
          <Transition mode="out-in" name="fade">
            <div :key="stack.name" class="flex items-center justify-center">
              <img
                :src="stack.icon"
                :alt="stack.name"
                class="h-32 w-32 object-contain md:h-40 md:w-40"
                :class="{ 'brightness-0 invert': stack.needsInvert }"
              />
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <!-- section offres d'emploi, structure identique a data ia -->
    <section
      id="offres"
      data-theme="light"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-white flex flex-col justify-center px-8 py-24 text-center md:py-32 lg:px-24"
    >
      <div>
        <p class="text-sm font-bold uppercase tracking-widest text-accent-500">Rejoignez-nous</p>
        <h2
          class="mt-2 mb-6 font-display text-5xl font-black text-[#000066] md:text-6xl xl:text-7xl"
        >
          Nos offres du moment
        </h2>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-gray-600 md:text-xl">
          Portez la vision produit, priorisez le backlog et faites le lien entre les besoins métiers
          et l'équipe technique.
        </p>
      </div>

      <!-- grille des 3 cartes -->
      <div
        class="mx-auto mt-10 grid w-full max-w-[1400px] grid-cols-1 gap-8 md:grid-cols-3 md:gap-12"
      >
        <div
          v-for="(job, index) in digitalJobs"
          :key="index"
          class="relative flex min-h-[350px] cursor-pointer flex-col justify-between rounded-[2rem] border border-gray-100 bg-white p-10 text-left shadow-2xl md:min-h-[400px] md:p-12"
          @click="openModal(job)"
        >
          <div>
            <p class="text-2xl font-bold text-[#000066] md:text-3xl">{{ job.title }}</p>
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

          <!-- flèche qui redirige vers la fiche complete, stop du clic de la carte -->
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

      <div class="mt-12 flex w-full justify-center">
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
              class="rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-white"
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
