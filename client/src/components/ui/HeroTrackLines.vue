<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Nombre de lignes constituant le ruban 3D */
    lineCount?: number
    /** Vitesse de propagation de la vague */
    speed?: number
  }>(),
  {
    lineCount: 55, // Densité élevée pour correspondre à l'effet de la maquette
    speed: 0.45,
  },
)

/** Vert accent de la charte Faceel-IT (#12D80A) */
const ACCENT_RGB = '18, 216, 10'

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvas')
const rootRef = useTemplateRef<HTMLDivElement>('root')

let ctx: CanvasRenderingContext2D | null = null
let frame: number | undefined
let resizeObserver: ResizeObserver | undefined
let reduceMotionQuery: MediaQueryList | null = null

let width = 0
let height = 0
let elapsedMs = 0
let lastTimestamp: number | null = null

function resize() {
  const canvas = canvasRef.value
  const root = rootRef.value
  if (!canvas || !root) return

  width = root.clientWidth
  height = root.clientHeight

  const dpr = window.devicePixelRatio || 1
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function render(elapsedSec: number) {
  if (!ctx || width === 0 || height === 0) return

  ctx.clearRect(0, 0, width, height)

  // 1. MASQUE D'OPACITÉ (Protection du texte à gauche)
  // Dégradé linéaire horizontal : invisible à gauche, éclatant à droite
  const gradient = ctx.createLinearGradient(0, 0, width, 0)
  gradient.addColorStop(0, `rgba(${ACCENT_RGB}, 0)`) // 0% : Totalement transparent
  gradient.addColorStop(0.35, `rgba(${ACCENT_RGB}, 0)`) // 35% : Protège le texte "Faceelitez votre passion"
  gradient.addColorStop(0.65, `rgba(${ACCENT_RGB}, 0.8)`) // 65% : Point de focus et torsion
  gradient.addColorStop(1, `rgba(${ACCENT_RGB}, 0.2)`) // 100% : Fin de l'écran, fondu doux

  ctx.strokeStyle = gradient
  ctx.lineWidth = 1.2
  // Mode de fusion pour illuminer les croisements de lignes
  ctx.globalCompositeOperation = 'screen'

  // 2. TRACÉ DU RUBAN (Ondes avec déphasage pour l'effet 3D "Pinch")
  // On traverse l'écran (axe X) avec un pas de résolution
  const resolution = 15

  for (let i = 0; i < props.lineCount; i++) {
    ctx.beginPath()

    // Index normalisé de -1 à 1 pour écarter les lignes de part et d'autre du centre
    const normI = (i / (props.lineCount - 1)) * 2 - 1

    // Le déphasage (phaseShift) est le secret du "pli" 3D.
    // Au lieu de simplement décaler les lignes en Y, on décale leur temps/phase.
    const phaseShift = normI * 0.85

    for (let x = 0; x <= width; x += resolution) {
      const nx = x / width

      // Formule d'onde principale :
      // nx * 5.5 définit le nombre d'ondulations à l'écran
      const X = nx * 5.5 - elapsedSec * props.speed + phaseShift

      // Amplitude adaptative : la vague est plus ample sur les bords et se resserre au centre
      const baseAmplitude = height * 0.32
      const amplitudeModulation = 1 - Math.cos(nx * Math.PI) * 0.15

      // Calcul du Y avec :
      // 1. L'ondulation principale (Math.sin)
      // 2. L'écartement vertical fixe (normI * espacement) pour donner de l'épaisseur
      const y =
        height * 0.5 + Math.sin(X) * (baseAmplitude * amplitudeModulation) + normI * (height * 0.12)

      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  ctx.globalCompositeOperation = 'source-over'
}

function loop(timestamp: number) {
  const deltaMs = lastTimestamp === null ? 0 : Math.min(timestamp - lastTimestamp, 200)
  lastTimestamp = timestamp
  elapsedMs += deltaMs

  render(elapsedMs / 1000)
  frame = requestAnimationFrame(loop)
}

function handleResize() {
  resize()
  if (frame === undefined) render(elapsedMs / 1000)
}

function startAnimated() {
  resize()
  elapsedMs = 0
  lastTimestamp = null
  frame = requestAnimationFrame(loop)
}

function startStatic() {
  resize()
  // Frame figée (précisément choisie pour montrer la torsion) si reduced-motion activé
  elapsedMs = 3800
  render(elapsedMs / 1000)
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
  <div
    ref="root"
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
  >
    <canvas ref="canvas" class="block size-full opacity-90" />
  </div>
</template>
