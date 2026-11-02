<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import CookieManagerModal from '@/components/ui/CookieManagerModal.vue'
import logoSrc from '@/assets/images/2.svg'
import glassdoorLogo from '@/assets/notations/glassdoor.svg'
import googleLogo from '@/assets/notations/google.svg'
import { scrollRevealClass, useScrollReveal } from '@/composables/useScrollReveal'
import { useProfileStore } from '@/stores/useProfileStore'

const isCookieModalOpen = ref(false)
// pilote l'affichage conditionnel des cta du footer
const profileStore = useProfileStore()

/**
 * `fullPageScroll` bascule entre deux rendus du MÊME contenu :
 *  - `true` (uniquement `HomeView.vue`) : deux sections `h-dvh snap-start`
 *    indépendantes, pour s'aimanter avec le reste du scroll-snap de l'accueil.
 *  - `false`/absent (toutes les autres pages, cf. `App.vue`) : rendu en flux
 *    normal, sans hauteur ni snap imposés — ces pages n'ont pas de conteneur
 *    de scroll-snap ambiant, `h-dvh` y casserait la mise en page.
 */
const props = defineProps<{
  fullPageScroll?: boolean
  columns?: unknown[]
  description?: string
}>()

/**
 * `fullPageScroll` ne donne PAS le même rendu à toutes les tailles d'écran :
 *  - mobile/tablette (< `lg`) : bleu et blanc restent deux écrans `h-dvh
 *    snap-start` indépendants (validé sur plusieurs itérations) ;
 *  - desktop (`lg:`) : le `<footer>` lui-même est verrouillé à `lg:h-dvh` et
 *    devient l'unique point d'ancrage snap (cf. `lg:snap-start` plus bas) ;
 *    `lg:snap-align-none` retire CHAQUE section de ce rôle individuellement,
 *    et `lg:flex-1` force bleu/blanc à se partager exactement 50/50 cette
 *    hauteur verrouillée (plus de `lg:h-auto` : la hauteur n'est plus dictée
 *    par le contenu).
 */
const blueSectionClass = computed(() =>
  props.fullPageScroll
    ? 'relative isolate h-dvh shrink-0 w-full snap-start snap-always lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:snap-align-none overflow-hidden flex flex-col justify-center [@media(max-height:568px)]:justify-end bg-[#000066] text-white'
    : 'relative isolate w-full flex-1 flex flex-col justify-center overflow-hidden bg-[#000066] text-white',
)

const whiteSectionClass = computed(() =>
  props.fullPageScroll
    ? 'h-dvh shrink-0 w-full snap-start snap-always lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:snap-align-none overflow-hidden flex flex-col justify-center bg-white text-gray-800'
    : 'w-full bg-white text-gray-800',
)

const blueEl = useTemplateRef<HTMLElement>('blueEl')
const blueReveal = useScrollReveal(blueEl)
const whiteEl = useTemplateRef<HTMLElement>('whiteEl')
const whiteReveal = useScrollReveal(whiteEl)
</script>

<template>
  <footer
    class="flex w-full shrink-0 flex-col"
    :class="fullPageScroll ? 'lg:flex lg:h-dvh lg:flex-col lg:snap-start lg:snap-always' : 'h-full'"
  >
    <!-- ═══════════════════════════════════════════════════════════════════════
         SECTION 1 : Fond bleu — marque, notes de satisfaction, coordonnées
         ═══════════════════════════════════════════════════════════════════════ -->
    <section data-theme="dark" :class="blueSectionClass">
      <div
        ref="blueEl"
        class="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 [@media(max-height:568px)]:pt-20 [@media(max-height:568px)]:pb-2 transition-all duration-700 ease-out motion-reduce:transition-none sm:px-6 lg:px-8 lg:py-12 xl:px-12"
        :class="scrollRevealClass(blueReveal, 'up', { durationClass: 'duration-1000' })"
      >
        <div
          class="flex flex-col items-center gap-6 text-center [@media(min-height:651px)_and_(max-height:760px)]:gap-4 [@media(min-height:569px)_and_(max-height:650px)]:gap-3 [@media(max-height:568px)]:gap-4 lg:flex-row lg:items-start lg:gap-16 lg:text-left"
        >
          <!-- Colonne gauche : identité -->
          <div class="flex-1">
            <img
              :src="logoSrc"
              alt="Faceel-IT"
              class="mx-auto h-12 w-auto object-contain lg:mx-0 lg:h-16"
            />

            <p
              class="mx-auto mt-5 [@media(max-height:568px)]:mt-2 max-w-lg text-sm leading-snug text-white/80 [@media(min-height:651px)_and_(max-height:760px)]:text-xs [@media(min-height:569px)_and_(max-height:650px)]:text-[11px] [@media(min-height:569px)_and_(max-height:650px)]:leading-tight [@media(max-height:568px)]:text-[11px] [@media(max-height:568px)]:leading-tight md:text-base lg:mx-0 lg:text-lg"
            >
              Cabinet de conseil expert en Data, Intelligence Artificielle et Transformation
              digitale. Au-delà du code, c'est l'engagement de notre collectif qui fait aboutir vos
              projets.
            </p>
          </div>

          <!-- Contact — mobile/tablette uniquement (`lg:hidden`) : repositionné
               ici (entre l'identité et les notes) pour suivre l'ordre de
               lecture demandé sur mobile ; invisible et donc sans effet sur
               la mise en page `lg:flex-row` du desktop. Mêmes coordonnées,
               pas de crochets : simple repli mobile du bloc encadré de la
               section blanche (cf. plus bas). -->
          <address
            class="space-y-2 [@media(min-height:651px)_and_(max-height:760px)]:space-y-1 [@media(min-height:569px)_and_(max-height:650px)]:space-y-0.5 [@media(max-height:568px)]:space-y-0.5 text-sm [@media(min-height:569px)_and_(max-height:760px)]:text-xs [@media(max-height:568px)]:text-[11px] [@media(max-height:568px)]:leading-tight not-italic text-white lg:hidden"
          >
            <p class="text-xs font-bold uppercase tracking-widest text-[#12D80A]">Contact</p>
            <p>10 allée du Château Blanc, 59290 Wasquehal</p>
            <p>
              <a href="tel:+33359617188" class="transition-colors hover:text-white"
                >03 59 61 71 88</a
              >
            </p>
            <p>
              <a href="mailto:contact@faceel-it.com" class="transition-colors hover:text-white"
                >contact@faceel-it.com</a
              >
            </p>
          </address>

          <!-- Colonne droite : notes Glassdoor + Google -->
          <!-- `lg:mt-21` : compense le logo (`lg:h-16` = 4rem) + l'écart avant
               le paragraphe (`mt-5` = 1.25rem) de la colonne de gauche, pour
               que le haut des « 5/5 » s'aligne avec la première ligne du
               texte, pas avec le logo au-dessus. -->
          <div
            class="flex w-full items-start origin-bottom scale-90 gap-4 [@media(min-height:651px)_and_(max-height:760px)]:scale-75 [@media(min-height:569px)_and_(max-height:650px)]:scale-[0.65] [@media(max-height:568px)]:scale-[0.55] lg:mt-21 lg:w-auto lg:scale-100 lg:shrink-0"
          >
            <a
              href="https://www.glassdoor.fr/Avis/Faceel-it-Lille-Avis-EI_IE4844076.0,9_IL.10,15_IM1111.htm"
              target="_blank"
              rel="noopener noreferrer"
              class="flex flex-1 flex-col items-center transition-transform duration-300 hover:scale-105 lg:px-8 lg:pb-6"
            >
              <p class="text-3xl font-extrabold leading-none tracking-tight lg:text-5xl">5/5</p>
              <img
                :src="glassdoorLogo"
                alt="Glassdoor"
                class="mt-1.5 w-36 h-auto object-contain brightness-0 invert lg:mt-2"
              />
            </a>

            <a
              href="https://www.google.com/search?sca_esv=40dae565ac35b613&hl=fr&gl=fr&output=search&kgmid=/g/11r3m97yrh&q=Faceel-it&shndl=30&shem=lcuae,lstl1,uaasie&source=sh/x/loc/uni/m1/1&kgs=88c0721b1fda94c2"
              target="_blank"
              rel="noopener noreferrer"
              class="flex flex-1 flex-col items-center transition-transform duration-300 hover:scale-105 lg:px-8 lg:pb-6"
            >
              <p class="text-3xl font-extrabold leading-none tracking-tight lg:text-5xl">5/5</p>
              <img
                :src="googleLogo"
                alt="Google"
                class="mt-1.5 w-36 h-auto object-contain brightness-0 invert lg:mt-2"
              />
            </a>
          </div>
        </div>

        <!-- Barre d'actions — mobile/tablette uniquement (`lg:hidden`) : copie
             de la barre de la section blanche (réseaux sociaux + CTA),
             couleurs inversées pour ce fond bleu. La barre d'origine est
             masquée sur cette plage de largeur (`hidden lg:flex`, cf. plus
             bas) pour éviter le doublon. -->
        <div
          class="mt-4 [@media(min-height:651px)_and_(max-height:760px)]:mt-2 [@media(max-height:650px)]:mt-1 flex w-full flex-col items-center gap-6 bg-transparent lg:hidden"
        >
          <div class="flex items-center gap-6">
            <a
              href="https://www.linkedin.com/company/faceel-it/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Faceel-IT sur LinkedIn"
              class="inline-flex size-12 sm:size-14 [@media(max-height:650px)]:size-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/10"
            >
              <svg
                viewBox="0 0 92 92"
                fill="none"
                class="w-10 h-10 sm:w-12 sm:h-12 [@media(max-height:650px)]:w-8 [@media(max-height:650px)]:h-8 text-white transition-colors hover:text-accent-500"
              >
                <rect
                  x="0.247223"
                  width="91.5618"
                  height="91.5618"
                  rx="45.7809"
                  fill="currentColor"
                />
                <path
                  class="text-[#000066]"
                  fill="currentColor"
                  d="M35.4959 64.3345V39.601H27.2821V64.3345H35.4967H35.4959ZM31.3907 36.2246C34.2544 36.2246 36.0373 34.3254 36.0373 31.9519C35.9837 29.5243 34.2544 27.678 31.4452 27.678C28.634 27.678 26.798 29.5243 26.798 31.9517C26.798 34.3252 28.5802 36.2244 31.3369 36.2244H31.3901L31.3907 36.2246ZM40.0423 64.3345H48.2554V50.5237C48.2554 49.7854 48.309 49.0452 48.526 48.518C49.1195 47.0404 50.4709 45.5109 52.7405 45.5109C55.7118 45.5109 56.9011 47.7789 56.9011 51.1042V64.3345H65.114V50.153C65.114 42.5563 61.0625 39.0211 55.6586 39.0211C51.2282 39.0211 49.2824 41.4996 48.2013 43.1876H48.256V39.6018H40.0427C40.1499 41.9221 40.0421 64.3353 40.0421 64.3353L40.0423 64.3345Z"
                />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@Faceel-it"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Faceel-IT sur YouTube"
              class="inline-flex size-12 sm:size-14 [@media(max-height:650px)]:size-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/10"
            >
              <svg
                viewBox="0 0 93 93"
                fill="none"
                class="w-10 h-10 sm:w-12 sm:h-12 [@media(max-height:650px)]:w-8 [@media(max-height:650px)]:h-8 text-white transition-colors hover:text-accent-500"
              >
                <rect
                  x="0.561798"
                  y="0.561829"
                  width="91.5618"
                  height="91.5618"
                  rx="45.7809"
                  fill="currentColor"
                />
                <path
                  class="text-[#000066]"
                  fill="currentColor"
                  d="M71.8089 33.749C71.2111 31.5016 69.4427 29.7286 67.1927 29.121C63.1244 28.0306 46.8014 28.0306 46.8014 28.0306C46.8014 28.0306 30.4868 28.0306 26.4102 29.121C24.1685 29.7203 22.4001 31.4933 21.794 33.749C20.7063 37.8277 20.7063 46.3429 20.7063 46.3429C20.7063 46.3429 20.7063 54.8582 21.794 58.9369C22.3918 61.1843 24.1602 62.9572 26.4102 63.5649C30.4868 64.6553 46.8014 64.6553 46.8014 64.6553C46.8014 64.6553 63.1244 64.6553 67.1927 63.5649C69.4344 62.9656 71.2028 61.1926 71.8089 58.9369C72.8966 54.8582 72.8966 46.3429 72.8966 46.3429C72.8966 46.3429 72.8966 37.8277 71.8089 33.749Z"
                />
                <path
                  fill="currentColor"
                  d="M41.5874 54.1923L55.1456 46.3429L41.5874 38.4936V54.1923Z"
                />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/faceelit/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Faceel-IT sur Instagram"
              class="inline-flex size-12 sm:size-14 [@media(max-height:650px)]:size-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/10"
            >
              <svg
                viewBox="0 0 319.73 319.73"
                class="w-10 h-10 sm:w-12 sm:h-12 [@media(max-height:650px)]:w-8 [@media(max-height:650px)]:h-8 text-white transition-colors hover:text-accent-500"
              >
                <circle cx="159.86" cy="159.86" r="159.86" fill="currentColor" />
                <path
                  class="text-[#000066]"
                  fill="currentColor"
                  d="M159.87,64.38c-39.12,0-76.26-3.48-90.45,32.93-5.86,15.04-5.01,34.57-5.01,62.54,0,24.54-.79,47.61,5.01,62.53,14.16,36.44,51.6,32.94,90.43,32.94s76.08,3.9,90.44-32.94c5.87-15.19,5.01-34.43,5.01-62.53,0-37.3,2.06-61.38-16.03-79.45-18.31-18.31-43.08-16.02-79.44-16.02h.04ZM151.31,81.58c81.6-.13,91.98-9.2,86.25,116.82-2.04,44.57-35.97,39.68-77.69,39.68-76.06,0-78.25-2.18-78.25-78.27s6.03-78.18,69.68-78.25v.02ZM210.82,97.43c-6.32,0-11.45,5.13-11.45,11.45s5.13,11.45,11.45,11.45,11.45-5.13,11.45-11.45-5.13-11.45-11.45-11.45ZM159.87,110.82c-27.07,0-49.02,21.96-49.02,49.03s21.95,49.02,49.02,49.02,49.01-21.95,49.01-49.02-21.93-49.03-49.01-49.03h0ZM159.87,128.03c42.07,0,42.12,63.65,0,63.65s-42.12-63.65,0-63.65Z"
                />
              </svg>
            </a>
            <a
              href="https://www.glassdoor.fr/Avis/Faceel-IT-Avis-E8791143.htm"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Faceel-IT sur Glassdoor"
              class="inline-flex size-12 sm:size-14 [@media(max-height:650px)]:size-10 items-center justify-center rounded-full text-white transition-colors duration-200 hover:bg-white/10 hover:text-accent-500"
            >
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                class="w-10 h-10 sm:w-12 sm:h-12 [@media(max-height:650px)]:w-8 [@media(max-height:650px)]:h-8"
              >
                <path
                  d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6L10 1.5Z"
                />
              </svg>
            </a>
          </div>

          <div
            class="flex w-full flex-col items-center gap-4 [@media(max-height:760px)]:gap-2 sm:w-auto sm:flex-row"
          >
            <RouterLink
              v-if="profileStore.profile !== 'candidat'"
              to="/contact-entreprise"
              class="inline-flex w-full items-center justify-center rounded-lg border-2 border-white px-5 py-2.5 [@media(min-height:651px)_and_(max-height:760px)]:py-1.5 [@media(min-height:569px)_and_(max-height:650px)]:py-1 [@media(max-height:568px)]:py-1.5 text-sm [@media(min-height:651px)_and_(max-height:760px)]:text-xs [@media(min-height:569px)_and_(max-height:650px)]:text-[11px] [@media(max-height:568px)]:text-[10px] font-semibold text-white transition-colors duration-200 hover:bg-white hover:text-[#000066] sm:w-auto"
            >
              Un projet ?
            </RouterLink>
            <RouterLink
              v-if="profileStore.profile !== 'entreprise'"
              to="/consulter-nos-offres"
              class="inline-flex w-full items-center justify-center rounded-lg bg-green-500 px-5 py-2.5 [@media(min-height:651px)_and_(max-height:760px)]:py-1.5 [@media(min-height:569px)_and_(max-height:650px)]:py-1 [@media(max-height:568px)]:py-1.5 text-sm [@media(min-height:651px)_and_(max-height:760px)]:text-xs [@media(min-height:569px)_and_(max-height:650px)]:text-[11px] [@media(max-height:568px)]:text-[10px] font-semibold text-gray-900 transition-colors duration-200 hover:bg-green-400 sm:w-auto"
            >
              Nous rejoindre
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════
         SECTION 2 : Fond blanc — navigation + CTAs + réseaux sociaux + copyright
         ═══════════════════════════════════════════════════════════════════════ -->
    <section data-theme="light" :class="whiteSectionClass">
      <div
        ref="whiteEl"
        class="mx-auto w-full max-w-7xl px-4 py-12 [@media(max-width:1023px)_and_(max-height:610px)]:pt-20 [@media(max-width:1023px)_and_(max-height:610px)]:pb-2 transition-all duration-700 ease-out motion-reduce:transition-none"
        :class="scrollRevealClass(whiteReveal, 'up', { durationClass: 'duration-1000' })"
      >
        <!-- Grille de navigation — bascule en flex à partir de `lg:` pour
             accueillir le bloc contact (col-cadre à crochets) et son
             séparateur vertical en bout de ligne, cf. plus bas. -->
        <div
          class="grid grid-cols-2 gap-x-4 gap-y-8 [@media(max-width:1023px)_and_(max-height:610px)]:gap-y-4 md:grid-cols-3 lg:flex lg:items-start lg:gap-x-10"
        >
          <!-- Nos BUs -->
          <nav aria-label="Nos BUs" class="lg:flex-1">
            <p class="text-xs font-semibold uppercase tracking-widest text-gray-500">NOS BUs</p>
            <ul class="mt-5 space-y-3 text-sm">
              <li>
                <RouterLink
                  to="/#business-units"
                  class="text-gray-700 transition-colors duration-200 hover:text-[#000066]"
                >
                  Digital
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/#business-units"
                  class="text-gray-700 transition-colors duration-200 hover:text-[#000066]"
                >
                  Product
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/#business-units"
                  class="text-gray-700 transition-colors duration-200 hover:text-[#000066]"
                >
                  Data & IA
                </RouterLink>
              </li>
            </ul>
          </nav>

          <!-- Notre agence -->
          <nav aria-label="Notre agence" class="lg:flex-1">
            <p class="text-xs font-semibold uppercase tracking-widest text-gray-500">
              NOTRE AGENCE
            </p>
            <ul class="mt-5 space-y-3 text-sm">
              <li>
                <RouterLink
                  :to="{ name: 'histoire' }"
                  class="text-gray-700 transition-colors duration-200 hover:text-[#000066]"
                >
                  Notre histoire
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  :to="{ name: 'collectif' }"
                  class="text-gray-700 transition-colors duration-200 hover:text-[#000066]"
                >
                  Notre collectif
                </RouterLink>
              </li>
            </ul>
          </nav>

          <!-- Informations légales -->
          <nav aria-label="Informations légales" class="col-span-2 md:col-span-1 lg:flex-1">
            <p class="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Informations légales
            </p>
            <ul class="mt-5 space-y-3 text-sm">
              <li>
                <RouterLink
                  to="/mentions-legales"
                  class="text-gray-700 transition-colors duration-200 hover:text-[#000066]"
                >
                  Mentions légales
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/politique-cookies"
                  class="text-gray-700 transition-colors duration-200 hover:text-[#000066]"
                >
                  Politique des cookies
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/politique-confidentialite"
                  class="text-gray-700 transition-colors duration-200 hover:text-[#000066]"
                >
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
                <RouterLink
                  to="/accessibilite"
                  class="text-gray-700 transition-colors duration-200 hover:text-[#000066]"
                >
                  Déclaration d'accessibilité
                </RouterLink>
              </li>
            </ul>
          </nav>

          <!-- Séparateur vertical + bloc contact. -->
          <div class="hidden lg:block lg:w-px lg:self-stretch lg:bg-gray-200" aria-hidden="true" />

          <div class="hidden lg:col-span-auto lg:block lg:w-64 lg:shrink-0 lg:p-0 lg:pl-2">
            <address class="px-2 py-1 not-italic">
              <p class="text-xs font-semibold uppercase tracking-widest text-[#000066]">Contact</p>
              <div class="mt-5 space-y-3 text-sm text-gray-700">
                <p>10 allée du Château Blanc<br />59290 Wasquehal</p>
                <p>
                  <a
                    href="tel:+33359617188"
                    class="transition-colors duration-200 hover:text-[#000066]"
                  >
                    03 59 61 71 88
                  </a>
                </p>
                <p>
                  <a
                    href="mailto:contact@faceel-it.com"
                    class="transition-colors duration-200 hover:text-[#000066]"
                  >
                    contact@faceel-it.com
                  </a>
                </p>
              </div>
            </address>
          </div>
        </div>

        <!-- CTAs de conversion -->
        <div
          class="mt-12 [@media(max-width:1023px)_and_(max-height:610px)]:mt-4 border-t border-gray-200 pt-10 [@media(max-width:1023px)_and_(max-height:610px)]:pt-4"
        >
          <div
            class="hidden flex-col items-center gap-6 sm:w-full sm:flex-row sm:justify-between lg:flex"
          >
            <!-- Réseaux sociaux — mêmes SVG inline que la section bleue, couleurs
                 inversées : ce fond est blanc (pas #000066), donc le rond
                 externe passe en primary-900 (+ hover accent-700, pas
                 accent-500 : 1,9:1 sur blanc, cf. main.css) et la couche
                 "transparente" interne passe de primary-900 à blanc pour se
                 fondre dans CE fond-ci. -->
            <div class="flex items-center gap-6">
              <a
                href="https://www.linkedin.com/company/faceel-it/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Faceel-IT sur LinkedIn"
                class="inline-flex size-12 sm:size-14 items-center justify-center rounded-full transition-colors duration-200 hover:bg-primary-900/10"
              >
                <svg
                  viewBox="0 0 92 92"
                  fill="none"
                  class="w-10 h-10 sm:w-12 sm:h-12 text-primary-900 transition-colors hover:text-accent-700"
                >
                  <rect
                    x="0.247223"
                    width="91.5618"
                    height="91.5618"
                    rx="45.7809"
                    fill="currentColor"
                  />
                  <path
                    class="text-white"
                    fill="currentColor"
                    d="M35.4959 64.3345V39.601H27.2821V64.3345H35.4967H35.4959ZM31.3907 36.2246C34.2544 36.2246 36.0373 34.3254 36.0373 31.9519C35.9837 29.5243 34.2544 27.678 31.4452 27.678C28.634 27.678 26.798 29.5243 26.798 31.9517C26.798 34.3252 28.5802 36.2244 31.3369 36.2244H31.3901L31.3907 36.2246ZM40.0423 64.3345H48.2554V50.5237C48.2554 49.7854 48.309 49.0452 48.526 48.518C49.1195 47.0404 50.4709 45.5109 52.7405 45.5109C55.7118 45.5109 56.9011 47.7789 56.9011 51.1042V64.3345H65.114V50.153C65.114 42.5563 61.0625 39.0211 55.6586 39.0211C51.2282 39.0211 49.2824 41.4996 48.2013 43.1876H48.256V39.6018H40.0427C40.1499 41.9221 40.0421 64.3353 40.0421 64.3353L40.0423 64.3345Z"
                  />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@Faceel-it"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Faceel-IT sur YouTube"
                class="inline-flex size-12 sm:size-14 items-center justify-center rounded-full transition-colors duration-200 hover:bg-primary-900/10"
              >
                <svg
                  viewBox="0 0 93 93"
                  fill="none"
                  class="w-10 h-10 sm:w-12 sm:h-12 text-primary-900 transition-colors hover:text-accent-700"
                >
                  <rect
                    x="0.561798"
                    y="0.561829"
                    width="91.5618"
                    height="91.5618"
                    rx="45.7809"
                    fill="currentColor"
                  />
                  <path
                    class="text-white"
                    fill="currentColor"
                    d="M71.8089 33.749C71.2111 31.5016 69.4427 29.7286 67.1927 29.121C63.1244 28.0306 46.8014 28.0306 46.8014 28.0306C46.8014 28.0306 30.4868 28.0306 26.4102 29.121C24.1685 29.7203 22.4001 31.4933 21.794 33.749C20.7063 37.8277 20.7063 46.3429 20.7063 46.3429C20.7063 46.3429 20.7063 54.8582 21.794 58.9369C22.3918 61.1843 24.1602 62.9572 26.4102 63.5649C30.4868 64.6553 46.8014 64.6553 46.8014 64.6553C46.8014 64.6553 63.1244 64.6553 67.1927 63.5649C69.4344 62.9656 71.2028 61.1926 71.8089 58.9369C72.8966 54.8582 72.8966 46.3429 72.8966 46.3429C72.8966 46.3429 72.8966 37.8277 71.8089 33.749Z"
                  />
                  <path
                    fill="currentColor"
                    d="M41.5874 54.1923L55.1456 46.3429L41.5874 38.4936V54.1923Z"
                  />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/faceelit/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Faceel-IT sur Instagram"
                class="inline-flex size-12 sm:size-14 items-center justify-center rounded-full transition-colors duration-200 hover:bg-primary-900/10"
              >
                <svg
                  viewBox="0 0 319.73 319.73"
                  class="w-10 h-10 sm:w-12 sm:h-12 text-primary-900 transition-colors hover:text-accent-700"
                >
                  <circle cx="159.86" cy="159.86" r="159.86" fill="currentColor" />
                  <path
                    class="text-white"
                    fill="currentColor"
                    d="M159.87,64.38c-39.12,0-76.26-3.48-90.45,32.93-5.86,15.04-5.01,34.57-5.01,62.54,0,24.54-.79,47.61,5.01,62.53,14.16,36.44,51.6,32.94,90.43,32.94s76.08,3.9,90.44-32.94c5.87-15.19,5.01-34.43,5.01-62.53,0-37.3,2.06-61.38-16.03-79.45-18.31-18.31-43.08-16.02-79.44-16.02h.04ZM151.31,81.58c81.6-.13,91.98-9.2,86.25,116.82-2.04,44.57-35.97,39.68-77.69,39.68-76.06,0-78.25-2.18-78.25-78.27s6.03-78.18,69.68-78.25v.02ZM210.82,97.43c-6.32,0-11.45,5.13-11.45,11.45s5.13,11.45,11.45,11.45,11.45-5.13,11.45-11.45-5.13-11.45-11.45-11.45ZM159.87,110.82c-27.07,0-49.02,21.96-49.02,49.03s21.95,49.02,49.02,49.02,49.01-21.95,49.01-49.02-21.93-49.03-49.01-49.03h0ZM159.87,128.03c42.07,0,42.12,63.65,0,63.65s-42.12-63.65,0-63.65Z"
                  />
                </svg>
              </a>
              <a
                href="https://www.glassdoor.fr/Avis/Faceel-IT-Avis-E8791143.htm"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Faceel-IT sur Glassdoor"
                class="inline-flex size-12 sm:size-14 items-center justify-center rounded-full text-primary-900 transition-colors duration-200 hover:bg-primary-900/10 hover:text-accent-700"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" class="w-10 h-10 sm:w-12 sm:h-12">
                  <path
                    d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6L10 1.5Z"
                  />
                </svg>
              </a>
            </div>

            <div class="flex flex-col items-center gap-4 w-full sm:w-auto sm:flex-row">
              <RouterLink
                v-if="profileStore.profile !== 'candidat'"
                to="/contact-entreprise"
                class="inline-flex w-full items-center justify-center rounded-lg border-2 border-[#000066] px-6 py-3 text-sm font-semibold text-[#000066] transition-colors duration-200 hover:bg-[#000066] hover:text-white sm:w-auto"
              >
                Un projet ?
              </RouterLink>
              <RouterLink
                v-if="profileStore.profile !== 'entreprise'"
                to="/consulter-nos-offres"
                class="inline-flex w-full items-center justify-center rounded-lg bg-green-500 px-6 py-3 text-sm font-semibold text-gray-900 transition-colors duration-200 hover:bg-green-400 sm:w-auto"
              >
                Nous rejoindre
              </RouterLink>
            </div>
          </div>

          <p
            class="mt-8 [@media(max-width:1023px)_and_(max-height:610px)]:mt-4 text-center text-sm text-gray-400"
          >
            Faceel-IT — ESN, Wasquehal, Hauts-de-France.
          </p>
        </div>
      </div>
    </section>
  </footer>

  <CookieManagerModal :is-open="isCookieModalOpen" @close="isCookieModalOpen = false" />
</template>
