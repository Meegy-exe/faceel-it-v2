<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
import logoDark from '@/assets/images/logo-bleu.png'
import logoWhite from '@/assets/images/logo-blanc.png'
import { BUSINESS_UNITS, NAV_DEFAULT, type NavItem } from '@/features/navigation/mainNav'

const open = defineModel<boolean>('open', { default: false })
const isDarkTheme = defineModel<boolean>('dark', { default: true })

const props = defineProps<{
  entries: NavItem[]
  scrollRoot?: HTMLElement | null
}>()

defineSlots<{
  logo?(): unknown
  /**
   * Toujours visible dans la barre (mobile + desktop). Surface suit `isBarDark`
   * comme les actions desktop. Typiquement : bouton icône chatbot.
   */
  chatButton?(props: { surface: 'light' | 'dark' }): unknown
  /**
   * Rendu à DEUX endroits distincts (barre desktop + panneau mobile, cf.
   * template) — jamais avec le même fond. `surface` est donc un paramètre du
   * SLOT, pas une prop lue une fois côté appelant : `App.vue` ne peut pas
   * deviner depuis l'extérieur sur quel fond chaque rendu va atterrir, seul
   * ce composant le sait à l'endroit où il pose chaque `<slot>`.
   */
  actions?(props: { surface: 'light' | 'dark' }): unknown
}>()

const toggleRef = useTemplateRef<HTMLButtonElement>('toggle')
const headerRef = useTemplateRef<HTMLElement>('header')
defineExpose({ focusToggle: () => toggleRef.value?.focus() })

onClickOutside(headerRef, () => {
  open.value = false
})

/* -------------------------------------------------------------------------- */
/* Panneau gauche + zone droite — dynamiques au survol                        */
/* -------------------------------------------------------------------------- */

const activeItem = ref<NavItem>(NAV_DEFAULT)

/* -------------------------------------------------------------------------- */
/* Sous-menu (Drill-down mobile)                                              */
/* -------------------------------------------------------------------------- */

const expandedId = ref<string | null>(null)

function drillDown(id: string) {
  expandedId.value = id
}

function goBack() {
  expandedId.value = null
}

const expandedEntry = computed(
  () => props.entries.find((entry) => entry.id === expandedId.value) ?? null,
)

watch(open, (isOpen) => {
  if (!isOpen) expandedId.value = null
})

function closeMenu() {
  open.value = false
  toggleRef.value?.focus()
}

/* -------------------------------------------------------------------------- */
/* Détection du thème de la section survolée par la barre                     */
/* -------------------------------------------------------------------------- */

const HEADER_OFFSET_PX = 80

const observedSections = ref<HTMLElement[]>([])
let observer: IntersectionObserver | null = null

function syncActiveTheme() {
  const sections = observedSections.value
  if (sections.length === 0) return

  const rootTop = props.scrollRoot?.getBoundingClientRect().top ?? 0
  const line = rootTop + HEADER_OFFSET_PX

  let active: HTMLElement | undefined
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= line) active = section
  }

  isDarkTheme.value = (active ?? sections[0])?.dataset.theme !== 'light'
}

function teardownObserver() {
  observer?.disconnect()
  observer = null
  observedSections.value = []
}

function setupObserver() {
  teardownObserver()
  if (import.meta.env.SSR || typeof IntersectionObserver === 'undefined') return

  const sections = Array.from(document.querySelectorAll<HTMLElement>('section[data-theme]'))

  if (sections.length === 0) {
    isDarkTheme.value = false
    return
  }

  observedSections.value = sections
  observer = new IntersectionObserver(syncActiveTheme, {
    root: props.scrollRoot ?? null,
    rootMargin: `-${HEADER_OFFSET_PX}px 0px 0px 0px`,
    threshold: 0,
  })
  sections.forEach((section) => observer?.observe(section))

  syncActiveTheme()
}

const route = useRoute()

onMounted(setupObserver)
onBeforeUnmount(teardownObserver)

watch([() => props.scrollRoot, () => route.fullPath], async () => {
  await nextTick()
  setupObserver()
})

/* -------------------------------------------------------------------------- */
/* Habillages dynamiques                                                      */
/* -------------------------------------------------------------------------- */

const isBarDark = computed(() => isDarkTheme.value)

const headerClass = computed(() =>
  isBarDark.value
    ? 'border-b border-white/5 bg-[#000066] shadow-sm shadow-black/20'
    : 'border-b border-primary-900/10 bg-white/95 backdrop-blur-xl',
)

const controlClass = computed(() =>
  isBarDark.value
    ? 'text-white hover:bg-white/10 focus-visible:outline-accent-500'
    : 'text-primary-900 hover:bg-primary-900/5 focus-visible:outline-primary-900',
)

const focusRingClass = computed(() =>
  isBarDark.value ? 'focus-visible:outline-accent-500' : 'focus-visible:outline-primary-900',
)
</script>

<template>
  <header
    ref="header"
    class="fixed top-0 left-0 z-50 w-full transition-all duration-700 ease-in-out motion-reduce:transition-none"
    :class="headerClass"
    @keydown.esc="closeMenu()"
  >
    <div class="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
      <div class="flex h-16 items-center gap-4 lg:h-20">
        <button
          ref="toggle"
          type="button"
          class="inline-flex size-11 shrink-0 items-center justify-center rounded-full transition-colors duration-700 ease-in-out focus-visible:outline-3 focus-visible:outline-offset-2 motion-reduce:transition-none"
          :class="controlClass"
          :aria-expanded="open"
          aria-controls="app-nav-panel"
          :aria-label="open ? 'Fermer le menu' : 'Ouvrir le menu'"
          @click="open = !open"
        >
          <svg class="size-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              v-if="!open"
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              v-else
              d="m6 6 12 12M18 6 6 18"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <RouterLink
          to="/"
          aria-label="Faceel-IT — retour à l'accueil"
          class="shrink-0 rounded-xl focus-visible:outline-3 focus-visible:outline-offset-2"
          :class="focusRingClass"
        >
          <slot name="logo">
            <span class="relative block h-14">
              <img
                :src="logoDark"
                alt=""
                class="h-14 w-auto object-contain transition-opacity duration-700 ease-in-out motion-reduce:transition-none"
                :class="isBarDark ? 'opacity-0' : 'opacity-100'"
              />
              <img
                :src="logoWhite"
                alt=""
                class="absolute inset-0 h-14 w-auto object-contain transition-opacity duration-700 ease-in-out motion-reduce:transition-none"
                :class="isBarDark ? 'opacity-100' : 'opacity-0'"
              />
            </span>
          </slot>
        </RouterLink>

        <!-- Zone droite de la barre : chatButton (toujours visible) + actions
             desktop (masquées sur mobile). Le ml-auto pousse tout le groupe
             contre le bord droit, le chatButton est donc toujours accessible
             quel que soit l'écran. `surface` suit `isBarDark` (fond réel de
             la barre, menu ouvert compris, pas le thème brut de la section). -->
        <div class="ml-auto flex items-center gap-2">
          <slot name="chatButton" :surface="isBarDark ? 'dark' : 'light'" />
          <div class="hidden lg:flex lg:items-center">
            <slot name="actions" :surface="isBarDark ? 'dark' : 'light'" />
          </div>
        </div>
      </div>
    </div>

    <!-- PANNEAU DE MENU -->
    <div
      id="app-nav-panel"
      class="absolute top-full left-0 w-full origin-top border-b border-primary-900/10 bg-white shadow-2xl shadow-black/10 transition-all duration-500 ease-snap motion-reduce:transition-none overflow-hidden"
      :class="
        open
          ? 'visible translate-y-0 opacity-100'
          : 'pointer-events-none invisible -translate-y-2 opacity-0'
      "
      :aria-hidden="!open"
    >
      <nav aria-label="Navigation principale" class="w-full min-h-[400px]">
        <Transition
          enter-active-class="transition-opacity duration-300 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
          mode="out-in"
        >
          <!-- VUE 1 : MENU PRINCIPAL — layout 3 zones (desktop) -->
          <div
            v-if="!expandedEntry"
            key="main-menu"
            class="flex min-h-[400px] w-full"
            @mouseleave="activeItem = NAV_DEFAULT"
          >
            <!-- ZONE 1 : Panneau gauche (info dynamique, desktop uniquement) -->
            <div
              class="hidden lg:flex flex-col justify-start w-80 xl:w-96 shrink-0 bg-[#000066] p-8"
            >
              <Transition
                enter-active-class="transition-opacity duration-200 ease-out"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition-opacity duration-150 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
                mode="out-in"
              >
                <div :key="activeItem.id">
                  <p class="mb-4 text-xs font-semibold uppercase tracking-widest text-accent-500">
                    Faceel-IT
                  </p>
                  <h2 class="font-display text-2xl font-bold leading-tight text-white">
                    {{ activeItem.title }}
                  </h2>
                  <p class="mt-4 text-sm leading-relaxed text-white/70">
                    {{ activeItem.description }}
                  </p>
                </div>
              </Transition>
            </div>

            <!-- ZONE 2 : Liste des entrées principales
                 - Mobile  : pleine largeur, seule zone visible
                 - Desktop : colonne étroite (fond gris clair), sépare zone 1 et zone 3 -->
            <div
              class="flex-1 lg:flex-none lg:w-64 xl:w-72 lg:shrink-0 lg:bg-gray-50 lg:border-r lg:border-gray-100 py-6 lg:py-8 px-3 lg:px-3"
            >
              <ul class="flex flex-col gap-1">
                <li v-for="entry in entries" :key="entry.id">
                  <!-- Drill-down mobile (pas de lien direct → sous-pages multiples) -->
                  <button
                    v-if="!entry.to"
                    type="button"
                    class="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-display font-bold text-primary-900 transition-colors duration-200 motion-reduce:transition-none"
                    :class="
                      activeItem.id === entry.id
                        ? 'bg-primary-900/8 text-primary-900'
                        : 'hover:bg-primary-900/5'
                    "
                    :tabindex="open ? undefined : -1"
                    @mouseenter="activeItem = entry"
                    @click="drillDown(entry.id)"
                  >
                    <span class="flex-1 text-base text-left">{{ entry.label }}</span>
                    <svg
                      class="size-4 shrink-0 text-primary-900/30 lg:hidden"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="m8 5 5 5-5 5"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>

                  <!-- Lien direct -->
                  <RouterLink
                    v-else
                    :to="entry.to"
                    class="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-display font-bold text-primary-900 transition-colors duration-200 motion-reduce:transition-none"
                    :class="
                      activeItem.id === entry.id
                        ? 'bg-primary-900/8 text-primary-900'
                        : 'hover:bg-primary-900/5'
                    "
                    :tabindex="open ? undefined : -1"
                    @mouseenter="activeItem = entry"
                    @click="closeMenu()"
                  >
                    <span class="flex-1 text-base text-left">{{ entry.label }}</span>
                  </RouterLink>
                </li>
              </ul>

              <!-- `surface="light"` EN DUR : ce rendu vit dans le panneau
                   blanc, pas dans la barre — sa lisibilité ne doit jamais
                   dépendre du thème de la section survolée. -->
              <div class="mt-6 border-t border-primary-900/10 pt-4 px-1 lg:hidden">
                <slot name="actions" surface="light" />
              </div>
            </div>

            <!-- ZONE 3 : Sous-liens de l'entrée survolée (desktop uniquement)
                 — bandes verticales côte à côte, une colonne par entrée,
                 séparées par un trait vertical (cf. maquette). -->
            <div class="hidden lg:flex flex-1 items-stretch justify-start overflow-x-auto">
              <Transition
                enter-active-class="transition-opacity duration-200 ease-out"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition-opacity duration-150 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
                mode="out-in"
              >
                <ul
                  v-if="activeItem.subItems?.length"
                  :key="activeItem.id"
                  class="flex h-full w-full divide-x divide-primary-900/10"
                >
                  <li v-for="sub in activeItem.subItems" :key="sub.label" class="flex-1 min-w-[160px]">
                    <component
                      :is="sub.to !== undefined ? 'RouterLink' : 'a'"
                      v-bind="sub.to !== undefined ? { to: sub.to } : { href: sub.href ?? '#' }"
                      class="group flex h-full flex-col justify-center gap-2 p-6 lg:p-8 transition-colors duration-200 hover:bg-gray-50 focus-visible:outline-primary-900 motion-reduce:transition-none"
                      :tabindex="open ? undefined : -1"
                      @click="closeMenu()"
                    >
                      <p class="font-display text-lg font-bold text-primary-900 transition-colors duration-200 group-hover:text-accent-700 motion-reduce:transition-none">
                        {{ sub.label }}
                      </p>
                      <p v-if="sub.description" class="text-sm leading-relaxed text-primary-900/55">
                        {{ sub.description }}
                      </p>
                    </component>
                  </li>
                </ul>

                <!-- État vide (NAV_DEFAULT ou entrée sans subItems) : même
                     disposition en bandes, pour les 4 practices internes. -->
                <ul v-else key="empty" class="flex h-full w-full divide-x divide-primary-900/10">
                  <li v-for="bu in BUSINESS_UNITS" :key="bu.label" class="flex-1 min-w-[160px]">
                    <RouterLink
                      :to="bu.to"
                      class="group flex h-full flex-col justify-center gap-2 p-6 lg:p-8 transition-colors duration-200 hover:bg-gray-50 focus-visible:outline-primary-900 motion-reduce:transition-none"
                      :tabindex="open ? undefined : -1"
                      @click="closeMenu()"
                    >
                      <p class="font-display text-lg font-bold text-primary-900 transition-colors duration-200 group-hover:text-accent-700 motion-reduce:transition-none">
                        {{ bu.label }}
                      </p>
                    </RouterLink>
                  </li>
                </ul>
              </Transition>
            </div>
          </div>

          <!-- VUE 2 : SOUS-MENU MOBILE (drill-down pour entrées sans lien direct) -->
          <div
            v-else
            key="sub-menu"
            class="w-full flex flex-col items-center px-4 py-8 sm:px-6 lg:px-8 xl:px-12"
          >
            <div class="relative flex w-full max-w-7xl items-center justify-center mb-10 px-3">
              <button
                type="button"
                class="absolute left-0 flex items-center gap-2 rounded-xl py-2 pr-4 font-display text-base font-bold text-primary-900 hover:bg-primary-900/5 focus-visible:outline-primary-900 transition-colors duration-200 motion-reduce:transition-none"
                @click="goBack()"
              >
                <svg class="size-5 shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="m12 15-5-5 5-5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span class="hidden sm:inline">Retour</span>
              </button>

              <h2
                class="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-primary-900 text-center"
              >
                {{ expandedEntry.label }}
              </h2>
            </div>

            <ul class="w-full max-w-md flex flex-col gap-2">
              <li v-for="sub in expandedEntry.subItems" :key="sub.label">
                <component
                  :is="sub.to !== undefined ? 'RouterLink' : 'a'"
                  v-bind="sub.to !== undefined ? { to: sub.to } : { href: sub.href ?? '#' }"
                  class="flex items-start gap-4 rounded-xl p-4 transition-colors duration-200 hover:bg-gray-50 focus-visible:outline-primary-900 motion-reduce:transition-none"
                  :tabindex="open ? undefined : -1"
                  @click="closeMenu()"
                >
                  <div class="flex-1">
                    <p class="text-base font-semibold text-primary-900">{{ sub.label }}</p>
                    <p v-if="sub.description" class="mt-0.5 text-sm text-primary-900/55">
                      {{ sub.description }}
                    </p>
                  </div>
                  <svg
                    class="mt-1 size-4 shrink-0 text-primary-900/25"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </component>
              </li>
            </ul>
          </div>
        </Transition>
      </nav>
    </div>
  </header>
</template>
