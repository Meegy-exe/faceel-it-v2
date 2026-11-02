<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
import photoLille from '@/assets/images/photos/lille.jpg'
import imgFaceel04 from '@/assets/images/photos/faceel_04.jpeg'
import IconGcp from '@/components/icons/IconGcp.vue'
import IconOmni from '@/components/icons/IconOmni.vue'
import IconPowerBi from '@/components/icons/IconPowerBi.vue'
import IconSnowflake from '@/components/icons/IconSnowflake.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useSeo } from '@/composables/useSeo'

/**
 * Page modèle (template) pour une Business Uni textes volontairement
 * génériques : sert de base que les RH dupliquent et complètent pour chaque
 * BU, pas un contenu final à publier tel quel.
 */
useSeo({
  title: 'Data & IA - Modèle de page BU',
  description: 'Page modèle pour la Business Unit Data & IA.',
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

// anim realisations
const realisationsEl = useTemplateRef<HTMLElement>('realisationsEl')
const realisationsReveal = useScrollReveal(realisationsEl)
const isRealisationsVisible = computed(() => realisationsReveal.value !== 'hidden')

// anim leadership
const leadershipEl = useTemplateRef<HTMLElement>('leadershipEl')
const leadershipReveal = useScrollReveal(leadershipEl)
const isLeadershipVisible = computed(() => leadershipReveal.value !== 'hidden')

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

/** Retournement au clic des deux grandes cartes 3D de la section Leadership
 *  (même mécanique que DigitalView.vue, cf. commentaire sur cette section). */
const isRRFlipped = ref(false)
const isLLFlipped = ref(false)

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
    headline: 'Rendre vos équipes autonomes',
    description:
      'Des parcours conçus autour de vos outils Data & IA, pour que vos équipes maîtrisent leurs plateformes au quotidien.',
    iconPath: 'M22 10 12 5 2 10l10 5 10-5Z M6 12v5c3 2 9 2 12 0v-5',
  },
  {
    name: 'Assistance tech',
    headline: 'Un expert à vos côtés',
    description:
      'Un accompagnement réactif pour débloquer vos projets, fiabiliser vos plateformes et sécuriser vos mises en production.',
    iconPath:
      'M4 14v-2a8 8 0 0 1 16 0v2 M4 14h3v5H5a1 1 0 0 1-1-1v-4Z M20 14h-3v5h2a1 1 0 0 0 1-1v-4Z',
    featured: true,
  },
  {
    name: 'Centre de service',
    headline: 'Vos plateformes data, pilotées dans la durée',
    description:
      'Maintenance, évolutions et supervision de vos solutions, pour un patrimoine data fiable et aligné sur vos usages.',
    iconPath: 'M4 5h16v5H4Z M4 14h16v5H4Z M8 7.5h.01 M8 16.5h.01',
  },
]

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
  {
    name: 'Réf 3',
    description: 'Description courte du projet mené pour ce secteur, sur deux lignes maximum.',
    bgColor: 'bg-[#000066]',
  },
  {
    name: 'Réf 4',
    description: 'Description courte du projet mené pour ce client, sur deux lignes maximum.',
    bgColor: 'bg-[#000066]',
  },
]

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
          BU Data & IA
        </h1>
        <p
          class="hero-lede mx-auto mt-6 max-w-3xl animate-fade-up text-base font-semibold leading-relaxed text-[#12D80A] motion-reduce:animate-none sm:text-xl xl:text-2xl [animation-delay:200ms]"
        >
          Plus qu'une ESN, nous sommes un collectif de haut niveau. Transparence totale, chiffres
          assumés, et une force de frappe technologique pour déployer vos solutions Data & IA.
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
            <p class="font-display font-bold text-white mb-4 sm:mb-6">Partenaires stratégiques</p>
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
               hauteurs mobiles compactes (568–630px), 4 logos + le titre ne
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
        <p class="text-sm font-bold uppercase tracking-widest text-accent-500 md:text-base">
          Notre offre
        </p>
        <h2
          class="mt-2 font-display text-5xl font-black tracking-tight text-[#000066] md:text-6xl xl:text-7xl"
        >
          Expertise
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
              {{ offer.headline }}
            </h3>
            <p class="expertise-desc mt-3 text-sm leading-relaxed text-gray-600">
              {{ offer.description }}
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
            class="font-display text-4xl font-black text-white md:text-5xl xl:text-6xl"
            :class="
              isExecutionVisible
                ? 'translate-y-0 opacity-100 transition-all duration-700 ease-out'
                : 'translate-y-8 opacity-0'
            "
          >
            Au-delà du conseil, une force d'exécution.
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
              Expertise technique de pointe, consultants certifiés sur les outils de référence,
              pragmatisme assumé : nous testons et choisissons le bon outil pour chaque cas d'usage.
            </p>
            <p>
              Tout le potentiel de nos outils partenaires réside dans leur paramétrage spécifique et
              leur interconnexion avec vos outils existants. Au plus près de vos équipes, nos
              ingénieurs calibrent la solution à votre métier, vos données et votre environnement.
            </p>
            <p>
              Grâce à nos partenariats officiels, vous bénéficiez en continu des dernières
              innovations et d'un accès premium aux éditeurs.
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

    <!-- SECTION 4 (Cas d'usage) galerie (portfolio immersif, image + overlay). -->
    <section
      id="realisations"
      ref="realisationsEl"
      data-theme="light"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-white flex flex-col justify-center py-20"
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
        <h2 class="font-display text-4xl font-extrabold text-[#000066] sm:text-5xl">
          Nos références
        </h2>
        <p class="mx-auto mt-4 max-w-2xl text-gray-600">
          Un aperçu des projets menés aux côtés de nos clients, tous secteurs confondus.
        </p>
      </div>

      <div
        class="mx-auto mt-10 grid w-full max-w-6xl grid-cols-1 gap-6 px-4 md:grid-cols-2 lg:gap-8"
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

    <!-- SECTION 5 (Leadership) présentation équipe, cartes 3D massives reprises
         à l'identique de DigitalView.vue (section « equipe ») : mêmes classes
         de perspective/transform/transition, mêmes paliers responsive. -->
    <section
      id="leadership"
      ref="leadershipEl"
      data-theme="dark"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden flex flex-col bg-[#000066] px-4 pt-36 [@media(max-height:850px)]:pt-16 pb-8 sm:px-6 lg:px-8 xl:px-12"
    >
      <!-- degrade fond, effet deep ambient -->
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-primary-700/40 to-transparent"
      />

      <!-- en tete, fondu vers le haut -->
      <header
        class="max-w-5xl px-4 md:px-24 2xl:px-28"
        :class="
          isLeadershipVisible
            ? 'translate-y-0 opacity-100 transition-all duration-700 ease-out'
            : 'translate-y-8 opacity-0'
        "
      >
        <h2
          class="mt-4 [@media(max-height:850px)]:mt-2 font-display text-display min-[1030px]:whitespace-nowrap text-white"
        >
          Nos BUs, Expertes de vos besoins.
        </h2>
        <p
          class="mt-4 min-[1030px]:whitespace-nowrap text-sm md:text-base min-[1030px]:text-lg leading-relaxed text-white/80"
        >
          Une organisation interne adaptée au marché pour une réponse sur-mesure à nos clients
        </p>
      </header>

      <!-- `accent-500` (pas `accent-700`) : sur fond sombre, c'est la variante
           WCAG-safe du vert (9,1:1, cf. règle de contraste de main.css)
           `accent-700` est la variante pour fond clair, devenue terne sur ce
           bleu marine. -->
      <div
        class="flex w-full justify-center items-end mt-8 mb-8 px-4 md:px-24 2xl:px-28 max-[459px]:hidden"
      >
        <h3 class="font-display font-bold text-3xl md:text-4xl text-accent-500 text-center">
          Data & IA
        </h3>
      </div>

      <div
        class="relative flex w-full flex-1 items-stretch max-[984px]:justify-center min-[985px]:justify-between gap-4 min-[985px]:gap-8 px-4 md:px-24 2xl:px-28 max-[459px]:hidden"
      >
        <!-- Combattant gauche : Robin Rins -->
        <div
          class="flex w-auto shrink-0 flex-col items-center justify-center min-[630px]:max-[984px]:-translate-x-16"
        >
          <div class="mb-4 max-w-32 text-center min-[985px]:hidden">
            <p class="text-sm font-bold text-white">Robin Rins</p>
            <p class="text-[11px] font-medium text-white/70">Directeur BU Data & IA</p>
            <p class="mt-1 min-h-[72px] text-xs italic leading-snug text-white/70">
              <span class="block">[Citation à venir]</span>
            </p>
          </div>
          <div class="flex flex-col items-center">
            <div
              class="w-32 h-48 min-[985px]:w-48 min-[985px]:h-72 2xl:w-[320px] 2xl:h-[480px] [perspective:1000px] transform-gpu border-0 ring-0 outline-none cursor-pointer"
              role="button"
              tabindex="0"
              aria-label="Retourner la carte de Robin Rins"
              @click="isRRFlipped = !isRRFlipped"
              @keydown.enter="isRRFlipped = !isRRFlipped"
              @keydown.space.prevent="isRRFlipped = !isRRFlipped"
            >
              <div
                class="relative w-full h-full [transform-style:preserve-3d] rounded-2xl shadow-[-40px_20px_50px_-15px_rgba(0,0,50,0.4)] will-change-transform transition-transform duration-700 ease-in-out border-0 ring-0 outline-none"
                :class="isRRFlipped ? '[transform:rotateY(195deg)]' : '[transform:rotateY(15deg)]'"
              >
                <!-- Face avant -->
                <div
                  class="absolute inset-0 h-full w-full backface-hidden antialiased translate-z-[1px] bg-white rounded-2xl flex items-center justify-center overflow-hidden border-0 border-transparent"
                >
                  <span
                    class="font-display text-3xl min-[985px]:text-5xl 2xl:text-7xl font-extrabold text-[#000066]/10 border-0 border-transparent"
                    >RR</span
                  >
                </div>
                <!-- Face arrière basique, prête à accueillir du contenu plus tard. -->
                <div
                  class="absolute inset-0 h-full w-full [transform:rotateY(180deg)] backface-hidden antialiased bg-white border border-gray-200 rounded-2xl overflow-hidden"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Citations centrales permanentes, en diagonale franche. -->
        <div class="hidden min-[985px]:flex flex-1 items-center px-4">
          <div class="relative w-full h-48 min-[985px]:h-72 2xl:h-[480px]">
            <div class="-mt-2 absolute inset-x-0 top-0 w-full px-4 text-left">
              <p class="text-base 2xl:text-2xl font-bold text-white mb-1">Robin Rins</p>
              <p class="text-sm font-medium text-white/70 mb-2">Directeur BU Data & IA</p>
              <p
                class="min-h-[100px] 2xl:min-h-[120px] w-full max-w-full overflow-hidden text-xs 2xl:text-lg italic text-white/70 leading-relaxed"
              >
                <span class="block whitespace-normal break-words">[Citation à venir]</span>
              </p>
            </div>
            <div class="-mb-2 absolute inset-x-0 bottom-0 w-full px-4 text-right">
              <p class="text-base 2xl:text-2xl font-bold text-white mb-1">Lena Lebecq</p>
              <p class="text-sm font-medium text-white/70 mb-2">Responsable RH</p>
              <p
                class="min-h-[100px] 2xl:min-h-[120px] w-full max-w-full overflow-hidden text-xs 2xl:text-lg italic text-white/70 leading-relaxed"
              >
                <span class="block whitespace-normal break-words">[Citation à venir]</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Combattant droit : Lena Lebecq -->
        <div
          class="flex w-auto shrink-0 flex-col items-center justify-center min-[630px]:max-[984px]:translate-x-16"
        >
          <div class="flex flex-col items-center">
            <div
              class="w-32 h-48 min-[985px]:w-48 min-[985px]:h-72 2xl:w-[320px] 2xl:h-[480px] [perspective:1000px] transform-gpu border-0 ring-0 outline-none cursor-pointer"
              role="button"
              tabindex="0"
              aria-label="Retourner la carte de Lena Lebecq"
              @click="isLLFlipped = !isLLFlipped"
              @keydown.enter="isLLFlipped = !isLLFlipped"
              @keydown.space.prevent="isLLFlipped = !isLLFlipped"
            >
              <div
                class="relative w-full h-full [transform-style:preserve-3d] rounded-2xl shadow-[40px_20px_50px_-15px_rgba(0,0,50,0.4)] will-change-transform transition-transform duration-700 ease-in-out border-0 ring-0 outline-none"
                :class="
                  isLLFlipped ? '[transform:rotateY(-195deg)]' : '[transform:rotateY(-15deg)]'
                "
              >
                <!-- Face avant -->
                <div
                  class="absolute inset-0 h-full w-full backface-hidden antialiased translate-z-[1px] bg-white rounded-2xl flex items-center justify-center overflow-hidden border-0 border-transparent"
                >
                  <span
                    class="font-display text-3xl min-[985px]:text-5xl 2xl:text-7xl font-extrabold text-[#000066]/10 border-0 border-transparent"
                    >LL</span
                  >
                </div>
                <!-- Face arrière basique, prête à accueillir du contenu plus tard. -->
                <div
                  class="absolute inset-0 h-full w-full [transform:rotateY(180deg)] backface-hidden antialiased bg-white border border-gray-200 rounded-2xl overflow-hidden"
                />
              </div>
            </div>
          </div>
          <div class="mt-4 max-w-32 text-center min-[985px]:hidden">
            <p class="text-sm font-bold text-white">Lena Lebecq</p>
            <p class="text-[11px] font-medium text-white/70">Responsable RH</p>
            <p class="mt-1 min-h-[72px] text-xs italic leading-snug text-white/70">
              <span class="block">[Citation à venir]</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Sous 460px, l'arène à deux cartes ne tient plus : les deux profils
           sont empilés statiquement. -->
      <div
        class="hidden max-[459px]:flex w-full flex-1 flex-col items-center justify-center gap-10 px-4"
      >
        <div class="flex flex-col items-center">
          <div
            class="flex h-[clamp(200px,40dvh,350px)] w-52 shrink min-h-0 items-center justify-center overflow-hidden rounded-2xl bg-white [@media(max-height:690px)]:max-h-[25dvh]"
          >
            <span class="font-display text-6xl font-extrabold text-[#000066]/10">RR</span>
          </div>
          <div
            class="mt-4 [@media(max-height:690px)]:mt-2 min-h-[160px] w-full max-w-[18rem] flex flex-col justify-start text-center"
          >
            <p class="text-xl font-bold text-white">Robin Rins</p>
            <p class="text-sm font-medium text-white/70">Directeur BU Data & IA</p>
            <p
              class="mt-1 text-base italic leading-snug text-white/70 [@media(max-height:690px)]:text-sm [@media(max-height:690px)]:leading-tight"
            >
              <span class="block">[Citation à venir]</span>
            </p>
          </div>
        </div>
        <div class="flex flex-col items-center">
          <div
            class="flex h-[clamp(200px,40dvh,350px)] w-52 shrink min-h-0 items-center justify-center overflow-hidden rounded-2xl bg-white [@media(max-height:690px)]:max-h-[25dvh]"
          >
            <span class="font-display text-6xl font-extrabold text-[#000066]/10">LL</span>
          </div>
          <div
            class="mt-4 [@media(max-height:690px)]:mt-2 min-h-[160px] w-full max-w-[18rem] flex flex-col justify-start text-center"
          >
            <p class="text-xl font-bold text-white">Lena Lebecq</p>
            <p class="text-sm font-medium text-white/70">Responsable RH</p>
            <p
              class="mt-1 text-base italic leading-snug text-white/70 [@media(max-height:690px)]:text-sm [@media(max-height:690px)]:leading-tight"
            >
              <span class="block">[Citation à venir]</span>
            </p>
          </div>
        </div>
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
    <section
      id="temoignage"
      ref="temoignageEl"
      data-theme="light"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-white grid grid-cols-1 lg:grid-cols-2"
    >
      <!-- Colonne gauche : témoignage (texte), à la place de la photo dans l'original -->
      <div class="flex flex-col justify-center px-8 py-12 lg:px-24">
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
        class="flex items-center justify-center px-8 py-12 lg:px-24"
        :class="
          isTemoignageVisible
            ? 'translate-x-0 opacity-100 transition-all duration-700 ease-out'
            : 'translate-x-8 opacity-0'
        "
      >
        <div class="relative aspect-square w-full max-w-md">
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
    <section
      id="parlons-ia"
      ref="parlonsIaEl"
      data-theme="dark"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-[#000066] flex flex-col justify-center py-20"
    >
      <!-- halo central derriere la grille de cartes -->
      <div
        aria-hidden="true"
        class="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[80%] w-[90%] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-[4rem] bg-primary-500/30 blur-[80px]"
      />

      <div class="mx-auto w-full max-w-[1400px] px-6">
        <div class="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          <!-- glisse depuis la gauche -->
          <div
            :class="
              isParlonsIaVisible
                ? 'translate-x-0 opacity-100 transition-all duration-700 ease-out'
                : '-translate-x-8 opacity-0'
            "
          >
            <p class="font-bold tracking-widest text-accent-500 uppercase">Parlons IA</p>
            <h2 class="mt-2 font-display text-4xl font-black text-white md:text-6xl">
              Vos projets, accélérés par l'intelligence artificielle.
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
            <p class="text-lg leading-relaxed text-white">
              Des agents conversationnels à l'automatisation des tâches répétitives, les
              possibilités qu'ouvre l'IA pour transformer vos processus sont quasi infinies à
              condition de les cadrer avec les bons experts.
            </p>
          </div>
        </div>

        <!-- cascade cartes, delai manuel (pas de v-for ici) -->
        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div
            class="rounded-[2rem] border-2 border-accent-500 bg-white p-8 md:p-10"
            :class="
              isParlonsIaVisible
                ? 'translate-y-0 opacity-100 transition-all duration-700 ease-out'
                : 'translate-y-8 opacity-0 transition-none'
            "
          >
            <div
              class="flex size-14 items-center justify-center rounded-2xl bg-accent-500"
              aria-hidden="true"
            >
              <svg class="size-6 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.95-6.95-1.414 1.414M7.464 16.536l-1.414 1.414m0-11.314 1.414 1.414m9.072 9.072 1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8Z"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <p class="mt-8 font-display text-xl font-bold text-[#000066] md:text-2xl">
              Création d'agents
            </p>
            <p class="mt-4 leading-relaxed text-gray-800">
              Conception d'assistants sur mesure, connectés à vos données et à vos outils métier,
              pour automatiser les tâches à faible valeur ajoutée.
            </p>
          </div>

          <div
            class="rounded-[2rem] border-2 border-accent-500 bg-white p-8 md:p-10 delay-150"
            :class="
              isParlonsIaVisible
                ? 'translate-y-0 opacity-100 transition-all duration-700 ease-out'
                : 'translate-y-8 opacity-0 transition-none'
            "
          >
            <div
              class="flex size-14 items-center justify-center rounded-2xl bg-accent-500"
              aria-hidden="true"
            >
              <svg class="size-6 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M17 2.1l4 4-4 4M3 12.6v-2a4 4 0 014-4h14M7 21.9l-4-4 4-4M21 11.4v2a4 4 0 01-4 4H3"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <p class="mt-8 font-display text-xl font-bold text-[#000066] md:text-2xl">
              Amélioration continue
            </p>
            <p class="mt-4 leading-relaxed text-gray-800">
              Suivi, évaluation et optimisation des solutions déployées pour qu'elles gagnent en
              pertinence au fil des usages réels.
            </p>
          </div>

          <!-- Troisième carte : contenu générique ajouté pour compléter la
               grille à 3 colonnes de la maquette (les 2 premières reprennent
               le contenu déjà existant). -->
          <div
            class="rounded-[2rem] border-2 border-accent-500 bg-white p-8 md:p-10 delay-300"
            :class="
              isParlonsIaVisible
                ? 'translate-y-0 opacity-100 transition-all duration-700 ease-out'
                : 'translate-y-8 opacity-0 transition-none'
            "
          >
            <div
              class="flex size-14 items-center justify-center rounded-2xl bg-accent-500"
              aria-hidden="true"
            >
              <svg class="size-6 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 14l9-5-9-5-9 5 9 5Zm0 0v7m-9-5.5V16a9 3 0 0018 0v-4.5"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <p class="mt-8 font-display text-xl font-bold text-[#000066] md:text-2xl">
              Formation &amp; adoption
            </p>
            <p class="mt-4 leading-relaxed text-gray-800">
              Montée en compétences de vos équipes pour qu'elles s'approprient durablement les
              nouveaux outils et usages IA au quotidien.
            </p>
          </div>
        </div>

        <div class="mt-12 flex justify-center">
          <RouterLink
            to="/contact-entreprise"
            class="rounded-full bg-[#12D80A] px-8 py-4 font-bold text-white transition-colors hover:bg-accent-400"
          >
            Contacter nos experts
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- section offres, fond blanc -->
    <section
      id="offres"
      ref="jobsEl"
      data-theme="light"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-white flex flex-col justify-center px-8 py-24 text-center md:py-32 lg:px-24"
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
          class="mt-2 mb-6 font-display text-5xl font-black text-[#000066] md:text-6xl xl:text-7xl"
        >
          Façonnez l'avenir de l'intelligence artificielle
        </h2>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-gray-600 md:text-xl">
          Envie de concevoir des modèles innovants et de valoriser la donnée au cœur de nos projets
          ? Découvrez nos opportunités.
        </p>
      </div>

      <!-- grille des cartes, cascade -->
      <div
        class="mx-auto mt-10 grid w-full max-w-[1400px] grid-cols-1 gap-8 md:grid-cols-3 md:gap-12"
      >
        <div
          v-for="(job, index) in dataJobs"
          :key="index"
          class="relative flex min-h-[350px] cursor-pointer flex-col justify-between rounded-[2rem] border border-gray-100 bg-white p-10 text-left shadow-2xl md:min-h-[400px] md:p-12"
          :style="{ transitionDelay: isJobsVisible ? `${index * 150}ms` : '0ms' }"
          :class="
            isJobsVisible
              ? 'translate-y-0 opacity-100 transition-all duration-700 ease-out'
              : 'translate-y-8 opacity-0 transition-none'
          "
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

          <!-- fleche qui redirige vers la fiche complete, stop du clic de la carte -->
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
   plus bas (568–630px de hauteur, en dessous de 767px de largeur). Partout
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
   dont la plage ne couvre pas entièrement 568–830px) pour que `height: auto`
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
   650px`) : 745–830px garde le plancher 210px, 568–744px descend à 180px
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

/* Palier dédié à la symétrie carrousel photo / carte partenaires (568–630px) :
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

/* sm–md (640–767px) : les 2 cartes sont côte à côte sur UNE ligne le
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
   168–210px de plancher des paliers précédents restent trop grands une
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
