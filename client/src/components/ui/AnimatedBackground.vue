<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'
import type { BackgroundTone, BackgroundVariant } from './types'

const props = withDefaults(
  defineProps<{
    variant?: BackgroundVariant
    /** Tonalité de la surface d'accueil, pas du décor lui-même. */
    tone?: BackgroundTone
    /** Nombre de faisceaux de données, piloté par la densité. */
    density?: number
  }>(),
  { variant: 'pixels', tone: 'dark', density: 60 },
)

/* -------------------------------------------------------------------------- */
/* Habillage par tonalité & Visibilité des calques                            */
/* -------------------------------------------------------------------------- */

const GRID_LINES: Record<BackgroundTone, string> = {
  dark: '[background-image:linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)]',
  light:
    '[background-image:linear-gradient(to_right,rgba(0,0,102,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,102,0.07)_1px,transparent_1px)]',
}

const showGrid = computed(() => props.variant === 'grid' || props.variant === 'pixels')
const showAurora = computed(() => props.variant === 'aurora' || props.variant === 'pixels')
const showDataCloud = computed(() => props.variant === 'pixels')

/* -------------------------------------------------------------------------- */
/* Cyber Flow / Data Trails (Canvas natif)                                    */
/* -------------------------------------------------------------------------- */

const ACCENT_RGB = '18, 216, 10' // Vert Faceel-IT

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvas')
const rootRef = useTemplateRef<HTMLDivElement>('root')

let ctx: CanvasRenderingContext2D | null = null
let frame: number | undefined
let resizeObserver: ResizeObserver | undefined
let reduceMotionQuery: MediaQueryList | null = null

let width = 0
let height = 0
let mouseX = -1000
let mouseY = -1000

interface DataStream {
  x: number
  y: number
  baseY: number
  length: number
  speed: number
  baseSpeed: number
  thickness: number
  opacity: number
}

const streams: DataStream[] = []

function createStream(randomizeX = false): DataStream {
  const baseSpeed = Math.random() * 3 + 1.5
  return {
    x: randomizeX ? Math.random() * width : -Math.random() * 200 - 150,
    y: Math.random() * height,
    baseY: Math.random() * height,
    length: Math.random() * 200 + 80,
    speed: baseSpeed,
    baseSpeed,
    thickness: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.7 + 0.1,
  }
}

function initStreams() {
  streams.length = 0
  const count = Math.max(10, Math.min(150, Math.round(props.density)))
  for (let i = 0; i < count; i++) {
    streams.push(createStream(true))
  }
}

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

  initStreams()
}

function handleMouseMove(e: MouseEvent) {
  if (!rootRef.value) return
  const rect = rootRef.value.getBoundingClientRect()
  mouseX = e.clientX - rect.left
  mouseY = e.clientY - rect.top
}

function handleMouseLeave() {
  mouseX = -1000
  mouseY = -1000
}

function render() {
  if (!ctx || !showDataCloud.value) {
    if (frame !== undefined) frame = requestAnimationFrame(render)
    return
  }

  ctx.clearRect(0, 0, width, height)

  const isReduced = reduceMotionQuery?.matches ?? false
  const timeScale = isReduced ? 0.05 : 1

  const mouseRadius = 120
  const repulsionForce = 15

  // Effet néon renforcé sur fond sombre
  ctx.globalCompositeOperation = props.tone === 'dark' ? 'screen' : 'source-over'

  for (const s of streams) {
    s.x += s.speed * timeScale

    // Interaction souris
    if (!isReduced && mouseX > -1) {
      const dx = s.x - mouseX
      const dy = s.y - mouseY
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < mouseRadius) {
        const push = (1 - dist / mouseRadius) * repulsionForce
        s.y += (dy > 0 ? push : -push) * 0.1
        s.speed += push * 0.02
      } else {
        s.y += (s.baseY - s.y) * 0.05
        s.speed += (s.baseSpeed - s.speed) * 0.05
      }
    }

    // Réinitialisation en sortie d'écran
    if (s.x - s.length > width) {
      Object.assign(s, createStream(false))
      s.baseY = Math.random() * height
      s.y = s.baseY
    }

    // Dessin du faisceau avec gradient
    const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.length, s.y)
    grad.addColorStop(0, `rgba(${ACCENT_RGB}, ${s.opacity})`)
    grad.addColorStop(1, `rgba(${ACCENT_RGB}, 0)`)

    ctx.beginPath()
    ctx.moveTo(s.x, s.y)
    ctx.lineTo(s.x - s.length, s.y)
    ctx.lineWidth = s.thickness
    ctx.strokeStyle = grad

    // Ajout du Glow uniquement si on est sur un fond sombre
    ctx.shadowBlur = props.tone === 'dark' ? s.thickness * 6 : 0
    ctx.shadowColor = `rgba(${ACCENT_RGB}, ${s.opacity})`

    ctx.stroke()
  }

  ctx.globalCompositeOperation = 'source-over'
  frame = requestAnimationFrame(render)
}

watch(() => props.density, initStreams)

onMounted(() => {
  ctx = canvasRef.value?.getContext('2d') ?? null

  resizeObserver = new ResizeObserver(resize)
  if (rootRef.value) resizeObserver.observe(rootRef.value)

  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseleave', handleMouseLeave)

  reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  resize()
  frame = requestAnimationFrame(render)
})

onBeforeUnmount(() => {
  if (frame !== undefined) cancelAnimationFrame(frame)
  resizeObserver?.disconnect()
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseleave', handleMouseLeave)
})
</script>

<template>
  <div
    ref="root"
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
  >
    <!-- 1. Trame technique. Débordement volontaire (`-inset-32`). -->
    <div
      v-if="showGrid"
      class="absolute -inset-32 animate-drift [background-size:64px_64px] [mask-image:radial-gradient(ellipse_55%_50%_at_50%_40%,black,transparent)] motion-reduce:animate-none"
      :class="GRID_LINES[tone]"
    />

    <!-- 2. Lueurs de fond (Aurora) -->
    <template v-if="showAurora">
      <div
        class="absolute -top-32 -left-24 size-[28rem] animate-float rounded-full bg-primary-500/25 blur-3xl motion-reduce:animate-none"
      />
      <div
        class="absolute -right-32 -bottom-40 size-[32rem] animate-float-slow rounded-full bg-accent-500/15 blur-3xl [animation-delay:-3s] motion-reduce:animate-none"
      />
      <div
        class="absolute top-1/3 left-1/2 size-72 -translate-x-1/2 animate-pulse-soft rounded-full bg-accent-400/10 blur-3xl motion-reduce:animate-none"
      />
    </template>

    <!-- 3. Cyber Flow / Data Trails (Canvas) -->
    <canvas
      v-show="showDataCloud"
      ref="canvas"
      class="absolute inset-0 block size-full opacity-80"
    />
  </div>
</template>
