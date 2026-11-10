<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { CardSize, CardTone, Navigable } from './types'

/**
 * Carte de mise en avant (inspiration Exalt) : grande typographie, relief par
 * l'ombre, bascule de couleur au survol, éléments superposés (filigrane
 * numéroté, pastille de hiérarchisation).
 *
 * Purement présentationnel. La carte devient cliquable dans son ensemble dès
 * qu'on lui passe `to` ou `href`  on évite ainsi le lien imbriqué dans une
 * carte déjà cliquable, qui produit deux cibles concurrentes pour un lecteur
 * d'écran.
 */
interface Props extends Navigable {
  title: string
  /** Surtitre court, en capitales. */
  eyebrow?: string
  /** Pastille superposée au bord supérieur. */
  badge?: string
  tone?: CardTone
  /** Gabarit de la carte  cf. `CardSize` dans `types.ts`. */
  size?: CardSize
  /**
   * Ombre renforcée en permanence (`shadow-lift`, déjà le jeton utilisé au
   * survol des cartes interactives) plutôt que la `shadow-soft` par défaut
   * pour une carte mise en avant hors interaction. Introduit en V0.1.17 pour
   * la carte active de `CoverCarousel` ; depuis V0.1.18 (« naked slider »,
   * cf. ADR 22), cette section utilise `CarouselSlideContent` (aucun encart,
   * donc aucune ombre)  `elevated` n'a plus de consommateur en production,
   * conservé pour un futur usage de `HighlightCard` hors carrousel (même
   * principe que le créneau `icon`, cf. ADR 15).
   */
  elevated?: boolean
  /**
   * Filigrane numéroté en fond (« 01 »). Décoratif : masqué aux technologies
   * d'assistance.
   */
  index?: number
  /**
   * Niveau du titre. Explicite pour préserver l'imbrication des `Hn` : une
   * carte n'a aucun moyen de connaître la profondeur de la section qui
   * l'accueille (point repris à l'audit SEO de l'étape 4).
   */
  headingLevel?: 2 | 3 | 4 | 5
  /** Libellé de l'appel à l'action, affiché seulement si la carte navigue. */
  actionLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  tone: 'light',
  size: 'md',
  elevated: false,
  headingLevel: 3,
  actionLabel: 'En savoir plus',
})

defineSlots<{
  /** Corps de la carte : description, liste de puces… */
  default?(): unknown
  /** Pictogramme affiché dans la vignette d'en-tête. */
  icon?(): unknown
  /** Remplace la ligne d'appel à l'action. */
  footer?(): unknown
  /**
   * Remplace le texte de `title` par un contenu enrichi (ex. surlignage
   * marqueur partiel, `CardCarousel` V0.1.14). `title` reste obligatoire :
   * c'est le texte affiché par défaut si ce créneau n'est pas fourni, les
   * deux ne s'affichent jamais en même temps.
   */
  title?(): unknown
}>()

const isInteractive = computed(() => props.to !== undefined || props.href !== undefined)

const tag = computed(() => {
  if (props.to !== undefined) return RouterLink
  if (props.href !== undefined) return 'a'
  return 'div'
})

const attrs = computed(() => {
  if (props.to !== undefined) return { to: props.to }
  if (props.href !== undefined) return { href: props.href }
  return {}
})

const heading = computed(() => `h${props.headingLevel}`)

/**
 * Habillage par tonalité. Deux surfaces seulement  blanc et navy  et tous
 * les survols convergent vers le navy : c'est le geste qui unifie une grille
 * de cartes hétérogènes.
 *
 * RÈGLE DE COULEUR ne pas contourner
 * L'accent ne sert JAMAIS de surface de carte (cf. `CardTone` dans types.ts).
 * Il n'apparaît ici que par touches, sur des éléments de petite taille et
 * toujours sur fond navy, où il tient 9,1:1 :
 *    le surtitre (`eyebrow`) au survol,
 *    la vignette de pictogramme (`chip`) au survol,
 *    le trait qui se déploie et le filigrane numéroté (dans le template),
 *    la bague de mise en relief (`ring`) au survol.
 * Chacune de ces touches est doublée d'un signal non chromatique  bascule de
 * fond, agrandissement du trait, décalage de la flèche  pour rester lisible
 * en deutéranopie comme en protanopie.
 */
const TONES: Record<CardTone, Record<'root' | 'eyebrow' | 'title' | 'body' | 'chip', string>> = {
  light: {
    root: 'bg-white text-primary-900 ring-1 ring-primary-900/8 hover:bg-primary-900 hover:ring-accent-500/60',
    // accent-700 sur blanc = 4,9:1 (AA) ; accent-500 une fois le fond passé au navy = 9,1:1 (AAA).
    eyebrow: 'text-accent-700 group-hover:text-accent-500',
    title: 'text-primary-900 group-hover:text-white',
    body: 'text-primary-900/65 group-hover:text-white/75',
    chip: 'bg-primary-900/5 text-primary-900 group-hover:bg-accent-500 group-hover:text-primary-900',
  },
  dark: {
    root: 'bg-primary-900 text-white ring-1 ring-white/10 hover:ring-accent-500/60',
    eyebrow: 'text-accent-500',
    title: 'text-white',
    body: 'text-white/70',
    chip: 'bg-white/10 text-white group-hover:bg-accent-500 group-hover:text-primary-900',
  },
}

const tone = computed(() => TONES[props.tone])

/**
 * Marges et typographie de titre par gabarit (`CardSize`, cf. `types.ts`).
 * `md` reprend l'habillage d'origine (grille, plusieurs cartes visibles) ;
 * `lg` (V0.1.15, `CardCarousel`) agrandit les deux pour une carte seule qui
 * occupe toute l'attention `text-display` est le palier immédiatement
 * au-dessus de `text-title` dans l'échelle fluide de `main.css`, déjà
 * utilisé pour les titres de section (`<h2>`) : la carte devient le second
 * niveau de lecture le plus imposant de la page, jamais aussi massive que le
 * titre de section lui-même (`text-mega` réservé au Hero).
 */
const SIZES: Record<CardSize, { root: string; title: string; body: string }> = {
  md: { root: 'p-6 sm:p-8', title: 'text-title', body: 'text-base' },
  lg: { root: 'p-8 sm:p-12 lg:p-16', title: 'text-display', body: 'text-lg' },
}

const size = computed(() => SIZES[props.size])
</script>

<template>
  <component
    :is="tag"
    v-bind="attrs"
    class="group relative isolate flex flex-col overflow-hidden rounded-card transition duration-300 ease-snap focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary-900 motion-reduce:transform-none motion-reduce:transition-none"
    :class="[
      tone.root,
      size.root,
      elevated ? 'shadow-lift' : 'shadow-soft',
      isInteractive ? 'cursor-pointer hover:-translate-y-2 hover:shadow-lift' : '',
    ]"
  >
    <!-- Lueur d'accent révélée au survol. -->
    <span
      aria-hidden="true"
      class="absolute -top-24 -right-24 -z-10 size-56 rounded-full bg-accent-500/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
    />

    <!-- Filigrane numéroté : superposition typographique. -->
    <span
      v-if="index !== undefined"
      aria-hidden="true"
      class="pointer-events-none absolute -top-6 right-2 -z-10 font-display text-mega leading-none font-extrabold opacity-[0.07] transition-opacity duration-500 select-none group-hover:opacity-[0.14]"
    >
      {{ String(index).padStart(2, '0') }}
    </span>

    <div v-if="$slots.icon || badge" class="flex items-start justify-between gap-4">
      <span
        v-if="$slots.icon"
        class="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl transition-colors duration-300"
        :class="tone.chip"
      >
        <slot name="icon" />
      </span>

      <span
        v-if="badge"
        class="ml-auto rounded-full px-3 py-1 text-eyebrow uppercase transition-colors duration-300"
        :class="tone.chip"
      >
        {{ badge }}
      </span>
    </div>

    <p
      v-if="eyebrow"
      class="mt-6 text-eyebrow uppercase transition-colors duration-300"
      :class="tone.eyebrow"
    >
      {{ eyebrow }}
    </p>

    <component
      :is="heading"
      class="mt-2 font-display text-balance transition-colors duration-300"
      :class="[tone.title, size.title]"
    >
      <slot name="title">{{ title }}</slot>
    </component>

    <!-- Trait d'accent qui se déploie : signale l'état survolé sans dépendre
         uniquement de la couleur. -->
    <span
      aria-hidden="true"
      class="mt-4 h-0.5 w-10 origin-left bg-accent-500 transition-transform duration-300 ease-snap group-hover:scale-x-[3.5] motion-reduce:transition-none"
    />

    <div
      v-if="$slots.default"
      class="mt-4 leading-relaxed transition-colors duration-300"
      :class="[tone.body, size.body]"
    >
      <slot />
    </div>

    <div
      v-if="$slots.footer || isInteractive"
      class="mt-6 flex flex-col items-start gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
    >
      <div class="w-full sm:w-auto">
        <slot name="footer">
          <span class="text-sm font-semibold transition-colors duration-300" :class="tone.title">
            {{ actionLabel }}
          </span>
        </slot>
      </div>
      <svg
        class="size-4 shrink-0 transition-transform duration-300 ease-snap group-hover:translate-x-1.5 motion-reduce:transition-none"
        :class="tone.title"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 10h14M11 4l6 6-6 6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </component>
</template>
