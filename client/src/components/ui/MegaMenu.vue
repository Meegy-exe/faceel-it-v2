<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
import logoDark from '@/assets/images/logo-bleu.png'
import logoWhite from '@/assets/images/logo-blanc.png'
import type { MegaMenuEntry } from './types'
import { MENU_DEFAULT, MENU_PANEL_CONFIG } from '@/features/navigation/mainNav'

const open = defineModel<boolean>('open', { default: false })
const isDarkTheme = defineModel<boolean>('dark', { default: true })

const props = defineProps<{
  entries: MegaMenuEntry[]
  scrollRoot?: HTMLElement | null
}>()

defineSlots<{
  logo?(): unknown
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
/* Panneau gauche — info dynamique au survol                                  */
/* -------------------------------------------------------------------------- */

const hoveredId = ref<string | null>(null)

const panelInfo = computed(
  () => (hoveredId.value ? MENU_PANEL_CONFIG[hoveredId.value] : undefined) ?? MENU_DEFAULT,
)

/* -------------------------------------------------------------------------- */
/* Sous-menu (Drill-down)                                                     */
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
/* Icônes par entrée                                                          */
/* -------------------------------------------------------------------------- */

type EntryIconKind = 'entreprise' | 'references' | 'collectif' | 'default'
function entryIconKind(id: string): EntryIconKind {
  if (id === 'entreprise' || id === 'references') return id
  if (id === 'qui-sommes-nous') return 'collectif'
  return 'default'
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

        <!-- Les actions du header (bouton Nous contacter / Nous rejoindre).
             `surface` suit `isBarDark`, PAS `isDarkTheme` seul : c'est cette
             valeur, et pas le thème brut de la section, qui reflète le fond
             réel de CETTE barre (menu ouvert compris). -->
        <div class="ml-auto hidden lg:flex lg:items-center">
          <slot name="actions" :surface="isBarDark ? 'dark' : 'light'" />
        </div>
      </div>
    </div>

    <!-- PANNEAU DE MENU (Fixé en blanc) -->
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
      <nav
        aria-label="Navigation principale"
        class="w-full min-h-[400px]"
      >
        <!-- Transition croisée entre le niveau principal et le sous-menu -->
        <Transition
          enter-active-class="transition-opacity duration-300 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
          mode="out-in"
        >
          <!-- VUE 1 : MENU PRINCIPAL — layout split (encart bleu gauche + liens droite) -->
          <div
            v-if="!expandedEntry"
            key="main-menu"
            class="flex min-h-[400px] w-full"
            @mouseleave="hoveredId = null"
          >

            <!-- Panneau gauche : infos dynamiques (desktop uniquement).
                 `justify-between` pousse le CTA en bas, le contenu textuel
                 reste en haut — même si la description est courte. -->
            <div class="hidden lg:flex flex-col justify-between w-80 xl:w-96 shrink-0 bg-[#000066] p-8">
              <Transition
                enter-active-class="transition-opacity duration-200 ease-out"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition-opacity duration-150 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
                mode="out-in"
              >
                <div :key="panelInfo.title">
                  <p class="mb-4 text-xs font-semibold uppercase tracking-widest text-accent-500">
                    Faceel-IT
                  </p>
                  <h2 class="font-display text-2xl font-bold leading-tight text-white">
                    {{ panelInfo.title }}
                  </h2>
                  <p class="mt-4 text-sm leading-relaxed text-white/70">
                    {{ panelInfo.description }}
                  </p>
                </div>
              </Transition>

              <RouterLink
                :to="panelInfo.ctaTo"
                class="mt-8 inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-accent-500"
                @click="closeMenu()"
              >
                {{ panelInfo.ctaLabel }}
                <svg class="size-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </RouterLink>
            </div>

            <!-- Panneau droit : liste des entrées -->
            <div class="flex-1 px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
              <ul class="flex flex-col gap-1">
                <li v-for="entry in entries" :key="entry.id">

                  <!-- Bouton Drill-down (avec sous-menu) -->
                  <button
                    v-if="entry.columns"
                    type="button"
                    class="flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-left font-display text-lg font-bold text-primary-900 hover:bg-primary-900/5 focus-visible:outline-primary-900 transition-colors duration-200 motion-reduce:transition-none"
                    :tabindex="open ? undefined : -1"
                    @mouseenter="hoveredId = entry.id"
                    @click="drillDown(entry.id)"
                  >
                    <span
                      aria-hidden="true"
                      class="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-900/5 text-primary-900"
                    >
                      <svg v-if="entryIconKind(entry.id) === 'entreprise'" class="size-5" viewBox="0 0 24 24" fill="none">
                        <rect x="4" y="7.5" width="16" height="11" rx="1.5" stroke="currentColor" stroke-width="2" />
                        <path d="M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5M4 12h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                      </svg>
                      <svg v-else-if="entryIconKind(entry.id) === 'references'" class="size-5" viewBox="0 0 24 24" fill="none">
                        <path d="M4 21V9.5L12 4l8 5.5V21M9 21v-6h6v6M4 21h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <svg v-else-if="entryIconKind(entry.id) === 'collectif'" class="size-5" viewBox="0 0 24 24" fill="none">
                        <circle cx="9" cy="8" r="3.5" stroke="currentColor" stroke-width="2" />
                        <path d="M2.5 19.5v-1.2c0-2.4 2.9-4.3 6.5-4.3s6.5 1.9 6.5 4.3v1.2M16 5.2a3.5 3.5 0 0 1 0 5.6M18 14.2c2.1.6 3.5 2.1 3.5 3.9v1.4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <svg v-else class="size-5" viewBox="0 0 24 24" fill="none">
                        <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </span>
                    <span class="flex-1">{{ entry.label }}</span>
                    <svg class="size-4 shrink-0 text-primary-900/40" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="m8 5 5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>

                  <!-- Lien simple (sans sous-menu) -->
                  <component
                    :is="entry.to !== undefined ? 'RouterLink' : 'a'"
                    v-else
                    v-bind="entry.to !== undefined ? { to: entry.to } : { href: entry.href }"
                    class="flex w-full items-center gap-4 rounded-xl px-4 py-3.5 font-display text-lg font-bold text-primary-900 hover:bg-primary-900/5 focus-visible:outline-primary-900 transition-colors duration-200 motion-reduce:transition-none"
                    :tabindex="open ? undefined : -1"
                    @mouseenter="hoveredId = entry.id"
                    @click="closeMenu()"
                  >
                    <span
                      aria-hidden="true"
                      class="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-900/5 text-primary-900"
                    >
                      <svg v-if="entryIconKind(entry.id) === 'entreprise'" class="size-5" viewBox="0 0 24 24" fill="none">
                        <rect x="4" y="7.5" width="16" height="11" rx="1.5" stroke="currentColor" stroke-width="2" />
                        <path d="M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5M4 12h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                      </svg>
                      <svg v-else-if="entryIconKind(entry.id) === 'references'" class="size-5" viewBox="0 0 24 24" fill="none">
                        <path d="M4 21V9.5L12 4l8 5.5V21M9 21v-6h6v6M4 21h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <svg v-else-if="entryIconKind(entry.id) === 'collectif'" class="size-5" viewBox="0 0 24 24" fill="none">
                        <circle cx="9" cy="8" r="3.5" stroke="currentColor" stroke-width="2" />
                        <path d="M2.5 19.5v-1.2c0-2.4 2.9-4.3 6.5-4.3s6.5 1.9 6.5 4.3v1.2M16 5.2a3.5 3.5 0 0 1 0 5.6M18 14.2c2.1.6 3.5 2.1 3.5 3.9v1.4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <svg v-else class="size-5" viewBox="0 0 24 24" fill="none">
                        <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </span>
                    <span class="flex-1">{{ entry.label }}</span>
                  </component>

                </li>
              </ul>

              <!-- `surface="light"` EN DUR, jamais `isBarDark` : ce rendu vit
                   dans le panneau blanc, pas dans la barre — sa lisibilité ne
                   doit jamais dépendre du thème de la section survolée. -->
              <div class="mt-6 border-t border-primary-900/10 pt-4 lg:hidden">
                <slot name="actions" surface="light" />
              </div>
            </div>

          </div>

          <!-- VUE 2 : SOUS-MENU (Drill-down panel, centré) -->
          <div v-else key="sub-menu" class="w-full flex flex-col items-center px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
            <!-- Header du sous-menu -->
            <div class="relative flex w-full max-w-7xl items-center justify-center mb-12 px-3">
              <!-- Bouton Retour aligné à gauche -->
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

              <!-- Titre centré -->
              <h2
                class="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-primary-900 text-center"
              >
                {{ expandedEntry.label }}
              </h2>
            </div>

            <!-- Contenu des colonnes aéré et centré -->
            <div
              class="flex w-full max-w-5xl flex-col gap-10 md:flex-row md:justify-center md:gap-x-24 px-3"
            >
              <div
                v-for="column in expandedEntry.columns"
                :key="column.title"
                class="md:flex-1 w-full"
              >
                <p class="mb-5 text-eyebrow uppercase text-primary-900/45">
                  {{ column.title }}
                </p>
                <ul class="space-y-3">
                  <li v-for="link in column.links" :key="link.label">
                    <component
                      :is="link.to !== undefined ? 'RouterLink' : 'a'"
                      v-bind="link.to !== undefined ? { to: link.to } : { href: link.href }"
                      class="flex items-center gap-3 rounded-lg py-2 text-lg text-primary-900/80 hover:bg-primary-900/5 hover:text-primary-900 focus-visible:outline-primary-900 transition-colors duration-200 motion-reduce:transition-none"
                      :tabindex="open ? undefined : -1"
                    >
                      {{ link.label }}
                      <span
                        v-if="link.badge"
                        class="rounded-full bg-accent-500/15 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-accent-700"
                      >
                        {{ link.badge }}
                      </span>
                    </component>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Transition>
      </nav>
    </div>
  </header>
</template>
