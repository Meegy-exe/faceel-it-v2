<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: "Déclaration d'accessibilité - Faceel-IT Wasquehal",
  description:
    "Déclaration d'accessibilité du site de Faceel-IT, ESN à Wasquehal : état de conformité et moyens de nous contacter.",
})
</script>

<template>
  <article class="min-h-screen h-auto snap-start bg-white px-4 pt-32 pb-20 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-4xl">
      <h1 class="font-display text-4xl font-extrabold tracking-tight text-primary-900">
        Déclaration d'accessibilité
      </h1>
      <!-- maj texte accessibilite -->
      <p class="mt-3 text-sm text-primary-900/50">Dernière mise à jour : 5 Novembre 2026</p>

      <div class="mt-12 space-y-12 text-base leading-relaxed text-primary-900/80">
        <section class="space-y-4">
          <p class="text-lg">
            Faceel-IT s'engage à rendre son site web accessible conformément à l'article 47 de la
            loi n°&nbsp;2005-102 du 11 février 2005. À cette fin, Faceel-IT intègre les normes
            d'accessibilité (WCAG 2.1 et 2.2 niveau AA) dès la conception de sa nouvelle plateforme.
            Un schéma pluriannuel de mise en accessibilité et un plan d'actions annuel sont en cours
            de rédaction.
          </p>
          <p>
            Cette déclaration d'accessibilité s'applique au site&nbsp;:
            <a
              href="https://www.faceel-it.com"
              target="_blank"
              rel="noopener noreferrer"
              class="font-medium text-[#000066] underline underline-offset-2 break-all hover:opacity-80"
              >https://www.faceel-it.com</a
            >.
          </p>
        </section>

        <section>
          <h2 class="font-display text-2xl font-bold text-primary-900">1. État de conformité</h2>
          <p class="mt-4">
            Le site Faceel-IT est <strong>non conforme</strong> avec le référentiel général
            d'amélioration de l'accessibilité (RGAA), version 4.1.
          </p>
          <h3 class="mt-6 text-lg font-bold text-primary-900">Résultats des tests</h3>
          <p class="mt-3">
            L'audit de conformité officiel n'ayant pas encore été réalisé, le pourcentage exact de
            critères respectés ne peut être calculé pour le moment. L'état "non conforme" est donc
            appliqué par défaut dans l'attente de cette évaluation.
          </p>
        </section>

        <section>
          <h2 class="font-display text-2xl font-bold text-primary-900">2. Contenus non accessibles</h2>
          <p class="mt-4">
            L'audit externe complet étant en attente de réalisation, la liste exhaustive des
            non-conformités, des dérogations pour charge disproportionnée et des contenus non
            soumis à l'obligation d'accessibilité n'est pas encore établie.
          </p>
        </section>

        <section>
          <h2 class="font-display text-2xl font-bold text-primary-900">
            3. Établissement de cette déclaration
          </h2>
          <p class="mt-4">Cette déclaration a été établie le 5 Novembre 2026.</p>
          <h3 class="mt-6 text-lg font-bold text-primary-900">
            Technologies utilisées pour la conception du site
          </h3>
          <ul class="mt-3 space-y-1 pl-6 list-disc">
            <li>HTML5</li>
            <li>CSS3 (Tailwind CSS)</li>
            <li>JavaScript</li>
            <li>Vue 3</li>
          </ul>
          <h3 class="mt-6 text-lg font-bold text-primary-900">
            Outils d'évaluation interne utilisés en cours de développement
          </h3>
          <ul class="mt-3 space-y-1 pl-6 list-disc">
            <li>Lighthouse</li>
            <li>Axe DevTools</li>
            <li>Navigation au clavier et lecteurs d'écran natifs</li>
          </ul>
        </section>

        <section>
          <h2 class="font-display text-2xl font-bold text-primary-900">
            4. Retour d'information et contact
          </h2>
          <p class="mt-4">
            Si vous n'arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le
            responsable du site web pour être orienté vers une alternative accessible ou obtenir le
            contenu sous une autre forme.
          </p>
          <p class="mt-3">
            Contactez-nous à l'adresse&nbsp;:
            <a
              href="mailto:contact@faceel-it.com"
              class="font-medium text-[#000066] underline underline-offset-2 break-all hover:opacity-80"
              >contact@faceel-it.com</a
            >.
          </p>
        </section>

        <section>
          <h2 class="font-display text-2xl font-bold text-primary-900">5. Voies de recours</h2>
          <p class="mt-4">
            Cette procédure est à utiliser dans le cas suivant&nbsp;: vous avez signalé au
            responsable du site web un défaut d'accessibilité qui vous empêche d'accéder à un
            contenu ou à un des services du portail et vous n'avez pas obtenu de réponse
            satisfaisante.
          </p>
          <ul class="mt-4 space-y-2 pl-6 list-disc">
            <li>
              Écrire un message au Défenseur des droits
              (<a
                href="https://formulaire.defenseurdesdroits.fr"
                target="_blank"
                rel="noopener noreferrer"
                class="font-medium text-[#000066] underline underline-offset-2 break-all hover:opacity-80"
                >https://formulaire.defenseurdesdroits.fr</a
              >).
            </li>
            <li>Contacter le délégué du Défenseur des droits dans votre région.</li>
            <li>
              Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre) à l'adresse
              suivante&nbsp;: Défenseur des droits - Libre réponse 71120 - 75342 Paris CEDEX 07.
            </li>
          </ul>
        </section>
      </div>
    </div>
  </article>
</template>
