<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

interface Logo {
  name: string
  src: string
  needsInvert?: boolean
}

/**
 * Logos uniquement - les liens externes ont été retirés : ils s'ouvraient
 * accidentellement au moindre clic pendant une tentative de drag sur le
 * marquee (cf. correctif drag/momentum ci-dessous).
 */
const ROW_1: Logo[] = [
  { name: 'Adéo', src: '/images/references/adeo.svg' },
  { name: 'Leroy Merlin', src: '/images/references/leroy_merlin.svg' },
  { name: 'Kiabi', src: '/images/references/kiabi.svg' },
  { name: 'Decathlon', src: '/images/references/decathlon.svg' },
  { name: 'Boulanger', src: '/images/references/boulanger.svg' },
  { name: "Tape à l'Œil", src: '/images/references/tape_a_loeil.svg' },
  { name: 'Midas', src: '/images/references/midas.svg' },
  { name: 'Keolis', src: '/images/references/keolis.svg' },
  { name: 'OVH', src: '/images/references/ovh.svg' },
]

const ROW_2: Logo[] = [
  { name: 'Verspieren', src: '/images/references/verspieren.svg', needsInvert: true },
  { name: 'AXA', src: '/images/references/axa.svg' },
  { name: 'Oney', src: '/images/references/oney.svg' },
  { name: 'Supermarché Match', src: '/images/references/supermarche_match.svg' },
  { name: 'Kiloutou', src: '/images/references/kiloutou.svg' },
  { name: 'IRCEM', src: '/images/references/ircem.svg' },
  { name: 'Chronodrive', src: '/images/references/chronodrive.svg' },
  { name: 'Mondial Relay', src: '/images/references/mondial_relay.svg' },
]

const SECTORS = [
  'Retail & e-commerce',
  'Industrie & Logistique',
  'Banque, Finance & Assurance',
  'Cloud',
]

const sectorIndex = ref(0)
let sectorInterval: ReturnType<typeof setInterval> | undefined

const track1 = ref<HTMLElement | null>(null)
const track2 = ref<HTMLElement | null>(null)

interface DragSession {
  el: HTMLElement
  startX: number
  initialTx: number
  halfWidth: number
  duration: number
  reverse: boolean
  lastX: number
  lastT: number
  velocity: number
  didDrag: boolean
}

/** Coefficient de friction appliqué à la vélocité à chaque frame d'inertie. */
const FRICTION = 0.95
/** En dessous de ce seuil (px/ms), l'inertie s'arrête et on ressynchronise
 *  l'animation CSS du marquee. */
const VELOCITY_EPSILON = 0.02

let dragSession: DragSession | null = null
let momentumFrame: number | null = null

const isDragging = ref(false)

function getTranslateX(el: HTMLElement): number {
  return new DOMMatrix(getComputedStyle(el).transform).m41
}

/**
 * Ramène `tx` dans `(-halfWidth, 0]` - chaque piste contient le jeu de logos
 * en double (cf. `v-for="pass in 2"`), donc décaler d'exactement `halfWidth`
 * retombe sur un visuel identique. Appliqué à chaque frame de drag/inertie
 * pour empêcher de sortir du contenu dupliqué (espace blanc en bout de piste).
 */
function wrapTranslateX(tx: number, halfWidth: number): number {
  const wrapped = tx % halfWidth
  return wrapped > 0 ? wrapped - halfWidth : wrapped
}

/** Point X de l'événement, souris ou tactile - le drag/momentum ci-dessous
 *  est écrit une seule fois et partagé par les deux familles d'événements. */
function getClientX(e: MouseEvent | TouchEvent): number {
  return 'touches' in e ? (e.touches[0]?.clientX ?? e.changedTouches[0]?.clientX ?? 0) : e.clientX
}

function startDrag(e: MouseEvent | TouchEvent, trackEl: HTMLElement | null, reverse: boolean) {
  if (!trackEl || dragSession) return
  const inner = trackEl.firstElementChild as HTMLElement | null
  if (!inner) return

  if (momentumFrame !== null) {
    cancelAnimationFrame(momentumFrame)
    momentumFrame = null
  }

  const tx = getTranslateX(inner)
  const duration = parseFloat(getComputedStyle(inner).animationDuration) || 80
  const clientX = getClientX(e)

  inner.style.animation = 'none'
  inner.style.transform = `translateX(${tx}px)`

  dragSession = {
    el: inner,
    startX: clientX,
    initialTx: tx,
    halfWidth: inner.scrollWidth / 2,
    duration,
    reverse,
    lastX: clientX,
    lastT: performance.now(),
    velocity: 0,
    didDrag: false,
  }
  isDragging.value = true

  window.addEventListener('mousemove', moveDrag)
  window.addEventListener('mouseup', endDrag)
  // `{ passive: false }` : indispensable pour que `preventDefault()` dans
  // `moveDrag` bloque effectivement le scroll vertical de la page pendant un
  // swipe horizontal sur le marquee (sinon le navigateur ignore l'appel et
  // scrolle quand même, cf. `touch-pan-y` posé sur `.marquee-track` ci-dessous
  // qui gère le cas où l'utilisateur n'a pas encore déplacé le doigt).
  window.addEventListener('touchmove', moveDrag, { passive: false })
  window.addEventListener('touchend', endDrag)
}

function moveDrag(e: MouseEvent | TouchEvent) {
  if (!dragSession) return
  e.preventDefault()

  const clientX = getClientX(e)
  const now = performance.now()
  const dt = now - dragSession.lastT
  const dx = clientX - dragSession.lastX

  if (Math.abs(dx) > 2) dragSession.didDrag = true

  // Vélocité instantanée lissée (évite les à-coups entre deux `mousemove`/`touchmove`).
  if (dt > 0) {
    const instant = dx / dt
    dragSession.velocity = dragSession.velocity * 0.7 + instant * 0.3
  }
  dragSession.lastX = clientX
  dragSession.lastT = now

  const delta = clientX - dragSession.startX
  const tx = wrapTranslateX(dragSession.initialTx + delta, dragSession.halfWidth)
  dragSession.el.style.transform = `translateX(${tx}px)`
}

/** Ressynchronise l'animation CSS infinie du marquee sur la position actuelle. */
function resumeMarqueeAnimation(session: DragSession) {
  const { el, halfWidth, duration, reverse } = session
  const currentTx = getTranslateX(el)
  const absTx = Math.abs(currentTx) % halfWidth
  const progress = reverse ? 1 - absTx / halfWidth : absTx / halfWidth
  const delay = -(progress * duration)

  el.style.transform = ''
  el.style.animation = ''
  el.style.animationDelay = `${delay}s`
}

function runMomentum(session: DragSession) {
  let lastFrameT = performance.now()

  function step() {
    const now = performance.now()
    const dt = now - lastFrameT
    lastFrameT = now

    session.velocity *= FRICTION

    if (Math.abs(session.velocity) < VELOCITY_EPSILON) {
      momentumFrame = null
      resumeMarqueeAnimation(session)
      return
    }

    const currentTx = getTranslateX(session.el)
    const nextTx = wrapTranslateX(currentTx + session.velocity * dt, session.halfWidth)
    session.el.style.transform = `translateX(${nextTx}px)`
    momentumFrame = requestAnimationFrame(step)
  }

  momentumFrame = requestAnimationFrame(step)
}

function endDrag() {
  if (!dragSession) return
  const session = dragSession
  dragSession = null
  isDragging.value = false

  window.removeEventListener('mousemove', moveDrag)
  window.removeEventListener('mouseup', endDrag)
  window.removeEventListener('touchmove', moveDrag)
  window.removeEventListener('touchend', endDrag)

  if (session.didDrag && Math.abs(session.velocity) >= VELOCITY_EPSILON) {
    runMomentum(session)
  } else {
    resumeMarqueeAnimation(session)
  }
}

onMounted(() => {
  sectorInterval = setInterval(() => {
    sectorIndex.value = (sectorIndex.value + 1) % SECTORS.length
  }, 3000)
})

onBeforeUnmount(() => {
  clearInterval(sectorInterval)
  if (momentumFrame !== null) cancelAnimationFrame(momentumFrame)
  window.removeEventListener('mousemove', moveDrag)
  window.removeEventListener('mouseup', endDrag)
  window.removeEventListener('touchmove', moveDrag)
  window.removeEventListener('touchend', endDrag)
})
</script>

<template>
  <div
    class="flex h-full w-full flex-col justify-center py-8 [@media(max-height:650px)]:justify-between [@media(max-height:650px)]:pt-20 [@media(max-height:650px)]:pb-8 md:py-12"
  >
    <!-- BLOC 1 : Marquee ligne 1 → gauche -->
    <div
      ref="track1"
      class="marquee-track touch-pan-y"
      :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
      @mousedown="startDrag($event, track1, false)"
      @touchstart="startDrag($event, track1, false)"
    >
      <div class="marquee-left">
        <template v-for="pass in 2" :key="pass">
          <div
            v-for="logo in ROW_1"
            :key="`${pass}-${logo.name}`"
            class="shrink-0 transition-transform duration-300 hover:scale-105"
          >
            <div
              class="flex h-20 [@media(max-height:650px)]:h-12 w-48 items-center justify-center md:h-24 md:w-56 xl:h-28 xl:w-64"
            >
              <img
                :src="logo.src"
                :alt="logo.name"
                class="pointer-events-none max-h-full max-w-full object-contain"
                :class="{ invert: logo.needsInvert }"
              />
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- BLOC 2 : Texte central -->
    <div class="my-32 text-center md:my-40">
      <!-- fix contraste texte : bleu marine de la charte, plus solide que blue-500 -->
      <p class="text-lg md:text-xl lg:text-2xl font-bold uppercase tracking-wider text-primary-900">
        Ils nous font confiance dans les Hauts-de-France et au-delà
      </p>
      <h2
        class="mt-2 flex min-h-[88px] [@media(max-height:650px)]:min-h-[56px] items-center justify-center overflow-hidden pb-2 font-display text-4xl [@media(max-height:650px)]:text-2xl [@media(max-height:650px)]:leading-tight font-extrabold tracking-tight text-gray-900 md:min-h-[112px] md:text-5xl"
      >
        <Transition
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-300 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4"
          mode="out-in"
        >
          <span :key="sectorIndex" class="block">{{ SECTORS[sectorIndex] }}</span>
        </Transition>
      </h2>
    </div>

    <!-- BLOC 3 : Marquee ligne 2 → droite -->
    <div
      ref="track2"
      class="marquee-track touch-pan-y"
      :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
      @mousedown="startDrag($event, track2, true)"
      @touchstart="startDrag($event, track2, true)"
    >
      <div class="marquee-right">
        <template v-for="pass in 2" :key="pass">
          <div
            v-for="logo in ROW_2"
            :key="`${pass}-${logo.name}`"
            class="shrink-0 transition-transform duration-300 hover:scale-105"
          >
            <div
              class="flex h-20 [@media(max-height:650px)]:h-12 w-48 items-center justify-center md:h-24 md:w-56 xl:h-28 xl:w-64"
            >
              <img
                :src="logo.src"
                :alt="logo.name"
                class="pointer-events-none max-h-full max-w-full object-contain"
                :class="{ invert: logo.needsInvert }"
              />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes scroll-left {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@keyframes scroll-right {
  from {
    transform: translateX(-50%);
  }
  to {
    transform: translateX(0);
  }
}

.marquee-track {
  position: relative;
  width: 100%;
  overflow: hidden;
  user-select: none;
}

.marquee-left {
  display: flex;
  width: max-content;
  gap: 3rem;
  animation: scroll-left 40s linear infinite;
}

.marquee-right {
  display: flex;
  width: max-content;
  gap: 3rem;
  animation: scroll-right 40s linear infinite;
}

.marquee-track:hover .marquee-left,
.marquee-track:hover .marquee-right {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  .marquee-left,
  .marquee-right {
    animation: none;
  }
}
</style>
