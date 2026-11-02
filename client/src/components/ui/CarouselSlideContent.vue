<script setup lang="ts">
import { computed } from 'vue'
import type { CardSize, CardTone } from './types'

/**
 * Contenu de diapositive « nu » pour les carrousels du Design System
 * (`CardCarousel`, `CoverCarousel`)  texte libre sans encart (V0.1.18, cf.
 * ADR 22) : ni fond, ni ombre, ni bordure, ni coin arrondi. Remplace
 * `HighlightCard` comme habillage de diapositive dans les 4 sections
 * carrousel de `HomeView` (Services, Secteurs, RSE, Valeur ajoutée) ;
 * `HighlightCard` reste le composant « carte » du Design System pour tout
 * usage hors carrousel (cf. `StyleguideView`), ce composant n'en est pas un
 * remplacement général.
 *
 * PUREMENT PRÉSENTATIONNEL, AUCUNE DONNÉE MÉTIER  mêmes principes que
 * `HighlightCard` : `tone`/`size` pilotent uniquement l'habillage, jamais le
 * contenu. Contrairement à `HighlightCard`, jamais cliquable dans son
 * ensemble : une diapositive de carrousel n'est pas un lien (la navigation
 * entre diapositives est déjà portée par le carrousel englobant).
 *
 * HAUTEUR PLANCHER (`min-h-[200px]`)  évite le saut de layout (CLS) quand
 * la `<Transition>` du carrousel englobant bascule d'un texte court à un
 * texte long : sans plancher, la hauteur de la région varierait à chaque
 * diapositive. La colonne reste `justify-center` (axe vertical) pour ce
 * plancher  seul l'axe horizontal change en V0.1.19 (cf. ci-dessous).
 *
 * ALIGNEMENT À GAUCHE (V0.1.19, cf. ADR 23)  remplace le centrage de
 * V0.1.18. Retour client : les titres de section (`<h2>` de `HomeView`) sont
 * alignés à gauche, un texte de diapositive centré cassait la ligne de force
 * verticale de la page. `items-start`/`text-left` (au lieu de
 * `items-center`/`text-center`) : badge, titre, trait d'accent et paragraphe
 * démarrent tous au même bord gauche. `HomeView.vue` complète cet alignement
 * en donnant à chaque `<header>` de section le même padding horizontal que
 * le conteneur de diapositive (`px-20 md:px-24 lg:px-28`, déjà présent dans
 * `CardCarousel`/`CoverCarousel` depuis V0.1.18)  sans quoi le bord gauche
 * du texte de diapositive resterait décalé du bord gauche du `<h2>`.
 */
interface Props {
  title: string
  /** Pastille superposée au-dessus du titre (ex. « Silver », RSE/Ecovadis). */
  badge?: string
  tone?: CardTone
  /** Gabarit typographique  cf. `CardSize` dans `types.ts`. */
  size?: CardSize
  /**
   * Niveau du titre. Explicite pour préserver l'imbrication des `Hn` : une
   * diapositive n'a aucun moyen de connaître la profondeur de la section qui
   * l'accueille (même raisonnement que `HighlightCard.headingLevel`).
   */
  headingLevel?: 2 | 3 | 4 | 5
  /** Classes additionnelles sur le paragraphe descriptif  échappatoire pour
   *  un besoin ponctuel (ex. `line-clamp-2`) sans changer `size` partout où
   *  ce composant est déjà utilisé (Services, Secteurs, RSE…). */
  bodyClass?: string
  /** Opt-in par instance : centre titre, filet et description sous `sm:`
   *  (box + text-align), reste identique (`items-start`/`text-left`) à partir
   *  de `sm:` et sur toute instance qui ne passe pas cette prop  aucune
   *  régression sur Services/Secteurs/RSE/Valeur ajoutée. */
  centerOnMobile?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tone: 'light',
  size: 'md',
  headingLevel: 3,
  bodyClass: '',
  centerOnMobile: false,
})

defineSlots<{
  /** Paragraphe descriptif de la diapositive. */
  default?(): unknown
}>()

const heading = computed(() => `h${props.headingLevel}`)

/**
 * Habillage par tonalité  mêmes couleurs de texte que `HighlightCard` (pas
 * de nouvelle valeur inventée) : `light` pour les sections `bg-light`
 * (Services, Valeur ajoutée), `dark` pour les sections à fond navy
 * (Secteurs, RSE). Le badge reprend le jeton `chip` déjà validé sur
 * `HighlightCard` (`bg-primary-900/5`/`bg-white/10`, une petite surface,
 * jamais un aplat de grande taille  cf. ADR 03/CLAUDE.md).
 */
const TONES: Record<CardTone, Record<'title' | 'body' | 'badge', string>> = {
  light: {
    title: 'text-primary-900',
    body: 'text-primary-900/70',
    badge: 'bg-primary-900/5 text-primary-900',
  },
  dark: {
    title: 'text-white',
    body: 'text-white/70',
    badge: 'bg-white/10 text-white',
  },
}

const tone = computed(() => TONES[props.tone])

/** Même échelle que `HighlightCard.SIZES` (typographie seule, pas de marge
 *  ce composant n'a pas de padding de carte à faire varier). */
const SIZES: Record<CardSize, { title: string; body: string }> = {
  md: { title: 'text-title', body: 'text-base' },
  lg: { title: 'text-display', body: 'text-lg' },
}

const size = computed(() => SIZES[props.size])
</script>

<template>
  <div
    class="flex min-h-[200px] flex-col justify-center"
    :class="
      centerOnMobile
        ? 'items-center text-center sm:items-start sm:text-left'
        : 'items-start text-left'
    "
  >
    <span
      v-if="badge"
      class="mb-3 inline-flex items-center rounded-full px-3 py-1 text-eyebrow uppercase"
      :class="tone.badge"
    >
      {{ badge }}
    </span>

    <component
      :is="heading"
      class="font-display text-balance"
      :class="[tone.title, size.title, centerOnMobile ? '[@media(max-height:568px)]:text-xl' : '']"
    >
      {{ title }}
    </component>

    <!-- Trait d'accent sous le titre  démarre au bord gauche (V0.1.19,
         `items-start` sur le parent), plus au centre (V0.1.18). Sans
         animation au survol : la diapositive n'est pas interactive.
         Compression `centerOnMobile` : seule l'instance "Nos valeurs" a
         besoin de resserrer cet espace sur écran très court. -->
    <span
      aria-hidden="true"
      class="h-0.5 w-10 bg-accent-500"
      :class="centerOnMobile ? 'mt-4 [@media(max-height:568px)]:mt-0' : 'mt-4'"
    />

    <!-- `max-w-prose` conditionnelle : générée après les classes `max-w-[…]`
         arbitraires dans la feuille Tailwind, elle les emportait toujours en
         cascade aucune valeur passée via `bodyClass` ne pouvait jamais la
         battre. Retirée uniquement pour `centerOnMobile`, seul cas qui a
         besoin d'une largeur mobile pilotée par l'appelant. -->
    <div
      v-if="$slots.default"
      class="mt-4 leading-relaxed text-center sm:text-left"
      :class="[tone.body, size.body, centerOnMobile ? '' : 'max-w-prose', bodyClass]"
    >
      <slot />
    </div>
  </div>
</template>
