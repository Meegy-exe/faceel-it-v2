<script setup lang="ts">
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
