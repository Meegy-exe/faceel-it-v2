<script setup lang="ts">
import imgAdeo from '@/assets/references/adeo.svg'
import imgLeroyMerlin from '@/assets/references/leroy_merlin.svg'
import imgKiabi from '@/assets/references/kiabi.svg'
import imgDecathlon from '@/assets/references/decathlon.svg'
import imgBoulanger from '@/assets/references/boulanger.svg'
import imgTapeALoeil from '@/assets/references/tape_a_loeil.svg'
import imgMidas from '@/assets/references/midas.svg'
import imgKeolis from '@/assets/references/keolis.svg'
import imgOvh from '@/assets/references/ovh.svg'
import imgVerspieren from '@/assets/references/verspieren.svg'
import imgAxa from '@/assets/references/axa.svg'
import imgOney from '@/assets/references/oney.svg'
import imgMatch from '@/assets/references/supermarche_match.svg'
import imgKiloutou from '@/assets/references/kiloutou.svg'
import imgIrcem from '@/assets/references/ircem.svg'
import imgChronodrive from '@/assets/references/chronodrive.svg'
import imgMondialRelay from '@/assets/references/mondial_relay.svg'

interface Logo {
  name: string
  src: string
  href?: string
  needsInvert?: boolean
}

const ROW_1: Logo[] = [
  { name: 'Adéo', src: imgAdeo, href: 'https://www.adeo.com/' },
  { name: 'Leroy Merlin', src: imgLeroyMerlin, href: 'https://www.leroymerlin.fr/' },
  { name: 'Kiabi', src: imgKiabi, href: 'https://www.kiabi.com/' },
  { name: 'Decathlon', src: imgDecathlon, href: 'https://www.decathlon.fr/' },
  { name: 'Boulanger', src: imgBoulanger, href: 'https://www.boulanger.com/' },
  { name: "Tape à l'Œil", src: imgTapeALoeil, href: 'https://www.taokids.com/' },
  { name: 'Midas', src: imgMidas, href: 'https://www.midas.fr/' },
  { name: 'Keolis', src: imgKeolis, href: 'https://www.keolis.com/' },
  { name: 'OVH', src: imgOvh, href: 'https://www.ovhcloud.com/fr/' },
]

const ROW_2: Logo[] = [
  { name: 'Verspieren', src: imgVerspieren, href: 'https://www.verspiren.com/', needsInvert: true },
  { name: 'AXA', src: imgAxa, href: 'https://www.axa.fr/' },
  { name: 'Oney', src: imgOney, href: 'https://www.oney.fr/' },
  { name: 'Supermarché Match', src: imgMatch, href: 'https://www.supermarchesmatch.fr/fr' },
  { name: 'Kiloutou', src: imgKiloutou, href: 'https://www.kiloutou.fr/' },
  { name: 'IRCEM', src: imgIrcem, href: 'https://www.ircem.com/' },
  { name: 'Chronodrive', src: imgChronodrive, href: 'https://www.chronodrive.com/' },
  { name: 'Mondial Relay', src: imgMondialRelay, href: 'https://www.mondialrelay.fr/' },
]
</script>

<template>
  <div class="flex h-full w-full flex-col justify-center py-8 md:py-12">
    <!-- BLOC 1 : Marquee ligne 1 → gauche -->
    <div class="marquee-track">
      <div class="marquee-left">
        <template v-for="pass in 2" :key="pass">
          <component
            :is="logo.href ? 'a' : 'div'"
            v-for="logo in ROW_1"
            :key="`${pass}-${logo.name}`"
            :href="logo.href"
            :target="logo.href ? '_blank' : undefined"
            :rel="logo.href ? 'noopener noreferrer' : undefined"
            class="mx-4 flex h-24 w-48 shrink-0 cursor-pointer items-center justify-center transition-transform duration-300 hover:scale-105 md:h-32 md:w-64"
          >
            <img
              :src="logo.src"
              :alt="logo.name"
              class="h-full w-full object-contain"
              :class="{ invert: logo.needsInvert }"
            />
          </component>
        </template>
      </div>
    </div>

    <!-- BLOC 2 : Texte central -->
    <div class="my-32 text-center md:my-40">
      <p class="text-base font-semibold uppercase tracking-widest text-blue-500">
        Ils nous font confiance
      </p>
      <h2
        class="mt-2 text-balance font-display text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl"
      >
        Nos références,<br />notre fierté.
      </h2>
    </div>

    <!-- BLOC 3 : Marquee ligne 2 → droite -->
    <div class="marquee-track">
      <div class="marquee-right">
        <template v-for="pass in 2" :key="pass">
          <component
            :is="logo.href ? 'a' : 'div'"
            v-for="logo in ROW_2"
            :key="`${pass}-${logo.name}`"
            :href="logo.href"
            :target="logo.href ? '_blank' : undefined"
            :rel="logo.href ? 'noopener noreferrer' : undefined"
            class="mx-4 flex h-24 w-48 shrink-0 cursor-pointer items-center justify-center transition-transform duration-300 hover:scale-105 md:h-32 md:w-64"
          >
            <img
              :src="logo.src"
              :alt="logo.name"
              class="h-full w-full object-contain"
              :class="{ invert: logo.needsInvert }"
            />
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
}

.marquee-left {
  display: flex;
  width: max-content;
  animation: scroll-left 80s linear infinite;
}

.marquee-right {
  display: flex;
  width: max-content;
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
