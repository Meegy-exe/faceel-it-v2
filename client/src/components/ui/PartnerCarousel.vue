<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import type { BackgroundTone } from './types'

/**
 * Bandeau de confiance partenaires : défilement horizontal infini
 * (« marquee ») de logos cliquables, en remplacement du bandeau statique
 * (`LogoWall`) pour cette section précise.
 *
 * MÉCANIQUE DU DÉFILEMENT INFINI
 * La piste (le `<ul>`) est rendue deux fois de suite : la liste réelle des
 * partenaires, puis une copie strictement identique juste derrière. Le
 * jeton `--animate-marquee` (cf. `main.css`) ne fait que translater toute la
 * piste de 0 à -50 % de sa propre largeur  comme les deux moitiés sont
 * identiques, au moment où la translation atteint -50 % la copie occupe
 * exactement la position de départ de l'originale : la boucle repart sans
 * saut ni blanc visible. Sans ce doublon, la fin d'un cycle laisserait un
 * vide avant que la piste ne revienne à son point de départ.
 *
 * La copie dupliquée est purement décorative : `aria-hidden="true"` sur
 * chaque entrée et `tabindex="-1"` sur ses liens la retirent entièrement de
 * l'arbre d'accessibilité et de l'ordre de tabulation. Sans ça, un lecteur
 * d'écran annoncerait deux fois « Visiter le site d'Auchan », et un
 * utilisateur clavier pourrait tabuler vers un lien visuellement sorti du
 * cadre (le conteneur est en `overflow-hidden`) sans jamais le voir.
 *
 * DURÉE FIXE, PAS DÉRIVÉE DU CONTENU
 * La durée de cycle est une constante du jeton d'animation, pas une valeur
 * calculée à partir du nombre de partenaires : le projet interdit tout calcul
 * de rendu non déterministe (cf. CLAUDE.md, pré-rendu `vite-ssg`)  une
 * constante fixe évite d'avoir à se poser la question.
 *
 * PAUSE AU SURVOL *ET* AU FOCUS CLAVIER
 * `group-hover/marquee` et `group-focus-within/marquee` mettent tous les
 * deux la piste en pause (`animation-play-state: paused`). Un survol souris
 * ne suffit pas : un utilisateur au clavier qui tabule jusqu'à un logo doit
 * pouvoir lire son intitulé sans que la piste continue de défiler sous lui.
 *
 * `prefers-reduced-motion`
 * L'animation ne se contente pas de s'arrêter net : la piste repasse en
 * disposition statique qui s'enroule (`flex-wrap`), et la copie dupliquée
 * est masquée (`motion-reduce:hidden`). Un simple gel de la translation
 * aurait laissé la moitié du contenu hors champ pour toujours, le
 * conteneur restant en `overflow-hidden`  ce n'est pas un défilement figé
 * qu'il faut sous cette préférence, mais un bandeau qui ne bouge jamais.
 */
export interface PartnerCarouselItem {
  name: string
  /** URL résolue par Vite (import statique)  jamais un chemin en dur. */
  logoUrl: string
  /** Site officiel du partenaire ; ouvert dans un nouvel onglet. */
  url: string
}

withDefaults(defineProps<{ partners: PartnerCarouselItem[]; tone?: BackgroundTone }>(), {
  tone: 'light',
})

/**
 * Couleur de l'anneau de focus. Même arbitrage que `BaseButton` : l'accent
 * (#12D80A) n'atteint pas 3:1 sur fond clair (WCAG 1.4.11 non-textuel), le
 * navy n'atteint pas 3:1 sur fond sombre  chaque surface a donc sa propre
 * couleur d'anneau plutôt qu'une valeur unique qui échouerait sur l'une des
 * deux.
 */
const FOCUS_RING: Record<BackgroundTone, string> = {
  light: 'focus-visible:outline-primary-900',
  dark: 'focus-visible:outline-accent-500',
}

/**
 * Filtre appliqué en plus de `grayscale` au repos.
 *
 * HISTORIQUE V0.1.3  pourquoi `brightness-0` avait été ajouté : le logo
 * Verspieren (`assets/images/partners/verspieren.svg`) était un tracé blanc
 * plein (`fill="#fff"`) sans aucun fond opaque  converti en `grayscale`, il
 * restait blanc, invisible sur le fond clair (`tone="light"`) de la section
 * Confiance. `brightness-0` assombrissait alors TOUS les logos jusqu'au noir
 * plein au repos (Verspieren y compris), avant que `grayscale-0`/
 * `brightness-100` ne restaurent couleur et luminosité au survol/focus.
 *
 * BUG DÉCOUVERT EN V0.1.6  pourquoi `brightness-0` est abandonné : deux des
 * huit logos (Kiabi, Mondial Relay) contiennent en réalité une forme de FOND
 * opaque (respectivement `fill="#040037"` et `fill="#96154a"`, occupant une
 * bonne partie du cadre de l'icône) SOUS un détail au tracé blanc plein
 * (`fill="#fff"`, le motif intérieur de l'icône). `brightness-0` assombrit
 * TOUT pixel opaque au noir, qu'il s'agisse du tracé du logo ou d'un fond :
 * le fond déjà sombre ET le détail blanc du dessus devenaient tous deux un
 * noir strictement identique, effaçant le motif intérieur et laissant un
 * simple aplat noir plein cadre  perçu comme un « gros bloc noir », pas
 * comme un logo.
 *
 * PISTE ÉCARTÉE (vérifiée puis rejetée)  corriger uniquement les SVG Kiabi/
 * Mondial Relay (découper le détail blanc en trou réellement transparent
 * dans le fond, via `fill-rule="evenodd"` ou un `<mask>`) tout en GARDANT
 * `brightness-0` pour ne rien changer aux 6 autres logos. Cette piste a été
 * testée dans un navigateur réel (Chromium/Playwright) avant d'être écartée :
 * elle fonctionne parfaitement SANS filtre (le trou est bien transparent), et
 * fonctionne aussi avec `grayscale` seul  mais dès qu'un filtre CSS
 * `brightness()` (à n'importe quelle valeur, y compris `brightness-0`) est
 * appliqué à un `<img>` chargeant ce SVG, la zone transparente redevient
 * opaque (reconstat par un cas de test minimal isolé : un simple carré avec
 * un trou rond, sans aucun rapport avec Kiabi, casse de façon identique dès
 * qu'un `brightness()` entre dans la chaîne de filtres). `contrast()` seul a
 * été vérifié inoffensif pour la transparence, mais son point de bascule fixe
 * (128/255) aurait poussé le vert clair de Leroy Merlin (luminance ≈ 62 %,
 * au-dessus du seuil) vers le blanc au lieu du noir  aucune combinaison
 * sans `brightness()` ne permet donc de forcer les 5 logos vers un noir pur
 * uniforme. `brightness()` est donc structurellement incompatible avec toute
 * solution qui dépend d'une zone transparente ou d'un blanc traité comme tel
 * dans un `<img>`  que cette zone vienne d'un vrai trou SVG ou du mécanisme
 * `multiply` ci-dessous. Le abandonner n'est donc pas une préférence, c'est
 * une contrainte technique vérifiée par l'observation.
 *
 * SOLUTION RETENUE V0.1.6  `grayscale` + `mix-blend-mode: multiply`, sans
 * aucun `brightness()`. En mode `multiply`, un pixel blanc (`multiply(blanc,
 * x) = x`) devient optiquement transparent : il laisse voir le fond de la
 * section (`bg-light`) au travers, exactement l'effet recherché pour un
 * « trou » dans un logo (le motif intérieur de Kiabi/Mondial Relay redevient
 * visible en négatif, sans bloc noir  vérifié par capture d'écran réelle et
 * échantillonnage de pixels, pas seulement par lecture du calcul). Un pixel
 * sombre reste sombre quel que soit le fond (`multiply(sombre, x) ≈ sombre`
 * sur un fond clair), donc les fonds opaques de Kiabi/Mondial Relay restent
 * visibles. `mix-blend-mode` est une opération de composition (comment les
 * pixels déjà rendus de l'`<img>` se mélangent avec ce qu'il y a derrière),
 * pas un filtre par pixel appliqué pendant le rendu du SVG lui-même : elle
 * n'est donc pas concernée par le bug de transparence de `brightness()`
 * ci-dessus, qui lui est spécifique à la chaîne de filtres CSS.
 *
 * EFFET DE BORD ACCEPTÉ, VÉRIFIÉ ET DOCUMENTÉ  les 5 logos qui n'avaient pas
 * ce problème (Auchan, Boulanger, Decathlon, Leroy Merlin, Midas) ne restent
 * PAS pixel-identiques à avant. Vérifié par capture d'écran comparative
 * (avant/après, même viewport, même position de défilement) : `brightness-0`
 * les forçait tous au noir pur (#000, un artifice indépendant de leur teinte
 * réelle) ; sans lui, `grayscale` seul les convertit vers LEUR propre niveau
 * de gris perceptuel  Midas reste identique (son tracé n'a aucun attribut
 * `fill`, donc déjà noir par défaut du SVG, luminance 0, insensible à ce
 * changement), les 4 autres dev-iennent un gris sombre plutôt qu'un noir
 * pur (le plus clair étant Leroy Merlin, vert assez lumineux, luminance
 * perceptuelle ≈ 62 %). C'est un compromis assumé, pas un oubli : la section
 * « PISTE ÉCARTÉE » ci-dessus démontre qu'aucune combinaison de filtres CSS
 * fiable (sans `brightness()`) ne permet de forcer ces 4 logos vers un noir
 * pur tout en préservant la transparence nécessaire à la correction de
 * Kiabi/Mondial Relay  la seule alternative aurait été de recolorer les
 * SVG sources de ces 4 logos eux-mêmes vers un gris/noir figé, hors
 * périmètre de ce correctif (ils ne présentent aucun bug, seul leur *rendu
 * sous filtre* changeait de nuance) et une charge de maintenance à chaque
 * futur ajout de partenaire. Le reste du bandeau (poids du texte, tailles,
 * espacement, comportement au survol/focus) est strictement inchangé ; à
 * l'échelle d'affichage réelle (`h-8`/`sm:h-9`, 32-36px de hauteur), les 4
 * logos concernés restent des silhouettes sombres et parfaitement lisibles,
 * cohérentes avec le reste du bandeau  voir ADR 10 pour l'arbitrage complet
 * et le détail des essais qui ont mené à ce choix.
 *
 * PIÈGE VÉRIFIÉ PAR OBSERVATION  POURQUOI VERSPIEREN EST CORRIGÉ À LA
 * SOURCE : `multiply` seul (sans corriger la source) NE résout PAS
 * Verspieren  son tracé est intégralement blanc, donc intégralement
 * transparent en `multiply`, blanc sur blanc comme avant. Contrairement à
 * Kiabi/Mondial Relay (dont le fond opaque sombre reste visible), Verspieren
 * n'a rien d'opaque à laisser voir : il redevient invisible. Le fichier
 * source `verspieren.svg` est donc corrigé directement en V0.1.6
 * (`fill="#fff"` → `fill="#000066"`, soit exactement `--color-primary-900`
 * du design system) : c'est un logo monochrome blanc conçu à l'origine pour
 * un fond sombre, mais utilisé ici uniquement sur fond clair (`tone="light"`,
 * seul usage réel du composant, vérifié)  le nom, la forme, le contenu du
 * tracé restent strictement identiques, seule la couleur de fill change pour
 * convenir à son contexte d'usage réel (ratio de contraste `#000066` sur
 * `#f4f6ff` ≈ 16,3:1, largement au-dessus du seuil AA non-textuel de 3:1).
 * Voir ADR 10 pour l'arbitrage complet.
 *
 * Sur fond sombre, `multiply` n'a plus de sens : la formule
 * `multiply(source, fond) = source × fond` tend vers 0 (noir) dès que le
 * fond est sombre, quelle que soit la couleur de la source  un logo clair
 * sur fond sombre se fondrait presque entièrement dans ce fond au lieu de
 * s'en détacher. Documenté comme un problème ouvert depuis V0.1.3 (`dark`
 * restait une chaîne vide) : la vraie difficulté n'est pas le blend mode
 * mais Midas, dont le tracé n'a AUCUN attribut `fill` (donc noir plein par
 * défaut du SVG, quel que soit le filtre appliqué)  aucune combinaison de
 * `filter`/`mix-blend-mode` ne peut éclaircir un pixel déjà au noir absolu
 * sans recolorer sa source, exactement le problème déjà rencontré (et
 * résolu à la source, pas par filtre) pour Verspieren ci-dessus.
 *
 * SOLUTION RETENUE  TUILE CLAIRE (V0.6) : plutôt que d'inventer un filtre
 * pour rendre CHAQUE logo lisible directement sur le navy (recolorer les 8
 * SVG à la main, non vérifiable sans les inspecter un par un), chaque logo
 * repose en tonalité sombre sur une petite tuile `bg-white/90 rounded-md`
 * (cf. `CHIP_CLASS` et le template). Le fond IMMÉDIAT du logo redevient
 * clair : la recette `multiply` ci-dessus s'applique donc SANS MODIFICATION
 *  Midas y reste un simple trait noir sur blanc, lisible par construction,
 * comme n'importe quel autre logo du bandeau. `dark` n'est donc plus une
 * chaîne vide mais une COPIE de `light` : le commentaire le précise pour
 * que ce ne soit pas lu comme un oubli de duplication.
 */
const MONOCHROME_FILTER: Record<BackgroundTone, string> = {
  light: 'mix-blend-multiply group-hover:mix-blend-normal group-focus-visible:mix-blend-normal',
  dark: 'mix-blend-multiply group-hover:mix-blend-normal group-focus-visible:mix-blend-normal',
}

/**
 * Tuile claire portée par chaque logo en tonalité sombre (cf. commentaire de
 * `MONOCHROME_FILTER` ci-dessus)  absente en tonalité claire, le fond de la
 * section suffit déjà. `/90` et non opaque : laisse deviner le fond du
 * bandeau derrière, cohérent avec le reste du design system (`bg-white/95`
 * de la Navbar, `bg-white/25` du reflet de survol des boutons).
 */
const CHIP_CLASS: Record<BackgroundTone, string> = {
  light: '',
  dark: 'rounded-md bg-white/90 px-2 py-1.5 shadow-soft',
}

const marqueeList = ref<HTMLElement | null>(null)

interface DragSession {
  startX: number
  initialTx: number
  halfWidth: number
  duration: number
}

let dragSession: DragSession | null = null

function getTranslateX(el: HTMLElement): number {
  return new DOMMatrix(getComputedStyle(el).transform).m41
}

function startDrag(e: MouseEvent) {
  const el = marqueeList.value
  if (!el || dragSession) return

  const tx = getTranslateX(el)
  const duration = parseFloat(getComputedStyle(el).animationDuration) || 80

  el.style.animation = 'none'
  el.style.transform = `translateX(${tx}px)`

  dragSession = { startX: e.clientX, initialTx: tx, halfWidth: el.scrollWidth / 2, duration }

  window.addEventListener('mousemove', moveDrag)
  window.addEventListener('mouseup', endDrag)
}

function moveDrag(e: MouseEvent) {
  if (!dragSession || !marqueeList.value) return
  e.preventDefault()
  const delta = e.clientX - dragSession.startX
  marqueeList.value.style.transform = `translateX(${dragSession.initialTx + delta}px)`
}

function endDrag() {
  const el = marqueeList.value
  if (!dragSession || !el) return

  const currentTx = getTranslateX(el)
  const absTx = Math.abs(currentTx) % dragSession.halfWidth
  const progress = absTx / dragSession.halfWidth
  const delay = -(progress * dragSession.duration)

  el.style.transform = ''
  el.style.animation = ''
  el.style.animationDelay = `${delay}s`

  dragSession = null
  window.removeEventListener('mousemove', moveDrag)
  window.removeEventListener('mouseup', endDrag)
}

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', moveDrag)
  window.removeEventListener('mouseup', endDrag)
})
</script>

<template>
  <div
    class="group/marquee overflow-hidden motion-reduce:overflow-visible cursor-grab active:cursor-grabbing select-none"
    @mousedown="startDrag"
  >
    <ul
      ref="marqueeList"
      class="flex w-max shrink-0 items-center gap-16 animate-marquee will-change-transform group-hover/marquee:[animation-play-state:paused] group-focus-within/marquee:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-8"
    >
      <li v-for="partner in partners" :key="partner.name" class="shrink-0">
        <a
          :href="partner.url"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`Visiter le site de ${partner.name} (nouvel onglet)`"
          class="group block rounded-md p-1 outline-offset-4 focus-visible:outline-3"
          :class="[FOCUS_RING[tone], CHIP_CLASS[tone]]"
        >
          <div class="flex h-20 w-48 items-center justify-center sm:h-24 sm:w-56">
            <img
              :src="partner.logoUrl"
              :alt="partner.name"
              class="max-h-full max-w-full object-contain grayscale transition-all duration-300 group-hover:grayscale-0 group-focus-visible:grayscale-0"
              :class="MONOCHROME_FILTER[tone]"
            />
          </div>
        </a>
      </li>

      <!-- Copie dupliquée, purement visuelle : cf. note de tête de fichier
           sur la mécanique du défilement infini et son retrait de
           l'accessibilité. -->
      <li
        v-for="partner in partners"
        :key="`${partner.name}-clone`"
        aria-hidden="true"
        class="shrink-0 motion-reduce:hidden"
      >
        <a :href="partner.url" tabindex="-1" class="block rounded-md p-1" :class="CHIP_CLASS[tone]">
          <div class="flex h-20 w-48 items-center justify-center sm:h-24 sm:w-56">
            <img
              :src="partner.logoUrl"
              alt=""
              class="max-h-full max-w-full object-contain grayscale"
              :class="MONOCHROME_FILTER[tone]"
            />
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>
