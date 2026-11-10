<script setup lang="ts">
import { ref } from 'vue'
import { useSeo } from '@/composables/useSeo'
import CookieManagerModal from '@/components/ui/CookieManagerModal.vue'

useSeo({
  title: "Politique de cookies - Faceel-IT Wasquehal",
  description:
    "Politique de cookies de Faceel-IT, ESN à Wasquehal : cookies utilisés sur le site et gestion de vos préférences.",
})

// meme pattern que TheFooter
const isCookieModalOpen = ref(false)
</script>

<template>
  <article class="min-h-screen h-auto snap-start bg-white px-4 pt-32 pb-20 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-4xl">
      <h1 class="font-display text-4xl font-extrabold tracking-tight text-primary-900">
        Politique de gestion des cookies
      </h1>
      <!-- maj texte cookies -->
      <p class="mt-3 text-sm text-primary-900/50">Dernière mise à jour : 5 Novembre 2026</p>

      <div class="mt-12 space-y-12 text-base leading-relaxed text-primary-900/80">
        <section>
          <h2 class="font-display text-2xl font-bold text-primary-900">
            1. Qu'est-ce qu'un cookie ?
          </h2>
          <p class="mt-4">
            Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette,
            téléphone) lors de la visite d'un site web. Il permet au site de mémoriser des
            informations sur votre navigation (préférences d'affichage, session de connexion) afin
            de vous offrir une expérience fluide et cohérente à chaque visite.
          </p>
          <p class="mt-3">
            Les cookies ne contiennent pas de virus et ne peuvent pas accéder aux fichiers stockés
            sur votre appareil. Leur durée de vie est limitée et définie à l'avance.
          </p>
        </section>

        <section>
          <h2 class="font-display text-2xl font-bold text-primary-900">
            2. Les cookies utilisés sur ce site
          </h2>
          <p class="mt-4">
            Dans une démarche de respect de la vie privée et de minimisation des données, le site de
            Faceel-IT n'utilise aucun cookie de traçage publicitaire, ni aucun outil de mesure
            d'audience intrusif.
          </p>
          <p class="mt-3">
            Nous utilisons exclusivement des cookies strictement nécessaires au bon fonctionnement
            technique et ergonomique de la plateforme. Ils ne peuvent pas être désactivés, car le
            site ne pourrait pas fonctionner correctement sans eux.
          </p>

          <!-- cookies techniques uniquement -->
          <div class="mt-8">
            <h3 class="text-xl font-bold text-primary-900">Cookies strictement nécessaires</h3>
            <p class="mt-3">
              <strong>Consentement requis&nbsp;:</strong> Non (exemptés selon l'Article 82 de la loi
              Informatique et Libertés).
            </p>
            <p class="mt-3">
              Voici les seules données mémorisées localement lors de votre navigation&nbsp;:
            </p>
            <ul class="mt-3 space-y-2 pl-6 list-disc">
              <li>
                <strong>Mémorisation du profil&nbsp;:</strong> Un cookie enregistre votre choix de
                parcours ("Je suis un candidat" ou "Je suis une entreprise") pour adapter le contenu
                lors de votre navigation et de vos prochaines visites.
              </li>
              <li>
                <strong>Gestion de l'animation&nbsp;:</strong> Un cookie technique retient si vous
                avez déjà visionné l'animation d'introduction de la page d'accueil afin de ne pas la
                rejouer à chaque changement de page.
              </li>
              <li>
                <strong>Choix de consentement&nbsp;:</strong> Un cookie
                (<code class="rounded bg-gray-100 px-1 text-sm">faceel-cookie-consent</code>)
                mémorise vos préférences quant à l'affichage du bandeau d'information lui-même.
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 class="font-display text-2xl font-bold text-primary-900">
            3. Gérer vos préférences
          </h2>
          <p class="mt-4">
            Puisque nous n'utilisons que des cookies techniques indispensables, le fonctionnement de
            notre site n'implique pas de gestion complexe de traceurs tiers.
          </p>
          <p class="mt-3">
            Si vous souhaitez néanmoins bloquer ces cookies techniques, vous devez configurer
            directement votre navigateur internet. Notez que ce blocage réinitialisera votre choix
            de profil et rejouera l'animation à chaque visite.
          </p>
          <p class="mt-3">Voici les pages d'aide des principaux navigateurs&nbsp;:</p>
          <ul class="mt-3 space-y-2 pl-6 list-disc">
            <li>
              <strong>Google Chrome&nbsp;:</strong>
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
                class="font-medium text-[#000066] underline underline-offset-2 break-all hover:opacity-80"
                >https://support.google.com/chrome/answer/95647</a
              >
            </li>
            <li>
              <strong>Mozilla Firefox&nbsp;:</strong>
              <a
                href="https://support.mozilla.org/fr/kb/protection-renforcee-contre-pistage-firefox-ordinateur"
                target="_blank"
                rel="noopener noreferrer"
                class="font-medium text-[#000066] underline underline-offset-2 break-all hover:opacity-80"
                >https://support.mozilla.org/fr/kb/protection-renforcee-contre-pistage-firefox-ordinateur</a
              >
            </li>
            <li>
              <strong>Apple Safari&nbsp;:</strong>
              <a
                href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
                class="font-medium text-[#000066] underline underline-offset-2 break-all hover:opacity-80"
                >https://support.apple.com/fr-fr/guide/safari/sfri11471/mac</a
              >
            </li>
            <li>
              <strong>Microsoft Edge&nbsp;:</strong>
              <a
                href="https://support.microsoft.com/fr-fr/windows/supprimer-et-g%C3%A9rer-les-cookies-168dab11-0753-043d-7c16-ede5947fc64d"
                target="_blank"
                rel="noopener noreferrer"
                class="font-medium text-[#000066] underline underline-offset-2 break-all hover:opacity-80"
                >https://support.microsoft.com/fr-fr/windows/supprimer-et-gérer-les-cookies-168dab11-0753-043d-7c16-ede5947fc64d</a
              >
            </li>
          </ul>
          <button
            type="button"
            class="mt-6 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-primary-900 transition-colors duration-200 hover:bg-gray-200"
            @click="isCookieModalOpen = true"
          >
            Ouvrir le panneau de gestion des cookies
          </button>
        </section>

        <section>
          <h2 class="font-display text-2xl font-bold text-primary-900">4. Contact</h2>
          <p class="mt-4">
            Pour toute question relative à notre politique de gestion des cookies, vous pouvez nous
            contacter à l'adresse suivante&nbsp;:
            <a
              href="mailto:contact@faceel-it.com"
              class="font-medium text-[#000066] underline underline-offset-2 hover:opacity-80"
              >contact@faceel-it.com</a
            >.
          </p>
        </section>
      </div>
    </div>
  </article>
  <CookieManagerModal :is-open="isCookieModalOpen" @close="isCookieModalOpen = false" />
</template>
