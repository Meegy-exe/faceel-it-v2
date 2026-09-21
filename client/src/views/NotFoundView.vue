<script setup lang="ts">
import AnimatedBackground from '@/components/ui/AnimatedBackground.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useSeo } from '@/composables/useSeo'

/**
 * Page 404.
 *
 * `indexable: false` : une page d'erreur indexée pollue les résultats de
 * recherche. Le `noindex` ne remplace pas le vrai statut HTTP 404 — c'est à
 * Nginx de le renvoyer, la SPA ne pouvant pas choisir son propre code de
 * réponse. À câbler dans `client/nginx.conf` avec le pré-rendu.
 */
useSeo({
  title: 'Page introuvable',
  description: 'Cette page n’existe pas ou a été déplacée.',
  indexable: false,
})
</script>

<template>
  <section
    data-theme="dark"
    class="relative isolate flex min-h-[70vh] items-center overflow-hidden bg-primary-900 px-4 pt-40 pb-24 text-white sm:px-6 lg:px-8"
  >
    <AnimatedBackground variant="grid" tone="dark" />

    <div class="mx-auto max-w-2xl">
      <p class="text-eyebrow uppercase text-accent-500">Erreur 404</p>

      <h1 class="mt-4 font-display text-display text-balance">Cette page n’existe pas.</h1>

      <p class="mt-6 text-lg leading-relaxed text-white/70">
        Le lien est peut-être obsolète, ou l’adresse comporte une coquille.
      </p>

      <div class="mt-10 flex flex-col gap-4 sm:flex-row">
        <BaseButton variant="primary" surface="dark" block class="sm:w-auto" to="/">
          Retour à l’accueil
        </BaseButton>
        <!-- mailto direct, pas une ancre `#contact` : cette section a été
             retirée de `HomeView.vue` en V0.1.13 (cf. ADR 17), même mesure
             temporaire que les CTA globaux de `App.vue`. -->
        <BaseButton
          variant="outline"
          surface="dark"
          block
          class="sm:w-auto"
          href="mailto:contact@faceel-it.com"
        >
          Nous signaler le problème
        </BaseButton>
      </div>
    </div>
  </section>
</template>
