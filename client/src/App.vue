<script setup lang="ts">
import { h, ref, useTemplateRef, watch, type FunctionalComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import MegaMenu from '@/components/ui/MegaMenu.vue'
import CookieBanner from '@/components/ui/CookieBanner.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import { mainNavEntries } from '@/features/navigation/mainNav'
import { footerColumns, footerDescription } from '@/features/navigation/footerNav'

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
const CONTACT_TO = '/contact'
const REJOINDRE_TO = '/consulter-nos-offres'

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

    <MegaMenu
      v-model:open="menuOpen"
      v-model:dark="isDarkTheme"
      :entries="mainNavEntries"
      :scroll-root="scrollRootEl"
    >
      <!-- Deux CTA de conversion, côte à côte, seule zone d'action du Header
           (V0.1.12, ticket #14) : plus de pilule « Discutons IA » ni d'icônes
           de réseau social/contact ici — un « outline » sobre pour l'action
           secondaire, un « accent » plein pour l'action prioritaire, flèche à
           l'appui pour renforcer son sens directionnel.

           `surface` REÇU DU SLOT, PAS CALCULÉ ICI : ce même template est
           rendu par `MegaMenu.vue` à DEUX endroits qui n'ont jamais le même
           fond (barre, et panneau mobile — toujours blanc). Une seule
           `surface` calculée ici pour les deux aurait rendu l'un des deux
           illisible ; c'est exactement le bug que ce scoped slot corrige :
           `MegaMenu` connaît le fond réel de chaque rendu, `App.vue` non. -->
      <template #chatButton="{ surface }">
        <router-link
          to="/login"
          class="inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-3 focus-visible:outline-offset-2 motion-reduce:transition-none"
          :class="
            surface === 'dark'
              ? 'text-white hover:bg-white/10 focus-visible:outline-accent-500'
              : 'text-primary-900 hover:bg-primary-900/5 focus-visible:outline-primary-900'
          "
          aria-label="Mon espace"
          @click="menuOpen = false"
        >
          <svg viewBox="0 0 24 24" fill="none" class="size-5" aria-hidden="true">
            <circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="1.75" />
            <path
              d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
            />
          </svg>
        </router-link>
        <router-link
          to="/chat"
          class="inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-3 focus-visible:outline-offset-2 motion-reduce:transition-none"
          :class="
            surface === 'dark'
              ? 'text-white hover:bg-white/10 focus-visible:outline-accent-500'
              : 'text-primary-900 hover:bg-primary-900/5 focus-visible:outline-primary-900'
          "
          aria-label="Discuter avec Faceelbot"
          @click="menuOpen = false"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" class="size-5" aria-hidden="true">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        </router-link>
      </template>

      <template #actions="{ surface }">
        <div class="flex items-center gap-3">
          <BaseButton variant="outline" size="sm" :surface="surface" :to="CONTACT_TO">
            Nous contacter
          </BaseButton>
          <BaseButton variant="accent" size="sm" :surface="surface" :to="REJOINDRE_TO">
            Nous rejoindre
            <template #iconRight><ArrowRightIcon /></template>
          </BaseButton>
        </div>
      </template>
    </MegaMenu>

    <!-- CRITICAL — LAISSER FLUIDE : aucune contrainte de hauteur ni overflow ici.
         Le scroll-snap est strictement géré localement dans les vues (ex: HomeView). -->
    <main id="contenu" class="flex-1">
      <RouterView />
    </main>

    <!-- Footer masqué sur l'accueil : TheFooter y est intégré dans le
         conteneur snap de HomeView.vue pour s'aimanter avec les sections. -->
    <TheFooter
      v-if="route.path !== '/'"
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
            <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" stroke-width="1.8" />
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
            <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6L10 1.5Z" />
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
          Nous contacter
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
  </div>
</template>
