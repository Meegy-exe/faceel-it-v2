<script setup lang="ts">
import type { BackgroundTone } from './types'

/**
 * Bandeau de confiance : logos ou noms de clients.
 *
 * STATIQUE PAR CHOIX, PAS PAR OMISSION
 * Le motif habituel de ce type de bandeau est un défilement automatique
 * continu. On ne le fait pas : une animation qui ne s'arrête jamais est
 * exactement le genre de déclencheur vestibulaire que
 * `prefers-reduced-motion` sert à neutraliser ailleurs dans ce Design
 * System — l'appliquer partout sauf ici serait incohérent. Un bandeau qui
 * s'enroule (`flex-wrap`) affiche la même liste sans jamais bouger seul.
 *
 * `logoUrl` est optionnel : sans fichier de logo réel fourni par chaque
 * client, l'entrée retombe sur son nom en typographie de marque. Le composant
 * n'a donc pas besoin d'être retouché le jour où les vrais fichiers arrivent
 * — seule la donnée change.
 */
export interface LogoWallItem {
  name: string
  /** URL absolue ou relative vers un fichier de logo réel (SVG/PNG). */
  logoUrl?: string
}

withDefaults(defineProps<{ logos: LogoWallItem[]; tone?: BackgroundTone }>(), { tone: 'light' })

const TEXT_TONE: Record<BackgroundTone, string> = {
  light: 'text-primary-900/50 hover:text-primary-900',
  dark: 'text-white/50 hover:text-white',
}
</script>

<template>
  <ul class="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
    <li v-for="logo in logos" :key="logo.name" class="flex items-center">
      <img
        v-if="logo.logoUrl"
        :src="logo.logoUrl"
        :alt="logo.name"
        class="h-7 w-auto object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
      />
      <!-- Repli tant qu'aucun fichier de logo réel n'est fourni pour ce
           client : le nom en typographie de marque, pas une image inventée. -->
      <span
        v-else
        class="font-display text-lg font-extrabold tracking-tight uppercase transition-colors duration-300"
        :class="TEXT_TONE[tone]"
      >
        {{ logo.name }}
      </span>
    </li>
  </ul>
</template>
