<script setup lang="ts">
import AnimatedBackground from '@/components/ui/AnimatedBackground.vue'
import type { FooterColumn } from '@/components/ui/types'
import logoSrc from '@/assets/images/2.svg'

/**
 * Pied de page du site.
 *
 * Vit dans `components/layout/` et non dans `components/ui/` : il connaît la
 * notion de « pied de page d'un site », ce qui n'est pas une primitive
 * d'interface. Il ne remonte pas pour autant vers `features/` — les liens
 * arrivent par prop, fournis par la coquille (`App.vue`), pour que la règle de
 * dépendance du README reste tenue.
 *
 * Surface sombre, donc tous les couples de couleurs sont calculés sur navy :
 *   blanc/navy 15,9:1 · blanc-70%/navy 9,4:1 · accent-500/navy 9,1:1
 * Le vert n'est utilisé qu'en touches — puces, soulignement au survol,
 * séparateur — jamais en aplat.
 *
 * `fullPageScroll` (V0.1.22, cf. ADR 26) : bascule ce pied de page en
 * diapositive plein écran (`snap-start min-h-dvh flex flex-col
 * justify-end`) quand la route active enveloppe `<main>`/`<TheFooter>` dans
 * le conteneur de scroll-snap d'`App.vue` (`isFullPageScroll` côté
 * `App.vue`, dérivé de `route.meta.fullPageScroll`) — override client
 * explicite des limites d'ADR 24/25, qui gardaient ce composant hors de tout
 * modèle de scroll-snap parce qu'il est PARTAGÉ par toutes les routes
 * (Styleguide, 404 comprises). Prop plutôt que classe figée : ce composant
 * n'est monté qu'une seule fois par `App.vue`, ses deux autres consommateurs
 * de route (`/styleguide`, la 404) n'ont pas vocation à devenir des
 * diapositives plein écran — `false` par défaut y préserve le pied de page
 * compact « collé en bas » existant, inchangé.
 */
withDefaults(
  defineProps<{
    /** Colonnes de liens rapides. Trois maximum en pratique, sinon ça déborde. */
    columns: FooterColumn[]
    /** Reprise de la baseline sous le logotype. */
    description: string
    /** Cf. commentaire ci-dessus — `false` par défaut (comportement inchangé). */
    fullPageScroll?: boolean
  }>(),
  { fullPageScroll: false },
)

defineSlots<{
  /** Remplace le logotype par défaut. */
  logo?(): unknown
  /** Icônes de réseaux sociaux, sous la baseline de marque (V0.1.12). */
  social?(): unknown
  /** Bloc de contact : adresse, téléphone, courriel. */
  contact?(): unknown
  /**
   * Duo de CTA de conversion, repris du Header en fin de navigation
   * (V0.1.12, ticket #14) — deux `BaseButton`, jamais un seul ni plus.
   */
  ctas?(): unknown
  /** Barre basse : mentions légales, politique de confidentialité… */
  legal?(): unknown
}>()
</script>

<template>
  <!-- `fullPageScroll` (V0.1.22, cf. ADR 26) : `snap-start min-h-dvh w-full
       flex flex-col justify-end` en fait une diapositive d'ancrage à part
       entière quand `App.vue` enveloppe `<main>`/`<TheFooter>` dans son
       conteneur de scroll-snap (route `/` uniquement) — `min-h-dvh` plutôt
       que `h-dvh` strict : le contenu du pied de page (4 colonnes + CTA +
       barre basse) peut légitimement dépasser un seul viewport sur un petit
       mobile, `min-h-dvh` le laisse grandir plutôt que le rogner (fallback
       explicitement permis par le brief). `justify-end` pousse le contenu
       vers le bas de la diapositive, cohérent avec un pied de page. Pas de
       `snap-start` ni `min-h-dvh` en dehors de ce cas : `/styleguide` et la
       404 partagent ce même composant et n'ont pas vocation à hériter d'un
       pied de page pleine hauteur. -->
  <footer
    :class="[
      // `bg-[#000066]` et non plus `bg-primary-950` (#00003D) : sur l'accueil,
      // le pied de page est la DERNIÈRE diapositive du défilement enclenché,
      // juste après la section RSE. Deux bleus foncés différents s'y
      // succédaient donc à l'écran, ce qui se lit comme un défaut d'alignement
      // de la charte — un seul et unique bleu foncé sur toute la page.
      'relative isolate overflow-hidden bg-[#000066] px-4 pb-10 text-white sm:px-6 lg:px-8 xl:px-12',
      fullPageScroll
        ? 'w-full h-full snap-start snap-always flex flex-col justify-end pt-12'
        : 'snap-start snap-always pt-20 sm:pt-24',
    ]"
  >
    <!-- Décor calme : le pied de page ne doit pas concurrencer le contenu qui
         le précède. `aurora` n'embarque ni traits ni particules. -->
    <AnimatedBackground variant="aurora" tone="dark" />

    <!-- w-full (V0.1.4, ex-max-w-[100rem] depuis V0.1.3, cf. ADR 09) : le
         padding horizontal qui compense l'absence de plafond de largeur vit
         désormais sur le `<footer>` lui-même, là où vivait déjà l'ancien
         padding fixe. L'échelle elle-même est revenue à un standard resserré
         (`px-4 sm:px-6 lg:px-8 xl:px-12`) en V0.1.9 : l'échelle fluide
         `px-6 md:px-12 lg:px-24 xl:px-32 2xl:px-40` de V0.1.4 écrasait le
         contenu au centre sur grand écran (cf. ADR 13). -->
    <div class="w-full">
      <!-- Mobile-first : une colonne, puis deux à partir de `sm`, puis la
           marque prend deux fractions à partir de `lg`. -->
      <div class="grid gap-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1.4fr] lg:gap-8">
        <!-- Marque ------------------------------------------------------- -->
        <div class="sm:col-span-2 lg:col-span-1">
          <slot name="logo">
            <img :src="logoSrc" alt="Faceel-IT" class="h-16 w-auto object-contain" />
          </slot>

          <p class="mt-5 max-w-sm text-base leading-relaxed text-white/70">
            {{ description }}
          </p>

          <div v-if="$slots.social" class="mt-6 flex items-center gap-3">
            <slot name="social" />
          </div>
        </div>

        <!-- Liens rapides ------------------------------------------------ -->
        <!-- `aria-label` et non `aria-labelledby` : le titre de colonne est un
             `<p>` décoratif sans identifiant. Nommer chaque `<nav>` évite que
             le lecteur d'écran annonce trois « navigation » indistinctes. -->
        <nav v-for="column in columns" :key="column.title" :aria-label="column.title">
          <p class="text-eyebrow uppercase text-white/45">{{ column.title }}</p>

          <ul class="mt-5 space-y-3">
            <li v-for="link in column.links" :key="link.label">
              <component
                :is="link.to !== undefined ? 'RouterLink' : 'a'"
                v-bind="link.to !== undefined ? { to: link.to } : { href: link.href }"
                class="group inline-flex items-center gap-2.5 rounded-md text-white/70 transition-colors duration-200 hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
              >
                <!-- Puce d'accent : elle grandit ET change de couleur, pour ne
                     pas reposer sur la seule teinte. -->
                <span
                  aria-hidden="true"
                  class="size-1.5 shrink-0 rounded-full bg-white/25 transition-all duration-200 group-hover:scale-150 group-hover:bg-accent-500 motion-reduce:transition-none"
                />
                {{ link.label }}
              </component>
            </li>
          </ul>
        </nav>

        <!-- Contact ------------------------------------------------------ -->
        <div>
          <p class="text-eyebrow uppercase text-white/45">Contact</p>
          <div class="mt-5">
            <slot name="contact" />
          </div>
        </div>
      </div>

      <!-- Duo de CTA de conversion, visible en fin de navigation
           (V0.1.12, ticket #14) : mêmes deux `BaseButton` que le Header,
           `block` + `sm:w-auto` fourni par l'appelant pour rester pleine
           largeur en mobile-first sans qu'aucune classe de disposition ne
           soit à deviner ici. -->
      <div
        v-if="$slots.ctas"
        class="mt-16 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
      >
        <slot name="ctas" />
      </div>

      <!-- Barre basse ---------------------------------------------------- -->
      <div
        class="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between"
      >
        <p>Faceel-IT — ESN, Wasquehal, Hauts-de-France.</p>

        <!-- Pas d'année : elle serait figée au moment du build par le
             pré-rendu, et la recalculer côté client provoquerait un écart
             d'hydratation au passage de janvier. -->
        <slot name="legal" />
      </div>
    </div>
  </footer>
</template>
