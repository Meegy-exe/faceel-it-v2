<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useSeo } from '@/composables/useSeo'

const route = useRoute()

interface JobOffer {
  id: number
  title: string
  location: string
  category: string
  contract: 'CDI' | 'CDD' | 'Stage'
  level: string
  description: string
  date: string
  keyPoints: string[]
}

const OFFERS: JobOffer[] = [
  {
    id: 1,
    title: 'Data Engineer (H/F)',
    location: 'Lille',
    category: 'Data',
    contract: 'CDI',
    level: 'Expérimentés',
    date: 'Publié il y a 9 mois',
    description:
      "Pour un client dans le secteur du retail, vous rejoindrez une équipe en charge de la mise en place et de l'optimisation des pipelines de données, dans un environnement Agile et orienté performance.",
    keyPoints: [
      "3+ ans d'expérience en ingénierie des données",
      'Maîtrise de Python et SQL',
      'Expérience sur les environnements cloud (Azure de préférence)',
      'Goût pour le travail en équipe et les environnements Agile',
    ],
  },
  {
    id: 2,
    title: 'Consultante / Consultant fonctionnel – Expert S4HANA SAP SD',
    location: 'Lille, Toulouse, Paris',
    category: 'Solutions SaaS',
    contract: 'CDI',
    level: 'Expérimentés',
    date: 'Publié il y a 3 mois',
    description:
      "Vous intégrerez une équipe projet pour accompagner la transformation SAP S/4HANA de nos clients industriels, en charge de l'analyse des besoins fonctionnels et de la conduite du changement.",
    keyPoints: [
      'Expérience confirmée sur SAP SD ou S/4HANA',
      'Capacité à animer des ateliers fonctionnels',
      'Maîtrise de la gestion du changement',
      'Mobilité sur les sites clients (Lille, Toulouse, Paris)',
    ],
  },
  {
    id: 3,
    title: 'Architecte solutions – Microsoft Azure',
    location: 'Lyon, Remote',
    category: 'Cloud & Infrastructure',
    contract: 'CDI',
    level: 'Expérimentés',
    date: 'Publié il y a 2 semaines',
    description:
      "Vous interviendrez en tant qu'Architecte Cloud principal sur des projets de migration et de modernisation d'infrastructures vers Microsoft Azure.",
    keyPoints: [
      'Certification Azure Solutions Architect souhaitée',
      "Expérience en conception d'architectures cloud complexes",
      'Maîtrise des services Azure (AKS, ADF, Azure DevOps)',
      'Télétravail partiel possible',
    ],
  },
  {
    id: 4,
    title: 'Business Analyst – Transformation digitale retail',
    location: 'Lille',
    category: 'Conseil',
    contract: 'CDD',
    level: 'Etudiants / Jeunes diplômés',
    date: 'Publié il y a 1 mois',
    description:
      "Dans le cadre d'un programme de transformation digitale pour un acteur majeur du retail, vous contribuerez à la définition des besoins fonctionnels et au pilotage des recettes utilisateurs.",
    keyPoints: [
      'Formation Bac+4/5 en management, informatique ou équivalent',
      'Première expérience en analyse fonctionnelle appréciée',
      'Aisance relationnelle et sens de la pédagogie',
      'Maîtrise des outils de gestion de projet (Jira, Confluence)',
    ],
  },
  {
    id: 5,
    title: 'Développeur fullstack – React / Node.js',
    location: 'Toulouse',
    category: 'Développement',
    contract: 'CDI',
    level: 'Expérimentés',
    date: 'Publié il y a 5 mois',
    description:
      "Vous rejoindrez une squad produit pour développer et maintenir des applications web en React et Node.js, en participant activement aux cérémonies Agile.",
    keyPoints: [
      '3+ ans en développement fullstack React / Node.js',
      'Bonne maîtrise de TypeScript',
      'Expérience en revues de code et pratiques CI/CD',
      'Appétence pour la qualité logicielle',
    ],
  },
  {
    id: 6,
    title: 'Stage – Data Scientist junior IA générative',
    location: 'Paris',
    category: 'Data & IA',
    contract: 'Stage',
    level: 'Etudiants / Jeunes diplômés',
    date: 'Publié il y a 1 semaine',
    description:
      "Dans le cadre d'un stage de fin d'études, vous travaillerez sur des cas d'usage d'intelligence artificielle générative et à l'évaluation de modèles de langage.",
    keyPoints: [
      'Formation Bac+4/5 en data science, IA ou équivalent',
      'Connaissances en Python et frameworks ML (PyTorch, HuggingFace)',
      'Curiosité pour les LLMs et les approches RAG',
      'Stage de 4 à 6 mois',
    ],
  },
]

const offer = computed(
  () => OFFERS.find((o) => String(o.id) === String(route.params.id)) ?? OFFERS[0]!,
)

useSeo({
  title: computed(() => `Postuler – ${offer.value.title} – Faceel-IT`),
  description:
    "Déposez votre candidature en quelques minutes. CV, lettre de motivation et coordonnées — nous reviendrons vers vous rapidement.",
})

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const message = ref('')
const cvFile = ref<File | null>(null)
const dragOver = ref(false)
const submitted = ref(false)

function handleFile(file: File | undefined) {
  if (file && file.type === 'application/pdf') cvFile.value = file
}

function onFileInput(e: Event) {
  handleFile((e.target as HTMLInputElement).files?.[0])
}

function onDrop(e: DragEvent) {
  dragOver.value = false
  handleFile(e.dataTransfer?.files[0])
}

function handleSubmit() {
  /* TODO : connecter à l'API de candidature */
  submitted.value = true
}
</script>

<template>
  <div class="min-h-screen flex flex-col lg:flex-row pt-20 lg:pt-0">

    <!-- ============================================================
         COLONNE GAUCHE — Résumé de l'offre
         ============================================================ -->
    <div
      data-theme="dark"
      class="w-full lg:w-1/2 lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] bg-[#000066] text-white p-8 md:p-12 flex flex-col justify-center overflow-y-auto"
    >
      <!-- Retour -->
      <RouterLink
        :to="{ name: 'offre-detail', params: { id: offer.id } }"
        class="mb-10 inline-flex items-center gap-2 text-sm font-medium text-white transition-all hover:text-gray-200 hover:underline self-start"
      >
        <svg class="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M10 3L5 8l5 5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Retour à l'offre
      </RouterLink>

      <!-- Surtitre -->
      <p class="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-3">
        Candidature pour
      </p>

      <!-- Titre -->
      <h1 class="font-display text-3xl font-bold text-white leading-tight mb-6 lg:text-4xl">
        {{ offer.title }}
      </h1>

      <!-- Badges -->
      <div class="flex flex-wrap gap-2 mb-8">
        <span class="rounded-full bg-white/20 border border-white/30 px-4 py-1.5 text-sm font-medium text-orange-300">
          {{ offer.category }}
        </span>
        <span class="inline-flex items-center gap-1.5 rounded-full bg-white/20 border border-white/30 px-4 py-1.5 text-sm font-medium text-green-300">
          <svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M8 1.5A4.5 4.5 0 003.5 6c0 2.9 3.23 6.77 4.5 8.25C9.27 12.77 12.5 8.9 12.5 6A4.5 4.5 0 008 1.5zm0 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clip-rule="evenodd" />
          </svg>
          {{ offer.location }}
        </span>
        <span class="rounded-full bg-white/20 border border-white/30 px-4 py-1.5 text-sm font-medium text-white">
          {{ offer.contract }}
        </span>
        <span class="rounded-full bg-white/20 border border-white/30 px-4 py-1.5 text-sm font-medium text-white">
          {{ offer.level }}
        </span>
      </div>

      <!-- Résumé -->
      <p class="text-base leading-relaxed text-white/75 mb-8">
        {{ offer.description }}
      </p>

      <!-- Points clés -->
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">
          Prérequis clés
        </p>
        <ul class="space-y-3">
          <li
            v-for="point in offer.keyPoints"
            :key="point"
            class="flex items-start gap-3"
          >
            <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#12D80A]" aria-hidden="true" />
            <span class="text-sm leading-relaxed text-white/80">{{ point }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- ============================================================
         COLONNE DROITE — Formulaire
         ============================================================ -->
    <div
      data-theme="light"
      class="w-full lg:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center overflow-y-auto"
    >

      <!-- Confirmation envoi -->
      <div v-if="submitted" class="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <svg class="mx-auto mb-4 size-12 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-xl font-bold text-green-800">Candidature envoyée !</h2>
        <p class="mt-2 text-sm text-green-700">Notre équipe RH vous contactera dans les meilleurs délais.</p>
        <RouterLink
          :to="{ name: 'offre-detail', params: { id: offer.id } }"
          class="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#000066] hover:underline"
        >
          Retour à l'offre
        </RouterLink>
      </div>

      <template v-else>
        <h2 class="text-2xl font-bold text-[#000066] mb-8">Postuler à cette offre</h2>

        <form class="space-y-5" novalidate @submit.prevent="handleSubmit">
          <!-- Prénom / Nom -->
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label for="firstName" class="mb-1.5 block text-sm font-medium text-primary-900">
                Prénom <span class="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                v-model="firstName"
                type="text"
                autocomplete="given-name"
                required
                class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-primary-900 outline-none transition-shadow focus:border-transparent focus:ring-2 focus:ring-[#000066]"
              />
            </div>
            <div>
              <label for="lastName" class="mb-1.5 block text-sm font-medium text-primary-900">
                Nom <span class="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                v-model="lastName"
                type="text"
                autocomplete="family-name"
                required
                class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-primary-900 outline-none transition-shadow focus:border-transparent focus:ring-2 focus:ring-[#000066]"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="mb-1.5 block text-sm font-medium text-primary-900">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-primary-900 outline-none transition-shadow focus:border-transparent focus:ring-2 focus:ring-[#000066]"
            />
          </div>

          <!-- Lettre de motivation -->
          <div>
            <label for="message" class="mb-1.5 block text-sm font-medium text-primary-900">
              Lettre de motivation
            </label>
            <textarea
              id="message"
              v-model="message"
              rows="4"
              placeholder="Présentez-vous et expliquez pourquoi ce poste vous intéresse…"
              class="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-primary-900 outline-none transition-shadow focus:border-transparent focus:ring-2 focus:ring-[#000066]"
            />
          </div>

          <!-- Upload CV -->
          <div>
            <p class="mb-1.5 text-sm font-medium text-primary-900">
              CV <span class="text-red-500">*</span>
            </p>
            <label
              for="cvFile"
              class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-6 py-8 text-center transition-colors"
              :class="dragOver ? 'border-[#000066] bg-blue-50' : 'border-gray-200 hover:border-gray-300'"
              @dragover.prevent="dragOver = true"
              @dragleave="dragOver = false"
              @drop.prevent="onDrop"
            >
              <svg class="w-10 h-10 mx-auto mb-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span v-if="cvFile" class="text-sm font-medium text-[#000066]">{{ cvFile.name }}</span>
              <span v-else class="text-sm text-gray-500">
                Glissez votre CV ici ou
                <span class="font-semibold text-[#000066]">parcourir</span>
              </span>
              <span class="text-xs text-gray-400">Format PDF uniquement</span>
              <input id="cvFile" type="file" accept=".pdf" class="sr-only" @change="onFileInput" />
            </label>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="w-full rounded-xl bg-[#12D80A] px-6 py-4 text-base font-semibold text-gray-900 transition-colors hover:bg-[#0fc009] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12D80A] focus-visible:ring-offset-2"
          >
            Envoyer ma candidature
          </button>

          <p class="text-center text-xs text-gray-400">
            Vos données sont traitées conformément à notre
            <RouterLink to="/politique-confidentialite" class="underline hover:text-gray-600">
              politique de confidentialité
            </RouterLink>.
          </p>
        </form>
      </template>
    </div>
  </div>

  <div class="w-full bg-white pt-12 pb-8">
    <hr class="border-t border-gray-200 mx-auto w-11/12 max-w-7xl" />
  </div>
</template>
