<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import { useSeo } from '@/composables/useSeo'
import { scrollRevealClass, useScrollReveal } from '@/composables/useScrollReveal'

useSeo({
  title: 'Adeo - Référence client ESN à Wasquehal',
  description:
    "Découvrez comment Faceel-IT, ESN à Wasquehal, dans la métropole lilloise, a accompagné Adeo dans la transformation de ses plateformes digitales : IA et automatisation des flux de données RH.",
})

const heroTextEl = useTemplateRef<HTMLElement>('heroTextEl')
const heroTextReveal = useScrollReveal(heroTextEl)

const heroLogoEl = useTemplateRef<HTMLElement>('heroLogoEl')
const heroLogoReveal = useScrollReveal(heroLogoEl)

const dataTextEl = useTemplateRef<HTMLElement>('dataTextEl')
const dataTextReveal = useScrollReveal(dataTextEl)

const dataImagesEl = useTemplateRef<HTMLElement>('dataImagesEl')
const dataImagesReveal = useScrollReveal(dataImagesEl)

// scinde section 2 : second bloc mobile avec para2 et photos
const data2bTextEl = useTemplateRef<HTMLElement>('data2bTextEl')
const data2bTextReveal = useScrollReveal(data2bTextEl)

const accessImageEl = useTemplateRef<HTMLElement>('accessImageEl')
const accessImageReveal = useScrollReveal(accessImageEl)

const accessTextEl = useTemplateRef<HTMLElement>('accessTextEl')
const accessTextReveal = useScrollReveal(accessTextEl)

// scinde section 3 : second bloc mobile avec para2 et para3
const access3bTextEl = useTemplateRef<HTMLElement>('access3bTextEl')
const access3bTextReveal = useScrollReveal(access3bTextEl)

const resultsTextEl = useTemplateRef<HTMLElement>('resultsTextEl')
const resultsTextReveal = useScrollReveal(resultsTextEl)

const resultsVisualEl = useTemplateRef<HTMLElement>('resultsVisualEl')
const resultsVisualReveal = useScrollReveal(resultsVisualEl)

// scinde section 4 : second bloc mobile avec para final et image
const results4bEl = useTemplateRef<HTMLElement>('results4bEl')
const results4bReveal = useScrollReveal(results4bEl)

const techs1HeaderEl = useTemplateRef<HTMLElement>('techs1HeaderEl')
const techs1HeaderReveal = useScrollReveal(techs1HeaderEl)

const techs1GridEl = useTemplateRef<HTMLElement>('techs1GridEl')
const techs1GridReveal = useScrollReveal(techs1GridEl)

const techs2HeaderEl = useTemplateRef<HTMLElement>('techs2HeaderEl')
const techs2HeaderReveal = useScrollReveal(techs2HeaderEl)

const techs2GridEl = useTemplateRef<HTMLElement>('techs2GridEl')
const techs2GridReveal = useScrollReveal(techs2GridEl)

// carrousel techno adeo : affichage 1 techno mobile, grille statique sur bureau
interface TechItem {
  icon: string
  title: string
  description: string
}

const TECHS_1: TechItem[] = [
  {
    icon: '/images/partners/adeo/techs/nest_js.png',
    title: 'NestJS',
    description:
      "Permet de structurer la logique métier dans un backend robuste, modulaire et performant, tout en facilitant la maintenance et l'évolution des applications.",
  },
  {
    icon: '/images/partners/adeo/techs/postgre_sql.png',
    title: 'PostgreSQL',
    description:
      "Garantit l'intégrité des données et des performances stables, même sur des systèmes complexes et exigeants.",
  },
  {
    icon: '/images/partners/adeo/techs/prisma.png',
    title: 'Prisma.io',
    description:
      'Permet de gagner en productivité en simplifiant les requêtes et la gestion des modèles de données au sein des applications.',
  },
]

const TECHS_2: TechItem[] = [
  {
    icon: '/images/partners/adeo/techs/vue_js.png',
    title: 'Vue.JS',
    description:
      'Permet de créer des interfaces utilisateur dynamiques et réactives, tout en garantissant une expérience fluide et performante.',
  },
  {
    icon: '/images/partners/adeo/techs/Vuetify.png',
    title: 'Vuetify',
    description:
      "Accélère le développement d'interfaces cohérente tout en garantissant une expérience utilisateur fluide.",
  },
  {
    icon: '/images/partners/adeo/techs/google_cloud_platform.png',
    title: 'Google Cloud Platform',
    description:
      "Propulse une infrastructure Cloud agile et sécurisée, capable de scaler vos applications et d'intégrer des outils d'IA avancés.",
  },
]

const activeTechIndex1 = ref(0)
const activeTech1 = computed(() => TECHS_1[activeTechIndex1.value]!)
function prevTech1() {
  activeTechIndex1.value = (activeTechIndex1.value - 1 + TECHS_1.length) % TECHS_1.length
}
function nextTech1() {
  activeTechIndex1.value = (activeTechIndex1.value + 1) % TECHS_1.length
}

const activeTechIndex2 = ref(0)
const activeTech2 = computed(() => TECHS_2[activeTechIndex2.value]!)
function prevTech2() {
  activeTechIndex2.value = (activeTechIndex2.value - 1 + TECHS_2.length) % TECHS_2.length
}
function nextTech2() {
  activeTechIndex2.value = (activeTechIndex2.value + 1) % TECHS_2.length
}
</script>

<template>
  <div
    class="h-screen w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth bg-primary-950"
  >
    <!-- Section Hero - data-theme="light" force la navbar en surface claire
         (texte sombre) sur tout le bloc teal, jusqu'au footer (data-theme
         "dark" plus bas) qui la bascule en sombre - mécanisme déjà générique
         de MegaMenu.vue, aucun état custom à ajouter ici.
         snap-always volontairement absent (seulement ici) : snap-start
         conserve ce point d'ancrage valide (cf. CLAUDE.md "Full Page Snap
         Scroll") sans forcer un snap plein écran au moindre tick de molette. -->
    <section
      data-theme="light"
      class="relative min-h-screen w-full snap-start flex items-center bg-[#059dab]"
    >
      <!-- bandeau uniquement home : retire ici, reserve a HomeView.vue -->
      <div
        class="relative z-10 w-full max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-12 px-4 sm:px-6 lg:px-24 xl:px-32"
      >
        <!-- Colonne gauche : textes -->
        <div
          ref="heroTextEl"
          class="flex flex-col items-start text-left lg:col-span-7"
          :class="scrollRevealClass(heroTextReveal)"
        >
          <!-- texte noir wcag : primary-950 restait a 3.09, noir pur passe 6.3:1 -->
          <h1 class="text-6xl lg:text-8xl font-bold text-black mb-6">
            Adeo<span class="sr-only"> - référence client de notre ESN à Wasquehal</span>
          </h1>
          <p class="text-lg lg:text-xl text-black w-full">
            Déploiement de solutions IA et automatisation des flux de données RH pour garantir une
            vision globale et fiable des applications internes.
          </p>
        </div>

        <!-- Colonne droite : logo en cercle -->
        <div
          ref="heroLogoEl"
          class="w-72 h-72 lg:w-[400px] lg:h-[400px] bg-white rounded-full flex items-center justify-center ml-auto mr-0 justify-self-end shadow-xl lg:col-span-5"
          :class="scrollRevealClass(heroLogoReveal)"
        >
          <img src="/images/references/adeo.svg" alt="Logo Adeo" class="w-3/5 object-contain" />
        </div>
      </div>
    </section>

    <!-- Section 2 : Mieux gérer la donnée -->
    <!-- scinde section 2 -->
    <section
      data-theme="light"
      class="relative min-h-dvh w-full snap-start snap-always flex items-center bg-white py-12 pt-24 lg:py-24 lg:pt-24"
    >
      <div
        class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 max-w-[1700px] mx-auto px-6 lg:px-24 xl:px-32 items-center"
      >
        <!-- Colonne gauche : textes -->
        <div
          ref="dataTextEl"
          class="justify-self-start lg:-translate-x-12"
          :class="scrollRevealClass(dataTextReveal)"
        >
          <h2 class="text-[#059dab] text-4xl lg:text-5xl font-bold mb-8">Mieux gérer la donnée</h2>
          <p class="text-base lg:text-lg text-primary-900/80 leading-relaxed">
            Dans le cadre d'un projet data, Adeo avait besoin de renforcer son équipe en charge de
            la gestion des données internes. L'objectif était double&nbsp;: fiabiliser les flux de
            données et améliorer leur exploitation pour le service RH de l'entreprise.
          </p>
          <p class="hidden lg:block mt-6 text-base lg:text-lg text-primary-900/80 leading-relaxed">
            C'est dans ce contexte que nos collaborateurs, <strong>Clément</strong>,
            <strong>Lauriane</strong> et <strong>Alexandre</strong>, sont intervenus pour venir
            renforcer une équipe déjà en place, avec une forte dimension opérationnelle et métier.
            Ils ont rapidement dû s'intégrer à l'environnement du client, à ses outils et à ses
            contraintes, notamment autour de <strong>Workday</strong>, qui centralisait une grande
            partie des données.
          </p>
        </div>

        <!-- composition de photos masquee sur mobile, repasse dans la section suivante -->
        <div ref="dataImagesEl" class="hidden lg:block relative w-full h-[500px] lg:h-[600px]">
          <!-- Fond décoratif -->
          <div
            aria-hidden="true"
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-3/4 bg-[#059dab] rounded-2xl z-0"
          />

          <img
            src="/images/partners/adeo/team/gg.png"
            alt="Collaborateur Faceel-IT sur le projet Adeo"
            class="absolute top-0 left-0 z-10 w-5/12 rounded-2xl shadow-xl animate-float motion-reduce:animate-none"
            :class="scrollRevealClass(dataImagesReveal, 'up', { delayClass: 'delay-100' })"
          />
          <img
            src="/images/partners/adeo/team/clement.png"
            alt="Clément, collaborateur Faceel-IT sur le projet Adeo"
            class="absolute top-1/4 right-0 z-10 w-5/12 rounded-2xl shadow-xl animate-float motion-reduce:animate-none"
            :class="scrollRevealClass(dataImagesReveal, 'up', { delayClass: 'delay-300' })"
          />
          <img
            src="/images/partners/adeo/team/lauriane.png"
            alt="Lauriane, collaboratrice Faceel-IT sur le projet Adeo"
            class="absolute bottom-0 left-12 z-10 w-5/12 rounded-2xl shadow-xl animate-float motion-reduce:animate-none"
            :class="scrollRevealClass(dataImagesReveal, 'up', { delayClass: 'delay-500' })"
          />
        </div>
      </div>
    </section>

    <!-- 2bis. Section mobile uniquement : suite donnee, meme fond blanc -->
    <section
      data-theme="light"
      class="lg:hidden relative min-h-dvh w-full snap-start snap-always flex items-center bg-white pt-24 pb-12"
    >
      <div
        ref="data2bTextEl"
        class="relative z-10 w-full px-6 flex flex-col items-start text-left gap-8"
      >
        <p
          class="text-base text-primary-900/80 leading-relaxed"
          :class="scrollRevealClass(data2bTextReveal)"
        >
          C'est dans ce contexte que nos collaborateurs, <strong>Clément</strong>,
          <strong>Lauriane</strong> et <strong>Alexandre</strong>, sont intervenus pour venir
          renforcer une équipe déjà en place, avec une forte dimension opérationnelle et métier.
          Ils ont rapidement dû s'intégrer à l'environnement du client, à ses outils et à ses
          contraintes, notamment autour de <strong>Workday</strong>, qui centralisait une grande
          partie des données.
        </p>

        <!-- photos bridees pour ne pas deborder -->
        <div
          class="relative w-full h-[320px]"
          :class="scrollRevealClass(data2bTextReveal, 'up', { delayClass: 'delay-150' })"
        >
          <div
            aria-hidden="true"
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-3/4 bg-[#059dab] rounded-2xl z-0"
          />

          <img
            src="/images/partners/adeo/team/gg.png"
            alt="Collaborateur Faceel-IT sur le projet Adeo"
            class="absolute top-0 left-0 z-10 w-5/12 max-h-[40vh] object-cover rounded-2xl shadow-xl animate-float motion-reduce:animate-none"
          />
          <img
            src="/images/partners/adeo/team/clement.png"
            alt="Clément, collaborateur Faceel-IT sur le projet Adeo"
            class="absolute top-1/4 right-0 z-10 w-5/12 max-h-[40vh] object-cover rounded-2xl shadow-xl animate-float motion-reduce:animate-none"
          />
          <img
            src="/images/partners/adeo/team/lauriane.png"
            alt="Lauriane, collaboratrice Faceel-IT sur le projet Adeo"
            class="absolute bottom-0 left-12 z-10 w-5/12 max-h-[40vh] object-cover rounded-2xl shadow-xl animate-float motion-reduce:animate-none"
          />
        </div>
      </div>
    </section>

    <!-- Section 3 : Accélérer l'accès à la donnée -->
    <!-- scinde section 3 -->
    <section
      data-theme="light"
      class="relative min-h-dvh w-full snap-start snap-always flex items-center bg-[#059dab] py-12 pt-24 lg:py-24 lg:pt-24"
    >
      <div
        class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 max-w-[1700px] mx-auto px-6 lg:px-24 xl:px-32 items-center"
      >
        <!-- Colonne gauche : image avec cadre décalé -->
        <div
          ref="accessImageEl"
          class="relative w-full max-w-lg lg:ml-0 lg:mr-auto justify-self-start"
          :class="scrollRevealClass(accessImageReveal, 'right')"
        >
          <div
            aria-hidden="true"
            class="absolute -bottom-8 -left-8 w-full h-full bg-white rounded-2xl z-0"
          />
          <!-- fix image top -->
          <img
            src="/images/partners/adeo/tt.png"
            alt="Équipe au travail"
            class="relative z-10 w-full max-h-[30vh] object-cover rounded-2xl shadow-xl animate-float motion-reduce:animate-none lg:max-h-none"
          />
        </div>

        <!-- Colonne droite : textes -->
        <div
          ref="accessTextEl"
          class="mx-auto justify-self-center"
          :class="scrollRevealClass(accessTextReveal, 'left', { delayClass: 'delay-200' })"
        >
          <h2 class="text-white text-4xl lg:text-5xl font-bold mb-8">
            Accélérer l'accès à la donnée
          </h2>
          <p class="text-white/90 text-lg leading-relaxed">
            Dès leur arrivée, <strong>Clément</strong> et <strong>Lauriane</strong> ont commencé par
            prendre en main l'écosystème data du client, notamment les flux issus de
            <strong>Workday</strong>. Cette phase d'onboarding leur a permis de comprendre les
            usages internes et les attentes des différents services.
          </p>
          <p class="hidden lg:block mt-6 text-white/90 text-lg leading-relaxed">
            Ils ont ensuite conçu un <strong>Dashboard</strong> global dédié à la qualité des
            données, offrant une vision transversale des applications internes. En intégrant des
            processus d'automatisation, ils ont également géré les flux <strong>CSV</strong> pour
            permettre de comparer et gérer les données RH.
          </p>
          <p class="hidden lg:block mt-6 text-white/90 text-lg leading-relaxed">
            Enfin, ils ont pris part au <strong>RUN</strong> quotidien, garantissant la stabilité
            des outils et la continuité de service, tout en restant en lien constant avec les
            équipes internes.
          </p>
        </div>
      </div>
    </section>

    <!-- 3bis. Section mobile uniquement : suite acceleration, meme fond couleur -->
    <section
      data-theme="light"
      class="lg:hidden relative min-h-dvh w-full snap-start snap-always flex items-center bg-[#059dab] pt-24 pb-12"
    >
      <div
        ref="access3bTextEl"
        class="relative z-10 w-full px-6 flex flex-col items-start text-left gap-6"
      >
        <p
          class="text-white/90 text-lg leading-relaxed"
          :class="scrollRevealClass(access3bTextReveal)"
        >
          Ils ont ensuite conçu un <strong>Dashboard</strong> global dédié à la qualité des
          données, offrant une vision transversale des applications internes. En intégrant des
          processus d'automatisation, ils ont également géré les flux <strong>CSV</strong> pour
          permettre de comparer et gérer les données RH.
        </p>
        <p
          class="text-white/90 text-lg leading-relaxed"
          :class="scrollRevealClass(access3bTextReveal, 'up', { delayClass: 'delay-150' })"
        >
          Enfin, ils ont pris part au <strong>RUN</strong> quotidien, garantissant la stabilité des
          outils et la continuité de service, tout en restant en lien constant avec les équipes
          internes.
        </p>
      </div>
    </section>

    <!-- Section 4 : Des résultats concrets -->
    <!-- scinde section 4 -->
    <section
      data-theme="light"
      class="relative min-h-dvh w-full snap-start snap-always flex items-center bg-white py-12 pt-24 lg:py-24 lg:pt-24"
    >
      <div
        class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 max-w-[1700px] mx-auto px-6 lg:px-24 xl:px-32 items-center"
      >
        <!-- Colonne gauche : textes -->
        <div ref="resultsTextEl" :class="scrollRevealClass(resultsTextReveal)">
          <h2 class="text-[#059dab] text-4xl lg:text-5xl font-bold mb-8">Des résultats concrets</h2>
          <p class="text-lg text-gray-800 mb-6">
            Grâce à leur intervention, le client a rapidement constaté&nbsp;:
          </p>
          <ul class="list-disc pl-6 space-y-3 text-lg text-gray-800 mb-8">
            <li>
              <strong>Des requêtes plus rapides et plus fiables, améliorant l'exploitation</strong>
              des données
            </li>
            <li>Des dashboards plus clairs et plus utiles pour les équipes internes</li>
            <li>
              Un gain de temps pour les services utilisateurs, grâce à des données mieux structurées
              et plus accessibles
            </li>
            <li>Une meilleure continuité opérationnelle grâce à une gestion efficace du RUN</li>
          </ul>
          <p class="hidden lg:block text-lg text-gray-800">
            Au final, cette mission
            <strong
              >a permis de renforcer la performance data du client tout en s'appuyant sur un contact
              humain fort, essentiel</strong
            >
            à la bonne compréhension des enjeux et des attentes. Un bel exemple de collaboration
            efficace entre nos équipes et celles du client dans un environnement retail exigeant.
          </p>
        </div>

        <!-- composition geometrique masquee sur mobile, repasse dans la section suivante -->
        <div
          ref="resultsVisualEl"
          class="hidden lg:block relative w-full max-w-md mx-auto lg:mr-0 lg:ml-auto"
          :class="scrollRevealClass(resultsVisualReveal, 'up', { delayClass: 'delay-200' })"
        >
          <div
            aria-hidden="true"
            class="absolute top-8 left-8 w-full h-full bg-[#059dab] rounded-2xl z-0"
          />
          <div
            class="relative z-10 bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-50 aspect-square flex items-center justify-center p-8 animate-float motion-reduce:animate-none"
          >
            <img src="/images/references/adeo.svg" alt="Logo Adeo" class="w-3/5 object-contain" />
          </div>
        </div>
      </div>
    </section>

    <!-- 4bis. Section mobile uniquement : suite resultats, meme fond blanc -->
    <section
      data-theme="light"
      class="lg:hidden relative min-h-dvh w-full snap-start snap-always flex items-center bg-white pt-24 pb-12"
    >
      <div
        ref="results4bEl"
        class="relative z-10 w-full px-6 flex flex-col items-center text-left gap-8"
      >
        <p class="text-lg text-gray-800" :class="scrollRevealClass(results4bReveal)">
          Au final, cette mission
          <strong
            >a permis de renforcer la performance data du client tout en s'appuyant sur un contact
            humain fort, essentiel</strong
          >
          à la bonne compréhension des enjeux et des attentes. Un bel exemple de collaboration
          efficace entre nos équipes et celles du client dans un environnement retail exigeant.
        </p>

        <!-- composition geometrique bridee pour ne pas deborder -->
        <div
          class="relative w-full max-w-[260px]"
          :class="scrollRevealClass(results4bReveal, 'up', { delayClass: 'delay-150' })"
        >
          <div
            aria-hidden="true"
            class="absolute top-8 left-8 w-full h-full bg-[#059dab] rounded-2xl z-0"
          />
          <div
            class="relative z-10 bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-50 aspect-square flex items-center justify-center p-8 animate-float motion-reduce:animate-none"
          >
            <img src="/images/references/adeo.svg" alt="Logo Adeo" class="w-3/5 object-contain" />
          </div>
        </div>
      </div>
    </section>

    <!-- Section Technos 1 : Backend & BDD -->
    <section
      data-theme="light"
      class="w-full min-h-screen flex flex-col justify-center snap-start snap-always bg-[#faf9f6] py-24"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <!-- En-tête de section -->
        <div
          ref="techs1HeaderEl"
          class="flex flex-col items-center mb-16 lg:mb-24"
          :class="scrollRevealClass(techs1HeaderReveal)"
        >
          <h2 class="font-display text-4xl lg:text-5xl font-medium text-[#0b0c10] mb-4 text-center">
            Les technos que nous avons utilisées
          </h2>
          <!-- Ligne verte de soulignement du titre -->
          <div class="w-48 h-1 bg-green-500"></div>
        </div>

        <!-- carrousel techno adeo -->
        <div class="md:hidden flex flex-col items-center">
          <Transition mode="out-in" name="fade">
            <div
              :key="activeTech1.title"
              class="flex min-h-[280px] w-full flex-col items-center text-center"
            >
              <img
                :src="activeTech1.icon"
                :alt="activeTech1.title"
                class="h-32 object-contain mb-8 drop-shadow-sm"
              />
              <h3 class="text-xl font-bold text-[#0b0c10] mb-2">{{ activeTech1.title }}</h3>
              <div class="w-12 h-[3px] bg-green-500 mb-4"></div>
              <p class="text-[16px] text-primary-950/80 leading-relaxed">
                {{ activeTech1.description }}
              </p>
            </div>
          </Transition>

          <!-- fleches navigation techno -->
          <div class="mt-8 flex items-center gap-6">
            <button
              type="button"
              aria-label="Techno précédente"
              class="inline-flex size-11 items-center justify-center rounded-full bg-primary-950/5 text-primary-950 transition-colors duration-200 hover:bg-primary-950/10 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary-950"
              @click="prevTech1"
            >
              <svg class="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="m12 15-5-5 5-5"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Techno suivante"
              class="inline-flex size-11 items-center justify-center rounded-full bg-primary-950/5 text-primary-950 transition-colors duration-200 hover:bg-primary-950/10 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary-950"
              @click="nextTech1"
            >
              <svg class="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="m8 5 5 5-5 5"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Grille des technologies : statique a partir de md -->
        <div
          ref="techs1GridEl"
          class="hidden md:grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[1400px] mx-auto px-6"
        >
          <!-- Item 1 : NestJS -->
          <div
            class="flex flex-col items-center text-center"
            :class="scrollRevealClass(techs1GridReveal, 'up', { delayClass: 'delay-100' })"
          >
            <img
              src="/images/partners/adeo/techs/nest_js.png"
              alt="NestJS"
              class="h-32 lg:h-44 object-contain mb-8 drop-shadow-sm"
            />
            <h3 class="text-xl lg:text-2xl font-bold text-[#0b0c10] mb-2">NestJS</h3>
            <div class="w-12 h-[3px] bg-green-500 mb-4"></div>
            <p class="text-[16px] lg:text-[17px] text-primary-950/80 leading-relaxed">
              Permet de structurer la logique métier dans un backend robuste, modulaire et
              performant, tout en facilitant la maintenance et l'évolution des applications.
            </p>
          </div>

          <!-- Item 2 : PostgreSQL -->
          <div
            class="flex flex-col items-center text-center"
            :class="scrollRevealClass(techs1GridReveal, 'up', { delayClass: 'delay-200' })"
          >
            <img
              src="/images/partners/adeo/techs/postgre_sql.png"
              alt="PostgreSQL"
              class="h-32 lg:h-44 object-contain mb-8 drop-shadow-sm"
            />
            <h3 class="text-xl lg:text-2xl font-bold text-[#0b0c10] mb-2">PostgreSQL</h3>
            <div class="w-12 h-[3px] bg-green-500 mb-4"></div>
            <p class="text-[16px] lg:text-[17px] text-primary-950/80 leading-relaxed">
              Garantit l'intégrité des données et des performances stables, même sur des systèmes
              complexes et exigeants.
            </p>
          </div>

          <!-- Item 3 : Prisma -->
          <div
            class="flex flex-col items-center text-center"
            :class="scrollRevealClass(techs1GridReveal, 'up', { delayClass: 'delay-300' })"
          >
            <img
              src="/images/partners/adeo/techs/prisma.png"
              alt="Prisma"
              class="h-32 lg:h-44 object-contain mb-8 drop-shadow-sm"
            />
            <h3 class="text-xl lg:text-2xl font-bold text-[#0b0c10] mb-2">Prisma.io</h3>
            <div class="w-12 h-[3px] bg-green-500 mb-4"></div>
            <p class="text-[16px] lg:text-[17px] text-primary-950/80 leading-relaxed">
              Permet de gagner en productivité en simplifiant les requêtes et la gestion des modèles
              de données au sein des applications.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Technos 2 : Frontend & Cloud -->
    <section
      data-theme="light"
      class="w-full min-h-screen flex flex-col justify-center snap-start snap-always bg-[#faf9f6] py-24"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <!-- En-tête de section -->
        <div
          ref="techs2HeaderEl"
          class="flex flex-col items-center mb-16 lg:mb-24"
          :class="scrollRevealClass(techs2HeaderReveal)"
        >
          <h2 class="font-display text-4xl lg:text-5xl font-medium text-[#0b0c10] mb-4 text-center">
            Les technos que nous avons utilisées
          </h2>
          <!-- Ligne verte de soulignement du titre -->
          <div class="w-48 h-1 bg-green-500"></div>
        </div>

        <!-- carrousel techno adeo -->
        <div class="md:hidden flex flex-col items-center">
          <Transition mode="out-in" name="fade">
            <div
              :key="activeTech2.title"
              class="flex min-h-[280px] w-full flex-col items-center text-center"
            >
              <img
                :src="activeTech2.icon"
                :alt="activeTech2.title"
                class="h-32 object-contain mb-8 drop-shadow-sm"
              />
              <h3 class="text-xl font-bold text-[#0b0c10] mb-2">{{ activeTech2.title }}</h3>
              <div class="w-12 h-[3px] bg-green-500 mb-4"></div>
              <p class="text-[16px] text-primary-950/80 leading-relaxed">
                {{ activeTech2.description }}
              </p>
            </div>
          </Transition>

          <!-- fleches navigation techno -->
          <div class="mt-8 flex items-center gap-6">
            <button
              type="button"
              aria-label="Techno précédente"
              class="inline-flex size-11 items-center justify-center rounded-full bg-primary-950/5 text-primary-950 transition-colors duration-200 hover:bg-primary-950/10 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary-950"
              @click="prevTech2"
            >
              <svg class="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="m12 15-5-5 5-5"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Techno suivante"
              class="inline-flex size-11 items-center justify-center rounded-full bg-primary-950/5 text-primary-950 transition-colors duration-200 hover:bg-primary-950/10 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary-950"
              @click="nextTech2"
            >
              <svg class="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="m8 5 5 5-5 5"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Grille des technologies : statique a partir de md -->
        <div
          ref="techs2GridEl"
          class="hidden md:grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[1400px] mx-auto px-6"
        >
          <!-- Item 4 : Vue.JS -->
          <div
            class="flex flex-col items-center text-center"
            :class="scrollRevealClass(techs2GridReveal, 'up', { delayClass: 'delay-100' })"
          >
            <img
              src="/images/partners/adeo/techs/vue_js.png"
              alt="Vue.JS"
              class="h-32 lg:h-44 object-contain mb-8 drop-shadow-sm"
            />
            <h3 class="text-xl lg:text-2xl font-bold text-[#0b0c10] mb-2">Vue.JS</h3>
            <div class="w-12 h-[3px] bg-green-500 mb-4"></div>
            <p class="text-[16px] lg:text-[17px] text-primary-950/80 leading-relaxed">
              Permet de créer des interfaces utilisateur dynamiques et réactives, tout en
              garantissant une expérience fluide et performante.
            </p>
          </div>

          <!-- Item 5 : Vuetify -->
          <div
            class="flex flex-col items-center text-center"
            :class="scrollRevealClass(techs2GridReveal, 'up', { delayClass: 'delay-200' })"
          >
            <img
              src="/images/partners/adeo/techs/Vuetify.png"
              alt="Vuetify"
              class="h-32 lg:h-44 object-contain mb-8 drop-shadow-sm"
            />
            <h3 class="text-xl lg:text-2xl font-bold text-[#0b0c10] mb-2">Vuetify</h3>
            <div class="w-12 h-[3px] bg-green-500 mb-4"></div>
            <p class="text-[16px] lg:text-[17px] text-primary-950/80 leading-relaxed">
              Accélère le développement d'interfaces cohérente tout en garantissant une expérience
              utilisateur fluide.
            </p>
          </div>

          <!-- Item 6 : Google Cloud Platform -->
          <div
            class="flex flex-col items-center text-center"
            :class="scrollRevealClass(techs2GridReveal, 'up', { delayClass: 'delay-300' })"
          >
            <img
              src="/images/partners/adeo/techs/google_cloud_platform.png"
              alt="Google Cloud Platform"
              class="h-32 lg:h-44 object-contain mb-8 drop-shadow-sm"
            />
            <h3 class="text-xl lg:text-2xl font-bold text-[#0b0c10] mb-2">Google Cloud Platform</h3>
            <div class="w-12 h-[3px] bg-green-500 mb-4"></div>
            <p class="text-[16px] lg:text-[17px] text-primary-950/80 leading-relaxed">
              Propulse une infrastructure Cloud agile et sécurisée, capable de scaler vos
              applications et d'intégrer des outils d'IA avancés.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- footer home : repris ici (App.vue masque son footer global pour
         cette route pour eviter le doublon) -->
    <TheFooter full-page-scroll />
  </div>
</template>

<style scoped>
/* anim fade : carrousel techno mobile */
@media (prefers-reduced-motion: no-preference) {
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
  100% {
    transform: translateY(0px);
  }
}
.animate-float {
  animation: float 4s ease-in-out infinite;
}
</style>
