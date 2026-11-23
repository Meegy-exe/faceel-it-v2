<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import photoLille from '@/assets/images/photos/lille.jpg'
import imgFaceel04 from '@/assets/images/photos/faceel_04.jpeg'
import IconGcp from '@/components/icons/IconGcp.vue'
import IconOmni from '@/components/icons/IconOmni.vue'
import IconPowerBi from '@/components/icons/IconPowerBi.vue'
import IconSnowflake from '@/components/icons/IconSnowflake.vue'
import UseCasesSection from '@/components/home/UseCasesSection.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useSeo } from '@/composables/useSeo'

/**
 * Page modèle (template) pour une Business Uni textes volontairement
 * génériques : sert de base que les RH dupliquent et complètent pour chaque
 * BU, pas un contenu final à publier tel quel.
 */
useSeo({
  // seo local
  title: 'Data & IA - ESN à Wasquehal, dans la métropole lilloise',
  description:
    'La BU Data & IA de Faceel-IT, ESN basée à Wasquehal, déploie vos projets Data et ' +
    'Intelligence Artificielle sur la métropole lilloise et dans les Hauts-de-France.',
})

const router = useRouter()

// anim hero
const heroEl = useTemplateRef<HTMLElement>('heroEl')
const heroReveal = useScrollReveal(heroEl)
const isHeroVisible = computed(() => heroReveal.value !== 'hidden')

// anim expertise
const expertiseEl = useTemplateRef<HTMLElement>('expertiseEl')
const expertiseReveal = useScrollReveal(expertiseEl)
const isExpertiseVisible = computed(() => expertiseReveal.value !== 'hidden')

// anim execution
const executionEl = useTemplateRef<HTMLElement>('executionEl')
const executionReveal = useScrollReveal(executionEl)
const isExecutionVisible = computed(() => executionReveal.value !== 'hidden')


// anim temoignage
const temoignageEl = useTemplateRef<HTMLElement>('temoignageEl')
const temoignageReveal = useScrollReveal(temoignageEl)
const isTemoignageVisible = computed(() => temoignageReveal.value !== 'hidden')

// anim parlons ia
const parlonsIaEl = useTemplateRef<HTMLElement>('parlonsIaEl')
const parlonsIaReveal = useScrollReveal(parlonsIaEl)
const isParlonsIaVisible = computed(() => parlonsIaReveal.value !== 'hidden')

// anim jobs
const jobsEl = useTemplateRef<HTMLElement>('jobsEl')
const jobsReveal = useScrollReveal(jobsEl)
const isJobsVisible = computed(() => jobsReveal.value !== 'hidden')

/** Profils de la section Équipe BU, repris de l'ancienne section Leadership.
 *  La citation reste un placeholder : aucun texte réel n'existait dans la
 *  source, on n'en invente pas (cf. CLAUDE.md, intégrité du contenu). */
const leadershipTeam = [
  {
    name: 'Robin Rins',
    role: 'Directeur BU Data & IA',
    quote: '[Citation à venir]',
    linkedin: 'https://www.linkedin.com/in/robin-rins/',
  },
  {
    name: 'Lena Lebecq',
    role: 'Responsable RH',
    quote: '[Citation à venir]',
    linkedin: 'https://www.linkedin.com/in/l%C3%A9na-lebecq-795242201/',
  },
]

/** Profil affiché dans le carrousel de la section Équipe. Pas de défilement
 *  automatique : un contenu qui bouge seul impose un bouton pause (WCAG 2.2.2),
 *  la navigation par points laisse la main au visiteur. */
const activeProfileIndex = ref(0)
const activeProfile = computed(() => leadershipTeam[activeProfileIndex.value]!)

/** Carrousel des deux photos de gauche du Hero, actif uniquement entre `md`
 *  et `xl` (cf. template : au-delà de `xl`, les deux cartes s'affichent côte
 *  à côte et ce carrousel n'a plus d'effet visuel). Réutilisé tel quel pour
 *  alterner les paires de logos partenaires (Snowflake/Omni ↔ GCP/Power BI) :
 *  un seul minuteur pilote les deux carrousels, qui restent synchronisés. */
const activeSlide = ref(0)
let carouselInterval: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  carouselInterval = setInterval(() => {
    activeSlide.value = activeSlide.value === 0 ? 1 : 0
  }, 4000)
})

onUnmounted(() => {
  clearInterval(carouselInterval)
})

interface ExpertiseOffer {
  name: string
  headline: string
  description: string
  /** Attribut `d` d'une icône trait 24×24 (stroke `currentColor`). */
  iconPath: string
  /** Carte mise en avant (bordure accent), cf. maquette : une seule. */
  featured?: boolean
}

/* TODO: textes génériques du gabarit BU, orientés valeur mais sans aucun
   fait chiffré à valider/adapter par chaque BU avant publication. */
const EXPERTISE_OFFERS: ExpertiseOffer[] = [
  {
    name: 'Centre de formation',
    headline: 'Rendre vos équipes autonomes **sur leurs outils data**',
    description:
      'Des **parcours de formation** conçus autour de vos outils Data & IA, pour que vos équipes maîtrisent leurs plateformes au quotidien.',
    iconPath: 'M22 10 12 5 2 10l10 5 10-5Z M6 12v5c3 2 9 2 12 0v-5',
  },
  {
    name: 'Assistance tech',
    headline: 'Un **expert data** à vos côtés',
    description:
      'Un **support technique** réactif pour débloquer vos **projets data**, fiabiliser vos plateformes et sécuriser vos mises en production.',
    iconPath:
      'M4 14v-2a8 8 0 0 1 16 0v2 M4 14h3v5H5a1 1 0 0 1-1-1v-4Z M20 14h-3v5h2a1 1 0 0 0 1-1v-4Z',
    featured: true,
  },
  {
    name: 'Centre de service',
    headline: 'Vos plateformes data, **maintenues et pilotées** dans la durée',
    description:
      '**Maintenance**, évolutions et supervision de vos **solutions data**, pour un patrimoine data fiable et aligné sur vos usages **métier**.',
    iconPath: 'M4 5h16v5H4Z M4 14h16v5H4Z M8 7.5h.01 M8 16.5h.01',
  },
]

/* Contenu statique du fichier (jamais de saisie utilisateur) : **x** devient <strong>x</strong>. */
const boldify = (text: string) => text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

interface IaCard {
  title: string
  description: string
  iconPath: string
}

const IA_CARDS: IaCard[] = [
  {
    title: "Création d'agents **IA**",
    description:
      "Conception d'**assistants IA sur mesure**, connectés à vos données et à vos outils métier, pour automatiser les tâches à faible valeur ajoutée.",
    iconPath:
      'M12 3v2m0 14v2m9-9h-2M5 12H3m14.95-6.95-1.414 1.414M7.464 16.536l-1.414 1.414m0-11.314 1.414 1.414m9.072 9.072 1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8Z',
  },
  {
    title: 'Amélioration continue',
    description:
      "Suivi, évaluation et optimisation des **solutions IA** déployées pour qu'elles gagnent en pertinence au fil des usages réels.",
    iconPath: 'M17 2.1l4 4-4 4M3 12.6v-2a4 4 0 014-4h14M7 21.9l-4-4 4-4M21 11.4v2a4 4 0 01-4 4H3',
  },
  {
    title: "Formation & adoption **de l'IA**",
    description:
      "Montée en compétences de vos équipes pour qu'elles s'approprient durablement les nouveaux outils et usages **de l'IA en entreprise**.",
    iconPath: 'M12 14l9-5-9-5-9 5 9 5Zm0 0v7m-9-5.5V16a9 3 0 0018 0v-4.5',
  },
]

/** Carrousel IA : défilement auto en pause au survol/focus (bouton "suivant"
 *  en plus), désactivé si l'utilisateur demande moins d'animations. */
const activeIaIndex = ref(0)
let iaInterval: ReturnType<typeof setInterval> | undefined

const stopIaCarousel = () => {
  clearInterval(iaInterval)
  iaInterval = undefined
}
const startIaCarousel = () => {
  stopIaCarousel()
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  iaInterval = setInterval(() => {
    activeIaIndex.value = (activeIaIndex.value + 1) % IA_CARDS.length
  }, 5000)
}
const nextIaCard = () => {
  activeIaIndex.value = (activeIaIndex.value + 1) % IA_CARDS.length
  startIaCarousel()
}
onMounted(startIaCarousel)
onUnmounted(stopIaCarousel)

// liste offres data
const allJobs = [
  {
    id: 201,
    title: 'Data Scientist',
    contract: 'CDI',
    location: 'Lille',
    buTag: 'Data',
    shortDescription:
      'Concevez des modèles de machine learning innovants pour répondre aux enjeux métier de nos clients.',
    stacks: ['Python', 'PyTorch', 'Hadoop'],
  },
  {
    id: 202,
    title: 'Data Engineer',
    contract: 'CDI',
    location: 'Lille',
    buTag: 'Data',
    shortDescription:
      'Construisez et fiabilisez les pipelines de données qui alimentent les projets analytics de nos clients.',
    stacks: ['Python', 'Spark', 'Airflow'],
  },
  {
    id: 203,
    title: 'Tech Lead Data',
    contract: 'CDI',
    location: 'Lille',
    buTag: 'Data',
    shortDescription:
      'Encadrez une équipe de data engineers et garantissez la qualité technique des projets data.',
    stacks: ['Python', 'SQL', 'Docker'],
  },
  {
    id: 204,
    title: 'Product Owner',
    contract: 'CDI',
    location: 'Lille',
    buTag: 'Digital',
    shortDescription:
      'Pilotez le backlog produit et faites le lien entre les besoins métier et les équipes de développement.',
    stacks: ['Agile', 'Jira'],
  },
]

// ne garde que les offres de la bu data
const dataJobs = computed(() => allJobs.filter((job) => job.buTag === 'Data'))

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
    <!-- SECTION 1 (Hero) - en-tête centré + mosaïque « bento grid » sur fond
         bleu Faceel-IT. `text-[#12D80A]` (accent-500 brut) pour la
         description : CORRECT ici, contrairement à la version précédente sur
         fond clair - sur ce fond sombre, le ratio est de 9,1:1 (cf. main.css). -->
    <section
      id="hero"
      ref="heroEl"
      data-theme="dark"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden flex flex-col gap-8 bg-gradient-to-b from-[#000066] from-60% to-[#00001a] px-4 pt-24 pb-12 text-center sm:px-6 lg:px-8 xl:px-12"
    >
      <!-- halo central derriere les cartes -->
      <div
        aria-hidden="true"
        class="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[80%] w-[90%] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-[4rem] bg-primary-500/30 blur-[80px]"
      />

      <!-- En-tête textuel, fondu au scroll -->
      <div
        class="mx-auto max-w-7xl shrink-0 px-4"
        :class="isHeroVisible ? 'opacity-100 transition-opacity duration-1000' : 'opacity-0'"
      >
        <h1
          class="animate-fade-up font-display text-4xl font-extrabold tracking-tight text-white motion-reduce:animate-none sm:text-6xl xl:text-7xl"
        >
          Votre <strong>expert data et intelligence artificielle à Lille</strong>
        </h1>
        <p
          class="hero-lede mx-auto mt-6 max-w-3xl animate-fade-up text-base font-semibold leading-relaxed text-[#12D80A] motion-reduce:animate-none sm:text-xl xl:text-2xl [animation-delay:200ms]"
        >
          Plus qu'une <strong>ESN</strong>, nous sommes un collectif de
          <strong>consultants Data & IA</strong> de haut niveau
          <strong>dans la métropole lilloise</strong>. Transparence totale, chiffres assumés, et une force de frappe
          technologique pour déployer vos solutions Data & IA.
        </p>
      </div>

      <!-- Mosaïque « bento grid » encarts photo en placeholders neutres (pas
           de vraies photos disponibles) plutôt que des images picsum.photos
           externes. Hauteurs : colonnes 1 et 2 et le conteneur de la colonne 3
           partagent explicitement le même `h-[480px]`, et les deux blocs
           empilés de la colonne 3 sont `flex-1` pour se répartir cette
           hauteur à parts égales alignement garanti, pas approximatif. -->
      <div
        class="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:gap-6 xl:gap-8 xl:grid-cols-3"
        :class="
          isHeroVisible
            ? 'translate-x-0 opacity-100 transition-all duration-1000 ease-out'
            : 'translate-x-16 opacity-0'
        "
      >
        <!-- Carrousel (photos « meetup » / « Sarah ») : une seule colonne de
             md à xl, cartes superposées en `absolute` et basculées par
             `activeSlide` (cf. script)  le `xl:!flex` force leur affichage
             simultané à partir de `xl`, où `v-show` perd (volontairement) la
             main au profit de la grille à 2 colonnes ci-dessous. -->
        <div
          class="carousel-wrapper relative h-[240px] sm:h-[480px] xl:col-span-2 xl:grid xl:h-auto xl:grid-cols-2 xl:gap-8"
        >
          <div
            v-show="activeSlide === 0"
            class="bento-photo-card absolute inset-0 flex h-[240px] sm:h-[480px] items-center justify-center rounded-3xl border border-white/10 bg-white/10 backdrop-blur-sm p-4 xl:relative xl:inset-auto xl:!flex"
          >
            <p class="text-sm text-white/50">Photo conférence / meetup</p>
          </div>

          <div
            v-show="activeSlide === 1"
            class="bento-photo-card absolute inset-0 flex h-[240px] sm:h-[480px] items-center justify-center rounded-3xl border border-white/10 bg-white/10 backdrop-blur-sm p-4 xl:relative xl:inset-auto xl:!flex"
          >
            <p class="text-sm text-white/50">Photo Sarah</p>
          </div>
        </div>

        <!-- Colonne 3 : photo de Lille masquée en dessous de `xl` (pile
             mobile/tablette simplifiée : seule la carte partenaires reste
             visible, cf. tour précédent), réintroduite à partir de `xl` pour
             ne pas laisser un grand vide au-dessus des partenaires sur
             desktop. -->
        <div class="col3-stack bento-photo-card h-auto xl:flex xl:h-[480px] xl:flex-col xl:gap-8">
          <div
            class="lille-photo-card relative hidden flex-1 min-h-0 overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur-sm xl:block"
          >
            <img :src="photoLille" alt="" class="absolute inset-0 h-full w-full object-cover" />
          </div>

          <!-- Carte partenaires l'accent saturé reste une touche (bordure),
               jamais un aplat de grande surface sur toute la carte (cf.
               main.css, règle de contraste du projet). Logos en slots de
               taille uniforme (h-6) : Omni est le premier à passer en
               composant SVG réel, les trois autres restent des slots neutres
               en attendant leurs propres composants (cf. IconOmni.vue pour le
               pourquoi de la démarche). -->
          <div
            class="partners-card flex h-full flex-col justify-center rounded-3xl border-l-4 border-accent-500 bg-white/10 backdrop-blur-sm p-4 sm:p-8 text-left xl:flex-1"
          >
            <p class="font-display font-bold text-white mb-4 sm:mb-6">Expertises stratégiques</p>
            <!-- Les 4 logos en `currentColor` pour l'icône qui peut se le
               permettre (Snowflake, mono-couleur) et pour le TEXTE
               seulement des deux logos multicolores (GCP, Power BI) leurs
               formes/dégradés d'icône gardent leurs couleurs de marque
               d'origine (cf. IconGcp.vue/IconPowerBi.vue pour le détail).
               Plus de chip blanche : passer currentColor uniquement sur le
               texte évite d'avoir à recolorer toute l'icône en blanc, ce
               qui l'aurait rendue illisible (cf. tours précédents).

               Paires alternées (même `activeSlide` que le carrousel photo,
               cf. script) plutôt que la grille statique à 4 logos : sur les
               hauteurs mobiles compactes (568-630px), 4 logos + le titre ne
               tenaient plus dans une carte à hauteur fixe/symétrique du
               carrousel photo sans déborder. 2 logos à la fois réduit assez
               le contenu réel de la carte pour que cette symétrie redevienne
               possible sans artifice de plafonnement (`max-height` sur les
               `<svg>`, retiré). `.partner-pair` est neutralisé (affiché en
               permanence, les 2 paires ensemble) en dehors de cette plage
               précise par la règle `@media not (...)` du bloc <style>
               ci-dessous ailleurs, rien ne change par rapport à l'ancienne
               grille statique. -->
            <div class="partners-logo-carousel mt-8 w-full">
              <div
                v-show="activeSlide === 0"
                class="partner-pair flex w-full items-center justify-around gap-8"
              >
                <IconSnowflake class="h-10 md:h-12 w-auto max-w-[45%] object-contain text-white" />
                <IconOmni class="h-10 md:h-12 w-auto max-w-[45%] object-contain text-white" />
              </div>
              <div
                v-show="activeSlide === 1"
                class="partner-pair flex w-full items-center justify-around gap-8"
              >
                <IconGcp
                  class="h-16 md:h-20 w-auto max-w-[45%] object-contain text-white -translate-x-4 md:-translate-x-6"
                />
                <IconPowerBi class="h-28 md:h-32 w-auto max-w-[45%] object-contain text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 2 (Expertise) même grammaire que les cartes bento du Hero,
         transposée au thème clair (alternance des sections) : `bg-white/10`
         serait invisible sur fond blanc, d'où des cartes plates `bg-gray-50`.
         Seule « Assistance tech » porte la bordure accent à gauche, comme la
         carte partenaires du Hero une touche, jamais un aplat.
         Mobile : icône à gauche du texte (`flex-row`) plutôt qu'au-dessus,
         pour que les 3 cartes empilées tiennent dans `h-dvh` sans scroll ;
         paliers de hauteur dans le bloc <style>. -->
    <section
      id="expertise-offre"
      ref="expertiseEl"
      data-theme="light"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-white flex flex-col justify-center px-4 pt-24 pb-12 sm:px-6 lg:px-8 xl:px-12"
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
          class="mt-2 font-display text-5xl font-black tracking-tight text-[#000066] md:text-6xl xl:text-7xl"
        >
          <strong>Notre</strong> Expertise
        </h2>
      </div>

      <!-- `mt-16 md:mt-24` (au lieu de `mt-10`) : les paliers de hauteur
           mobile ci-dessous (bloc <style>) imposent déjà `margin-top` en
           `!important` sur `.expertise-grid` à 900px/740px de haut ils
           continuent de s'appliquer quelle que soit la valeur de base, donc
           ce changement n'a besoin d'aucun ajustement mobile supplémentaire. -->
      <div
        class="expertise-grid mx-auto mt-16 grid w-full max-w-[1400px] grid-cols-1 gap-6 sm:gap-8 md:mt-24 md:grid-cols-3 xl:gap-10"
      >
        <!-- cascade cartes -->
        <article
          v-for="(offer, index) in EXPERTISE_OFFERS"
          :key="offer.name"
          :style="{ transitionDelay: isExpertiseVisible ? `${index * 150}ms` : '0ms' }"
          :class="[
            'expertise-card flex items-start gap-4 rounded-3xl bg-gray-50 p-6 text-left sm:p-8 md:flex-col md:justify-between md:gap-6 md:min-h-[450px] md:p-10 xl:min-h-[500px]',
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

          <div class="min-w-0">
            <p class="text-xs font-bold uppercase tracking-widest text-accent-700">
              {{ offer.name }}
            </p>
            <h3
              class="expertise-headline mt-2 font-display text-lg font-bold leading-snug text-[#000066] md:text-2xl xl:text-3xl"
            >
              <span v-html="boldify(offer.headline)" />
            </h3>
            <p class="expertise-desc mt-3 text-sm leading-relaxed text-gray-600">
              <span v-html="boldify(offer.description)" />
            </p>
          </div>
        </article>
      </div>
    </section>

    <!-- SECTION 3 (Force d'exécution) contenu mixte (image + texte) puis bannière de chiffres clés.
         `data-theme="dark"` (plutôt que "light") pour suivre le fond bleu :
         crée deux sections sombres consécutives (3 et 4), ce qui contredit
         l'alternance stricte « une section sur deux » documentée dans
         CLAUDE.md changement demandé explicitement, signalé ici tel quel. -->
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
            class="font-display text-2xl font-black text-white sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
            :class="
              isExecutionVisible
                ? 'translate-y-0 opacity-100 transition-all duration-700 ease-out'
                : 'translate-y-8 opacity-0'
            "
          >
            Au-delà du <strong>conseil data</strong>, une force d'exécution.
          </h2>
          <!-- glisse depuis la droite -->
          <div
            class="mt-3 space-y-3 text-sm leading-relaxed text-white sm:text-base md:mt-4 md:space-y-4 md:text-lg xl:text-xl"
            :class="
              isExecutionVisible
                ? 'translate-x-0 opacity-100 transition-all duration-700 delay-150 ease-out'
                : 'translate-x-8 opacity-0'
            "
          >
            <p>
              Expertise technique de pointe, consultants certifiés sur les <strong>outils data</strong> de référence,
              pragmatisme assumé : nous testons et choisissons le bon outil pour chaque cas d'usage.
            </p>
            <p>
              Tout le potentiel de nos outils partenaires réside dans leur paramétrage spécifique et
              leur <strong>intégration à vos outils existants</strong>. Au plus près de vos équipes, nos
              <strong>ingénieurs data</strong> calibrent la solution à votre métier, vos données et votre environnement.
            </p>
            <p>
              Grâce à nos <strong>partenariats officiels avec les éditeurs</strong>, vous bénéficiez en
              continu des dernières <strong>innovations Data & IA</strong> et d'un accès premium à leurs équipes.
            </p>
          </div>
        </div>
      </div>

      <!-- Bannière de chiffres clés `bg-white/10` (au lieu de `bg-gray-50`)
           pour suivre le fond bleu, même traitement que les cartes du Hero. -->
      <div
        class="mx-auto mt-16 w-full max-w-[1400px] rounded-3xl bg-white/10 px-8 py-10"
        :class="
          isExecutionVisible
            ? 'translate-y-0 opacity-100 transition-all duration-700 delay-300 ease-out'
            : 'translate-y-8 opacity-0'
        "
      >
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div
            v-for="stat in [
              { value: '5', label: 'partenaires officiels' },
              { value: '15', label: 'experts' },
              { value: '50', label: 'clients accompagnés' },
            ]"
            :key="stat.label"
            class="text-center"
          >
            <p class="font-display text-4xl font-bold text-accent-500 sm:text-5xl">
              {{ stat.value }}
            </p>
            <p class="mt-1 text-sm text-white/70">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 4 (Cas d'usage) : composant partage avec DigitalView.vue -->
    <UseCasesSection />

    <!-- SECTION 5 (Équipe BU) grille 50/50 sur desktop : profils à gauche sur fond
         sombre, photo à droite (masquée sous `lg`, en attendant la photo
         définitive : elle prenait trop de place sur mobile). Remplace l'ancienne section
         « leadership » (cartes 3D) ; les profils en reprennent les données. -->
    <section
      id="leadership"
      data-theme="dark"
      class="w-full shrink-0 snap-start snap-always min-h-dvh grid grid-cols-1 lg:grid-cols-2"
    >
      <div
        class="flex flex-col justify-center bg-[#000066] p-8 pt-28 text-white sm:p-12 sm:pt-28 lg:p-16 lg:pt-28"
      >
        <h2 class="mt-3 font-display text-4xl font-black text-balance md:text-5xl">
          Les experts Data &amp; IA
        </h2>
        <p class="mt-4 max-w-xl text-base leading-relaxed text-gray-300">
          Nos BUs, expertes de vos besoins, vous accompagnent depuis notre ESN à Wasquehal
          (métropole lilloise, Hauts-de-France).
        </p>

        <!-- hauteur minimale : évite que la section saute quand le profil change -->
        <div class="mt-12 min-h-[220px] lg:mt-16" aria-live="polite">
          <Transition
            mode="out-in"
            enter-active-class="transition-opacity duration-300 motion-reduce:transition-none"
            leave-active-class="transition-opacity duration-300 motion-reduce:transition-none"
            enter-from-class="opacity-0"
            leave-to-class="opacity-0"
          >
            <div :key="activeProfile.name" class="flex flex-col">
              <a
                :href="activeProfile.linkedin"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="'Profil LinkedIn de ' + activeProfile.name"
                class="inline-flex w-fit rounded-sm text-white/70 transition-colors duration-300 motion-reduce:transition-none hover:text-accent-500 focus-visible:text-accent-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-500"
              >
                <svg class="size-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path
                    d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"
                  />
                </svg>
              </a>
              <h4 class="mt-6 font-display text-xl font-bold text-white">
                {{ activeProfile.name }}
              </h4>
              <p class="mt-2 text-sm text-white/60">{{ activeProfile.role }}</p>
              <p class="mt-6 text-sm italic leading-relaxed text-white/70">
                {{ activeProfile.quote }}
              </p>
            </div>
          </Transition>
        </div>

        <!-- points de navigation : zone cliquable de 32 px autour d'un point de 10 px -->
        <div class="mt-6 flex gap-1">
          <button
            v-for="(member, index) in leadershipTeam"
            :key="member.name"
            type="button"
            :aria-label="'Afficher le profil de ' + member.name"
            :aria-current="index === activeProfileIndex ? 'true' : undefined"
            class="group flex size-8 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
            @click="activeProfileIndex = index"
          >
            <span
              class="size-2.5 rounded-full transition-colors duration-300 motion-reduce:transition-none"
              :class="
                index === activeProfileIndex
                  ? 'bg-accent-500'
                  : 'bg-white/30 group-hover:bg-white/60'
              "
            />
          </button>
        </div>
      </div>

      <!-- TODO : photo d'équipe de la BU à fournir (aucune image dans l'ancienne
           section) ; remplacer ce bloc par une <img> object-cover h-full w-full
           avec alt="L'équipe Data et IA de Faceel-IT". En attendant, role="img" +
           aria-label porte le même nom accessible. -->
      <div
        class="hidden h-full w-full items-center justify-center bg-primary-700 text-lg font-medium text-white/60 lg:flex"
        role="img"
        aria-label="L'équipe Data et IA de Faceel-IT"
      >
        Placeholder Image
      </div>
    </section>

    <!-- SECTION 5bis (Témoignage Consultant) reprise de la section
         `#temoignage` de DigitalView.vue, mise en miroir : layout inversé
         (texte à gauche, photo à droite l'original a la photo à gauche) et
         couleurs inversées (fond blanc au lieu de bg-[#000066], textes en
         bleu marine au lieu de blanc). `lg:grid-cols-2` (pas `md:`) : reprend
         le point de rupture exact de la section source, pas une
         approximation.
         Insérée ici, cette section cassera de nouveau l'alternance stricte
         des thèmes avec la section suivante (Parlons IA, elle aussi
         `data-theme="light"`) signalé tel quel, Parlons IA n'a pas été
         touchée (hors du périmètre demandé). -->
    <!-- compense hauteur navbar -->
    <section
      id="temoignage"
      ref="temoignageEl"
      data-theme="light"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-white grid grid-cols-1 pt-24 lg:grid-cols-2 lg:pt-0"
    >
      <!-- fix hauteur temoignages -->
      <div class="flex flex-col justify-center px-8 pb-6 lg:px-24 lg:py-12">
        <p
          class="text-sm font-bold uppercase tracking-widest text-accent-500"
          :class="
            isTemoignageVisible
              ? 'translate-y-0 opacity-100 transition-all duration-700 ease-out'
              : 'translate-y-8 opacity-0'
          "
        >
          Surtitre
        </p>

        <!-- glisse depuis la gauche -->
        <div
          class="mt-6 flex flex-col"
          :class="
            isTemoignageVisible
              ? 'translate-x-0 opacity-100 transition-all duration-700 delay-150 ease-out'
              : '-translate-x-8 opacity-0'
          "
        >
          <span
            class="self-start font-display text-6xl font-black leading-none text-[#000066]"
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <p class="mx-auto max-w-md text-center text-xl leading-relaxed text-[#000066]">
            Témoignage générique illustrant l'expérience d'un collaborateur ou d'un client de cette
            Business Unit.
          </p>
          <span
            class="self-end font-display text-6xl font-black leading-none text-[#000066]"
            aria-hidden="true"
          >
            &rdquo;
          </span>
        </div>

        <div
          class="mt-6"
          :class="
            isTemoignageVisible
              ? 'translate-x-0 opacity-100 transition-all duration-700 delay-150 ease-out'
              : '-translate-x-8 opacity-0'
          "
        >
          <p class="font-semibold text-[#000066]">Nom Prénom</p>
          <p class="text-sm text-gray-600">Poste</p>
        </div>

        <!-- Navigation visuelle : trait plein, deux segments pointillés, flèche -->
        <div
          class="mt-8 flex items-center gap-2"
          :class="
            isTemoignageVisible
              ? 'translate-x-0 opacity-100 transition-all duration-700 delay-150 ease-out'
              : '-translate-x-8 opacity-0'
          "
        >
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

      <!-- Colonne droite : photo (effet d'empilement), glisse depuis la droite -->
      <div
        class="flex items-center justify-center px-8 pb-6 lg:px-24 lg:py-12"
        :class="
          isTemoignageVisible
            ? 'translate-x-0 opacity-100 transition-all duration-700 ease-out'
            : 'translate-x-8 opacity-0'
        "
      >
        <div class="relative aspect-square max-h-[150px] w-full max-w-md lg:max-h-none">
          <div
            class="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl bg-[#000066]"
            aria-hidden="true"
          />
          <div
            class="relative flex h-full w-full items-center justify-center rounded-3xl border border-gray-300 bg-white"
          >
            <p class="text-lg font-semibold text-gray-800">Photo</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 6 (Parlons IA) refondue d'après la maquette fournie :
         en-tête 2 colonnes (surtitre+titre / description) puis grille de 3
         cartes blanches. `data-theme="dark"` (pas "light" comme avant) : le
         fond passe de `bg-gray-50` à `bg-[#000066]`, nécessaire pour que la
         navbar reste lisible non explicitement demandé mais requis par la
         convention du projet. Ça crée par ailleurs une nouvelle rupture
         d'alternance stricte des thèmes avec la section suivante (Offres,
         déjà `dark`) : signalé tel quel, Offres n'a pas été touchée. -->
    <!-- compense hauteur navbar -->
    <section
      id="parlons-ia"
      ref="parlonsIaEl"
      data-theme="dark"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-[#000066] flex flex-col justify-center pt-24 pb-6 sm:py-20"
    >
      <!-- halo central derriere la grille de cartes -->
      <div
        aria-hidden="true"
        class="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[80%] w-[90%] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-[4rem] bg-primary-500/30 blur-[80px]"
      />

      <div class="mx-auto w-full max-w-[1400px] px-6">
        <!-- ajuste hauteur mobile -->
        <div class="mb-4 grid grid-cols-1 gap-3 sm:mb-16 sm:gap-8 md:grid-cols-2">
          <!-- glisse depuis la gauche -->
          <div
            :class="
              isParlonsIaVisible
                ? 'translate-x-0 opacity-100 transition-all duration-700 ease-out'
                : '-translate-x-8 opacity-0'
            "
          >
            <h2 class="mt-2 font-display text-[28px] font-black text-white sm:text-4xl md:text-6xl">
              Vos projets <strong>métier, accélérés</strong> par l'intelligence artificielle.
            </h2>
          </div>
          <!-- glisse depuis la droite -->
          <div
            class="flex items-center"
            :class="
              isParlonsIaVisible
                ? 'translate-x-0 opacity-100 transition-all duration-700 ease-out'
                : 'translate-x-8 opacity-0'
            "
          >
            <!-- texte raccourci -->
            <p class="text-base leading-relaxed text-white sm:text-lg">
              De l'<strong>automatisation des processus</strong> aux <strong>agents IA sur mesure</strong>,
              l'intelligence artificielle transforme vos processus métier. Explorez ce potentiel avec
              nos <strong>experts IA</strong>.
            </p>
          </div>
        </div>

        <!-- Carrousel : toutes les cartes sont empilées dans la même cellule de
             grille (la plus haute fixe la hauteur), seul l'opacité change, d'où
             aucun saut de hauteur de la section pendant la transition. -->
        <div
          :class="
            isParlonsIaVisible
              ? 'translate-y-0 opacity-100 transition-all duration-700 ease-out'
              : 'translate-y-8 opacity-0 transition-none'
          "
          @mouseenter="stopIaCarousel"
          @mouseleave="startIaCarousel"
          @focusin="stopIaCarousel"
          @focusout="startIaCarousel"
        >
          <div class="mx-auto grid w-full max-w-2xl">
            <div
              v-for="(card, index) in IA_CARDS"
              :key="card.title"
              class="col-start-1 row-start-1 rounded-[2rem] border-2 border-accent-500 bg-white p-5 transition-opacity duration-500 ease-in-out motion-reduce:transition-none md:p-10"
              :class="index === activeIaIndex ? 'opacity-100' : 'pointer-events-none opacity-0'"
              :aria-hidden="index !== activeIaIndex"
            >
              <div
                class="flex size-12 items-center justify-center rounded-2xl bg-accent-500 md:size-14"
                aria-hidden="true"
              >
                <svg
                  class="size-5 text-white md:size-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    :d="card.iconPath"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <p
                class="mt-5 font-display text-lg font-bold text-[#000066] md:mt-8 md:text-2xl"
                v-html="boldify(card.title)"
              />
              <p
                class="mt-3 text-sm leading-relaxed text-gray-800 md:text-base"
                v-html="boldify(card.description)"
              />
            </div>
          </div>

          <div class="mt-4 flex items-center justify-center gap-4 sm:mt-8">
            <div class="flex gap-2" aria-hidden="true">
              <span
                v-for="(card, index) in IA_CARDS"
                :key="card.title"
                class="size-2 rounded-full transition-colors duration-500"
                :class="index === activeIaIndex ? 'bg-[#12D80A]' : 'bg-white/40'"
              />
            </div>
            <button
              type="button"
              aria-label="Carte suivante"
              class="flex size-11 items-center justify-center rounded-full bg-[#12D80A] text-white transition-colors hover:bg-accent-400"
              @click="nextIaCard"
            >
              <svg class="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 12h14m-6-6 6 6-6 6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="mt-4 flex justify-center sm:mt-12">
          <RouterLink
            to="/contact-entreprise"
            class="rounded-full bg-[#12D80A] px-8 py-4 font-bold text-white transition-colors hover:bg-accent-400"
          >
            Contacter nos experts <strong>Data & IA</strong>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- compense hauteur navbar -->
    <!-- section offres, fond blanc -->
    <section
      id="offres"
      ref="jobsEl"
      data-theme="light"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-white flex flex-col justify-center px-8 pt-24 pb-6 text-center sm:py-24 md:py-32 lg:px-24"
    >
      <!-- en tete, fondu vers le haut -->
      <div
        :class="
          isJobsVisible
            ? 'translate-y-0 opacity-100 transition-all duration-700 ease-out'
            : 'translate-y-8 opacity-0'
        "
      >
        <p class="text-sm font-bold uppercase tracking-widest text-accent-500">
          REJOIGNEZ LA BU DATA & IA
        </p>
        <h2
          class="mt-2 mb-3 font-display text-3xl font-black text-[#000066] sm:mb-6 md:text-6xl xl:text-7xl"
        >
          Façonnez l'avenir de l'intelligence artificielle
        </h2>
        <p class="mx-auto mt-2 max-w-2xl text-lg text-gray-600 sm:mt-4 md:text-xl">
          Envie de concevoir des modèles innovants et de valoriser la donnée au cœur de nos projets
          ? Découvrez nos opportunités.
        </p>
      </div>

      <!-- defilement horizontal offres -->
      <div
        v-if="dataJobs.length > 0"
        class="mx-auto mt-4 flex w-full max-w-[1400px] snap-x snap-mandatory gap-4 overflow-x-auto pb-4 hide-scrollbar sm:mt-10 md:grid md:grid-cols-3 md:gap-12 md:overflow-visible md:pb-0"
      >
        <!-- cache ombre mobile -->
        <div
          v-for="(job, index) in dataJobs"
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
          @click="router.push({ name: 'offres', query: { bu: 'Data & IA' } })"
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
/* Les 2 paires de logos partenaires (`.partner-pair`) sont toujours dans le
   DOM, basculées par `v-show`/`activeSlide` comme le carrousel photo mais
   l'alternance ne doit être visible QUE sur la plage mobile compacte ciblée
   plus bas (568-630px de hauteur, en dessous de 767px de largeur). Partout
   ailleurs, on neutralise `v-show` et on force l'affichage simultané des 2
   paires (4 logos ensemble, comportement identique à l'ancienne grille
   statique) via `@media not` l'exact inverse de la plage compacte. */
@media not all and (max-width: 767px) and (max-height: 630px) {
  #hero .partner-pair {
    display: flex !important;
  }
}

/* Desktop compact (grand écran mais fenêtre basse, ex. 838px de hauteur) :
   les cartes photo du Hero gardent leur `h-[480px]` Tailwind quelle que soit
   la hauteur de la fenêtre dès `xl`, ce qui fait déborder la section sur un
   écran large mais court. `!important` nécessaire pour gagner face aux
   utilitaires Tailwind `h-[480px]`/`xl:h-[480px]`, de même spécificité. */
@media (min-width: 1280px) and (max-height: 900px) {
  .bento-photo-card {
    height: 360px !important;
  }

  /* Le `padding-top` n'est volontairement PAS réduit ici : `#hero` garde son
     `pt-24` Tailwind de base, seul rempart contre le chevauchement avec la
     navbar fixe (`h-16 lg:h-20`, cf. TheMegaMenu/TickerBand) quelle que soit
     la hauteur de la fenêtre. Seul le bas est compacté ; `justify-content`
     recentre le contenu restant dans l'espace disponible sous la navbar. */
  #hero {
    padding-bottom: 1.5rem !important;
    justify-content: center;
  }

  #hero h1 {
    font-size: 2.75rem !important;
    line-height: 1.1 !important;
  }

  /* `.hero-lede`, pas `#hero p` : #hero contient aussi les légendes photo
     et le titre "Partenaires stratégiques" (des <p> eux aussi) un
     sélecteur générique les aurait décalés/recompactés sans raison. */
  #hero .hero-lede {
    margin-top: 0.75rem !important;
    font-size: 1rem !important;
    line-height: 1.4 !important;
  }

  /* La photo de Lille masquée + `gap: 0` évitent qu'un `gap-8` hérité de
     `xl:gap-8` ne laisse un espace vide / un trait de bordure résiduel
     au-dessus de la carte partenaires une fois la photo retirée la carte
     partenaires (seule enfant flex visible, déjà `xl:flex-1`) récupère alors
     naturellement toute la hauteur de `.bento-photo-card`. */
  #hero .lille-photo-card {
    display: none !important;
  }

  #hero .col3-stack {
    gap: 0 !important;
  }
}

/* Très faible hauteur (ex. 568px) : la marche précédente (900px) ne suffit
   plus, le contenu déborde encore par le bas. `padding-top: 5rem` reste
   volontairement non réduit à moins que `pt-24` de base c'est l'exacte
   hauteur de la navbar fixe (`lg:h-20`), le minimum en dessous duquel le
   titre toucherait la navbar. */
@media (min-width: 1280px) and (max-height: 650px) {
  .bento-photo-card {
    height: 260px !important;
  }

  #hero {
    padding-top: 5rem !important;
    padding-bottom: 0.75rem !important;
  }

  #hero h1 {
    font-size: 2.25rem !important;
  }

  #hero .hero-lede {
    font-size: 0.9rem !important;
    margin-top: 0.4rem !important;
  }

  #hero .lille-photo-card {
    display: none !important;
  }

  #hero .col3-stack {
    gap: 0 !important;
  }
}

/* En dessous de `xl` (1280px), les cartes photo ne portent que `.bento-photo-card`
   (pas de variante `xl:h-[...]`) et la photo de Lille est déjà masquée en
   permanence par `hidden xl:block` donc `.bento-photo-card` suffit seule à
   couvrir le carrousel ET le conteneur colonne 3, sans qu'un sélecteur
   d'attribut sur le nom de classe Tailwind (fragile : il casserait
   silencieusement à la prochaine valeur `h-[...]` changée, comme `h-[300px]`
   déjà obsolète depuis un tour précédent) soit nécessaire. */
@media (max-width: 1279px) and (max-height: 800px) {
  /* Bascule du carrousel hors du positionnement absolu strict sur ce
     format : `.carousel-wrapper` (son conteneur) passe d'une hauteur fixe
     à `auto` + un plancher, et les 2 cartes-slide (`.bento-photo-card`)
     repassent en flux normal (`position:relative`) pour que leur contenu
     participe réellement au calcul de cette hauteur `auto` ce qu'un
     `absolute inset-0` empêchait. Comme `v-show` ne laisse jamais plus
     d'une slide visible à la fois, repasser en flux normal ne crée aucun
     chevauchement entre les deux. */
  #hero .carousel-wrapper {
    height: 100% !important;
    min-height: 280px !important;
  }

  .bento-photo-card {
    position: relative !important;
    inset: auto !important;
    height: 100% !important;
    min-height: 280px !important;
    padding: 1.5rem !important;
  }

  /* `justify-content: center` centrait le bloc de contenu sur toute la
     hauteur de l'écran, y compris la zone masquée par la navbar fixe, et
     faisait donc remonter le titre derrière elle. `flex-start` + un
     `padding-top` à lui seul suffisamment grand (6rem couvre `lg:h-20`,
     80px, avec marge) garantit que le contenu démarre toujours en aval de
     la navbar et s'empile ensuite naturellement de haut en bas. */
  #hero {
    padding-top: 6rem !important;
    padding-bottom: 1rem !important;
    justify-content: flex-start !important;
  }

  #hero h1 {
    font-size: 2.25rem !important;
  }

  #hero .hero-lede {
    font-size: 0.85rem !important;
    margin-top: 0.25rem !important;
    line-height: 1.3 !important;
  }

  /* `.col3-stack` (parent direct de `.partners-card`) porte aussi la classe
     `.bento-photo-card` : il hérite donc déjà de `height: 100%` (règle
     ci-dessus) et, comme grid-item, s'étire via le comportement par défaut
     de CSS Grid (`align-items: stretch`) pour matcher la hauteur de
     `.carousel-wrapper` sur la même ligne les deux colonnes ont donc déjà
     la même hauteur de ligne. Ce qui manquait : `.partners-card` elle-même
     (un niveau plus bas) restait en `height: auto`, ne remplissant que son
     propre contenu et laissant un vide sous sa carte jusqu'au bas de
     `.col3-stack`. `height: 100%` la fait remplir cette hauteur déjà
     commune aux deux colonnes les deux cartes se terminent maintenant au
     même niveau. */
  #hero .partners-card {
    height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    padding: 1.25rem !important;
  }

  #hero .partners-card p.font-display {
    margin-bottom: 0.75rem !important;
  }
}

/* Mobile / écrans étroits en hauteur réduite : en dessous de `md` (768px),
   `.carousel-wrapper` et `.col3-stack` ne sont plus côte à côte dans la même
   ligne de grille (1 colonne sous `sm`, 2 colonnes entre `sm` et `md`), donc
   empilés verticalement une hauteur fixe (200px) sur le carrousel pendant
   que la carte partenaires restait en `height: auto` créait un déséquilibre
   visuel entre les deux blocs. Les deux passent maintenant en `height: auto`
   avec le même plancher (`min-height: 210px`), chacun se dimensionnant sur
   son propre contenu tout en partageant un gabarit minimal cohérent.
   `position: relative`/`inset: auto` sur `.bento-photo-card` : nécessaire ici
   aussi (pas seulement dans la media query `max-height: 800px` au-dessus,
   dont la plage ne couvre pas entièrement 568-830px) pour que `height: auto`
   ait un effet réel sur les cartes-slide du carrousel, normalement
   `absolute inset-0`. */
@media (max-width: 767px) and (max-height: 830px) {
  #hero .carousel-wrapper,
  #hero .bento-photo-card {
    position: relative !important;
    inset: auto !important;
    height: auto !important;
    min-height: 210px !important;
  }

  #hero {
    padding-top: 4.5rem !important;
    padding-bottom: 0.75rem !important;
  }

  #hero .mx-auto.grid {
    gap: 1rem !important;
  }

  #hero .partners-card {
    height: auto !important;
    min-height: 210px !important;
    padding: 1.25rem !important;
  }

  #hero .partners-card p.font-display {
    margin-bottom: 0.75rem !important;
  }
}

/* Palier supplémentaire, plus serré, pour les hauteurs mobiles entre 568px
   et 744px : le plancher de 210px de la règle `max-height: 830px`
   ci-dessus reste trop grand sur ce segment. Ce bloc est ajouté APRÈS
   (et non à la place de) celui du dessus même logique de paliers
   progressifs que côté desktop (`max-height: 900px` puis `max-height:
   650px`) : 745-830px garde le plancher 210px, 568-744px descend à 180px
   via celui-ci, qui l'emporte en cascade (même `!important`, déclaré plus
   loin dans la feuille de style). */
@media (max-width: 767px) and (max-height: 744px) {
  #hero .carousel-wrapper,
  #hero .bento-photo-card {
    position: relative !important;
    inset: auto !important;
    height: 180px !important;
    min-height: 180px !important;
  }

  #hero .partners-card {
    height: auto !important;
    min-height: unset !important;
    padding: 1rem !important;
  }

  #hero {
    padding-top: 4rem !important;
    padding-bottom: 0.5rem !important;
  }

  #hero .mx-auto.grid {
    gap: 0.75rem !important;
  }
}

/* Palier dédié à la symétrie carrousel photo / carte partenaires (568-630px) :
   avec seulement 2 logos affichés à la fois (`.partner-pair`, cf. template
   et règle `@media not` plus haut), le contenu de `.partners-card` est enfin
   assez compact pour lui donner, comme au carrousel, une hauteur FIXE
   identique (plutôt que `height: auto`) sans risque de débordement. */
@media (max-width: 767px) and (max-height: 630px) {
  #hero .carousel-wrapper,
  #hero .bento-photo-card {
    position: relative !important;
    inset: auto !important;
    height: 130px !important;
    min-height: 130px !important;
  }

  #hero .partners-card {
    height: 130px !important;
    min-height: 130px !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
  }
}

/* Hauteur élastique sur toute la tranche mobile compacte : les paliers fixes
   ci-dessus (180px / 130px) laissaient un grand vide en bas dès que la
   fenêtre grandissait (666px, 819px…). Pas de `clamp(…vh…)` : l'en-tête
   n'a pas la même hauteur selon les paliers (228px à 666px, 324px à 819px),
   aucune valeur en `vh` ne tombe juste partout `38vh` débordait de 81px
   à 666px et de 143px à 819px (mesuré). La grille prend donc tout l'espace
   restant sous l'en-tête (`flex: 1`, `#hero` étant déjà en flex colonne
   `h-dvh`) et ses 2 lignes (1 colonne, < sm) se le partagent à parts
   égales, sans calcul à maintenir. Le palier ≤ 580px garde ses 175px fixes
   (`min-height: 581px` ici). */
@media (max-width: 639px) and (min-height: 581px) and (max-height: 820px) {
  #hero .mx-auto.grid {
    flex: 1 1 0;
    min-height: 0;
    grid-auto-rows: minmax(0, 1fr);
  }

  #hero .carousel-wrapper,
  #hero .bento-photo-card,
  #hero .partners-card {
    height: 100% !important;
    min-height: 0 !important;
  }
}

/* sm-md (640-767px) : les 2 cartes sont côte à côte sur UNE ligne le
   remplissage ci-dessus leur donnait toute la hauteur restante (~500px à
   800px de haut), rendu étiré. Hauteur modérée + section centrée à la
   place. Pas appliqué < sm : empilées, 2 × 240px minimum + l'en-tête
   dépassaient l'écran (121 à 209px coupés à 375px de large, mesuré). */
@media (min-width: 640px) and (max-width: 767px) and (min-height: 581px) and (max-height: 820px) {
  #hero {
    justify-content: center !important;
    align-items: center !important;
  }

  #hero .carousel-wrapper,
  #hero .bento-photo-card,
  #hero .partners-card {
    height: clamp(240px, 42vh, 360px) !important;
    min-height: unset !important;
  }
}

@media (max-width: 767px) and (min-height: 581px) and (max-height: 820px) {
  /* Même piège que dans le palier 580px : `.col3-stack` hérite du padding
     de `.bento-photo-card` et décalerait la carte hors de son conteneur. */
  #hero .col3-stack {
    padding: 0 !important;
  }

  /* Les cartes faisant désormais ~50% de l'espace restant, la carte
     partenaires descend à ~190px vers 631px de haut seuil à partir duquel
     les 4 logos s'affichent ensemble (cf. `@media not` en tête). Avec le
     `mt-8` et le Power BI en `h-28` (112px), son contenu en demandait 220px :
     mêmes plafonds de logos que le palier 580px, marge réduite. */
  #hero .partners-logo-carousel {
    margin-top: 0.5rem !important;
  }

  #hero .partner-pair:last-child svg {
    height: 2.75rem !important;
  }

  #hero .partner-pair:last-child svg:last-child {
    height: 4.5rem !important;
  }
}

/* Dernier palier, pour les hauteurs mobiles extrêmes (ex. 568px) : les
   168-210px de plancher des paliers précédents restent trop grands une
   fois cumulés avec le padding et la typographie de base. */
@media (max-width: 767px) and (max-height: 580px) {
  #hero .carousel-wrapper,
  #hero .bento-photo-card,
  #hero .partners-card {
    height: 175px !important;
    min-height: 175px !important;
  }

  /* 4.75rem (76px) : au-delà des 64px de la navbar mobile (`h-16`, seul
     palier applicable sous `max-width: 767px`), avec une marge de
     respiration volontaire sous la barre. */
  #hero {
    padding-top: 4.75rem !important;
    padding-bottom: 0.25rem !important;
  }

  #hero .mx-auto.grid {
    gap: 0.5rem !important;
  }

  #hero h1 {
    font-size: 1.75rem !important;
  }

  #hero .hero-lede {
    font-size: 0.75rem !important;
    margin-top: 0.2rem !important;
  }

  #hero .partners-card {
    padding: 0.5rem 0.75rem !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
  }

  #hero .partners-card p.font-display {
    margin-bottom: 0.25rem !important;
    font-size: 0.8rem !important;
  }

  /* `.col3-stack` porte aussi `.bento-photo-card` et hérite donc du
     `padding: 1.5rem` du palier `max-height: 800px` : la carte partenaires
     (135px) se retrouvait décalée de 24px dans un conteneur de 135px et
     débordait par le bas. Ce n'est qu'un wrapper, pas une carte visible. */
  #hero .col3-stack {
    padding: 0 !important;
  }

  /* Mesuré à 375×568 : contenu de 175px pour 135px de carte (le `mt-8` du
     carrousel de logos + le Power BI en `h-28`, 112px, dépassaient de 40px).
     Logos plafonnés en gardant leur rapport GCP/Power BI d'origine (≈ 4:7). */
  #hero .partners-logo-carousel {
    margin-top: 0 !important;
  }

  /* Seule la paire GCP/Power BI (2e paire) est concernée : Snowflake/Omni
     (`h-10`, 40px) tiennent déjà dans la carte. */
  #hero .partner-pair:last-child svg {
    height: 2.75rem !important;
  }

  #hero .partner-pair:last-child svg:last-child {
    height: 4.5rem !important;
  }
}

/* Section Expertise, < md : les 3 cartes s'empilent et leurs gabarits de
   base (p-6, texte `sm`) dépassaient `h-dvh` de 81px à 819px de haut et de
   206px à 568px (mesuré) `overflow-hidden` les aurait coupées. Paliers de
   hauteur sur le modèle du Hero : on resserre les espacements d'abord, la
   typographie ensuite, sans jamais masquer de contenu.

   Les gabarits massifs (`min-h-[450px]`/`[500px]`, `p-10`, icônes/titres
   agrandis) ne s'appliquent qu'à partir de `md:`/`xl:` sous `md`, aucune de
   ces classes ne prend effet (préfixes Tailwind en `min-width`), donc les
   paliers ci-dessous restent valables tels quels, sans ajustement. */
@media (max-width: 767px) and (max-height: 900px) {
  #expertise-offre {
    padding-top: 4.5rem !important;
    padding-bottom: 1rem !important;
  }

  #expertise-offre h2 {
    font-size: 2rem !important;
  }

  #expertise-offre .expertise-grid {
    margin-top: 1.25rem !important;
    gap: 0.75rem !important;
  }

  #expertise-offre .expertise-card {
    padding: 1rem !important;
    gap: 0.875rem !important;
  }

  #expertise-offre .expertise-headline {
    margin-top: 0.25rem !important;
    font-size: 1rem !important;
  }

  #expertise-offre .expertise-desc {
    margin-top: 0.375rem !important;
    font-size: 0.8125rem !important;
    line-height: 1.45 !important;
  }
}

@media (max-width: 767px) and (max-height: 740px) {
  #expertise-offre {
    padding-top: 4.25rem !important;
    padding-bottom: 0.5rem !important;
  }

  #expertise-offre h2 {
    margin-top: 0.125rem !important;
    font-size: 1.75rem !important;
  }

  #expertise-offre .expertise-grid {
    margin-top: 0.75rem !important;
    gap: 0.5rem !important;
  }

  #expertise-offre .expertise-card {
    padding: 0.75rem 1rem !important;
    gap: 0.75rem !important;
  }

  #expertise-offre .expertise-icon {
    width: 2.25rem !important;
    height: 2.25rem !important;
    border-radius: 0.75rem !important;
  }

  #expertise-offre .expertise-headline {
    font-size: 0.9375rem !important;
    line-height: 1.3 !important;
  }

  #expertise-offre .expertise-desc {
    margin-top: 0.25rem !important;
    font-size: 0.75rem !important;
    line-height: 1.4 !important;
  }
}

/* Hauteurs égales des cartes empilées (alignées sur la plus haute) pas
   en dessous de 601px de haut : à 568px, ce gain d'une vingtaine de pixels
   suffisait à faire déborder la section (mesuré). */
@media (max-width: 767px) and (min-height: 601px) {
  #expertise-offre .expertise-grid {
    grid-auto-rows: 1fr;
  }
}

/* Très petits écrans (320px de large) : le texte y passe à la ligne bien
   plus tôt et débordait encore de 34px à 568px de haut. L'icône est
   purement décorative (`aria-hidden`) : la masquer rend ~48px de largeur au
   texte, ce qui retire une ligne à chaque carte sans perdre de contenu. */
@media (max-width: 359px) and (max-height: 740px) {
  #expertise-offre .expertise-icon {
    display: none !important;
  }
}
</style>
