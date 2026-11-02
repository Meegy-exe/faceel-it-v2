<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'

/**
 * Maillage de losanges animé, fond du Hero de l'accueil.
 *
 * Deux familles de lignes parallèles inclinées à ±`angleDeg` quadrillent toute
 * la surface et forment un réseau de losanges. Le maillage reste discret en
 * permanence ; par-dessus, une vague de cases « allumées » parcourt la grille
 * en boucle, en suivant l'orientation du maillage.
 *
 * REPÈRE OBLIQUE  toute la géométrie tient dans un changement de repère, pas
 * dans une rotation du contexte canvas (`ctx.rotate()` ferait tourner AUSSI la
 * zone à couvrir, il faudrait alors sur-dimensionner le dessin à l'aveugle).
 * Chaque point (x, y) reçoit deux coordonnées obliques, une par famille de
 * lignes, exprimées en nombre de mailles :
 *     a = (-x·sinα + y·cosα) / cellSize      (normale à la famille A)
 *     b = ( x·sinα + y·cosα) / cellSize      (normale à la famille B)
 * Une case est alors le couple d'entiers (i, j) = (⌊a⌋, ⌊b⌋)  adressable, et
 * inversible pour retrouver ses quatre sommets à l'écran (cf. `cellCorner`).
 *
 * INDICE DIAGONAL DE LA VAGUE c'est `i` seul, et non `i + j` ou `i - j`.
 * Dans un réseau SYMÉTRIQUE (±α), `a + b` ne dépend que de y et `b - a` que de
 * x : un front construit sur `i + j` serait donc horizontal, sur `i - j`
 * vertical  dans les deux cas plus « en biais » du tout. Le front parallèle
 * aux lignes du maillage, celui qu'on cherche, est exactement `i = constante`.
 *
 * CANVAS, PAS DE DOM  un nœud par case (plusieurs milliers) serait ingérable
 * à 60 images/s. L'état d'animation vit dans des variables de module
 * délibérément NON réactives : le passer dans un `ref` ferait suivre chaque
 * frame par le système de réactivité de Vue pour rien.
 *
 * DÉTERMINISME (cf. CLAUDE.md)  aucune source d'aléa : la grille est
 * entièrement dérivée de la taille du canvas et la vague part toujours de 0.
 * Le pré-rendu SSG et le rendu client ne peuvent pas diverger.
 *
 * `prefers-reduced-motion` : la boucle ne démarre pas une vague qui traverse
 * l'écran en continu est exactement le type de mouvement que ce réglage vise.
 * Une seule frame figée, vague à mi-course, la remplace.
 */
const props = withDefaults(
  defineProps<{
    /** Espacement entre deux lignes d'une même famille, en pixels CSS. */
    cellSize?: number
    /** Inclinaison des deux familles par rapport à l'horizontale, en degrés. */
    angleDeg?: number
    /** Durée d'une traversée complète de la grille par la vague, en secondes. */
    cycleSeconds?: number
    /**
     * Largeur du front de vague, en NOMBRE DE CASES  donc solidaire de
     * `cellSize` : resserrer la maille sans augmenter cette valeur d'autant
     * rétrécirait le front à l'écran dans la même proportion. Les deux ont été
     * ajustés ensemble (46/6 → 18/14).
     */
    waveWidth?: number
    /**
     * Amplitude de l'ondulation du front, en nombre de cases : de combien la
     * crête avance ou recule selon l'endroit où on la regarde le long de son
     * axe. À 0, le front redevient la droite parfaite de l'itération
     * précédente.
     */
    waveAmplitude?: number
    /** Fréquence SPATIALE de l'ondulation, en radians par case de `j`
     *  autrement dit le nombre de sinuosités visibles d'un bout à l'autre du
     *  front. */
    waveSpatialFrequency?: number
    /** Fréquence TEMPORELLE de l'ondulation, en radians par seconde : elle
     *  fait serpenter le front sur place, indépendamment de son avancée
     *  d'ensemble. */
    waveTemporalFrequency?: number
    /** Opacité des lignes du maillage (toujours visibles). */
    lineOpacity?: number
    /** Opacité maximale du remplissage d'une case, au cœur du front. */
    fillOpacity?: number
  }>(),
  {
    cellSize: 12,
    angleDeg: 60,
    cycleSeconds: 24,
    waveWidth: 20,
    waveAmplitude: 7,
    waveSpatialFrequency: 0.14,
    waveTemporalFrequency: 0.55,
    lineOpacity: 0.15,
    fillOpacity: 0.5,
  },
)

/** Vert accent de la charte (#12D80A). Dupliqué en RGB : un canvas ne voit pas
 *  les variables `@theme` de Tailwind  `main.css` reste la source de vérité. */
const ACCENT = '18, 216, 10'

/**
 * Nombre de paliers d'opacité de remplissage. Il sert deux fois :
 *   les chaînes `rgba()` correspondantes sont calculées UNE fois
 *     (`fillPalette`), là où les composer par case allouerait des dizaines de
 *     milliers de chaînes par seconde pour un dégradé dont l'œil ne distingue
 *     de toute façon pas les paliers ;
 *    c'est le nombre de `Path2D` accumulés par frame (`drawWave`) : depuis
 *     que l'intensité dépend AUSSI de `j`, elle n'est plus constante le long
 *     d'une colonne, et un `fillStyle` par case ferait des milliers de
 *     changements d'état du contexte par frame  de loin le poste le plus
 *     coûteux du rendu canvas. Regrouper les cases par palier ramène ce
 *     nombre à `FILL_STEPS`, quelle que soit la densité de la grille.
 * Volontairement modeste (16 et non 48) : chaque palier coûte un `Path2D` et
 * un `fill()` par frame, et la différence entre deux paliers voisins est déjà
 * sous le seuil perceptible à ces opacités.
 */
const FILL_STEPS = 16

/** En dessous, la case n'apporte rien de visible : on évite le tracé. */
const MIN_VISIBLE_INTENSITY = 0.02

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvas')
const rootRef = useTemplateRef<HTMLDivElement>('root')

let ctx: CanvasRenderingContext2D | null = null
let frame: number | undefined
let resizeObserver: ResizeObserver | undefined
let reduceMotionQuery: MediaQueryList | null = null

let widthCss = 0
let heightCss = 0

/** Géométrie du repère oblique, recalculée à chaque redimensionnement. */
let sinA = 0
let cosA = 1
let iMin = 0
let iMax = 0
let jMin = 0
let jMax = 0
/** Nombre de colonnes obliques : c'est la distance que la vague parcourt avant
 *  de reboucler. */
let iSpan = 1

let fillPalette: string[] = []
let lineStyle = ''

/** Position du front, en colonnes obliques depuis `iMin`. */
let waveFront = 0
let lastTimestamp: number | null = null
/** Temps cumulé depuis le démarrage de la boucle  pilote le déphasage
 *  temporel de l'ondulation (cf. `frontAtRow`). */
let elapsedMs = 0

/** Coordonnée écran du sommet (a, b) du repère oblique  inversion du système
 *  décrit en tête de fichier. */
function cellCorner(a: number, b: number): { x: number; y: number } {
  return {
    x: (props.cellSize * (b - a)) / (2 * sinA),
    y: (props.cellSize * (a + b)) / (2 * cosA),
  }
}

function resize() {
  const canvas = canvasRef.value
  const root = rootRef.value
  if (!canvas || !root) return

  widthCss = root.clientWidth
  heightCss = root.clientHeight

  // Mise à l'échelle HiDPI : sans elle, les traits fins du maillage bavent sur
  // tout écran Retina (devicePixelRatio > 1).
  const dpr = window.devicePixelRatio || 1
  canvas.width = Math.max(1, Math.round(widthCss * dpr))
  canvas.height = Math.max(1, Math.round(heightCss * dpr))
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)

  const angle = (props.angleDeg * Math.PI) / 180
  sinA = Math.sin(angle)
  cosA = Math.cos(angle)

  // Bornes de la grille : les quatre coins du canvas suffisent à encadrer les
  // deux coordonnées obliques, toutes deux linéaires en (x, y)  inutile
  // d'échantillonner le reste de la surface.
  const corners: [number, number][] = [
    [0, 0],
    [widthCss, 0],
    [0, heightCss],
    [widthCss, heightCss],
  ]
  let aMin = Infinity
  let aMax = -Infinity
  let bMin = Infinity
  let bMax = -Infinity
  for (const [x, y] of corners) {
    const a = (-x * sinA + y * cosA) / props.cellSize
    const b = (x * sinA + y * cosA) / props.cellSize
    aMin = Math.min(aMin, a)
    aMax = Math.max(aMax, a)
    bMin = Math.min(bMin, b)
    bMax = Math.max(bMax, b)
  }

  // Une maille de marge de chaque côté : sans elle, les cases de bord seraient
  // tronquées au lieu de sortir proprement du cadre.
  iMin = Math.floor(aMin) - 1
  iMax = Math.ceil(aMax) + 1
  jMin = Math.floor(bMin) - 1
  jMax = Math.ceil(bMax) + 1
  iSpan = Math.max(1, iMax - iMin + 1)

  lineStyle = `rgba(${ACCENT}, ${props.lineOpacity.toFixed(3)})`
  fillPalette = Array.from(
    { length: FILL_STEPS + 1 },
    (_, step) => `rgba(${ACCENT}, ${((step / FILL_STEPS) * props.fillOpacity).toFixed(3)})`,
  )
}

/** Longueur suffisante pour qu'une ligne traverse le canvas de part en part
 *  quelle que soit son inclinaison. */
function halfLineLength(): number {
  return Math.hypot(widthCss, heightCss)
}

function drawMesh() {
  if (!ctx) return

  const reach = halfLineLength()
  ctx.lineWidth = 1
  ctx.strokeStyle = lineStyle

  // Un seul `beginPath`/`stroke` pour TOUTES les lignes des deux familles :
  // un tracé par ligne multiplierait par cent les changements d'état du
  // contexte, de loin le poste le plus coûteux du rendu canvas.
  ctx.beginPath()

  // Famille A : normale (-sinα, cosα), donc direction (cosα, sinα).
  for (let i = iMin; i <= iMax + 1; i++) {
    const offset = i * props.cellSize
    const px = -sinA * offset
    const py = cosA * offset
    ctx.moveTo(px - cosA * reach, py - sinA * reach)
    ctx.lineTo(px + cosA * reach, py + sinA * reach)
  }

  // Famille B : normale (sinα, cosα), donc direction (cosα, -sinα).
  for (let j = jMin; j <= jMax + 1; j++) {
    const offset = j * props.cellSize
    const px = sinA * offset
    const py = cosA * offset
    ctx.moveTo(px - cosA * reach, py + sinA * reach)
    ctx.lineTo(px + cosA * reach, py - sinA * reach)
  }

  ctx.stroke()
}

/**
 * Position du front POUR UNE RANGÉE DONNÉE, en colonnes obliques depuis `iMin`.
 *
 * C'est tout l'effet d'ondulation : le front n'est plus la droite `i =
 * waveFront` mais une ligne qui serpente, chaque rangée `j` voyant la crête
 * légèrement en avance ou en retard. Deux termes se composent un déphasage
 * SPATIAL (`j * waveSpatialFrequency`, qui donne au front sa forme de
 * sinusoïde à un instant figé) et un déphasage TEMPOREL (`elapsedSec *
 * waveTemporalFrequency`, qui fait glisser cette sinusoïde le long du front).
 * Sans le second, l'ondulation serait une forme rigide translatée ; avec lui,
 * elle serpente.
 *
 * Ce sont bien les CASES qui s'allument et s'éteignent une à une rien ne se
 * déplace à l'écran, seule leur opacité de remplissage change.
 */
function frontAtRow(j: number, elapsedSec: number): number {
  return (
    waveFront +
    props.waveAmplitude *
      Math.sin(j * props.waveSpatialFrequency + elapsedSec * props.waveTemporalFrequency)
  )
}

/**
 * Intensité de la vague pour une case, ∈ [0, 1].
 *
 * Distance CIRCULAIRE au front (`iSpan - raw` si c'est plus court) : sans ce
 * repli, la vague s'éteindrait au bord droit avant de réapparaître à gauche,
 * au lieu de traverser la couture sans rupture visible.
 */
function waveIntensity(i: number, front: number): number {
  const raw = Math.abs(i - iMin - front)
  const distance = Math.min(raw, iSpan - raw)
  if (distance >= props.waveWidth) return 0
  // Cosinus au carré : décroissance douce aux deux extrémités du front, là où
  // une rampe linéaire laisserait un angle net visible à l'œil.
  return Math.cos((distance / props.waveWidth) * (Math.PI / 2)) ** 2
}

function drawWave(elapsedSec: number) {
  if (!ctx) return

  // Un tracé par palier d'opacité, rempli d'un coup à la fin (cf. `FILL_STEPS`).
  const layers = Array.from({ length: FILL_STEPS + 1 }, () => new Path2D())
  let drawn = false

  for (let j = jMin; j <= jMax; j++) {
    const front = frontAtRow(j, elapsedSec)

    // Balayage BORNÉ à la fenêtre du front, et non à toute la grille : à cette
    // densité, parcourir les dizaines de milliers de cases hors d'atteinte
    // coûterait plus cher que tout le reste du rendu réuni.
    const center = iMin + front
    const from = Math.floor(center - props.waveWidth)
    const to = Math.ceil(center + props.waveWidth)

    for (let raw = from; raw <= to; raw++) {
      // Repli dans les bornes de la grille : une case « débordante » réapparaît
      // de l'autre côté, cohérent avec la distance circulaire ci-dessus.
      const i = iMin + ((((raw - iMin) % iSpan) + iSpan) % iSpan)

      const intensity = waveIntensity(i, front)
      if (intensity < MIN_VISIBLE_INTENSITY) continue

      const layer = layers[Math.round(intensity * FILL_STEPS)]
      if (!layer) continue

      const p0 = cellCorner(i, j)
      const p1 = cellCorner(i + 1, j)
      const p2 = cellCorner(i + 1, j + 1)
      const p3 = cellCorner(i, j + 1)

      layer.moveTo(p0.x, p0.y)
      layer.lineTo(p1.x, p1.y)
      layer.lineTo(p2.x, p2.y)
      layer.lineTo(p3.x, p3.y)
      layer.closePath()
      drawn = true
    }
  }

  if (!drawn) return
  for (let step = 1; step <= FILL_STEPS; step++) {
    const layer = layers[step]
    const color = fillPalette[step]
    if (!layer || !color) continue
    ctx.fillStyle = color
    ctx.fill(layer)
  }
}

function render(elapsedSec: number) {
  if (!ctx || widthCss === 0 || heightCss === 0) return
  ctx.clearRect(0, 0, widthCss, heightCss)
  // Remplissages d'abord, maillage par-dessus : les traits restent nets sur les
  // cases allumées, au lieu d'être noyés par leur propre remplissage.
  drawWave(elapsedSec)
  drawMesh()
}

function loop(timestamp: number) {
  const deltaMs = lastTimestamp === null ? 0 : Math.min(timestamp - lastTimestamp, 200)
  lastTimestamp = timestamp
  // Accumulateur borné au même plafond que `deltaMs` : un onglet remis au
  // premier plan après plusieurs minutes ne doit pas faire sauter l'ondulation
  // d'un coup. Il ne repart jamais à zéro tant que la boucle tourne, sinon la
  // sinusoïde temporelle se remettrait en phase par à-coups.
  elapsedMs += deltaMs

  // Vitesse exprimée en « grille entière par cycle » : la vague met
  // `cycleSeconds` à traverser, quelle que soit la largeur de l'écran ou la
  // taille de maille  un pas fixe en cases irait deux fois plus vite sur un
  // écran deux fois plus étroit.
  //
  // SENS : `waveFront` DÉCROÎT, pour que le front aille visuellement de la
  // gauche vers la droite. L'axe des `i` croissants suit la normale à la
  // famille A, soit (-sinα, cosα) : sa composante horizontale est négative
  // pour tout angle de ]0°, 180°[  autrement dit, faire croître `i` déplace
  // le front vers la GAUCHE, quel que soit `angleDeg`. D'où le décrément, et
  // le `+ iSpan` avant le modulo (le `%` de JavaScript garde le signe du
  // dividende : sans lui, `waveFront` deviendrait négatif au premier
  // rebouclage).
  waveFront = (waveFront - (iSpan * deltaMs) / (props.cycleSeconds * 1000) + iSpan) % iSpan

  render(elapsedMs / 1000)
  frame = requestAnimationFrame(loop)
}

function handleResize() {
  resize()
  if (frame === undefined) render(elapsedMs / 1000)
}

function startAnimated() {
  resize()
  waveFront = 0
  lastTimestamp = null
  elapsedMs = 0
  frame = requestAnimationFrame(loop)
}

/** Instant figé choisi pour la frame statique. Non nul et non multiple de π sur
 *  la fréquence temporelle : à t = 0 la sinusoïde partirait de sa position
 *  neutre sur toute une partie du front, donnant une image quasi rectiligne
 *  l'inverse de ce qu'on veut montrer d'une vague ondulante. */
const STATIC_FRAME_SECONDS = 2.4

function startStatic() {
  resize()
  // Vague figée à mi-course : une seule frame, aucun `frame` programmé  c'est
  // ce qui neutralise l'animation sous `prefers-reduced-motion`.
  waveFront = iSpan / 2
  elapsedMs = STATIC_FRAME_SECONDS * 1000
  render(STATIC_FRAME_SECONDS)
}

function stopAnimated() {
  if (frame !== undefined) {
    cancelAnimationFrame(frame)
    frame = undefined
  }
}

function syncMotionPreference() {
  stopAnimated()
  if (reduceMotionQuery?.matches) startStatic()
  else startAnimated()
}

onMounted(() => {
  ctx = canvasRef.value?.getContext('2d') ?? null

  resizeObserver = new ResizeObserver(handleResize)
  if (rootRef.value) resizeObserver.observe(rootRef.value)
  window.addEventListener('resize', handleResize)

  reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduceMotionQuery.addEventListener('change', syncMotionPreference)
  syncMotionPreference()
})

onBeforeUnmount(() => {
  stopAnimated()
  resizeObserver?.disconnect()
  window.removeEventListener('resize', handleResize)
  reduceMotionQuery?.removeEventListener('change', syncMotionPreference)
})
</script>

<template>
  <!-- Purement décoratif : `aria-hidden` + `pointer-events-none`. `-z-10`
       suppose un ancêtre positionné (`relative isolate` ou tout élément déjà
       `position` + `z-index` explicite, cf. le Hero d'accueil) même contrat
       que `AnimatedBackground.vue`. -->
  <div
    ref="root"
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
  >
    <canvas ref="canvas" class="block size-full" />
  </div>
</template>
