<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useSeo } from '@/composables/useSeo'
import { useWaveCanvas } from '@/composables/useWaveCanvas'

const route = useRoute()

onMounted(() => {
  window.scrollTo(0, 0)
  document.querySelector('#app')?.scrollTo(0, 0)
})

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
      "Dans le cadre d'un programme de transformation digitale pour un acteur majeur du retail, vous contribuerez à la définition des besoins fonctionnels, à la rédaction des spécifications et au pilotage des recettes utilisateurs.",
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
      "Vous rejoindrez une squad produit pour développer et maintenir des applications web en React et Node.js. Vous participerez aux cérémonies Agile, contribuerez aux revues de code et serez acteur de l'amélioration continue des pratiques d'ingénierie.",
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

const offer = computed(
  () => OFFERS.find((o) => String(o.id) === String(route.params.id)) ?? OFFERS[0]!,
)

const similarOffers = computed(() => OFFERS.filter((o) => o.id !== offer.value.id).slice(0, 3))

const waveCanvas = ref<HTMLCanvasElement | null>(null)
useWaveCanvas(waveCanvas)

useSeo({
  title: 'Data Engineer (H/F) – Faceel-IT',
  description:
    'Rejoignez Faceel-IT en tant que Data Engineer (H/F) à Lille en CDI. Conception de pipelines de données, architecture lakehouse, environnement Azure et Databricks.',
})
</script>

<template>
  <!-- Pas de <main> ici : App.vue le fournit déjà.
       fullPageScroll → <main> est `contents` : ces sections sont des enfants
       directs du conteneur snap-y d'App.vue, TheFooter compris. -->

  <!-- ==================================================================
       SECTION 1 — HERO (Thème Sombre — plein écran strict)
       ================================================================== -->
  <section
    id="hero"
    data-theme="dark"
    class="relative min-h-screen w-full flex flex-col justify-center bg-[#000066] text-white overflow-hidden"
  >
    <!-- Canvas vague — fond animé, désactivé si motion-reduce. -->
    <canvas
      ref="waveCanvas"
      aria-hidden="true"
      class="absolute inset-0 h-full w-full pointer-events-none opacity-60 motion-reduce:hidden"
    />

    <!-- Halo décoratif vert -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute -right-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-accent-500/10 blur-3xl"
    />

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

    <!-- Contenu -->
    <div class="relative z-10 px-4 py-24 sm:px-6 lg:px-8 xl:px-12">
      <div class="mr-auto w-full max-w-4xl">
        <p class="mb-4 text-sm text-white/90">
          Équipe RH Faceel-IT · {{ offer.date }} · 3 min de lecture
        </p>

        <h1 class="font-display text-display text-balance text-white">
          {{ offer.title }}
        </h1>

        <div class="mt-6 flex flex-wrap items-center gap-3">
          <span class="rounded-full bg-white/20 border border-white/30 px-4 py-1.5 text-sm font-medium text-orange-300 backdrop-blur-sm">
            {{ offer.category }}
          </span>
          <span class="inline-flex items-center gap-1.5 rounded-full bg-white/20 border border-white/30 px-4 py-1.5 text-sm font-medium text-green-300 backdrop-blur-sm">
            <svg class="h-4 w-4 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M8 1.5A4.5 4.5 0 003.5 6c0 2.9 3.23 6.77 4.5 8.25C9.27 12.77 12.5 8.9 12.5 6A4.5 4.5 0 008 1.5zm0 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clip-rule="evenodd" />
            </svg>
            {{ offer.location }}
          </span>
          <span class="rounded-full bg-white/20 border border-white/30 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            {{ offer.contract }}
          </span>
          <span class="rounded-full bg-white/20 border border-white/30 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            Selon profil
          </span>
        </div>

        <div class="mt-8 rounded-xl border border-white/20 bg-white/10 p-6">
          <p class="text-base leading-relaxed text-white/80">{{ offer.description }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================================================================
       SECTION 2 — DÉTAILS & PARTAGE (Thème Clair — scroll libre)
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
                <span class="text-base leading-relaxed text-primary-900/70">{{ tech }}</span>
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

        <!-- Colonne droite : encart Partager sticky -->
        <aside class="lg:sticky lg:top-32 lg:self-start">
          <div class="rounded-2xl bg-gray-50 p-6 ring-1 ring-gray-200">
            <h3 class="text-base font-bold text-primary-900 mb-1">Partager cette offre</h3>
            <p class="text-sm text-primary-900/55 mb-5">
              Transmettez cette opportunité à votre réseau.
            </p>
            <div class="flex gap-3">
              <a
                href="#"
                aria-label="Partager sur LinkedIn"
                class="flex h-11 w-11 items-center justify-center rounded-full bg-primary-900 text-white transition-opacity hover:opacity-75"
              >
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  />
                </svg>
              </a>

              <a
                href="#"
                aria-label="Partager sur Facebook"
                class="flex h-11 w-11 items-center justify-center rounded-full bg-primary-900 text-white transition-opacity hover:opacity-75"
              >
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
              </a>

              <a
                :href="`mailto:?subject=${offer.title} – Faceel-IT&body=Bonjour,%0A%0AJe pensais à toi pour cette offre : ${offer.title} chez Faceel-IT.%0A%0A`"
                aria-label="Partager par e-mail"
                class="flex h-11 w-11 items-center justify-center rounded-full bg-primary-900 text-white transition-opacity hover:opacity-75"
              >
                <svg
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  aria-hidden="true"
                >
                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <polyline
                    points="22,6 12,13 2,6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </a>

              <a
                href="#"
                aria-label="Partager sur WhatsApp"
                class="flex h-11 w-11 items-center justify-center rounded-full bg-primary-900 text-white transition-opacity hover:opacity-75"
              >
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>

  <hr class="w-24 h-1 mx-auto my-12 bg-[#000066]/20 border-0 rounded md:my-16" aria-hidden="true" />

  <!-- ==================================================================
       SECTION 3 — OFFRES SIMILAIRES (flux naturel, fond gris pour séparer)
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
</template>
