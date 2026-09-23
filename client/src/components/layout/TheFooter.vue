<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AnimatedBackground from '@/components/ui/AnimatedBackground.vue'
import CookieManagerModal from '@/components/ui/CookieManagerModal.vue'
import logoSrc from '@/assets/images/2.svg'

const isCookieModalOpen = ref(false)

const route = useRoute()

withDefaults(
  defineProps<{
    fullPageScroll?: boolean
    /** Conservé optionnel pour compatibilité App.vue — contenu désormais codé en dur. */
    columns?: unknown[]
    description?: string
  }>(),
  { fullPageScroll: false },
)
</script>

<template>
  <footer
    :class="[
      'w-full',
      route.meta.classicScroll
        ? 'shrink-0'
        : 'snap-start snap-always',
    ]"
  >

    <!-- ═══════════════════════════════════════════════════════════════════════
         SECTION 1 : Fond bleu — marque, réseaux sociaux, notes de satisfaction
         ═══════════════════════════════════════════════════════════════════════ -->
    <section class="relative isolate w-full overflow-hidden bg-[#000066] text-white">
      <AnimatedBackground variant="aurora" tone="dark" />

      <div class="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-16 md:pt-40 md:pb-20">
        <div class="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">

          <!-- Colonne gauche : identité + réseaux sociaux -->
          <div class="flex-1">
            <img :src="logoSrc" alt="Faceel-IT" class="h-16 w-auto object-contain" />

            <p class="mt-5 max-w-lg text-base leading-relaxed text-white/70 md:text-lg">
              Cabinet de conseil expert en Data, Intelligence Artificielle et Transformation digitale. Au-delà du code, c'est l'engagement de notre collectif qui fait aboutir vos projets.
            </p>

            <div class="mt-6 flex items-center gap-2">
              <a
                href="https://www.linkedin.com/company/faceel-it/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Faceel-IT sur LinkedIn"
                class="inline-flex size-9 items-center justify-center rounded-full text-white/60 transition-colors duration-200 hover:bg-white/10 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" class="size-5">
                  <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.3-.02-3-1.83-3-1.83 0-2.1 1.43-2.1 2.9V21h-4V9Z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@faceelit"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Faceel-IT sur YouTube"
                class="inline-flex size-9 items-center justify-center rounded-full text-white/60 transition-colors duration-200 hover:bg-white/10 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" class="size-5">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M3 5h18v14H3V5Zm7 4 6 3-6 3V9Z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/faceelit/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Faceel-IT sur Instagram"
                class="inline-flex size-9 items-center justify-center rounded-full text-white/60 transition-colors duration-200 hover:bg-white/10 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="none" class="size-5">
                  <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" stroke-width="1.8" />
                  <circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.8" />
                  <circle cx="17" cy="7" r="1" fill="currentColor" />
                </svg>
              </a>
              <a
                href="https://www.glassdoor.fr/Avis/Faceel-IT-Avis-E8791143.htm"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Faceel-IT sur Glassdoor"
                class="inline-flex size-9 items-center justify-center rounded-full text-white/60 transition-colors duration-200 hover:bg-white/10 hover:text-white"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" class="size-5">
                  <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6L10 1.5Z" />
                </svg>
              </a>
            </div>
          </div>

          <!-- Colonne droite : notes Glassdoor + Google -->
          <div class="flex w-full gap-4 lg:w-auto lg:shrink-0">
            <a
              href="https://www.glassdoor.fr/Avis/Faceel-it-Lille-Avis-EI_IE4844076.0,9_IL.10,15_IM1111.htm"
              target="_blank"
              rel="noopener noreferrer"
              class="flex flex-1 flex-col items-center rounded-xl bg-white px-4 py-4 text-gray-900 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg lg:px-8 lg:py-6"
            >
              <p class="text-3xl font-extrabold leading-none tracking-tight lg:text-5xl">5,0</p>
              <p class="mt-1.5 text-xs font-bold text-green-600 lg:mt-2 lg:text-sm">Glassdoor</p>
            </a>

            <a
              href="https://www.google.com/search?sca_esv=40dae565ac35b613&hl=fr&gl=fr&output=search&kgmid=/g/11r3m97yrh&q=Faceel-it&shndl=30&shem=lcuae,lstl1,uaasie&source=sh/x/loc/uni/m1/1&kgs=88c0721b1fda94c2"
              target="_blank"
              rel="noopener noreferrer"
              class="flex flex-1 flex-col items-center rounded-xl bg-white px-4 py-4 text-gray-900 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg lg:px-8 lg:py-6"
            >
              <p class="text-3xl font-extrabold leading-none tracking-tight lg:text-5xl">5/5</p>
              <p class="mt-1.5 text-xs font-bold lg:mt-2 lg:text-sm">
                <span class="text-[#4285F4]">G</span><span class="text-[#EA4335]">o</span><span class="text-[#FBBC05]">o</span><span class="text-[#4285F4]">g</span><span class="text-[#34A853]">l</span><span class="text-[#EA4335]">e</span>
              </p>
            </a>
          </div>

        </div>

        <!-- Coordonnées de contact — visibles uniquement sur mobile -->
        <address class="mt-8 block space-y-2 text-sm not-italic text-white/70 md:hidden">
          <p class="text-xs font-semibold uppercase tracking-widest text-white/40">Contact</p>
          <p>10 allée du Château Blanc, 59290 Wasquehal</p>
          <p><a href="tel:+33359617188" class="transition-colors hover:text-white">03 59 61 71 88</a></p>
          <p><a href="mailto:contact@faceel-it.com" class="transition-colors hover:text-white">contact@faceel-it.com</a></p>
        </address>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════
         SECTION 2 : Fond blanc — navigation + CTAs + copyright
         ═══════════════════════════════════════════════════════════════════════ -->
    <section class="w-full bg-white text-gray-800">
      <div class="mx-auto max-w-7xl px-4 py-12">

        <!-- Grille de navigation -->
        <div class="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">

          <!-- Nos services -->
          <nav aria-label="Nos services">
            <p class="text-xs font-semibold uppercase tracking-widest text-gray-500">Nos services</p>
            <ul class="mt-5 space-y-3 text-sm">
              <li>
                <RouterLink to="/#services" class="text-gray-700 transition-colors duration-200 hover:text-[#000066]">
                  La tech au service des métiers
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/#valeurs" class="text-gray-700 transition-colors duration-200 hover:text-[#000066]">
                  Nos valeurs ajoutées
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/#secteurs" class="text-gray-700 transition-colors duration-200 hover:text-[#000066]">
                  Nos secteurs d'activités
                </RouterLink>
              </li>
            </ul>
          </nav>

          <!-- L'agence -->
          <nav aria-label="L'agence">
            <p class="text-xs font-semibold uppercase tracking-widest text-gray-500">L'agence</p>
            <ul class="mt-5 space-y-3 text-sm">
              <li>
                <RouterLink to="/#rse" class="text-gray-700 transition-colors duration-200 hover:text-[#000066]">
                  Politique RSE
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/nous-rejoindre" class="text-gray-700 transition-colors duration-200 hover:text-[#000066]">
                  Nous rejoindre
                </RouterLink>
              </li>
            </ul>
          </nav>

          <!-- Informations légales -->
          <nav aria-label="Informations légales" class="col-span-2 md:col-span-1">
            <p class="text-xs font-semibold uppercase tracking-widest text-gray-500">Informations légales</p>
            <ul class="mt-5 space-y-3 text-sm">
              <li>
                <RouterLink to="/mentions-legales" class="text-gray-700 transition-colors duration-200 hover:text-[#000066]">
                  Mentions légales
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/politique-cookies" class="text-gray-700 transition-colors duration-200 hover:text-[#000066]">
                  Politique des cookies
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/politique-confidentialite" class="text-gray-700 transition-colors duration-200 hover:text-[#000066]">
                  Politique de confidentialité des données
                </RouterLink>
              </li>
              <li>
                <a
                  href="#"
                  class="cursor-pointer text-gray-700 transition-colors duration-200 hover:text-[#000066]"
                  @click.prevent="isCookieModalOpen = true"
                >
                  Gestion des cookies
                </a>
              </li>
              <li>
                <RouterLink to="/accessibilite" class="text-gray-700 transition-colors duration-200 hover:text-[#000066]">
                  Déclaration d'accessibilité
                </RouterLink>
              </li>
            </ul>
          </nav>

          <!-- Contact — masqué sur mobile (affiché dans la section bleue) -->
          <div class="hidden md:block">
            <p class="text-xs font-semibold uppercase tracking-widest text-gray-500">Contact</p>
            <address class="mt-5 space-y-3 text-sm not-italic text-gray-700">
              <p>10 allée du Château Blanc<br />59290 Wasquehal</p>
              <p>
                <a href="tel:+33359617188" class="transition-colors duration-200 hover:text-[#000066]">
                  03 59 61 71 88
                </a>
              </p>
              <p>
                <a href="mailto:contact@faceel-it.com" class="transition-colors duration-200 hover:text-[#000066]">
                  contact@faceel-it.com
                </a>
              </p>
            </address>
          </div>

        </div>

        <!-- CTAs de conversion -->
        <div class="mt-12 border-t border-gray-200 pt-10">
          <div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <RouterLink
              to="/contact"
              class="inline-flex w-full items-center justify-center rounded-lg border-2 border-[#000066] px-6 py-3 text-sm font-semibold text-[#000066] transition-colors duration-200 hover:bg-[#000066] hover:text-white sm:w-auto"
            >
              Nous contacter
            </RouterLink>
            <RouterLink
              to="/nous-rejoindre"
              class="inline-flex w-full items-center justify-center rounded-lg bg-green-500 px-6 py-3 text-sm font-semibold text-gray-900 transition-colors duration-200 hover:bg-green-400 sm:w-auto"
            >
              Nous rejoindre
            </RouterLink>
          </div>

          <p class="mt-8 text-center text-sm text-gray-400">
            Faceel-IT — ESN, Wasquehal, Hauts-de-France.
          </p>
        </div>

      </div>
    </section>

  </footer>

  <CookieManagerModal :is-open="isCookieModalOpen" @close="isCookieModalOpen = false" />
</template>
