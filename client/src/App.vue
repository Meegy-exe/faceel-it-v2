<script setup lang="ts">
import { computed, h, onMounted, ref, useTemplateRef, watch, type FunctionalComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import MegaMenu from '@/components/ui/MegaMenu.vue'
import CookieBanner from '@/components/ui/CookieBanner.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import { getMainNavEntries } from '@/features/navigation/mainNav'
import { footerColumns, footerDescription } from '@/features/navigation/footerNav'
import { useProfileStore } from '@/stores/useProfileStore'
import imgCandidat from '@/assets/images/photos/f-it-01.jpg'
import imgEntreprise from '@/assets/images/padel-equipe.jpg'

/**
 * Coquille de l'application : en-tête, contenu, pied de page.
 *
 * L'en-tête et le pied de page sont montés ICI, une seule fois, et non dans
 * chaque vue. Deux conséquences à connaître :
 *   — les vues ne doivent PAS déclarer de `<main>`, il est fourni ci-dessous ;
 *     deux `<main>` imbriqués sont invalides et désorientent les lecteurs
 *     d'écran, qui s'appuient dessus pour atteindre le contenu ;
 *   — le lien d'évitement est le premier élément focusable du document, donc
 *     lui aussi ici, avant l'en-tête.
 *
 * `min-h-dvh` + `flex-col` + `flex-1` sur le contenu : le pied de page reste
 * collé en bas même sur une page courte (une 404, typiquement), sans recourir
 * à un `position: fixed` qui le superposerait au contenu long.
 *
 * Le scroll snap de l'accueil est géré par `HomeView.vue` lui-même via un
 * conteneur interne `h-dvh overflow-y-auto snap-y snap-mandatory`. App.vue
 * n'a plus de logique conditionnelle : `<main>` est toujours `flex-1` et le
 * document défile naturellement via le navigateur.
 */
const route = useRoute()

/**
 * NAVBAR EN SUPERPOSITION (V0.3) — deux états possédés ici.
 *
 * `scrollRoot` : le conteneur de défilement réel (ce n'est PAS le document,
 * cf. ADR 26). `MegaMenu` en a besoin comme `root` de son
 * `IntersectionObserver` — sans lui, l'observateur ne se déclencherait jamais,
 * les sections ne quittant jamais la fenêtre.
 *
 * `isDarkTheme` : remonté depuis `MegaMenu` par `v-model:dark`, `App.vue` ne
 * le relit nulle part lui-même — seule la liaison `v-model` l'exige ici. Le
 * choix de `surface` des CTA (slot `#actions`) est calculé par `MegaMenu`
 * lui-même et transmis en paramètre de slot, PAS lu depuis cette variable :
 * le même bouton est rendu à deux endroits (barre, panneau mobile) qui n'ont
 * jamais le même fond, seul `MegaMenu` sait lequel s'applique où.
 */
const scrollRootEl = useTemplateRef<HTMLElement>('scrollRoot')
const isDarkTheme = ref(true)

/**
 * État d'ouverture du menu, POSSÉDÉ ICI mais plus rendu ici (V0.4).
 *
 * Le tiroir latéral « push » qui vivait dans cette coquille a été remplacé par
 * un bandeau horizontal en superposition, rendu par `MegaMenu.vue` : le menu
 * n'a plus AUCUN effet sur le layout (il ne pousse plus `<main>`, il le
 * recouvre), donc plus aucune raison d'être possédé par la coquille. Tout ce
 * qui restait ici — accordéons dépliés, icônes par entrée, bouton de
 * fermeture — a suivi le balisage.
 *
 * Seul l'état d'ouverture reste ici, parce que `App.vue` doit le remettre à
 * zéro au changement de route (cf. `watch` plus bas).
 */
const menuOpen = ref(false)

/**
 * Sélecteur de profil (onboarding) — s'affiche directement au montage si
 * aucun profil n'est stocké. État possédé par `useProfileStore` (store
 * global Pinia) : `HomeView.vue` et la navigation (cf. `navEntries`
 * ci-dessous) doivent pouvoir y réagir sans dépendre de `App.vue`.
 */
const profileStore = useProfileStore()

onMounted(() => {
  profileStore.hydrate()
})

/** Navigation du mega-menu, adaptée au profil actif (cf. `mainNav.ts` :
 *  profil « entreprise » → retire "Je suis candidat"/"Consulter nos offres"
 *  et reformule l'entrée "Je suis une entreprise" en indicateur de profil). */
const navEntries = computed(() => getMainNavEntries(profileStore.profile))

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
    window.scrollTo({ top: 0, behavior: 'instant' })
  },
)

/**
 * Réglages de tête valables pour tout le site. Les vues les affinent avec
 * `useSeo()` ; `@unhead/vue` fusionne, la déclaration la plus profonde gagne.
 */
useHead({
  htmlAttrs: { lang: 'fr' },
  titleTemplate: (title?: string) => title ?? 'Faceel-IT',
})

/** Coordonnées officielles (V0.1.13, ticket #15, cf. ADR 17) — fournies par
 * le client, reprises ici telles que transmises, pas des valeurs de
 * remplissage. */
const PHONE_DISPLAY = '03 59 61 71 88'
const PHONE_HREF = 'tel:+33359617188'
const EMAIL = 'contact@faceel-it.com'
const ADDRESS_LINE_1 = '10 allée du Château Blanc'
const ADDRESS_LINE_2 = '59290 Wasquehal'

/**
 * URLs des réseaux sociaux (V0.1.13, ticket #15) — fournies par le client.
 * Affichées dans le Footer (`#social`), plus dans le Header depuis V0.1.12
 * (ticket #14) : un pied de page est l'emplacement conventionnel pour ces
 * liens une fois qu'ils ne concurrencent plus les CTA de conversion.
 */
const LINKEDIN_HREF = 'https://www.linkedin.com/company/faceel-it/'
const YOUTUBE_HREF = 'https://www.youtube.com/@Faceel-it/featured'
const INSTAGRAM_HREF = 'https://www.instagram.com/faceelit/'
const GLASSDOOR_HREF =
  'https://www.glassdoor.fr/Avis/Faceel-it-Lille-Avis-EI_IE4844076.0,9_IL.10,15_IM1111.htm'

/**
 * Cible commune des deux CTA de conversion (header, menu mobile, footer).
 *
 * MESURE TEMPORAIRE (V0.1.13, ticket #14→#15, cf. ADR 17) : pointait vers
 * `{ path: '/', hash: '#contact' }` depuis V0.1.12, une section supprimée de
 * `HomeView.vue` en V0.1.13 (doublon avec ces mêmes CTA globaux). Un lien vers
 * une ancre qui n'existe plus ne provoquerait pas d'erreur visible (la page
 * resterait simplement sur place), mais romprait silencieusement la promesse
 * du bouton — pire qu'un lien mort visible. En l'absence de toute page dédiée
 * « contact » ou « recrutement » (site limité à `/`), le mailto direct est la
 * seule destination réelle qui reste : à remplacer par une vraie route dès
 * qu'une page contact existera.
 */
/** Remplace l'ancien mailto provisoire — page /contact désormais disponible. */
const CONTACT_TO = '/contact-entreprise'
const REJOINDRE_TO = '/consulter-nos-offres'

/** Routes dont la vue gère elle-même son conteneur snap local (HomeView.vue
 *  et consorts) et y intègre son propre `<TheFooter>` — le footer global
 *  rendu ci-dessous doit s'effacer sur ces routes pour éviter le doublon. */
const LOCAL_SNAP_FOOTER_ROUTES = new Set([
  '/',
  '/consulter-nos-offres',
  '/login',
  '/chat',
  // maj route entreprise
  '/client-chez-faceel-it',
  // maj route consultant
  '/consultant-chez-faceel-it',
  '/qui-sommes-nous/notre-histoire',
  '/qui-sommes-nous/notre-collectif',
  '/sport-sponsoring',
  '/contact-entreprise',
  '/partenaires',
  '/politique-rse',
  '/references/boulanger',
  '/references/adeo',
  '/nos-bus/data-ia',
  '/nos-bus/digital',
  '/nos-bus/product',
])

/** Même logique que `LOCAL_SNAP_FOOTER_ROUTES`, mais par nom de route : pour
 *  `offre-postuler` (`/offres/:id/postuler`), un chemin dynamique ne peut pas
 *  figurer dans un `Set` de chemins exacts. */
const LOCAL_SNAP_FOOTER_ROUTE_NAMES = new Set(['offre-postuler', 'candidature-spontanee'])

/** Flèche du CTA « Nous rejoindre », en composant fonctionnel local plutôt
 * qu'un `<svg>` recopié à chaque emplacement (Header desktop, menu mobile,
 * Footer). */
const ArrowRightIcon: FunctionalComponent = () =>
  h('svg', { viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true', class: 'size-full' }, [
    h('path', {
      d: 'M4 12h16m-6-6 6 6-6 6',
      stroke: 'currentColor',
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    }),
  ])
</script>

<template>
  <div ref="scrollRoot" class="flex min-h-dvh flex-col bg-light">
    <!-- Premier élément focusable du document : permet d'enjamber la
         vingtaine de liens de l'en-tête. Invisible tant qu'il n'a pas le
         focus, d'où le couple `sr-only` / `focus:not-sr-only`. -->
    <a
      href="#contenu"
      class="sr-only rounded-full bg-primary-900 px-5 py-3 font-semibold text-white focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:outline-3 focus:outline-offset-2 focus:outline-accent-500"
    >
      Aller au contenu
    </a>

    <Transition
      leave-active-class="transition-all duration-[1000ms] ease-in-out"
      leave-to-class="opacity-0 blur-md scale-105"
    >
      <div v-if="profileStore.showSelector" class="fixed inset-0 z-[100] flex flex-col bg-white">
        <div class="flex h-full w-full flex-1 flex-row overflow-hidden">
          <button
            type="button"
            :class="[
              profileStore.animatingSelection === 'candidat'
                ? 'w-full z-50 text-5xl'
                : profileStore.animatingSelection === 'entreprise'
                  ? 'w-0 opacity-0'
                  : 'w-1/2 hover:scale-[1.02] z-10',
              'relative overflow-hidden transition-all duration-700 ease-in-out origin-left flex items-center justify-center cursor-pointer bg-primary-950 text-white',
            ]"
            @click="profileStore.setProfile('candidat')"
          >
            <div
              class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.12] grayscale pointer-events-none"
              :style="{ backgroundImage: `url(${imgCandidat})` }"
            />
            <div class="relative z-10 flex flex-col items-center justify-center">
              <span class="block mb-1 text-sm font-medium text-white">Je suis</span>
              <span class="whitespace-nowrap text-2xl font-bold lg:text-4xl">Un candidat</span>
            </div>
          </button>
          <button
            type="button"
            :class="[
              profileStore.animatingSelection === 'entreprise'
                ? 'w-full z-50 text-5xl'
                : profileStore.animatingSelection === 'candidat'
                  ? 'w-0 opacity-0'
                  : 'w-1/2 hover:scale-[1.02] z-10',
              'relative overflow-hidden transition-all duration-700 ease-in-out origin-right flex items-center justify-center cursor-pointer cursor-faceel-blue bg-white text-primary-950',
            ]"
            @click="profileStore.setProfile('entreprise')"
          >
            <div
              class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 grayscale contrast-125 pointer-events-none"
              :style="{ backgroundImage: `url(${imgEntreprise})` }"
            />
            <div class="absolute inset-0 bg-white/85 pointer-events-none" />
            <div class="relative z-10 flex flex-col items-center justify-center">
              <span class="block mb-1 text-sm font-medium text-primary-950">Je suis</span>
              <span class="whitespace-nowrap text-2xl font-bold lg:text-4xl">Une entreprise</span>
            </div>
          </button>
        </div>
      </div>
    </Transition>

    <MegaMenu
      v-model:open="menuOpen"
      v-model:dark="isDarkTheme"
      :entries="navEntries"
      :scroll-root="scrollRootEl"
    >
      <!-- Deux CTA de conversion, côte à côte (V0.1.12, ticket #14) : un
           « outline » sobre pour l'action secondaire, un « accent » plein
           pour l'action prioritaire, flèche à l'appui pour renforcer son sens
           directionnel. Les icônes réseaux sociaux ont été réintroduites
           juste avant l'icône compte (cf. bloc ci-dessous).

           `surface` REÇU DU SLOT, PAS CALCULÉ ICI : ce même template est
           rendu par `MegaMenu.vue` à DEUX endroits qui n'ont jamais le même
           fond (barre, et panneau mobile — toujours blanc). Une seule
           `surface` calculée ici pour les deux aurait rendu l'un des deux
           illisible ; c'est exactement le bug que ce scoped slot corrige :
           `MegaMenu` connaît le fond réel de chaque rendu, `App.vue` non. -->
      <!-- Équivalent mobile de la bulle flottante (masquée sous `md:`, cf.
           plus bas) : même lien `/chat`, mêmes couleurs, en miniature pour
           tenir dans la barre sans en déformer la hauteur. -->
      <template #mobileChat>
        <router-link
          v-if="route.path !== '/chat'"
          to="/chat"
          aria-label="Ouvrir le ChatBot"
          class="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#12D80A]"
        >
          <span class="text-xs font-bold leading-none tracking-tight text-white">it</span>
        </router-link>
      </template>

      <template #chatButton="{ surface }">
        <!-- Réseaux sociaux — visibles en permanence (jusqu'à 500px de large,
             au même titre que les boutons d'action, cf. MegaMenu.vue) :
             `surface` peut valoir 'light' (section claire), où text-white/70
             et accent-500 échoueraient le contraste (cf. main.css,
             accent-500 sur blanc = 1,9:1). -->
        <div
          class="hidden min-[500px]:flex items-center gap-2 sm:gap-4 mr-1 sm:mr-4 pr-2 sm:pr-4 border-r"
          :class="surface === 'dark' ? 'border-white/20' : 'border-primary-900/15'"
        >
          <!-- LinkedIn -->
          <a
            :href="LINKEDIN_HREF"
            target="_blank"
            rel="noopener noreferrer"
            class="transition-colors"
            :class="
              surface === 'dark'
                ? 'text-white hover:text-accent-500'
                : 'text-primary-900 hover:text-accent-700'
            "
            aria-label="LinkedIn"
          >
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
          <!-- Instagram -->
          <a
            :href="INSTAGRAM_HREF"
            target="_blank"
            rel="noopener noreferrer"
            class="transition-colors"
            :class="
              surface === 'dark'
                ? 'text-white hover:text-accent-500'
                : 'text-primary-900 hover:text-accent-700'
            "
            aria-label="Instagram"
          >
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
          <!-- YouTube -->
          <a
            :href="YOUTUBE_HREF"
            target="_blank"
            rel="noopener noreferrer"
            class="transition-colors"
            :class="
              surface === 'dark'
                ? 'text-white hover:text-accent-500'
                : 'text-primary-900 hover:text-accent-700'
            "
            aria-label="YouTube"
          >
            <svg
              class="w-5 h-5 sm:w-6 sm:h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
        </div>
      </template>

      <!-- Pas de classe `hidden`/`min-[500px]` ici : ce même slot est rendu à
           deux endroits (barre + panneau mobile, cf. MegaMenu.vue), chacun
           avec sa propre règle de visibilité portée par SON wrapper — un seul
           jeu de classes ici s'appliquerait identiquement aux deux. -->
      <template #actions="{ surface }">
        <div class="flex items-center gap-1 sm:gap-3">
          <template v-if="profileStore.profile === 'candidat'">
            <BaseButton
              variant="outline"
              size="sm"
              :surface="surface"
              @click="profileStore.resetProfile"
            >
              Changer de profil
            </BaseButton>
            <BaseButton variant="accent" size="sm" :surface="surface" :to="REJOINDRE_TO">
              Nous rejoindre
              <template #iconRight><ArrowRightIcon /></template>
            </BaseButton>
          </template>

          <!-- ordre et couleurs btn navbar : changer de profil (blanc) puis action (vert) -->
          <template v-else-if="profileStore.profile === 'entreprise'">
            <BaseButton
              variant="outline"
              size="sm"
              :surface="surface"
              @click="profileStore.resetProfile"
            >
              Changer de profil
            </BaseButton>
            <BaseButton variant="accent" size="sm" :surface="surface" :to="CONTACT_TO">
              Un projet ?
            </BaseButton>
          </template>

          <template v-else>
            <BaseButton
              variant="outline"
              size="sm"
              :surface="surface"
              @click="profileStore.resetProfile"
            >
              Changer de profil
            </BaseButton>
            <BaseButton variant="outline" size="sm" :surface="surface" :to="CONTACT_TO">
              Un projet ?
            </BaseButton>
            <BaseButton variant="accent" size="sm" :surface="surface" :to="REJOINDRE_TO">
              Nous rejoindre
              <template #iconRight><ArrowRightIcon /></template>
            </BaseButton>
          </template>
        </div>
      </template>
    </MegaMenu>

    <!-- CRITICAL — LAISSER FLUIDE : aucune contrainte de hauteur ni overflow ici.
         Le scroll-snap est strictement géré localement dans les vues (ex: HomeView). -->
    <main id="contenu" class="flex-1">
      <RouterView />
    </main>

    <!-- Footer masqué sur les routes à snap local : TheFooter y est intégré
         dans le conteneur snap de la vue elle-même (HomeView.vue,
         OffersView.vue, LoginView.vue, ChatbotView.vue, EnterpriseView.vue)
         pour s'aimanter avec les sections. -->
    <TheFooter
      v-if="
        !LOCAL_SNAP_FOOTER_ROUTES.has(route.path) &&
        !LOCAL_SNAP_FOOTER_ROUTE_NAMES.has(String(route.name))
      "
      :full-page-scroll="false"
      :columns="footerColumns"
      :description="footerDescription"
    >
      <template #social>
        <a
          :href="LINKEDIN_HREF"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Faceel-IT sur LinkedIn"
          class="inline-flex size-9 items-center justify-center rounded-full text-white/60 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" class="size-5">
            <path
              d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.3-.02-3-1.83-3-1.83 0-2.1 1.43-2.1 2.9V21h-4V9Z"
            />
          </svg>
        </a>
        <a
          :href="YOUTUBE_HREF"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Faceel-IT sur YouTube"
          class="inline-flex size-9 items-center justify-center rounded-full text-white/60 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" class="size-5">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M3 5h18v14H3V5Zm7 4 6 3-6 3V9Z" />
          </svg>
        </a>
        <a
          :href="INSTAGRAM_HREF"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Faceel-IT sur Instagram"
          class="inline-flex size-9 items-center justify-center rounded-full text-white/60 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
        >
          <svg viewBox="0 0 24 24" fill="none" class="size-5">
            <rect
              x="3.5"
              y="3.5"
              width="17"
              height="17"
              rx="5"
              stroke="currentColor"
              stroke-width="1.8"
            />
            <circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.8" />
            <circle cx="17" cy="7" r="1" fill="currentColor" />
          </svg>
        </a>
        <a
          :href="GLASSDOOR_HREF"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Faceel-IT sur Glassdoor"
          class="inline-flex size-9 items-center justify-center rounded-full text-white/60 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" class="size-5">
            <path
              d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6L10 1.5Z"
            />
          </svg>
        </a>
      </template>

      <template #contact>
        <address class="space-y-3 text-base not-italic text-white/70">
          <p>{{ ADDRESS_LINE_1 }}<br />{{ ADDRESS_LINE_2 }}</p>
          <p>
            <a
              :href="PHONE_HREF"
              class="rounded-md transition-colors duration-200 hover:text-accent-500 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
            >
              {{ PHONE_DISPLAY }}
            </a>
          </p>
          <p>
            <a
              :href="`mailto:${EMAIL}`"
              class="rounded-md transition-colors duration-200 hover:text-accent-500 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
            >
              {{ EMAIL }}
            </a>
          </p>
        </address>
      </template>

      <template #ctas>
        <BaseButton
          variant="outline"
          size="lg"
          surface="dark"
          block
          class="sm:w-auto"
          :to="CONTACT_TO"
        >
          Un projet ?
        </BaseButton>
        <BaseButton
          variant="accent"
          size="lg"
          surface="dark"
          block
          class="sm:w-auto"
          :to="REJOINDRE_TO"
        >
          Nous rejoindre
          <template #iconRight><ArrowRightIcon /></template>
        </BaseButton>
      </template>
    </TheFooter>
    <CookieBanner />

    <!-- Bulle ChatBot flottante — remplace l'ancien bouton "ChatBot" de la
         navbar, reprend le rond vert/texte "it" du logo pour rester
         identifiable même retiré de la barre. `hidden md:flex` : sur mobile
         elle mangeait trop de place en bas d'écran, remplacée sous `md:` par
         l'icône équivalente dans la barre (slot `#mobileChat` de MegaMenu). -->
    <div
      v-if="route.path !== '/chat'"
      class="group hidden md:flex fixed bottom-2 right-2 [@media(max-height:568px)]:scale-75 lg:bottom-8 lg:right-8 z-50 items-center gap-3"
    >
      <span
        class="bg-white/95 backdrop-blur-sm text-gray-800 text-sm md:text-base font-medium py-2.5 px-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 cursor-default opacity-0 translate-x-2 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
        >Une question ?</span
      >
      <router-link
        to="/chat"
        aria-label="Ouvrir le ChatBot"
        class="flex size-14 items-center justify-center rounded-full bg-[#12D80A] shadow-2xl transition-all duration-300 hover:animate-wiggle hover:shadow-[0_10px_40px_-10px_rgba(18,216,10,0.6)] lg:size-16 motion-reduce:transition-none motion-reduce:hover:animate-none"
      >
        <span class="text-2xl font-bold leading-none tracking-tight text-white lg:text-3xl"
          >it</span
        >
      </router-link>
    </div>
  </div>
</template>

<style scoped>
@keyframes wiggle {
  0%,
  100% {
    transform: scale(1.1) rotate(-6deg);
  }
  50% {
    transform: scale(1.1) rotate(6deg);
  }
}
.hover\:animate-wiggle:hover {
  animation: wiggle 0.4s ease-in-out infinite;
}
</style>
