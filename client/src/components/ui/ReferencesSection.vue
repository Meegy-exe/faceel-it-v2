<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

interface Logo {
  name: string
  src: string
  href?: string
  needsInvert?: boolean
}

const ROW_1: Logo[] = [
  { name: 'Adéo', src: '/images/references/adeo.svg', href: 'https://www.adeo.com/' },
  { name: 'Leroy Merlin', src: '/images/references/leroy_merlin.svg', href: 'https://www.leroymerlin.fr/' },
  { name: 'Kiabi', src: '/images/references/kiabi.svg', href: 'https://www.kiabi.com/' },
  { name: 'Decathlon', src: '/images/references/decathlon.svg', href: 'https://www.decathlon.fr/' },
  { name: 'Boulanger', src: '/images/references/boulanger.svg', href: 'https://www.boulanger.com/' },
  { name: "Tape à l'Œil", src: '/images/references/tape_a_loeil.svg', href: 'https://www.taokids.com/' },
  { name: 'Midas', src: '/images/references/midas.svg', href: 'https://www.midas.fr/' },
  { name: 'Keolis', src: '/images/references/keolis.svg', href: 'https://www.keolis.com/' },
  { name: 'OVH', src: '/images/references/ovh.svg', href: 'https://www.ovhcloud.com/fr/' },
]

const ROW_2: Logo[] = [
  { name: 'Verspieren', src: '/images/references/verspieren.svg', href: 'https://www.verspiren.com/', needsInvert: true },
  { name: 'AXA', src: '/images/references/axa.svg', href: 'https://www.axa.fr/' },
  { name: 'Oney', src: '/images/references/oney.svg', href: 'https://www.oney.fr/' },
  { name: 'Supermarché Match', src: '/images/references/supermarche_match.svg', href: 'https://www.supermarchesmatch.fr/fr' },
  { name: 'Kiloutou', src: '/images/references/kiloutou.svg', href: 'https://www.kiloutou.fr/' },
  { name: 'IRCEM', src: '/images/references/ircem.svg', href: 'https://www.ircem.com/' },
  { name: 'Chronodrive', src: '/images/references/chronodrive.svg', href: 'https://www.chronodrive.com/' },
  { name: 'Mondial Relay', src: '/images/references/mondial_relay.svg', href: 'https://www.mondialrelay.fr/' },
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
}

let dragSession: DragSession | null = null

function getTranslateX(el: HTMLElement): number {
  return new DOMMatrix(getComputedStyle(el).transform).m41
}

function startDrag(e: MouseEvent, trackEl: HTMLElement | null, reverse: boolean) {
  if (!trackEl || dragSession) return
  const inner = trackEl.firstElementChild as HTMLElement | null
  if (!inner) return

  const tx = getTranslateX(inner)
  const duration = parseFloat(getComputedStyle(inner).animationDuration) || 80

  inner.style.animation = 'none'
  inner.style.transform = `translateX(${tx}px)`

  dragSession = { el: inner, startX: e.clientX, initialTx: tx, halfWidth: inner.scrollWidth / 2, duration, reverse }

  window.addEventListener('mousemove', moveDrag)
  window.addEventListener('mouseup', endDrag)
}

function moveDrag(e: MouseEvent) {
  if (!dragSession) return
  e.preventDefault()
  const delta = e.clientX - dragSession.startX
  dragSession.el.style.transform = `translateX(${dragSession.initialTx + delta}px)`
}

function endDrag() {
  if (!dragSession) return
  const { el, halfWidth, duration, reverse } = dragSession
  const currentTx = getTranslateX(el)
  const absTx = Math.abs(currentTx) % halfWidth
  const progress = reverse ? 1 - absTx / halfWidth : absTx / halfWidth
  const delay = -(progress * duration)

  el.style.transform = ''
  el.style.animation = ''
  el.style.animationDelay = `${delay}s`

  dragSession = null
  window.removeEventListener('mousemove', moveDrag)
  window.removeEventListener('mouseup', endDrag)
}

onMounted(() => {
  sectorInterval = setInterval(() => {
    sectorIndex.value = (sectorIndex.value + 1) % SECTORS.length
  }, 3000)
})

onBeforeUnmount(() => {
  clearInterval(sectorInterval)
  window.removeEventListener('mousemove', moveDrag)
  window.removeEventListener('mouseup', endDrag)
})
</script>

<template>
  <div class="flex h-full w-full flex-col justify-center py-8 md:py-12">
    <!-- BLOC 1 : Marquee ligne 1 → gauche -->
    <div ref="track1" class="marquee-track" @mousedown="startDrag($event, track1, false)">
      <div class="marquee-left">
        <template v-for="pass in 2" :key="pass">
          <component
            :is="logo.href ? 'a' : 'div'"
            v-for="logo in ROW_1"
            :key="`${pass}-${logo.name}`"
            :href="logo.href"
            :target="logo.href ? '_blank' : undefined"
            :rel="logo.href ? 'noopener noreferrer' : undefined"
            class="shrink-0 transition-transform duration-300 hover:scale-105"
          >
            <div class="flex h-20 w-48 items-center justify-center md:h-24 md:w-56 xl:h-28 xl:w-64">
              <img
                :src="logo.src"
                :alt="logo.name"
                class="max-h-full max-w-full object-contain"
                :class="{ invert: logo.needsInvert }"
              />
            </div>
          </component>
        </template>
      </div>
    </div>

    <!-- BLOC 2 : Texte central -->
    <div class="my-32 text-center md:my-40">
      <p class="text-base font-semibold uppercase tracking-widest text-blue-500">
        Ils nous font confiance
      </p>
      <h2 class="mt-2 overflow-hidden pb-2 font-display text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
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
    <div ref="track2" class="marquee-track" @mousedown="startDrag($event, track2, true)">
      <div class="marquee-right">
        <template v-for="pass in 2" :key="pass">
          <component
            :is="logo.href ? 'a' : 'div'"
            v-for="logo in ROW_2"
            :key="`${pass}-${logo.name}`"
            :href="logo.href"
            :target="logo.href ? '_blank' : undefined"
            :rel="logo.href ? 'noopener noreferrer' : undefined"
            class="shrink-0 transition-transform duration-300 hover:scale-105"
          >
            <div class="flex h-20 w-48 items-center justify-center md:h-24 md:w-56 xl:h-28 xl:w-64">
              <img
                :src="logo.src"
                :alt="logo.name"
                class="max-h-full max-w-full object-contain"
                :class="{ invert: logo.needsInvert }"
              />
            </div>
          </component>
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
  cursor: grab;
  user-select: none;
}

.marquee-track:active {
  cursor: grabbing;
}

.marquee-left {
  display: flex;
  width: max-content;
  gap: 3rem;
  animation: scroll-left 80s linear infinite;
}

.marquee-right {
  display: flex;
  width: max-content;
  gap: 3rem;
  animation: scroll-right 80s linear infinite;
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
