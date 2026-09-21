<script setup lang="ts">
import { h, ref, type FunctionalComponent } from 'vue'
import AnimatedBackground from '@/components/ui/AnimatedBackground.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import HighlightCard from '@/components/ui/HighlightCard.vue'
import type {
  BackgroundTone,
  BackgroundVariant,
  ButtonSize,
  ButtonVariant,
  CardTone,
} from '@/components/ui/types'
import { useSeo } from '@/composables/useSeo'

/**
 * VUE JETABLE — À SUPPRIMER AVANT LA MISE EN LIGNE.
 *
 * Banc d'essai du Design System : chaque composant de `components/ui/` y est
 * rendu dans toutes ses variantes avec des données factices, pour valider
 * d'un coup d'œil l'habillage, les états et les animations.
 *
 * Suppression = 2 gestes : effacer ce fichier et retirer l'entrée `styleguide`
 * de `src/router/routes.ts`. Aucun autre fichier ne la référence, et la route
 * est volontairement absente de `staticPrerenderRoutes`.
 *
 * Elle enfreint sciemment la règle de dépendance du README (`views/` →
 * `features/` → `components/ui/`) en consommant directement `components/ui/` :
 * c'est justement son objet, et elle ne survivra pas à l'intégration.
 */

/* -------------------------------------------------------------------------- */
/* Utilitaires de démonstration                                               */
/* -------------------------------------------------------------------------- */

/**
 * Pictogramme minimal : évite de recopier douze fois le même `<svg>`. La
 * taille n'est pas fixée ici, elle arrive par `class` (fallthrough d'attrs).
 */
const Icon: FunctionalComponent<{ d: string }> = (props) =>
  h('svg', { viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' }, [
    h('path', {
      d: props.d,
      stroke: 'currentColor',
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    }),
  ])

const PATHS = {
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  spark:
    'M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6 2.1-2.1',
  shield: 'M12 3 5 6v5c0 4.4 3 8.3 7 9.5 4-1.2 7-5.1 7-9.5V6l-7-3Z',
  code: 'm8 8-4 4 4 4m8-8 4 4-4 4',
  chart: 'M4 20V10m5 10V4m5 16v-7m5 7V8',
  download: 'M12 4v10m0 0 4-4m-4 4-4-4M4 18h16',
} as const

const BUTTON_VARIANTS: ButtonVariant[] = ['primary', 'outline', 'ghost']
const BUTTON_SIZES: ButtonSize[] = ['sm', 'md', 'lg']
/** Deux surfaces seulement : le vert n'est jamais un aplat de carte. */
const CARD_TONES: CardTone[] = ['light', 'dark']

const BACKGROUNDS: { variant: BackgroundVariant; tone: BackgroundTone; surface: string }[] = [
  { variant: 'pixels', tone: 'dark', surface: 'bg-primary-900' },
  { variant: 'grid', tone: 'dark', surface: 'bg-primary-950' },
  { variant: 'aurora', tone: 'dark', surface: 'bg-primary-900' },
  { variant: 'pixels', tone: 'light', surface: 'bg-light' },
  { variant: 'grid', tone: 'light', surface: 'bg-white' },
  { variant: 'aurora', tone: 'light', surface: 'bg-light-100' },
]

/** Densités contrastées : borne basse, défaut, plafond (le composant clampe à 60). */
const DENSITIES = [6, 22, 60]

/* -------------------------------------------------------------------------- */
/* Jeu de tokens visualisés                                                   */
/* -------------------------------------------------------------------------- */

/** Classes écrites en entier : Tailwind v4 scanne le texte source. */
const SWATCHES: { group: string; items: { class: string; label: string }[] }[] = [
  {
    group: 'primary',
    items: [
      { class: 'bg-primary-50', label: '50' },
      { class: 'bg-primary-100', label: '100' },
      { class: 'bg-primary-200', label: '200' },
      { class: 'bg-primary-300', label: '300' },
      { class: 'bg-primary-400', label: '400' },
      { class: 'bg-primary-500', label: '500' },
      { class: 'bg-primary-600', label: '600' },
      { class: 'bg-primary-700', label: '700' },
      { class: 'bg-primary-800', label: '800' },
      { class: 'bg-primary-900', label: '900' },
      { class: 'bg-primary-950', label: '950' },
    ],
  },
  {
    group: 'accent',
    items: [
      { class: 'bg-accent-50', label: '50' },
      { class: 'bg-accent-100', label: '100' },
      { class: 'bg-accent-200', label: '200' },
      { class: 'bg-accent-300', label: '300' },
      { class: 'bg-accent-400', label: '400' },
      { class: 'bg-accent-500', label: '500' },
      { class: 'bg-accent-600', label: '600' },
      { class: 'bg-accent-700', label: '700' },
      { class: 'bg-accent-800', label: '800' },
      { class: 'bg-accent-900', label: '900' },
      { class: 'bg-accent-950', label: '950' },
    ],
  },
  {
    group: 'light',
    items: [
      { class: 'bg-light-100', label: '100' },
      { class: 'bg-light-200', label: '200' },
      { class: 'bg-light-300', label: '300' },
      { class: 'bg-light-400', label: '400' },
    ],
  },
]

const SHADOWS = ['shadow-soft', 'shadow-lift', 'shadow-panel', 'shadow-glow']

/* -------------------------------------------------------------------------- */
/* État local : preuve que l'événement `click` remonte bien                   */
/* -------------------------------------------------------------------------- */

const clicks = ref(0)

/** Un banc d'essai n'a rien à faire dans un index de moteur de recherche. */
useSeo({
  title: 'Styleguide',
  description: 'Banc d’essai interne du Design System Faceel-IT.',
  indexable: false,
})
</script>

<template>
  <!-- Ni en-tête ni `<main>` ici : `App.vue` les fournit désormais pour toutes
       les pages. Le `MegaMenu` visible en haut est donc l'instance globale,
       alimentée par le vrai `mainNavEntries` — ce qui en fait un meilleur banc
       d'essai que le jeu factice qu'embarquait cette vue. -->
  <div>
    <div class="w-full px-4 pb-32 sm:px-6 lg:px-8 xl:px-12">
      <!-- ================================================================
           En-tête de page
           ================================================================ -->
      <header
        class="relative isolate overflow-hidden rounded-panel bg-primary-900 px-6 py-16 text-white sm:px-12"
      >
        <AnimatedBackground variant="pixels" tone="dark" />

        <p class="text-eyebrow uppercase text-accent-500">Design System — Faceel-IT v2</p>
        <h1 class="mt-4 font-display text-display text-balance">Banc d’essai des composants</h1>
        <p class="mt-6 max-w-2xl text-lg text-white/70">
          Vue jetable. Tous les composants de
          <code class="font-mono text-accent-400">components/ui/</code>
          y sont rendus dans chacune de leurs variantes, avec des données factices. À supprimer une
          fois la direction artistique validée.
        </p>

        <nav aria-label="Sommaire du styleguide" class="mt-10 flex flex-wrap gap-3">
          <BaseButton variant="primary" size="sm" surface="dark" href="#tokens">Tokens</BaseButton>
          <BaseButton variant="primary" size="sm" surface="dark" href="#boutons"
            >BaseButton</BaseButton
          >
          <BaseButton variant="primary" size="sm" surface="dark" href="#cartes"
            >HighlightCard</BaseButton
          >
          <BaseButton variant="primary" size="sm" surface="dark" href="#fonds"
            >AnimatedBackground</BaseButton
          >
          <BaseButton variant="primary" size="sm" surface="dark" href="#composants"
            >MegaMenu</BaseButton
          >
        </nav>

        <p class="mt-8 max-w-2xl text-sm text-white/50">
          Toutes les animations de cette page sont neutralisées si le système est réglé sur «
          réduire les animations » (<code class="font-mono">prefers-reduced-motion</code>). Bascule
          cette préférence pour valider les deux rendus.
        </p>
      </header>

      <!-- ================================================================
           1. Tokens
           ================================================================ -->
      <section id="tokens" class="scroll-mt-24 pt-20">
        <p class="text-eyebrow uppercase text-accent-700">01</p>
        <h2 class="mt-2 font-display text-title text-primary-900">Tokens</h2>
        <p class="mt-3 max-w-2xl text-primary-900/65">
          Déclarés dans <code class="font-mono text-sm">assets/styles/main.css</code> via
          <code class="font-mono text-sm">@theme</code>. Rappel de contraste :
          <span class="font-semibold">accent-500 sur fond clair est décoratif uniquement</span> —
          pour du texte accentué sur blanc, c’est accent-700.
        </p>

        <h3 class="mt-10 font-display text-lg font-bold text-primary-900">Palette</h3>
        <div class="mt-4 space-y-6">
          <div v-for="swatch in SWATCHES" :key="swatch.group">
            <p class="mb-2 text-eyebrow uppercase text-primary-900/45">{{ swatch.group }}</p>
            <div class="flex flex-wrap gap-2">
              <div v-for="item in swatch.items" :key="item.class" class="w-16">
                <div class="h-14 rounded-xl ring-1 ring-primary-900/10" :class="item.class" />
                <p class="mt-1 text-center font-mono text-xs text-primary-900/60">
                  {{ item.label }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <h3 class="mt-10 font-display text-lg font-bold text-primary-900">Typographie</h3>
        <div class="mt-4 space-y-4 rounded-card bg-white p-6 ring-1 ring-primary-900/8">
          <p class="text-eyebrow uppercase text-primary-900/45">text-eyebrow · surtitre</p>
          <p class="font-display text-mega text-primary-900">Mega</p>
          <p class="font-display text-display text-primary-900">Display</p>
          <p class="font-display text-title text-primary-900">Title</p>
          <p class="text-base text-primary-900/70">
            Base — corps de texte courant, 16px, interlignage confortable.
          </p>
          <p class="font-mono text-sm text-primary-900/70">Mono — JetBrains Mono, 14px.</p>
        </div>

        <h3 class="mt-10 font-display text-lg font-bold text-primary-900">Ombres</h3>
        <div class="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="shadow in SHADOWS"
            :key="shadow"
            class="flex h-28 items-center justify-center rounded-card bg-white font-mono text-sm text-primary-900/70"
            :class="shadow"
          >
            {{ shadow }}
          </div>
        </div>
      </section>

      <!-- ================================================================
           2. BaseButton
           ================================================================ -->
      <section id="boutons" class="scroll-mt-24 pt-20">
        <p class="text-eyebrow uppercase text-accent-700">02</p>
        <h2 class="mt-2 font-display text-title text-primary-900">BaseButton</h2>
        <p class="mt-3 max-w-2xl text-primary-900/65">
          Survole pour voir le voile montant et le reflet ; tabule pour l’anneau de focus. L’élément
          rendu (<code class="font-mono text-sm">button</code>,
          <code class="font-mono text-sm">a</code>,
          <code class="font-mono text-sm">RouterLink</code>) découle de
          <code class="font-mono text-sm">to</code> / <code class="font-mono text-sm">href</code>.
        </p>

        <!-- Matrice variante × taille, sur fond clair -->
        <h3 class="mt-10 font-display text-lg font-bold text-primary-900">
          Variantes × tailles — <code class="font-mono text-base">surface="light"</code>
        </h3>
        <div class="mt-4 space-y-6 rounded-card bg-white p-6 ring-1 ring-primary-900/8 sm:p-8">
          <div v-for="variant in BUTTON_VARIANTS" :key="variant">
            <p class="mb-3 text-eyebrow uppercase text-primary-900/45">{{ variant }}</p>
            <div class="flex flex-wrap items-center gap-4">
              <BaseButton
                v-for="size in BUTTON_SIZES"
                :key="size"
                :variant="variant"
                :size="size"
                @click="clicks++"
              >
                Taille {{ size }}
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Même matrice sur fond sombre : valide le focus accent -->
        <h3 class="mt-10 font-display text-lg font-bold text-primary-900">
          Variantes × tailles — <code class="font-mono text-base">surface="dark"</code>
        </h3>
        <p class="mt-2 max-w-2xl text-sm text-primary-900/60">
          <code class="font-mono">surface</code> pilote l’habillage complet, pas seulement l’anneau
          de focus. <span class="font-semibold">primary</span> part de l’accent (un remplissage navy
          disparaîtrait dans le fond) et bascule vers le blanc ;
          <span class="font-semibold">outline</span> passe en bordure claire + texte blanc ;
          <span class="font-semibold">ghost</span> en texte blanc. L’anneau de focus vire à
          l’accent-500, le navy n’atteignant pas 3:1 sur fond sombre.
        </p>
        <div class="mt-4 space-y-6 rounded-card bg-primary-900 p-6 sm:p-8">
          <div v-for="variant in BUTTON_VARIANTS" :key="variant">
            <p class="mb-3 text-eyebrow uppercase text-white/45">{{ variant }}</p>
            <div class="flex flex-wrap items-center gap-4">
              <BaseButton
                v-for="size in BUTTON_SIZES"
                :key="size"
                :variant="variant"
                :size="size"
                surface="dark"
                @click="clicks++"
              >
                Taille {{ size }}
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Icônes -->
        <h3 class="mt-10 font-display text-lg font-bold text-primary-900">Icônes</h3>
        <div
          class="mt-4 flex flex-wrap items-center gap-4 rounded-card bg-white p-6 ring-1 ring-primary-900/8 sm:p-8"
        >
          <BaseButton variant="primary">
            <template #iconLeft><Icon :d="PATHS.spark" class="size-full" /></template>
            Icône à gauche
          </BaseButton>
          <BaseButton variant="outline">
            Icône à droite
            <template #iconRight><Icon :d="PATHS.arrow" class="size-full" /></template>
          </BaseButton>
          <BaseButton variant="ghost">
            <template #iconLeft><Icon :d="PATHS.download" class="size-full" /></template>
            Les deux
            <template #iconRight><Icon :d="PATHS.arrow" class="size-full" /></template>
          </BaseButton>
          <BaseButton variant="primary" size="lg">
            <template #iconLeft><Icon :d="PATHS.shield" class="size-full" /></template>
            Grand format
            <template #iconRight><Icon :d="PATHS.arrow" class="size-full" /></template>
          </BaseButton>
        </div>

        <!-- États -->
        <h3 class="mt-10 font-display text-lg font-bold text-primary-900">États</h3>
        <div class="mt-4 space-y-6 rounded-card bg-white p-6 ring-1 ring-primary-900/8 sm:p-8">
          <div>
            <p class="mb-3 text-eyebrow uppercase text-primary-900/45">Chargement</p>
            <div class="flex flex-wrap items-center gap-4">
              <BaseButton
                v-for="variant in BUTTON_VARIANTS"
                :key="variant"
                :variant="variant"
                loading
              >
                Envoi en cours
              </BaseButton>
            </div>
          </div>

          <div>
            <p class="mb-3 text-eyebrow uppercase text-primary-900/45">Désactivé</p>
            <div class="flex flex-wrap items-center gap-4">
              <BaseButton
                v-for="variant in BUTTON_VARIANTS"
                :key="variant"
                :variant="variant"
                disabled
              >
                Indisponible
              </BaseButton>
              <!-- Lien inerte : ni cliquable, ni atteignable au Tab. -->
              <BaseButton variant="outline" href="https://www.faceel-it.com" disabled>
                Lien désactivé
              </BaseButton>
            </div>
          </div>

          <div>
            <p class="mb-3 text-eyebrow uppercase text-primary-900/45">
              Éléments rendus — <code class="font-mono">button</code> /
              <code class="font-mono">a</code> /
              <code class="font-mono">RouterLink</code>
            </p>
            <div class="flex flex-wrap items-center gap-4">
              <BaseButton variant="primary" @click="clicks++">button (compteur)</BaseButton>
              <BaseButton variant="outline" href="https://www.faceel-it.com"
                >a — externe</BaseButton
              >
              <BaseButton variant="ghost" to="/">RouterLink — accueil</BaseButton>
              <BaseButton variant="ghost" type="submit">type="submit"</BaseButton>
            </div>
            <p class="mt-4 text-sm text-primary-900/60" aria-live="polite">
              Clics captés : <span class="font-mono font-bold text-primary-900">{{ clicks }}</span>
            </p>
          </div>

          <div>
            <p class="mb-3 text-eyebrow uppercase text-primary-900/45">
              Pleine largeur — <code class="font-mono">block</code>
            </p>
            <div class="max-w-sm space-y-3">
              <BaseButton variant="primary" block>Bloc primaire</BaseButton>
              <BaseButton variant="outline" block>Bloc contour</BaseButton>
              <BaseButton variant="ghost" block>Bloc fantôme</BaseButton>
            </div>
          </div>
        </div>
      </section>

      <!-- ================================================================
           3. HighlightCard
           ================================================================ -->
      <section id="cartes" class="scroll-mt-24 pt-20">
        <p class="text-eyebrow uppercase text-accent-700">03</p>
        <h2 class="mt-2 font-display text-title text-primary-900">HighlightCard</h2>
        <p class="mt-3 max-w-2xl text-primary-900/65">
          Toutes les tonalités convergent vers le navy au survol. Une carte devient cliquable dans
          son ensemble dès qu’elle reçoit <code class="font-mono text-sm">to</code> ou
          <code class="font-mono text-sm">href</code> — jamais de lien imbriqué dedans.
        </p>

        <!-- Les trois tonalités, en version cliquable et complète -->
        <h3 class="mt-10 font-display text-lg font-bold text-primary-900">
          Tonalités — cartes cliquables
        </h3>
        <div class="mt-4 grid gap-6 md:grid-cols-3">
          <HighlightCard
            v-for="(cardTone, cardIndex) in CARD_TONES"
            :key="cardTone"
            :tone="cardTone"
            :index="cardIndex + 1"
            :heading-level="4"
            eyebrow="Expertise"
            badge="Phare"
            :title="`Tonalité ${cardTone}`"
            action-label="Découvrir l’offre"
            to="/styleguide#cartes"
          >
            <template #icon><Icon :d="PATHS.code" class="size-6" /></template>
            Texte factice pour juger de la lisibilité du corps sur cette tonalité, au repos comme au
            survol.
          </HighlightCard>
        </div>

        <!-- Cartes non interactives -->
        <h3 class="mt-10 font-display text-lg font-bold text-primary-900">
          Non cliquables — rendu <code class="font-mono text-base">div</code>
        </h3>
        <div class="mt-4 grid gap-6 md:grid-cols-3">
          <HighlightCard
            v-for="cardTone in CARD_TONES"
            :key="cardTone"
            :tone="cardTone"
            :heading-level="4"
            :title="`Statique — ${cardTone}`"
          >
            Sans <code class="font-mono text-sm">to</code> ni
            <code class="font-mono text-sm">href</code> : pas d’élévation au survol, pas de ligne
            d’appel à l’action.
          </HighlightCard>
        </div>

        <!-- Combinatoire des options -->
        <h3 class="mt-10 font-display text-lg font-bold text-primary-900">Options</h3>
        <div class="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <HighlightCard :heading-level="4" title="Nue" tone="light" to="/styleguide#cartes">
            Ni surtitre, ni pastille, ni pictogramme, ni filigrane.
          </HighlightCard>

          <HighlightCard
            :heading-level="4"
            :index="7"
            title="Filigrane seul"
            tone="light"
            to="/styleguide#cartes"
          >
            Le filigrane numéroté est décoratif : masqué aux technologies d’assistance.
          </HighlightCard>

          <HighlightCard
            :heading-level="4"
            title="Pastille seule"
            badge="Nouveau"
            tone="light"
            to="/styleguide#cartes"
          />

          <HighlightCard
            :heading-level="4"
            title="Pictogramme + surtitre"
            eyebrow="Infrastructure"
            tone="dark"
            to="/styleguide#cartes"
          >
            <template #icon><Icon :d="PATHS.shield" class="size-6" /></template>
            Surtitre en accent-500 sur navy : 9,1:1, conforme AAA.
          </HighlightCard>

          <HighlightCard
            :heading-level="4"
            title="Pied de carte remplacé"
            eyebrow="Data"
            tone="dark"
            :index="12"
            href="https://www.faceel-it.com"
          >
            <template #icon><Icon :d="PATHS.chart" class="size-6" /></template>
            Le créneau <code class="font-mono text-sm">footer</code> remplace l’appel à l’action par
            défaut.
            <template #footer>
              <span class="font-mono text-sm font-semibold">→ faceel-it.com</span>
            </template>
          </HighlightCard>

          <HighlightCard
            :heading-level="4"
            title="Libellé d’action personnalisé"
            eyebrow="Cybersécurité"
            badge="Audit"
            tone="light"
            :index="3"
            action-label="Demander un devis"
            to="/styleguide#cartes"
          >
            <template #icon><Icon :d="PATHS.spark" class="size-6" /></template>
            Tous les leviers activés en même temps : pictogramme, pastille, surtitre, filigrane.
          </HighlightCard>
        </div>

        <!-- Sur fond sombre : la carte claire doit tenir -->
        <h3 class="mt-10 font-display text-lg font-bold text-primary-900">
          Posées sur fond sombre
        </h3>
        <div class="relative isolate mt-4 overflow-hidden rounded-panel bg-primary-950 p-6 sm:p-10">
          <AnimatedBackground variant="grid" tone="dark" />
          <div class="grid gap-6 md:grid-cols-3">
            <HighlightCard
              v-for="(cardTone, cardIndex) in CARD_TONES"
              :key="cardTone"
              :tone="cardTone"
              :index="cardIndex + 1"
              :heading-level="4"
              eyebrow="Sur décor"
              :title="`Tonalité ${cardTone}`"
              to="/styleguide#cartes"
            >
              <template #icon><Icon :d="PATHS.code" class="size-6" /></template>
              Lisibilité de la carte lorsqu’elle repose sur un fond animé.
            </HighlightCard>
          </div>
        </div>
      </section>

      <!-- ================================================================
           4. AnimatedBackground
           ================================================================ -->
      <section id="fonds" class="scroll-mt-24 pt-20">
        <p class="text-eyebrow uppercase text-accent-700">04</p>
        <h2 class="mt-2 font-display text-title text-primary-900">AnimatedBackground</h2>
        <p class="mt-3 max-w-2xl text-primary-900/65">
          Décor purement présentationnel (<code class="font-mono text-sm">aria-hidden</code> +
          <code class="font-mono text-sm">pointer-events-none</code>). Le conteneur d’accueil doit
          porter <code class="font-mono text-sm">relative isolate overflow-hidden</code> : sans
          <code class="font-mono text-sm">isolate</code>, le
          <code class="font-mono text-sm">-z-10</code>
          fait passer le décor derrière le fond du conteneur, qui le masque.
        </p>

        <h3 class="mt-10 font-display text-lg font-bold text-primary-900">
          Variantes × tonalité de surface
        </h3>
        <div class="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="background in BACKGROUNDS"
            :key="`${background.variant}-${background.tone}`"
            class="relative isolate flex h-64 flex-col justify-end overflow-hidden rounded-card p-6 ring-1 ring-primary-900/10"
            :class="background.surface"
          >
            <AnimatedBackground :variant="background.variant" :tone="background.tone" />
            <p
              class="font-mono text-sm font-semibold"
              :class="background.tone === 'dark' ? 'text-white' : 'text-primary-900'"
            >
              variant="{{ background.variant }}"
            </p>
            <p
              class="font-mono text-xs"
              :class="background.tone === 'dark' ? 'text-white/60' : 'text-primary-900/60'"
            >
              tone="{{ background.tone }}"
            </p>
          </div>
        </div>

        <h3 class="mt-10 font-display text-lg font-bold text-primary-900">
          Densité — variante <code class="font-mono text-base">pixels</code>
        </h3>
        <p class="mt-2 max-w-2xl text-sm text-primary-900/60">
          Bornée à 60 par le composant. Les positions sont dérivées de l’index par une fonction
          déterministe (pas de <code class="font-mono">Math.random()</code>) : le pré-rendu au build
          produit exactement le même HTML que le navigateur.
        </p>
        <div class="mt-4 grid gap-6 md:grid-cols-3">
          <div
            v-for="density in DENSITIES"
            :key="density"
            class="relative isolate flex h-56 items-end overflow-hidden rounded-card bg-primary-900 p-6"
          >
            <AnimatedBackground variant="pixels" tone="dark" :density="density" />
            <p class="font-mono text-sm font-semibold text-white">density = {{ density }}</p>
          </div>
        </div>

        <h3 class="mt-10 font-display text-lg font-bold text-primary-900">
          En situation — bandeau d’accroche
        </h3>
        <div
          class="relative isolate mt-4 overflow-hidden rounded-panel bg-primary-900 px-6 py-20 text-center sm:px-12"
        >
          <AnimatedBackground variant="aurora" tone="dark" />
          <p class="text-eyebrow uppercase text-accent-500">Un projet en tête ?</p>
          <p class="mx-auto mt-4 max-w-3xl font-display text-display text-balance text-white">
            Parlons de votre système d’information.
          </p>
          <div class="mt-10 flex flex-wrap justify-center gap-4">
            <BaseButton variant="primary" size="lg" surface="dark" to="/styleguide#composants">
              Prendre rendez-vous
              <template #iconRight><Icon :d="PATHS.arrow" class="size-full" /></template>
            </BaseButton>
            <BaseButton variant="ghost" size="lg" surface="dark" href="https://www.faceel-it.com">
              Voir nos références
            </BaseButton>
          </div>
        </div>
      </section>

      <!-- ================================================================
           5. MegaMenu — rappel du protocole de test (tiroir latéral, V0.1.24)
           ================================================================ -->
      <section id="composants" class="scroll-mt-24 pt-20">
        <p class="text-eyebrow uppercase text-accent-700">05</p>
        <h2 class="mt-2 font-display text-title text-primary-900">MegaMenu (menu latéral)</h2>
        <p class="mt-3 max-w-2xl text-primary-900/65">
          Le composant est rendu en haut de cette page, en conditions réelles (collant, pleine
          largeur). Depuis V0.1.24, la barre ne montre plus aucun lien en texte brut : seuls le logo
          et le bouton burger y restent, à toutes les tailles d’écran. Cliquer le burger glisse un
          tiroir depuis la gauche, qui porte la liste complète (avec sous-liens en accordéon).
        </p>

        <div class="mt-8 grid gap-6 lg:grid-cols-2">
          <div class="rounded-card bg-white p-6 ring-1 ring-primary-900/8 sm:p-8">
            <h3 class="font-display text-lg font-bold text-primary-900">À vérifier au clavier</h3>
            <ul class="mt-4 space-y-3 text-primary-900/70">
              <li class="flex gap-3">
                <span
                  aria-hidden="true"
                  class="mt-2 size-1.5 shrink-0 rounded-full bg-accent-600"
                />
                <span>
                  <kbd class="font-mono text-sm font-semibold text-primary-900">Entrée</kbd> /
                  <kbd class="font-mono text-sm font-semibold text-primary-900">Espace</kbd> sur le
                  burger ouvre le tiroir et place le focus sur son premier élément focusable (la
                  croix de fermeture).
                </span>
              </li>
              <li class="flex gap-3">
                <span
                  aria-hidden="true"
                  class="mt-2 size-1.5 shrink-0 rounded-full bg-accent-600"
                />
                <span>
                  <kbd class="font-mono text-sm font-semibold text-primary-900">Tab</kbd> atteint
                  chaque lien un par un dans l’ordre du document : c’est toujours le motif
                  <em>disclosure</em>, pas <code class="font-mono text-sm">role="menu"</code> — une
                  entrée à sous-liens (« Secteurs ») est un accordéon, pas un sous-menu.
                </span>
              </li>
              <li class="flex gap-3">
                <span
                  aria-hidden="true"
                  class="mt-2 size-1.5 shrink-0 rounded-full bg-accent-600"
                />
                <span>
                  <kbd class="font-mono text-sm font-semibold text-primary-900">Tab</kbd> sur le
                  DERNIER élément focusable du tiroir revient au premier (piège de focus maison,
                  <code class="font-mono text-sm">trapFocus</code>) — le contenu de la page, masqué
                  sous le fond assombri, ne doit jamais être atteignable au clavier tant que le
                  tiroir est ouvert.
                  <kbd class="font-mono text-sm font-semibold text-primary-900">Maj+Tab</kbd>
                  sur le premier élément boucle de la même façon vers le dernier.
                </span>
              </li>
              <li class="flex gap-3">
                <span
                  aria-hidden="true"
                  class="mt-2 size-1.5 shrink-0 rounded-full bg-accent-600"
                />
                <span>
                  <kbd class="font-mono text-sm font-semibold text-primary-900">Échap</kbd> ferme le
                  tiroir et rend le focus au bouton burger.
                </span>
              </li>
            </ul>
          </div>

          <div class="rounded-card bg-white p-6 ring-1 ring-primary-900/8 sm:p-8">
            <h3 class="font-display text-lg font-bold text-primary-900">À vérifier à la souris</h3>
            <ul class="mt-4 space-y-3 text-primary-900/70">
              <li class="flex gap-3">
                <span
                  aria-hidden="true"
                  class="mt-2 size-1.5 shrink-0 rounded-full bg-accent-600"
                />
                <span>
                  Cliquer le burger glisse le tiroir depuis la gauche (<code
                    class="font-mono text-sm"
                    >&lt;Transition&gt;</code
                  >
                  natif de Vue) et assombrit/floute le reste de la page.
                </span>
              </li>
              <li class="flex gap-3">
                <span
                  aria-hidden="true"
                  class="mt-2 size-1.5 shrink-0 rounded-full bg-accent-600"
                />
                <span>Cliquer le fond assombri, ou la croix en tête du tiroir, referme tout.</span>
              </li>
              <li class="flex gap-3">
                <span
                  aria-hidden="true"
                  class="mt-2 size-1.5 shrink-0 rounded-full bg-accent-600"
                />
                <span>
                  Cliquer un lien du tiroir navigue et referme automatiquement (changement de route)
                  — sans rendre le focus au burger cette fois : l’utilisateur vient de choisir une
                  destination, le focus doit rester disponible pour la suite de sa lecture, pas
                  revenir en arrière.
                </span>
              </li>
              <li class="flex gap-3">
                <span
                  aria-hidden="true"
                  class="mt-2 size-1.5 shrink-0 rounded-full bg-accent-600"
                />
                <span>
                  Cliquer « Secteurs » déplie un accordéon sous l’entrée (plusieurs entrées peuvent
                  rester dépliées à la fois) — même mécanique que l’ex-tiroir mobile d’avant
                  V0.1.24, désormais seul mode d’affichage, à toutes les tailles d’écran.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-6 rounded-card bg-primary-900 p-6 text-white sm:p-8">
          <h3 class="font-display text-lg font-bold">Jeu de données observé</h3>
          <p class="mt-3 text-white/70">
            Ce n’est pas un jeu factice : l’en-tête est celui de
            <code class="font-mono text-sm text-accent-400">App.vue</code>, alimenté par
            <code class="font-mono text-sm text-accent-400">features/navigation/mainNav.ts</code>.
            Ce qui est validé ici est donc la navigation réelle du site.
          </p>
          <ul class="mt-4 space-y-2 text-white/70">
            <li>
              <strong class="text-white">Expertises</strong> — lien simple, icône « mallette ».
            </li>
            <li>
              <strong class="text-white">Secteurs</strong> — 1 colonne de 4 sous-liens en accordéon,
              icône « bâtiment ».
            </li>
          </ul>
          <p class="mt-4 text-sm text-white/50">
            Le panneau à encart (<code class="font-mono text-accent-400">MegaMenuFeature</code>) et
            la temporisation de survol du desktop, propres à l’ancien panneau déroulant, ont été
            retirés du Design System en V0.1.24 avec le pivot vers ce tiroir latéral (cf.
            <code class="font-mono text-accent-400">docs/DECISIONS.md</code>) : plus rien à en
            vérifier ici.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>
