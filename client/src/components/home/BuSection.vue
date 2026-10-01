<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

type BuSlug = 'digital' | 'product' | 'data-ia' | 'cyber'

interface Member {
  id: string
  name: string
  role: string
  pending?: boolean
}

const TABS: { slug: BuSlug; label: string; description: string }[] = [
  { slug: 'digital', label: 'Digital', description: 'Développement applicatif, conseil et pilotage de projets tech.' },
  { slug: 'product', label: 'Product', description: 'Product management, conception UX et delivery produit.' },
  { slug: 'data-ia', label: 'Data & IA', description: 'Architecture data, modélisation et intelligence artificielle.' },
  { slug: 'cyber', label: 'Cyber', description: 'Audit, conseil et accompagnement en cybersécurité.' },
]

const MEMBERS: Record<BuSlug, Member[]> = {
  digital: [
    { id: 'd1', name: 'Stéphanie Demarez', role: 'Direction' },
    { id: 'd2', name: 'Noémie Vannoye', role: 'Responsable RH' },
    { id: 'd3', name: 'Business Manager', role: 'En cours de recrutement', pending: true },
    { id: 'd4', name: 'Alternance RH', role: 'En cours de recrutement', pending: true },
  ],
  product: [
    { id: 'p1', name: 'Laetitia Lesaffre', role: 'Direction' },
    { id: 'p2', name: 'Victoire Machowiak', role: 'Responsable RH' },
  ],
  'data-ia': [
    { id: 'di1', name: 'Robin Rins', role: 'Direction' },
    { id: 'di2', name: 'Lena Lebecq', role: 'Responsable RH' },
  ],
  cyber: [
    { id: 'c1', name: 'Laurent Descleves', role: 'Direction' },
    { id: 'c2', name: 'Responsable RH', role: 'En cours de recrutement', pending: true },
  ],
}

const activeTab = ref<BuSlug>('digital')
const visibleMembers = computed(() => MEMBERS[activeTab.value])
const activeTabDescription = computed(() => TABS.find((t) => t.slug === activeTab.value)!.description)
const activeTabLabel = computed(() => TABS.find((t) => t.slug === activeTab.value)!.label)

// Dictionnaire d'état retourné : clé = member.id. Les cartes en attente ne sont pas cliquables.
const flippedCards = reactive<Record<string, boolean>>({})

function toggleFlip(id: string) {
  flippedCards[id] = !flippedCards[id]
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}
</script>

<template>
  <section
    id="business-units"
    data-theme="light"
    class="h-dvh shrink-0 w-full snap-start snap-always flex flex-col bg-light px-4 pt-36 pb-8 sm:px-6 lg:px-8 xl:px-12"
  >
    <header class="max-w-5xl px-4 md:px-24 lg:px-28">
      <p class="text-eyebrow uppercase text-accent-700">Notre Organisation</p>
      <h2 class="mt-4 font-display text-display text-balance text-primary-900">
        Nos Business Units
      </h2>
      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-primary-900/60">
        Une organisation par métier, pas par portefeuille commercial
      </p>
    </header>

    <div class="flex-1 w-full max-w-7xl mt-10 overflow-hidden flex flex-col gap-8 items-start px-4 md:px-24 lg:px-28">
      <div
        role="tablist"
        aria-label="Naviguer par BU"
        class="inline-flex flex-wrap gap-1 rounded-full bg-white p-1.5 shadow-soft ring-1 ring-primary-900/8"
      >
        <button
          v-for="tab in TABS"
          :key="tab.slug"
          type="button"
          role="tab"
          :aria-selected="activeTab === tab.slug"
          class="cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ease-snap focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary-900 motion-reduce:transition-none"
          :class="
            activeTab === tab.slug
              ? 'bg-primary-900 text-white shadow-soft'
              : 'text-primary-900/60 hover:bg-primary-900/5 hover:text-primary-900'
          "
          @click="activeTab = tab.slug"
        >
          {{ tab.label }}
        </button>
      </div>

      <Transition
        enter-active-class="transition-[opacity,transform] duration-400 ease-premium motion-reduce:transition-none"
        leave-active-class="transition-[opacity,transform] duration-200 ease-premium motion-reduce:transition-none"
        enter-from-class="translate-y-4 opacity-0"
        leave-to-class="-translate-y-2 opacity-0"
        mode="out-in"
      >
        <div
          :key="activeTab"
          class="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <!-- Conteneur de perspective : dimensionne la carte et fournit le point de fuite 3D. -->
          <div
            v-for="member in visibleMembers"
            :key="member.id"
            class="h-[23rem]"
            style="perspective: 1000px"
            :class="member.pending ? 'opacity-60' : ''"
          >
            <!-- Plateau rotatif : preserve-3d permet aux deux faces de coexister en 3D. -->
            <div
              class="relative h-full w-full [transform-style:preserve-3d] transition-transform duration-700 ease-premium motion-reduce:transition-none"
              :class="flippedCards[member.id] ? 'rotate-y-180' : ''"
              @click="!member.pending && toggleFlip(member.id)"
            >

              <!-- ═══════════════════════════════════════════════════════════
                   FACE AVANT : zone navy + bloc blanc avec hover slide
                   ══════════════════════════════════════════════════════════ -->
              <article
                class="group absolute inset-0 flex flex-col overflow-hidden rounded-panel bg-primary-900 shadow-soft ring-1 [backface-visibility:hidden] transition-[box-shadow] duration-300 hover:shadow-lift motion-reduce:transition-none"
                :class="[
                  member.pending ? 'ring-white/5' : 'ring-white/10 cursor-pointer',
                ]"
              >
                <!-- Zone navy : gradient + initiales / description au survol -->
                <div class="relative flex-1">
                  <span
                    aria-hidden="true"
                    class="flex size-full items-center justify-center bg-linear-to-br from-primary-800 to-primary-950 font-display text-5xl font-extrabold transition-opacity duration-300 group-hover:opacity-0 motion-reduce:transition-none"
                    :class="member.pending ? 'text-white/10' : 'text-white/15'"
                  >
                    {{ member.pending ? '?' : initials(member.name) }}
                  </span>
                  <div
                    class="absolute inset-0 flex items-center justify-center bg-primary-900/95 p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
                    aria-hidden="true"
                  >
                    <p class="text-center text-sm leading-relaxed text-white/80">{{ activeTabDescription }}</p>
                  </div>
                </div>

                <!-- Vague + bloc blanc solidaires : glissent ensemble au survol -->
                <div class="shrink-0 transition-transform duration-500 ease-out group-hover:translate-y-6 motion-reduce:transition-none">
                  <svg
                    class="h-8 w-full text-white"
                    viewBox="0 0 320 32"
                    preserveAspectRatio="none"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M0 16c53-21 107 11 160 4s107-25 160-4v16H0z" fill="currentColor" />
                  </svg>
                  <div class="bg-white px-5 pt-2 pb-5">
                    <h3 class="font-display text-base font-bold text-primary-900">{{ member.name }}</h3>
                    <p
                      class="mt-1 text-sm font-semibold"
                      :class="member.pending ? 'italic text-primary-900/35' : 'text-accent-700'"
                    >{{ member.role }}</p>
                    <span aria-hidden="true" class="mt-3 block h-0.5 w-8 rounded-full bg-accent-500" />
                  </div>
                </div>
              </article>

              <!-- ═══════════════════════════════════════════════════════════
                   FACE ARRIÈRE : identité BU + description + CTA
                   rotate-y-180 la retourne face cachée par défaut ;
                   quand le plateau tourne à 180°, elle revient face visible.
                   ══════════════════════════════════════════════════════════ -->
              <div
                class="absolute inset-0 flex flex-col justify-between rounded-panel bg-primary-900 p-6 [backface-visibility:hidden] [transform:rotateY(180deg)] ring-1 ring-white/10 shadow-soft cursor-pointer"
              >
                <div>
                  <p class="text-eyebrow uppercase text-accent-500">BU {{ activeTabLabel }}</p>
                  <span aria-hidden="true" class="mt-2 block h-0.5 w-8 rounded-full bg-accent-500" />
                  <p class="mt-4 text-sm leading-relaxed text-white/75">{{ activeTabDescription }}</p>
                </div>

                <button
                  type="button"
                  class="mt-6 w-full rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-primary-900 transition-colors duration-200 hover:bg-accent-500 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
                  @click.stop
                >
                  Voir la BU &amp; ses consultants
                </button>
              </div>

            </div>
          </div>
        </div>
      </Transition>
    </div>
  </section>
</template>
