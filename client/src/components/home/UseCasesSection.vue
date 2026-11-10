<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { useScrollReveal } from '@/composables/useScrollReveal'

// anim realisations
const realisationsEl = useTemplateRef<HTMLElement>('realisationsEl')
const realisationsReveal = useScrollReveal(realisationsEl)
const isRealisationsVisible = computed(() => realisationsReveal.value !== 'hidden')

interface CaseStudy {
  name: string
  description: string
  /** Graine picsum.photos  déterministe (même visuel à chaque rendu/build),
   *  pas d'image aléatoire. Absente quand `image` est fourni (cas réel, ex.
   *  Boulanger) : pas besoin d'un visuel de substitution. */
  seed?: string
  /** Image de fond réelle (remplace le picsum)  uniquement pour les cas
   *  clients réels, documentés, avec un visuel propre. */
  image?: string
  /** Logo blanc affiché à la place du nom en texte uniquement pour les cas
   *  clients réels disposant d'un logo officiel (ex. Boulanger). */
  logo?: string
  /** Présent uniquement pour les cas clients réels, documentés par une page
   *  de référence dédiée : la carte entière devient un lien. */
  to?: RouteLocationRaw
  /** Fond de marque (ex. orange Boulanger) remplace le fond neutre par
   *  défaut de la carte ; pilote aussi le cadrage de l'image (cf. template :
   *  `object-contain` diminué plutôt que `object-cover` plein cadre). */
  bgColor?: string
}

const CASE_STUDIES: CaseStudy[] = [
  {
    name: 'Boulanger',
    description:
      "Refonte complète de l'application Boulanger pour moderniser l'interface et accompagner le lancement des projets stratégiques.",
    image: '/images/partners/boulanger/tel.png',
    logo: '/images/partners/boulanger-white.svg',
    to: { name: 'reference-boulanger' },
    bgColor: 'bg-[#ff6200]',
  },
  {
    name: 'Adeo',
    description:
      'Déploiement de solutions IA et automatisation des flux de données RH pour garantir une vision globale et fiable des applications internes.',
    /** `/images/references/adeo.svg` : seul fichier logo Adeo du dépôt, déjà
     *  utilisé tel quel (logo multicolore, pas de variante blanche) dans
     *  AdeoView.vue pas de fichier `adeo-white.svg`. Couleur de marque
     *  `#059dab` reprise de ce même fichier (teal), pas `#004f9f`. */
    image: '/images/partners/adeo/tt.png',
    logo: '/images/references/adeo.svg',
    to: { name: 'reference-adeo' },
    bgColor: 'bg-[#059dab]',
  },
  // retire cartes vides
]
</script>

<template>
  <!-- SECTION 4 (Cas d'usage) galerie (portfolio immersif, image + overlay). -->
  <!-- fix hauteur mobile -->
  <section
    id="realisations"
    ref="realisationsEl"
    data-theme="light"
    class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-white flex flex-col justify-center py-10 sm:py-20"
  >
    <!-- en tete, fondu vers le haut -->
    <div
      class="mx-auto max-w-3xl px-4 text-center"
      :class="
        isRealisationsVisible
          ? 'translate-y-0 opacity-100 transition-all duration-700 ease-out'
          : 'translate-y-8 opacity-0'
      "
    >
      <h2 class="font-display text-3xl font-extrabold text-[#000066] sm:text-5xl">
        Nos références
      </h2>
      <p class="mx-auto mt-2 max-w-2xl text-gray-600 sm:mt-4">
        Un aperçu des projets menés aux côtés de nos clients, tous secteurs confondus.
      </p>
    </div>

    <div
      class="mx-auto mt-6 grid w-full max-w-6xl grid-cols-1 gap-4 px-4 sm:mt-10 sm:gap-6 md:grid-cols-2 lg:gap-8"
    >
      <!-- `study.to` : cas client réel documenté par sa propre page (ex.
             Boulanger) la carte entière devient un lien ; absent pour les
             autres (mockups), qui restent de simples `<div>`. -->
      <!-- cascade cartes -->
      <component
        :is="study.to ? 'RouterLink' : 'div'"
        v-for="(study, index) in CASE_STUDIES"
        :key="study.name"
        v-bind="study.to ? { to: study.to } : {}"
        :style="{ transitionDelay: isRealisationsVisible ? `${index * 150}ms` : '0ms' }"
        :class="[
          study.bgColor || 'bg-gray-900',
          'group relative aspect-video overflow-hidden rounded-3xl',
          isRealisationsVisible
            ? 'translate-y-0 opacity-100 transition-all duration-700 ease-out'
            : 'translate-y-8 opacity-0 transition-none',
        ]"
      >
        <!-- `v-if` : Télécom/EDF n'ont plus ni `image` ni `seed` (fond
               blanc uni demandé) sans ce garde-fou, l'`<img>` pointerait
               vers une URL picsum invalide (`seed` undefined). -->
        <img
          v-if="study.image || study.seed"
          :src="study.image ?? `https://picsum.photos/seed/${study.seed}/800/600`"
          :alt="study.name"
          loading="lazy"
          decoding="async"
          :class="[
            'absolute transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100',
            study.bgColor
              ? 'inset-0 h-full w-full object-contain object-right p-4'
              : 'inset-0 h-full w-full object-cover',
          ]"
        />
        <!-- Dégradé navy prévu pour assombrir une photo de fond : sur les
               cartes à fond blanc uni, il ne ferait que ternir ce blanc sans
               raison (pas de photo à estomper dessous). -->
        <div
          v-if="study.bgColor !== 'bg-white'"
          class="absolute inset-0 bg-gradient-to-t from-[#000066]/90 via-[#000066]/40 to-transparent"
          aria-hidden="true"
        />
        <div class="absolute bottom-0 left-0 p-6">
          <img
            v-if="study.logo"
            :src="study.logo"
            :alt="study.name"
            class="h-8 w-auto object-contain"
          />
          <p
            v-else
            class="font-display font-bold"
            :class="study.bgColor === 'bg-white' ? 'text-[#000066]' : 'text-white'"
          >
            {{ study.name }}
          </p>
          <p
            class="mt-1 line-clamp-2 text-sm"
            :class="study.bgColor === 'bg-white' ? 'text-[#000066]' : 'text-white/80'"
          >
            {{ study.description }}
          </p>
        </div>
      </component>
    </div>
  </section>
</template>
