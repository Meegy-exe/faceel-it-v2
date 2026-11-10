<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { ButtonSize, ButtonVariant, Navigable } from './types'

/**
 * Bouton générique du Design System.
 *
 * Aucune logique métier : le composant ne fait qu'émettre `click`. Il choisit
 * son élément de rendu (`button`, `a`, `RouterLink`) selon `to` / `href`, ce
 * qui évite de dupliquer trois fois le même habillage dans les pages.
 *
 * Dynamisme du survol : un voile coloré monte depuis le bas (`sweep`) et un
 * reflet balaye le bouton (`sheen`). Les deux sont neutralisés par
 * `motion-reduce:` pour respecter `prefers-reduced-motion`.
 */
type Surface = 'light' | 'dark'

interface Props extends Navigable {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Ignoré dès que `to` ou `href` est fourni (l'élément n'est plus un bouton). */
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  /** Affiche un indicateur d'attente et neutralise l'interaction. */
  loading?: boolean
  /** Pleine largeur : utile en mobile-first, où les CTA sont empilés. */
  block?: boolean
  /**
   * Surface d'accueil du bouton. Le composant ne peut pas la deviner : rien,
   * en CSS, ne permet à un enfant de lire la couleur de fond de son parent.
   *
   * Elle pilote deux choses :
   *   1. L'habillage complet des trois variantes (cf. `SKINS`). Sur navy, un
   *      `primary` en `bg-primary-900` disparaît dans le fond et un `outline`
   *      en `text-primary-900` devient illisible.
   *   2. La couleur de l'indicateur de focus : l'accent (#12D80A) n'atteint
   *      pas 3:1 sur fond clair (WCAG 1.4.11), le navy n'atteint pas 3:1 sur
   *      fond sombre. Aucun des deux ne convient partout.
   */
  surface?: Surface
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  block: false,
  surface: 'light',
})

defineEmits<{ click: [event: MouseEvent] }>()

defineSlots<{
  default(): unknown
  /** Icône avant le libellé. Reçoit la classe de taille adéquate. */
  iconLeft?(): unknown
  /** Icône après le libellé, typiquement une flèche. */
  iconRight?(): unknown
}>()

const isLink = computed(() => props.to !== undefined || props.href !== undefined)

const tag = computed(() => {
  if (props.to !== undefined) return RouterLink
  if (props.href !== undefined) return 'a'
  return 'button'
})

const isInert = computed(() => props.disabled || props.loading)

/**
 * Un `<a>` n'a pas d'attribut `disabled`. On retire donc la cible et on le
 * sort de l'ordre de tabulation plutôt que de laisser un lien inerte
 * cliquable au clavier.
 */
const attrs = computed(() => {
  if (!isLink.value) {
    return { type: props.type, disabled: isInert.value }
  }

  if (isInert.value) {
    return { role: 'link', 'aria-disabled': 'true', tabindex: -1 }
  }

  return props.to !== undefined ? { to: props.to } : { href: props.href }
})

/**
 * `sm` seule est responsive : c'est la taille utilisée dans la navbar
 * (App.vue, slot `#actions`), toujours visible désormais jusqu'à 500px de
 * large (cf. MegaMenu.vue  plus de `hidden lg:flex` sur ce slot). `md`/`lg`
 * ne sont jamais utilisées dans un contexte aussi contraint.
 */
const SIZES: Record<ButtonSize, string> = {
  sm: 'h-7 gap-1 px-2 text-[11px] sm:h-9 sm:gap-1.5 sm:px-4 sm:text-sm',
  md: 'h-11 gap-2 px-6 text-base',
  lg: 'h-14 gap-2.5 px-8 text-lg',
}

const ICON_SIZES: Record<ButtonSize, string> = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
}

interface VariantSkin {
  /** Habillage au repos et au survol. */
  base: string
  /** Couleur du voile montant. `null` = pas de voile (variante fantôme). */
  sweep: string | null
}

/**
 * Habillages, indexés par surface puis par variante.
 *
 * Le geste est le même partout : la couleur de repos est celle qui contraste
 * avec la surface, le survol bascule vers la couleur opposée. Seules les
 * valeurs changent  sur clair on va vers l'accent, sur sombre on s'en éloigne
 * (l'accent est déjà la couleur de repos du bouton principal).
 *
 * Chaque couple couleur/fond ci-dessous est au-dessus de 4,5:1 :
 *   blanc sur navy 15,9:1 · navy sur accent-500 9,1:1 · navy sur blanc 18,1:1
 *   blanc/70 sur navy 7,5:1 (bordure, seuil non textuel de 3:1)
 *
 * `accent` reprend le pair navy-sur-accent-500 (9,1:1) sur les deux surfaces :
 * seul un bouton isolé peut se le permettre (cf. `ButtonVariant` dans
 * types.ts)  jamais une carte, jamais une section entière.
 */
const SKINS: Record<Surface, Record<ButtonVariant, VariantSkin>> = {
  light: {
    // Fond navy → bascule sur l'accent au survol.
    primary: {
      base: 'bg-primary-900 text-white shadow-soft hover:text-primary-900 hover:shadow-lift',
      sweep: 'bg-accent-500',
    },
    // fix contraste btn : bg-transparent + backdrop-blur de la navbar faussait
    // le calcul de contraste Lighthouse, fond blanc solide a la place.
    outline: {
      base: 'border-2 border-primary-900 bg-white text-primary-900 hover:text-white',
      sweep: 'bg-primary-900',
    },
    // Discret : pas de remplissage, une barre d'accent se déploie sous le texte.
    ghost: { base: 'bg-transparent text-primary-900 hover:bg-primary-900/5', sweep: null },
    // Aplat vert plein  cf. `ButtonVariant` dans types.ts pour la limite
    // d'usage (bouton isolé uniquement). Bascule vers le navy au survol.
    accent: {
      base: 'bg-accent-500 text-primary-900 shadow-soft hover:text-white hover:shadow-lift',
      sweep: 'bg-primary-900',
    },
  },
  dark: {
    // Sur navy, le remplissage navy s'annulerait : on part de l'accent et on
    // bascule vers le blanc. Le texte reste navy dans les deux états.
    primary: {
      base: 'bg-accent-500 text-primary-900 shadow-soft hover:shadow-glow',
      sweep: 'bg-white',
    },
    // Bordure claire, remplissage d'accent au survol.
    outline: {
      base: 'border-2 border-white/70 bg-transparent text-white hover:border-accent-500 hover:text-primary-900',
      sweep: 'bg-accent-500',
    },
    ghost: { base: 'bg-transparent text-white hover:bg-white/10', sweep: null },
    // Identique à `primary` sur fond sombre : c'est déjà la déclinaison
    // accent-plein de cette surface, `accent` n'a rien à en différencier ici.
    accent: {
      base: 'bg-accent-500 text-primary-900 shadow-soft hover:shadow-glow',
      sweep: 'bg-white',
    },
  },
}

/**
 * Barre d'accent de la variante fantôme : accent-600 sur clair (4,9:1),
 * accent-500 sur sombre (9,1:1). Élément non textuel, mais il porte à lui seul
 * l'état de survol  il doit rester franchement visible.
 */
const GHOST_BARS: Record<Surface, string> = {
  light: 'bg-accent-600',
  dark: 'bg-accent-500',
}

const skin = computed(() => SKINS[props.surface][props.variant])

const focusClasses = computed(() =>
  props.surface === 'dark'
    ? 'focus-visible:outline-accent-500'
    : 'focus-visible:outline-primary-900',
)
</script>

<template>
  <component
    :is="tag"
    v-bind="attrs"
    class="group relative isolate inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full font-display font-semibold tracking-tight whitespace-nowrap transition duration-200 ease-snap select-none hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transform-none motion-reduce:transition-none aria-disabled:pointer-events-none aria-disabled:opacity-50"
    :class="[
      SIZES[size],
      skin.base,
      focusClasses,
      block ? 'w-full' : '',
      loading ? 'cursor-wait' : '',
    ]"
    :aria-busy="loading ? 'true' : undefined"
    @click="$emit('click', $event)"
  >
    <!-- Voile montant : sous le contenu grâce à `isolate` + `-z-10`. -->
    <span
      v-if="skin.sweep"
      aria-hidden="true"
      class="absolute inset-0 -z-10 translate-y-full transition-transform duration-300 ease-snap group-hover:translate-y-0 motion-reduce:transition-none"
      :class="skin.sweep"
    />

    <!-- Barre d'accent de la variante fantôme. -->
    <span
      v-if="variant === 'ghost'"
      aria-hidden="true"
      class="absolute inset-x-4 bottom-1.5 h-0.5 origin-left scale-x-0 transition-transform duration-300 ease-snap group-hover:scale-x-100 motion-reduce:transition-none"
      :class="GHOST_BARS[surface]"
    />

    <!-- Reflet : rejoué à chaque survol. -->
    <span
      aria-hidden="true"
      class="pointer-events-none absolute inset-y-0 -left-1/3 -z-10 w-1/3 bg-white/25 opacity-0 group-hover:animate-sheen group-hover:opacity-100 motion-reduce:hidden"
    />

    <svg
      v-if="loading"
      class="animate-spin"
      :class="ICON_SIZES[size]"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity="0.25" stroke-width="3" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>

    <span v-else-if="$slots.iconLeft" :class="ICON_SIZES[size]" class="shrink-0">
      <slot name="iconLeft" />
    </span>

    <slot />

    <!-- Décalage de l'icône de droite : renforce la lecture directionnelle. -->
    <span
      v-if="$slots.iconRight"
      :class="ICON_SIZES[size]"
      class="shrink-0 transition-transform duration-200 ease-snap group-hover:translate-x-1 motion-reduce:transition-none"
    >
      <slot name="iconRight" />
    </span>
  </component>
</template>
