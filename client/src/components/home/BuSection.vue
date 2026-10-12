<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type BuSlug = 'data-ia' | 'digital' | 'product'

interface Member {
  id: string
  name: string
  role: string
  /** TODO — citation réelle à fournir par le membre ; aucun témoignage
   *  fictif attribué à une personne réelle (cf. CLAUDE.md, intégrité du
   *  contenu). Découpée en segments pour un affichage sur un nombre de
   *  lignes fixe (cf. template, <span class="block"> par segment) — un seul
   *  segment pour un placeholder, rien à couper en deux. */
  quote: string[]
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
    { id: 'di1', name: 'Robin Rins', role: 'Directeur BU Data & IA', quote: ['[Citation à venir]'] },
    { id: 'di2', name: 'Lena Lebecq', role: 'Responsable RH', quote: ['[Citation à venir]'] },
  ],
  digital: [
    {
      id: 'd1',
      name: 'Stéphanie Demarez',
      role: 'Directrice BU Digital',
      quote: [
        '« Je ne cherche pas seulement un business',
        'mais avant tout à créer une relation durable. »',
      ],
    },
    {
      id: 'd2',
      name: 'Noémie Vannoye',
      role: 'Responsable RH',
      quote: [
        '« Écouter pour mieux suivre et accompagner',
        'mes collaborateurs dans leur montée en compétences. »',
      ],
    },
  ],
  product: [
    {
      id: 'pr1',
      name: 'Laetitia Lesaffre',
      role: 'Directrice BU Product',
      quote: [
        '« Etre à l’écoute est pour moi le plus important',
        'pour répondre au mieux au besoin de nos client. »',
      ],
    },
    {
      id: 'pr2',
      name: 'Victoire Machowiak',
      role: 'Responsable RH',
      quote: ['« Je cherche avant tout des qualités humaines', 'avant des qualités techniques. »'],
    },
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
  slideInterval = setInterval(nextBU, 10_000)
}

function stopAutoSlide() {
  if (slideInterval === undefined) return
  clearInterval(slideInterval)
  slideInterval = undefined
}

/** Sélection manuelle (clic sur un onglet BU) : reboote le timer pour que la
 *  rotation automatique reparte pour 10 s complètes, au lieu d'enchaîner
 *  presque aussitôt si le clic tombe juste avant la fin du cycle en cours. */
function selectBU(index: number) {
  activeBUIndex.value = index
  flippedLeft.value = false
  flippedRight.value = false
  stopAutoSlide()
  startAutoSlide()
}

onMounted(startAutoSlide)
onBeforeUnmount(stopAutoSlide)
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

    <!-- Rangée statique des 3 BUs, surplombant l'arène : gauche/centre/droite
         pour coïncider avec les cartes gauche/droite et la citation centrale
         en dessous (même padding horizontal que la rangée de l'arène,
         cf. ci-dessous, pour un alignement exact). accent-700, pas
         accent-500 — sur fond clair, accent-500 ne tient que 1,9:1 même en
         grand gras (seuil large-text 3:1), accent-700 tient 4,9:1
         (cf. main.css). -->
    <div class="flex w-full justify-between items-end mt-8 mb-8 px-4 md:px-24 lg:px-28 max-[459px]:hidden">
      <h3
        v-for="(tab, index) in TABS"
        :key="tab.slug"
        class="cursor-pointer font-display transition-all duration-300"
        :class="[
          activeBUIndex === index
            ? 'font-bold text-3xl md:text-4xl text-accent-700'
            : 'font-normal text-xl md:text-2xl text-accent-700/60',
          index === 0 ? 'text-left' : index === TABS.length - 1 ? 'text-right' : 'text-center',
        ]"
        @click="selectBU(index)"
      >
        {{ tab.label }}
      </h3>
    </div>

    <!-- Arène « Street Fighter » : deux cartes se font face, le témoignage
         alterné occupe le centre. -->
    <div
      class="relative flex w-full flex-1 items-stretch max-[572px]:justify-center min-[573px]:justify-between gap-8 px-4 md:px-24 lg:px-28 max-[459px]:hidden"
    >
      <!-- Combattant gauche -->
      <div class="flex w-auto shrink-0 flex-col items-center justify-center">
        <!-- Nom/poste/citation : copie compacte, visible uniquement sous
             573px, où le texte se retrouvait coincé entre les deux cartes
             (cf. zone centrale ci-dessous, cachée à cette largeur). -->
        <div class="mb-4 max-w-32 text-center min-[573px]:hidden">
          <p class="text-sm font-bold text-primary-950">{{ leftMember.name }}</p>
          <p class="text-[11px] font-medium text-primary-900/50">{{ leftMember.role }}</p>
          <Transition name="fade" mode="out-in">
            <p :key="leftMember.id" class="mt-1 min-h-[72px] text-xs italic leading-snug text-primary-900/80">
              <span v-for="(line, idx) in leftMember.quote" :key="idx" class="block">{{ line }}</span>
            </p>
          </Transition>
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
              class="w-40 h-60 md:w-48 md:h-72 lg:w-[320px] lg:h-[480px] [perspective:1000px]"
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
                  <span class="font-display text-4xl md:text-5xl lg:text-7xl font-extrabold text-white/10">{{
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

      <!-- Citations centrales — permanentes, en diagonale franche. Masquées
           sous 573px : le texte y est remplacé par les copies compactes
           attachées à chaque carte (cf. ci-dessus/dessous). -->
      <div class="hidden min-[573px]:flex flex-1 items-center px-4">
        <!-- Cadre de référence, hauteur calquée sur celle de la carte (pas
             h-full : la colonne parente reste plus haute — `items-center`
             ci-dessus centre ce cadre à hauteur fixe dans cet espace plutôt
             que de l'étirer dessus). Les deux blocs sont ancrés en `absolute`
             à ses coins plutôt que distribués en flex : élimine toute
             dépendance aux conteneurs flex environnants. -mt-2/-mb-2 :
             compensation optique du line-height. -->
        <div class="relative w-full h-60 md:h-72 lg:h-[480px]">
          <div class="-mt-2 absolute top-0 left-0 w-full text-left">
            <p class="text-xl lg:text-2xl font-bold text-primary-950 mb-1">{{ leftMember.name }}</p>
            <p class="text-sm font-medium text-primary-900/50 mb-2">{{ leftMember.role }}</p>
            <Transition name="fade" mode="out-in">
              <p :key="leftMember.id" class="min-h-[100px] lg:min-h-[120px] text-base lg:text-lg italic text-primary-900/80 leading-relaxed">
                <span v-for="(line, idx) in leftMember.quote" :key="idx" class="block whitespace-nowrap">{{ line }}</span>
              </p>
            </Transition>
          </div>
          <div class="-mb-2 absolute bottom-0 right-0 w-full text-right">
            <p class="text-xl lg:text-2xl font-bold text-primary-950 mb-1">{{ rightMember.name }}</p>
            <p class="text-sm font-medium text-primary-900/50 mb-2">{{ rightMember.role }}</p>
            <Transition name="fade" mode="out-in">
              <p :key="rightMember.id" class="min-h-[100px] lg:min-h-[120px] text-base lg:text-lg italic text-primary-900/80 leading-relaxed">
                <span v-for="(line, idx) in rightMember.quote" :key="idx" class="block whitespace-nowrap">{{ line }}</span>
              </p>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Combattant droit -->
      <div class="flex w-auto shrink-0 flex-col items-center justify-center">
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
              class="w-40 h-60 md:w-48 md:h-72 lg:w-[320px] lg:h-[480px] [perspective:1000px]"
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
                  <span class="font-display text-4xl md:text-5xl lg:text-7xl font-extrabold text-white/10">{{
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
          <Transition name="fade" mode="out-in">
            <p :key="rightMember.id" class="mt-1 min-h-[72px] text-xs italic leading-snug text-primary-900/80">
              <span v-for="(line, idx) in rightMember.quote" :key="idx" class="block">{{ line }}</span>
            </p>
          </Transition>
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
            <span v-for="(line, idx) in currentMobileProfile.quote" :key="idx" class="block">{{ line }}</span>
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

<style scoped>
/* `prefers-reduced-motion` : sans cette garde, la transition resterait
   active — motion-reduce: n'existe pas en Tailwind pour les classes
   générées par <Transition>, d'où le média query CSS direct (cf. CLAUDE.md,
   neutralisation obligatoire des animations décoratives). */
@media (prefers-reduced-motion: no-preference) {
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
