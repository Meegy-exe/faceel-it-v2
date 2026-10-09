<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type BuSlug = 'data-ia' | 'digital' | 'product'

interface Member {
  id: string
  name: string
  role: string
  /** TODO — citation réelle à fournir par le membre ; aucun témoignage
   *  fictif attribué à une personne réelle (cf. CLAUDE.md, intégrité du
   *  contenu). */
  quote: string
}

const TABS: { slug: BuSlug; label: string; description: string }[] = [
  {
    slug: 'data-ia',
    label: 'Data & IA',
    description:
      "Collecte, qualité, modélisation, restitution — puis les modèles et les agents qui s'appuient dessus. La chaîne complète, ou rien de fiable.",
  },
  {
    slug: 'digital',
    label: 'Digital',
    description:
      "Produits web, mobile et applications métier. Architecture, revue de code, tests : la vitesse d'aujourd'hui ne doit pas devenir le problème de demain.",
  },
  {
    slug: 'product',
    label: 'Product',
    description:
      "Cadrage, priorisation et cohérence fonctionnelle du portefeuille produit, du besoin client jusqu'à la mise en production.",
  },
]

const MEMBERS: Record<BuSlug, [Member, Member]> = {
  'data-ia': [
    { id: 'di1', name: 'Robin Rins', role: 'Directeur BU Data & IA', quote: '[Citation à fournir]' },
    { id: 'di2', name: 'Lena Lebecq', role: 'Responsable RH', quote: '[Citation à fournir]' },
  ],
  digital: [
    { id: 'd1', name: 'Stéphanie Demarez', role: 'Directrice BU Digital', quote: '[Citation à fournir]' },
    { id: 'd2', name: 'Noémie Vannoye', role: 'Responsable RH', quote: '[Citation à fournir]' },
  ],
  product: [
    { id: 'pr1', name: 'Laetitia Lesaffre', role: 'Directrice BU Product', quote: '[Citation à fournir]' },
    { id: 'pr2', name: 'Victoire Machowiak', role: 'Responsable RH', quote: '[Citation à fournir]' },
  ],
}

const activeBUIndex = ref(0)
const flippedLeft = ref(false)
const flippedRight = ref(false)

const activeBU = computed(() => TABS[activeBUIndex.value]!)
const activeMembers = computed(() => MEMBERS[activeBU.value.slug])
const leftMember = computed(() => activeMembers.value[0])
const rightMember = computed(() => activeMembers.value[1])

function nextBU() {
  activeBUIndex.value = (activeBUIndex.value + 1) % TABS.length
  flippedLeft.value = false
  flippedRight.value = false
}

interface FlatProfile extends Member {
  buLabel: string
}

/** Carrousel mobile (<460px) : les 6 profils à plat, toutes BUs confondues,
 *  dans l'ordre réel de `TABS` (Data & IA, Digital, Product) — pas l'ordre
 *  donné en exemple, qui ne correspond pas à l'ordre existant du composant. */
const ALL_PROFILES: FlatProfile[] = TABS.flatMap((tab) =>
  MEMBERS[tab.slug].map((member) => ({ ...member, buLabel: tab.label })),
)

const mobileCardIndex = ref(0)
const currentMobileProfile = computed(() => ALL_PROFILES[mobileCardIndex.value]!)

function nextMobileCard() {
  mobileCardIndex.value = (mobileCardIndex.value + 1) % ALL_PROFILES.length
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

let slideInterval: ReturnType<typeof setInterval> | undefined

function startAutoSlide() {
  if (import.meta.env.SSR || slideInterval !== undefined) return
  slideInterval = setInterval(nextBU, 4500)
}

function stopAutoSlide() {
  if (slideInterval === undefined) return
  clearInterval(slideInterval)
  slideInterval = undefined
}

/* -------------------------------------------------------------------------- */
/* Effet machine à écrire sur les deux citations — réécrit à chaque           */
/* changement de BU. Pas d'animation côté SSR : le texte complet est posé     */
/* directement pour que le HTML pré-rendu reste déterministe (cf. CLAUDE.md). */
/* -------------------------------------------------------------------------- */

const displayedLeftQuote = ref('')
const displayedRightQuote = ref('')

interface TypewriterHandle {
  id: ReturnType<typeof setInterval> | undefined
}

const leftTypewriter: TypewriterHandle = { id: undefined }
const rightTypewriter: TypewriterHandle = { id: undefined }

function typeText(text: string, target: ReturnType<typeof ref<string>>, handle: TypewriterHandle) {
  if (handle.id !== undefined) {
    clearInterval(handle.id)
    handle.id = undefined
  }

  if (import.meta.env.SSR) {
    target.value = text
    return
  }

  target.value = ''
  let i = 0
  handle.id = setInterval(() => {
    i += 1
    target.value = text.slice(0, i)
    if (i >= text.length) {
      clearInterval(handle.id)
      handle.id = undefined
    }
  }, 60)
}

watch(
  [leftMember, rightMember],
  ([left, right]) => {
    typeText(left.quote, displayedLeftQuote, leftTypewriter)
    typeText(right.quote, displayedRightQuote, rightTypewriter)
  },
  { immediate: true },
)

function stopTypewriters() {
  if (leftTypewriter.id !== undefined) clearInterval(leftTypewriter.id)
  if (rightTypewriter.id !== undefined) clearInterval(rightTypewriter.id)
}

onMounted(startAutoSlide)
onBeforeUnmount(() => {
  stopAutoSlide()
  stopTypewriters()
})
</script>

<template>
  <section
    id="business-units"
    data-theme="light"
    class="h-dvh shrink-0 w-full snap-start snap-always flex flex-col bg-light px-4 pt-36 pb-8 sm:px-6 lg:px-8 xl:px-12"
  >
    <header class="max-w-5xl px-4 md:px-24 lg:px-28">
      <h2 class="mt-4 font-display text-display min-[1030px]:whitespace-nowrap text-primary-900">
        Nos BUs, Experte de vos besoins.
      </h2>
      <p class="mt-4 min-[1030px]:whitespace-nowrap text-sm md:text-base min-[1030px]:text-lg leading-relaxed text-primary-900/60">
        Une organisation interne adaptée au marché pour une réponse sur-mesure à nos clients
      </p>
    </header>

    <!-- Sélecteur de BU compact, centré au-dessus de l'arène : accent-700,
         pas accent-500 — sur fond clair, accent-500 ne tient que 1,9:1 même
         en grand gras (seuil large-text 3:1), accent-700 tient 4,9:1
         (cf. main.css). -->
    <div class="flex w-full items-center justify-center mt-8 mb-8 max-[459px]:hidden">
      <Transition
        enter-active-class="transition-all duration-700 ease-out"
        enter-from-class="opacity-0 translate-x-12"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-500 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 -translate-x-12"
        mode="out-in"
      >
        <h3
          :key="activeBUIndex"
          class="flex items-center gap-2 font-display text-4xl font-bold text-accent-700"
        >
          {{ activeBU.label }}
          <button
            type="button"
            aria-label="Expertise suivante"
            class="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-accent-700 transition-colors duration-200 hover:bg-accent-700/10 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-700 motion-reduce:transition-none"
            @click="nextBU"
          >
            <svg class="size-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </h3>
      </Transition>
    </div>

    <!-- Arène « Street Fighter » : deux cartes se font face, le témoignage
         alterné occupe le centre. -->
    <div
      class="relative flex w-full flex-1 items-center max-[572px]:justify-center min-[573px]:justify-between gap-8 px-4 md:px-24 lg:px-28 max-[459px]:hidden"
    >
      <!-- Combattant gauche -->
      <div class="flex w-1/4 flex-col items-center">
        <!-- Nom/poste/citation : copie compacte, visible uniquement sous
             573px, où le texte se retrouvait coincé entre les deux cartes
             (cf. zone centrale ci-dessous, cachée à cette largeur). -->
        <div class="mb-4 max-w-32 text-center min-[573px]:hidden">
          <p class="text-sm font-bold text-primary-950">{{ leftMember.name }}</p>
          <p class="text-[11px] font-medium text-primary-900/50">{{ leftMember.role }}</p>
          <p class="mt-1 text-xs italic leading-snug text-primary-900/80">
            <span>{{ displayedLeftQuote }}</span
            ><span class="opacity-0">{{ leftMember.quote.slice(displayedLeftQuote.length) }}</span>
          </p>
        </div>
        <Transition
          mode="out-in"
          enter-active-class="transition-all duration-700 ease-out"
          enter-from-class="opacity-0 scale-75"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-500 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-75"
        >
          <div :key="activeBUIndex" class="flex flex-col items-center">
            <div
              class="w-32 h-48 md:w-40 md:h-60 lg:w-48 lg:h-72 min-[1076px]:w-[300px] min-[1076px]:h-[480px] [perspective:1000px]"
              @mouseenter="flippedLeft = true; stopAutoSlide()"
              @mouseleave="flippedLeft = false; startAutoSlide()"
            >
              <div
                class="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] rounded-2xl shadow-[-40px_20px_50px_-15px_rgba(0,0,50,0.4)]"
                :style="{ transform: flippedLeft ? 'rotateY(195deg)' : 'rotateY(15deg)' }"
              >
                <!-- Face avant -->
                <div
                  class="absolute inset-0 [backface-visibility:hidden] bg-primary-950 rounded-2xl flex items-center justify-center overflow-hidden"
                >
                  <span class="font-display text-3xl md:text-4xl lg:text-5xl min-[1076px]:text-6xl font-extrabold text-white/10">{{
                    initials(leftMember.name)
                  }}</span>
                </div>

                <!-- Face arrière — description de la BU uniquement, pas de
                     nom ni de citation (cf. zone centrale ci-dessous). -->
                <div
                  class="absolute inset-0 [backface-visibility:hidden] bg-primary-950 rounded-2xl [transform:rotateY(180deg)] flex flex-col justify-center items-center p-8 text-center text-base lg:text-lg leading-relaxed text-white/90"
                >
                  {{ activeBU.description }}
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Citations centrales — permanentes, en diagonale franche, effet
           machine à écrire (cf. <script setup>). Masquées sous 573px : le
           texte y est remplacé par les copies compactes attachées à chaque
           carte (cf. ci-dessus/dessous). -->
      <div class="hidden min-[573px]:flex flex-1 flex-col justify-center gap-20 lg:gap-32 px-4">
        <div class="self-start text-left max-w-sm">
          <p class="text-xl lg:text-2xl font-bold text-primary-950 mb-1">{{ leftMember.name }}</p>
          <p class="text-sm font-medium text-primary-900/50 mb-2">{{ leftMember.role }}</p>
          <p class="text-base lg:text-lg italic text-primary-900/80 leading-relaxed">
            <span>{{ displayedLeftQuote }}</span><span class="opacity-0">{{ leftMember.quote.slice(displayedLeftQuote.length) }}</span>
          </p>
        </div>
        <div class="self-end text-right max-w-sm">
          <p class="text-xl lg:text-2xl font-bold text-primary-950 mb-1">{{ rightMember.name }}</p>
          <p class="text-sm font-medium text-primary-900/50 mb-2">{{ rightMember.role }}</p>
          <p class="text-base lg:text-lg italic text-primary-900/80 leading-relaxed">
            <span>{{ displayedRightQuote }}</span><span class="opacity-0">{{ rightMember.quote.slice(displayedRightQuote.length) }}</span>
          </p>
        </div>
      </div>

      <!-- Combattant droit -->
      <div class="flex w-1/4 flex-col items-center">
        <Transition
          mode="out-in"
          enter-active-class="transition-all duration-700 ease-out"
          enter-from-class="opacity-0 scale-75"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-500 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-75"
        >
          <div :key="activeBUIndex" class="flex flex-col items-center">
            <div
              class="w-32 h-48 md:w-40 md:h-60 lg:w-48 lg:h-72 min-[1076px]:w-[300px] min-[1076px]:h-[480px] [perspective:1000px]"
              @mouseenter="flippedRight = true; stopAutoSlide()"
              @mouseleave="flippedRight = false; startAutoSlide()"
            >
              <div
                class="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] rounded-2xl shadow-[40px_20px_50px_-15px_rgba(0,0,50,0.4)]"
                :style="{ transform: flippedRight ? 'rotateY(-195deg)' : 'rotateY(-15deg)' }"
              >
                <!-- Face avant -->
                <div
                  class="absolute inset-0 [backface-visibility:hidden] bg-primary-950 rounded-2xl flex items-center justify-center overflow-hidden"
                >
                  <span class="font-display text-3xl md:text-4xl lg:text-5xl min-[1076px]:text-6xl font-extrabold text-white/10">{{
                    initials(rightMember.name)
                  }}</span>
                </div>

                <!-- Face arrière — description de la BU uniquement, pas de
                     nom ni de citation (cf. zone centrale ci-dessus). -->
                <div
                  class="absolute inset-0 [backface-visibility:hidden] bg-primary-950 rounded-2xl [transform:rotateY(180deg)] flex flex-col justify-center items-center p-8 text-center text-base lg:text-lg leading-relaxed text-white/90"
                >
                  {{ activeBU.description }}
                </div>
              </div>
            </div>
          </div>
        </Transition>
        <!-- Nom/poste/citation : copie compacte, sous la carte, sous 573px uniquement. -->
        <div class="mt-4 max-w-32 text-center min-[573px]:hidden">
          <p class="text-sm font-bold text-primary-950">{{ rightMember.name }}</p>
          <p class="text-[11px] font-medium text-primary-900/50">{{ rightMember.role }}</p>
          <p class="mt-1 text-xs italic leading-snug text-primary-900/80">
            <span>{{ displayedRightQuote }}</span
            ><span class="opacity-0">{{ rightMember.quote.slice(displayedRightQuote.length) }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Carrousel mobile : sous 460px, l'arène à deux cartes ne tient plus —
         un seul profil à la fois, les 6 profils de toutes les BUs confondus. -->
    <div class="hidden max-[459px]:flex w-full flex-1 flex-col items-center justify-center gap-6 px-4">
      <div class="relative flex flex-col items-center">
        <!-- accent-700, pas accent-500 : 1,9:1 sur blanc, sous le seuil
             WCAG même en grand gras (cf. sélecteur desktop ci-dessus). -->
        <div class="mb-6 flex items-center justify-center gap-2 text-center font-display text-4xl font-black text-accent-700">
          {{ currentMobileProfile.buLabel }}
          <svg class="size-6 text-primary-900/30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="flex h-72 w-52 items-center justify-center overflow-hidden rounded-2xl bg-primary-950">
          <span class="font-display text-6xl font-extrabold text-white/10">{{
            initials(currentMobileProfile.name)
          }}</span>
        </div>

        <div class="mt-4 max-w-[18rem] text-center">
          <p class="text-xl font-bold text-primary-950">{{ currentMobileProfile.name }}</p>
          <p class="text-sm font-medium text-primary-900/50">{{ currentMobileProfile.role }}</p>
          <p class="mt-1 text-base italic leading-snug text-primary-900/80">
            {{ currentMobileProfile.quote }}
          </p>
        </div>

        <button
          type="button"
          aria-label="Profil suivant"
          class="absolute top-36 -right-14 -translate-y-1/2 inline-flex size-10 items-center justify-center rounded-full text-primary-900 transition-colors duration-200 hover:bg-primary-900/10 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary-900 motion-reduce:transition-none"
          @click="nextMobileCard"
        >
          <svg class="size-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>
