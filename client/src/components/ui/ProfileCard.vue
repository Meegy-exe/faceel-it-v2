<script setup lang="ts">
import { computed } from 'vue'

/**
 * Carte de profil dépliable (annuaire du Collectif).
 *
 * Purement présentationnelle : elle ne possède PAS son état ouvert/fermé.
 * `expanded` est piloté par le parent (`CollectifView`), qui garantit qu'une
 * seule carte est ouverte à la fois  un état local ici rendrait ce
 * « accordéon horizontal » impossible sans remonter l'information de toute
 * façon.
 *
 * DÉPLIAGE  POURQUOI DEUX MÉCANIQUES PLUTÔT QU'UNE
 * Le panneau de détail (Mission / Profil) ne peut pas s'ouvrir dans le même
 * axe sur toutes les tailles d'écran : à 375 px de large, élargir la carte de
 * 288 px à 600 px déborderait de l'écran et ne révélerait rien. D'où :
 *    desktop (≥ sm) : la carte s'ÉLARGIT (`w-72` → `w-[38rem]`), le panneau
 *     est un `grid-cols-[0fr]` → `[1fr]` ;
 *    mobile : la largeur ne bouge pas, la carte s'ALLONGE vers le bas, le
 *     panneau est un `grid-rows-[0fr]` → `[1fr]`.
 * Les deux passent par la même propriété animable (`grid-template-*`), donc
 * une seule transition à déclarer  et surtout aucune hauteur/largeur en dur
 * à calculer en JavaScript, qui casserait au moindre changement de contenu.
 *
 * Le contenu interne garde une largeur FIXE (`w-72`/`sm:w-[19rem]`) : sans
 * elle, le texte se re-justifierait à chaque image de l'animation (reflow
 * visible, saccadé). Le cadre `overflow-hidden` du parent le révèle
 * progressivement  même principe que la sidebar « push » d'`App.vue`.
 */
interface Props {
  /** Identifiant stable : sert d'ancre `aria-controls`. Doit être unique. */
  id: string
  name: string
  role: string
  mission: string
  profile: string
  /**
   * Portrait. Optionnel : tant que le client n'a pas fourni les photos, la
   * carte retombe sur un monogramme (initiales) plutôt qu'une photo générique
   * de banque d'images, qui laisserait croire à un visage réel de l'équipe.
   */
  /**
   * `| undefined` EXPLICITE, et non le simple `?` : `exactOptionalPropertyTypes`
   * est actif (cf. `tsconfig`), un appelant qui lie `:photo="profil.photo"`
   * passe littéralement `undefined` quand la photo manque  ce que `photo?:
   * string` seul refuse. Même forme que `SeoInput.image` dans `useSeo.ts`.
   */
  photo?: string | undefined
  expanded?: boolean
}

const props = withDefaults(defineProps<Props>(), { expanded: false })

const emit = defineEmits<{ toggle: [id: string] }>()

const panelId = computed(() => `profile-panel-${props.id}`)

/**
 * Initiales du monogramme de repli. Dérivées du nom (donc déterministes,
 * cf. CLAUDE.md : rien d'aléatoire dans un calcul de rendu, le HTML pré-rendu
 * au build doit être identique au rendu client sous peine de casser
 * l'hydratation).
 */
const initials = computed(() =>
  props.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join(''),
)
</script>

<template>
  <article
    class="relative flex shrink-0 snap-start snap-always flex-col overflow-hidden rounded-panel bg-white ring-1 ring-primary-900/8 transition-[width,box-shadow] duration-700 ease-premium sm:flex-row motion-reduce:transition-none"
    :class="expanded ? 'w-72 shadow-panel sm:w-[38rem]' : 'w-72 shadow-soft'"
  >
    <!-- Colonne « fermée » : photo + vague + identité. C'est elle qui porte
         l'interaction  un `<button>` plutôt qu'un `@click` sur l'`<article>`
         pour être atteignable au clavier et annoncer son état (`aria-expanded`)
         sans avoir à recréer à la main le rôle, le focus et la touche Entrée. -->
    <button
      type="button"
      class="group flex w-72 shrink-0 cursor-pointer flex-col text-left focus-visible:outline-3 focus-visible:-outline-offset-4 focus-visible:outline-primary-900"
      :aria-expanded="expanded"
      :aria-controls="panelId"
      @click="emit('toggle', id)"
    >
      <div class="relative h-64 overflow-hidden bg-primary-900">
        <img
          v-if="photo"
          :src="photo"
          :alt="`Portrait de ${name}`"
          class="size-full object-cover transition-transform duration-700 ease-premium group-hover:scale-105 motion-reduce:transition-none"
        />
        <!-- Repli sans photo : monogramme sur fond navy. `aria-hidden`  le nom
             juste en dessous porte déjà l'information, la répéter créerait un
             doublon à la lecture d'écran. -->
        <span
          v-else
          aria-hidden="true"
          class="flex size-full items-center justify-center bg-linear-to-br from-primary-800 to-primary-950 font-display text-6xl font-extrabold text-white/15"
        >
          {{ initials }}
        </span>

        <!-- Séparation en vague : SVG étiré (`preserveAspectRatio="none"`)
             plutôt qu'un `mask` ou une image bitmap  il suit n'importe quelle
             largeur de carte sans se pixelliser, et `currentColor` le raccorde
             automatiquement au fond de la partie basse. -->
        <svg
          class="absolute inset-x-0 -bottom-px h-8 w-full text-white"
          viewBox="0 0 320 32"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path d="M0 16c53-21 107 11 160 4s107-25 160-4v16H0z" fill="currentColor" />
        </svg>
      </div>

      <div class="flex flex-1 flex-col justify-center gap-1 px-6 pt-2 pb-6">
        <h3 class="font-display text-title text-primary-900">{{ name }}</h3>
        <p class="text-sm font-semibold text-accent-700">{{ role }}</p>

        <!-- Affordance du dépliage : le libellé change ET la flèche pivote
             deux signaux, dont un non chromatique. -->
        <span
          class="mt-3 inline-flex items-center gap-2 text-eyebrow uppercase text-primary-900/45"
        >
          {{ expanded ? 'Réduire' : 'Découvrir' }}
          <svg
            class="size-3.5 transition-transform duration-500 ease-snap motion-reduce:transition-none"
            :class="expanded ? '-rotate-90 sm:rotate-180' : 'rotate-90 sm:rotate-0'"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 10h12m-5-5 5 5-5 5"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
    </button>

    <!-- Panneau révélé. Cf. le bloc de tête pour le choix `grid-template-*`. -->
    <div
      :id="panelId"
      class="grid overflow-hidden bg-light-200 transition-[grid-template-rows,grid-template-columns] duration-700 ease-premium motion-reduce:transition-none"
      :class="
        expanded
          ? 'grid-cols-[1fr] grid-rows-[1fr]'
          : 'grid-cols-[1fr] grid-rows-[0fr] sm:grid-cols-[0fr] sm:grid-rows-[1fr]'
      "
    >
      <div class="min-h-0 min-w-0 overflow-hidden">
        <!-- Largeur fixe : voir le bloc de tête (pas de reflow pendant
             l'animation). -->
        <div
          class="flex w-72 flex-col justify-center gap-6 border-t border-primary-900/8 p-6 sm:h-full sm:w-[19rem] sm:border-t-0 sm:border-l sm:p-8"
        >
          <!-- Décalage d'apparition (delay-300) : le texte n'entre qu'une fois
               la carte presque arrivée à sa taille finale, sinon il « pousse »
               le regard avant que le cadre existe  c'est ce décalage qui rend
               le geste organique plutôt que mécanique. Le `delay` ne s'applique
               qu'à l'ouverture : à la fermeture, l'opacité tombe immédiatement
               pour ne pas laisser du texte flotter dans un cadre déjà refermé. -->
          <div
            class="transition-[opacity,transform] duration-500 ease-premium motion-reduce:transition-none"
            :class="expanded ? 'translate-y-0 opacity-100 delay-300' : 'translate-y-3 opacity-0'"
          >
            <p class="text-eyebrow uppercase text-accent-700">Mission</p>
            <span aria-hidden="true" class="mt-2 block h-0.5 w-8 bg-accent-500" />
            <p class="mt-3 text-sm leading-relaxed text-primary-900/70">{{ mission }}</p>
          </div>

          <div
            class="transition-[opacity,transform] duration-500 ease-premium motion-reduce:transition-none"
            :class="
              expanded ? 'translate-y-0 opacity-100 delay-[450ms]' : 'translate-y-3 opacity-0'
            "
          >
            <p class="text-eyebrow uppercase text-accent-700">Profil</p>
            <span aria-hidden="true" class="mt-2 block h-0.5 w-8 bg-accent-500" />
            <p class="mt-3 text-sm leading-relaxed text-primary-900/70">{{ profile }}</p>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
