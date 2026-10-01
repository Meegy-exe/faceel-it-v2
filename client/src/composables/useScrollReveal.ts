import { onMounted, ref, type Ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

/**
 * Apparition au défilement (V0.1.24, ticket animations inter-sections) —
 * pensé pour `HomeView.vue`, dont les diapositives sont en CSS Scroll
 * Snapping pleine page (`h-dvh snap-start`, cf. ADR 24/26) : seul le Hero est
 * visible au chargement, les diapositives suivantes n'entrent dans le
 * viewport qu'au fil du défilement — exactement le moment où doit se jouer
 * l'effet (fondu + léger `translate-y`), pas au montage du composant (qui,
 * dans une SPA, a lieu pour TOUTES les diapositives dès le premier rendu,
 * qu'elles soient visibles ou non).
 *
 * TROIS ÉTATS, PAS UN BOOLÉEN — `'idle' | 'hidden' | 'visible'` :
 *   - `idle` (valeur initiale, y compris pendant le pré-rendu `vite-ssg` et
 *     pour un visiteur/robot sans JavaScript) : AUCUNE classe d'animation
 *     n'est appliquée par l'appelant dans cet état — le contenu reste
 *     pleinement visible par défaut. Condition nécessaire pour le SEO
 *     (ADR 01) et pour ne jamais cacher du contenu réel à un utilisateur
 *     dont l'observateur ne se déclenche jamais (JS désactivé) ;
 *   - `hidden` : posé UNIQUEMENT après le montage côté client, uniquement
 *     pour un élément qui n'intersecte PAS le viewport au moment du tout
 *     premier rapport de l'observateur (cf. ci-dessous) — c'est l'état
 *     « avant apparition » que l'appelant traduit en `opacity-0` ;
 *   - `visible` : posé au moment où l'élément intersecte réellement le
 *     viewport — l'appelant y déclenche l'animation. L'observateur n'est
 *     jamais arrêté : l'état repasse à `hidden` à la sortie du viewport
 *     et l'animation se rejoue à chaque entrée (UX V0.3).
 *
 * PREMIER RAPPORT DE L'OBSERVATEUR = DÉCISION, PAS UN SIGNAL IGNORÉ — un
 * `IntersectionObserver` fraîchement attaché rapporte toujours l'état courant
 * dès `observe()`. Si CET état initial montre déjà l'élément intersectant
 * (ex. navigation directe vers une ancre de la page, `mainNav.ts` cible des
 * `hash` — la diapositive visée peut donc déjà être à l'écran dès le
 * montage), l'état reste `idle` (jamais animé) : on ne veut pas faire
 * disparaître puis réapparaître un contenu que l'utilisateur est déjà en
 * train de regarder. Seul un élément RÉELLEMENT hors champ au premier rapport
 * passe par `hidden` puis `visible` au gré d'un défilement ultérieur.
 *
 * `prefers-reduced-motion` — l'observateur n'est même pas instancié sous
 * cette préférence : l'état reste `idle` pour toujours, donc le contenu est
 * visible en permanence, sans jamais passer par `hidden` (CLAUDE.md : une
 * animation décorative doit être neutralisée, pas seulement raccourcie).
 *
 * SSR-SAFE — `onMounted` n'est jamais appelé pendant le pré-rendu `vite-ssg`
 * (même garde que le typewriter du Hero et les carrousels du Design System) ;
 * `useIntersectionObserver` (VueUse) est de toute façon lui-même inerte hors
 * navigateur (`isSupported` teste la présence de `window`), la garde ici documente
 * l'hypothèse plutôt que de s'y fier implicitement.
 */
export type ScrollRevealState = 'idle' | 'hidden' | 'visible'

/**
 * @param target Ref de template du conteneur à révéler, déclarée par
 *   l'appelant via `useTemplateRef` (même idiome que `MegaMenu.vue`) — ce
 *   composable ne fait qu'OBSERVER cet élément, jamais ne le crée ni ne le
 *   référence sous un nom qui lui serait propre. Un `ref="nomStable"`
 *   compilé par Vue (plutôt qu'une fonction `:ref="(el) => ..."` inline)
 *   reste stable d'un rendu à l'autre : important ici car `HomeView.vue`
 *   re-rend son template plusieurs fois par seconde pendant quelques
 *   centaines de ms toutes les 5 s (typewriter du Hero) — une fonction
 *   inline fraîche à chaque rendu aurait fait rejouer inutilement le binding
 *   de `ref` à cette cadence.
 */
export function useScrollReveal(target: Ref<HTMLElement | null>): Ref<ScrollRevealState> {
  const state = ref<ScrollRevealState>('idle')

  onMounted(() => {
    if (import.meta.env.SSR) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    useIntersectionObserver(
      target,
      ([entry]) => {
        if (!entry) return
        if (state.value === 'idle') {
          // Premier rapport : décide si l'élément part masqué ou reste
          // visible d'emblée. Pas de stop() — l'observateur continue pour
          // rejouer l'animation à chaque passage dans le viewport.
          state.value = entry.isIntersecting ? 'visible' : 'hidden'
          return
        }
        state.value = entry.isIntersecting ? 'visible' : 'hidden'
      },
      { threshold: 0.3 },
    )
  })

  return state
}

/**
 * Direction du décalage masqué — `up` (défaut, HomeView) pour un simple
 * fondu vertical ; `left`/`right` pour un glissement horizontal, utile à un
 * layout en zigzag (`HistoireView.vue`) où l'image et le texte doivent
 * entrer chacun depuis leur propre bord plutôt que depuis le bas.
 */
export type ScrollRevealDirection = 'up' | 'left' | 'right'

const HIDDEN_OFFSET: Record<ScrollRevealDirection, string> = {
  up: 'translate-y-8',
  left: '-translate-x-8',
  right: 'translate-x-8',
}

/**
 * Classes Tailwind par état (transition simple, pas de `@keyframes`) :
 * `hidden` → `opacity-0` + décalage selon `direction` ; `idle`/`visible` →
 * `opacity-100 translate-y-0 translate-x-0` (identiques : `idle` doit rester
 * visible par défaut pour le SSR/no-JS). `motion-reduce:opacity-100
 * motion-reduce:translate-y-0 motion-reduce:translate-x-0` en défense en
 * profondeur sur l'état `hidden`, bien que l'observateur ne soit jamais
 * instancié sous cette préférence. La classe permanente `transition-all
 * duration-700 ease-out motion-reduce:transition-none` vit sur l'élément
 * côté appelant (cf. `HomeView.vue`), pas ici : elle ne dépend d'aucun état.
 */
export function scrollRevealClass(
  state: ScrollRevealState,
  direction: ScrollRevealDirection = 'up',
): string {
  if (state === 'hidden') {
    // transition-none : reset instantané — pas de fondu lent vers l'état invisible.
    return `opacity-0 ${HIDDEN_OFFSET[direction]} transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:translate-x-0`
  }
  return 'opacity-100 translate-y-0 translate-x-0 transition-all duration-700 ease-out motion-reduce:transition-none'
}
